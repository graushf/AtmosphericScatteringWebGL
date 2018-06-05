SkyFromSpaceLUT_fs = {
    "data": `#version 300 es
        precision mediump float;

        #define DELTA 0.000001

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;

        uniform sampler2D uTextureLUT;
        
        uniform vec3 v3CameraPos;					// The camera's current position
        uniform float fScaleDepth;					// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
        uniform float fScaleOverScaleDepth;			// fScale / fScaleDepth
        uniform float fInnerRadius;					// The inner (planetary) radius
        uniform float fScale;						// 1 / (fOuterRadius - fInnerRadius)
        uniform vec3 v3InvWavelength;				// 1 / pow(wavelength, 4) for the red, green, and blue channels
        uniform float fKr4PI;						// Kr * 4 * PI
        uniform float fKm4PI;						// Km * 4 * PI
        uniform float fKrESun;						// Kr * ESun
        uniform float fKmESun;						// Km * ESun
        uniform float fCameraHeight2;				// fCameraHeight^2
        uniform float fOuterRadius2;				// fOuterRadius^2
        uniform float fOuterRadius;					// The outer (atmosphere) radius

        in vec3 v_vertexPos;
        in vec3 v3Direction;
        
        out vec4 outputColor;

        const int nSamples = 10;

        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        float GetRayleighPhase(float fCos2);
        vec4 GetDepth(float x, float y);
        float scale(float fCos);
        bool solveQuadratic(float a, float b, float c, out float x0, out float x1);

        bool computeIntersections(vec3 v3Origin, vec3 v3CenterSphere, vec3 v3Direction, float sphereRadius, out float t0, out float t1);
        float GetNearIntersection(vec3 v3Origin, vec3 v3Direction, float fSphereRadius2);

        void main(void)
        {
            // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)
            vec3 v3Pos = v_vertexPos.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;

            // Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)
            /* float B = 2.0 * dot(v3CameraPos, v3Ray);
            float C = fCameraHeight2 - fOuterRadius2;
            float fDet = max(0.0, B*B - 4.0 * C);
            float fNear = 0.5 * (-B - sqrt(fDet)); */
            
            float fNear = GetNearIntersection(v3CameraPos, v3Ray, fOuterRadius2);

            vec4 v4LightDepth;
            vec4 v4SampleDepth;

            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos + v3Ray * fNear;
            fFar -= fNear;

            // Initialize the scattering loop variables
            vec3 v3RayleighSum = vec3(0.0, 0.0, 0.0);
            vec3 v3MieSum = vec3(0.0, 0.0, 0.0);

            float fSampleLength = fFar / float(nSamples);
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5; // Start at the center of the first sample ray, and loop through each of the colors
            vec3 v3Attenuation;
            
            // Now loop through the sample rays
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                // Start by looking up the optical depth coming from the light source to this point
                float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
                float fAltitude = (fHeight - fInnerRadius) * fScale; // How many times bigger than OutRadius
                v4LightDepth = GetDepth(fAltitude, 0.5 - fLightAngle*0.5);

                // If no light reaches this part of the atmosphere, no light is scattered in at this point
                if (v4LightDepth.x < DELTA)
                    continue;

                // Get the density at this point, along with the optical depth from the light source to this point
                float fRayleighDensity = fScaledLength * v4LightDepth.x;
                float fRayleighDepth = v4LightDepth.y;
                float fMieDensity = fScaledLength * v4LightDepth.z;
                float fMieDepth = v4LightDepth.w;

                // If the camera is above the point we're shading, we calculate the optical depth from the sample position to the camera
                // Otherwise, we calculate the optical depth from the camera to the sample point
                float fSampleAngle = dot(-v3Ray, v3SamplePoint) / fHeight;
                v4SampleDepth = GetDepth(fAltitude, 0.5 - fSampleAngle*0.5);
                fRayleighDepth += v4SampleDepth.y;
                fMieDepth += v4SampleDepth.w;

                // Now multiply the optical depth by the attenuation factor for the sample ray
                fRayleighDepth *= fKr4PI;
                fMieDepth *= fKm4PI;

                // Calculate the attenuation factor for the sample ray
                v3Attenuation = exp(-vec3(fRayleighDepth) * v3InvWavelength - vec3(fMieDepth));
                v3RayleighSum += vec3(fRayleighDensity) * v3Attenuation;
                v3MieSum += vec3(fMieDensity) * v3Attenuation;
                
                // Move the position to the center of the next sample ray
                v3SamplePoint += v3SampleRay;
            }

            vec3 mieColor, rayleighColor;
            // Finally, scale the Mie and Rayleigh colors
            mieColor = v3MieSum * fKmESun;
            rayleighColor = v3RayleighSum * (v3InvWavelength * fKrESun);
        
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;
            float fMiePhase = GetMiePhase(fCos, fCos2, g, g2);
            
            outputColor.xyz = rayleighColor + fMiePhase * mieColor;
            outputColor.w = 1.0;

            vec3 debugColor = vec3(fNear);

            /* if (!_boolInters) {
                debugColor = vec3(1.0, 0.0, 0.0);
            } */

            //outputColor = vec4(debugColor, 1.0);
        }
        
        float GetMiePhase(float fCos, float fCos2, float g, float g2)
        {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
        }

        float GetRayleighPhase(float fCos2)
        {
            return 0.75 + 0.75 * fCos2;
        }

        vec4 GetDepth(float x, float y)
        {
            return texture(uTextureLUT, vec2(x, y));
        }

        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
        }

        bool computeIntersections(vec3 v3Origin, vec3 v3CenterSphere, vec3 v3Direction, float sphereRadius, out float t0, out float t1) {
            // analitic solution
            vec3 L = v3Origin - v3CenterSphere;
            float a = dot(v3Direction, L);
            float b = 2.0 * dot(v3Direction, L);
            float c = dot(L,L) - pow(sphereRadius, 2.0);
            
            float T0, T1;
            bool aux = solveQuadratic(a, b, c, T0, T1);
            if (!aux) {
                return false;
            }

            if (T0 > T1) {
                float A = T0;
                float B = T1;
                t0 = B;
                t1 = A;
            }
            
            if (T0 < 0.0) {
                t0 = T1; // If t0 is negative, lets use t1 instead
                if (T0 < 0.0) {
                    return false;
                }
            }

            if ((T0 > 0.0) && (T1 > 0.0)) {
                if (T1 > T0) {
                    t0 = T0;
                    t1 = T1;
                }
            }

            return true;
        }

        bool solveQuadratic(float a, float b, float c, out float x0, out float x1) {
            float discr = b * b - 4.0 * a * c;
            if (discr < 0.0) {
                return false;
            } else {
                if (discr == 0.0) {
                    x0 = -0.5 * b / a;
                    x1 = -0.5 * b / a;
                } else {
                    float q;
                    if (b > 0.0) {
                        q = -0.5 * (b + sqrt(discr));
                    } else {
                        q = -0.5 * (b - sqrt(discr));
                    }
                    x0 = q / a;
                    x1 = c / q;
                }
            }

            if (x0 > x1) {
                float aux = x0;
                float aux2 = x1;
                x0 = aux2;
                x1 = aux;
            }

            return true;
        }

        float GetNearIntersection(vec3 v3Origin, vec3 v3Direction, float fSphereRadius2) {
            // Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)
            float B = 2.0 * dot(v3Origin, v3Direction);
            float C = pow(length(v3Origin), 2.0) - fSphereRadius2;
            float fDet = max(0.0, B*B - 4.0 * C);
            float fNear = 0.5 * (-B - sqrt(fDet));

            return fNear;
        }   
    `,
    "type": "x-shader/x-fragment"
};

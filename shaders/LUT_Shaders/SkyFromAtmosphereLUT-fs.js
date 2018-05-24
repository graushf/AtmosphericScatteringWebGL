SkyFromAtmosphereLUT_fs = {
    "data": `#version 300 es
        precision mediump float;

        #define DELTA 0.000001

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;

        uniform sampler2D uTextureLUT;

        // loop stuff
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
        uniform float fCameraHeight;			// The camera's current height
        uniform float fCameraHeight2;				// fCameraHeight^2
        uniform float fOuterRadius2;				// fOuterRadius^2
        uniform float fOuterRadius;					// The outer (atmosphere) radius

        in vec3 v_vertexPos;
        in vec3 v3Direction;

        out vec4 outputColor;

        const int nSamples = 2;
        //const float fSamples = 2.0;

        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        float GetRayleighPhase(float fCos2);
        vec4 GetDepth(float x, float y);
        float scale(float fCos);

        void main(void)
        {
            // Get the ray from the camera to the vertex and its length
            vec3 v3Pos = v_vertexPos.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;

            vec4 v4LightDepth;
            vec4 v4SampleDepth;

            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos;
            float fHeight = length(v3Start);

            // Initialize the scattering loop variables
            vec3 v3RayleighSum = vec3(0.0, 0.0, 0.0);
            vec3 v3MieSum = vec3(0.0, 0.0, 0.0);

            float fSampleLength = fFar / float(nSamples);
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;
            vec3 v3Attenuation;

            vec3 debugColor;
            if (length(v3CameraPos) > length(v3Pos)) {
                debugColor = vec3(1.0, 0.0, 0.0);
            } else {
                debugColor = vec3(0.0, 1.0, 0.0);
            }


            // Now loop through the sample rays
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                // Start by looking up the optical depth coming from the light source to this point
                float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
                float fAltitude = (fHeight - fInnerRadius) * fScale; // How many times bigger than OutRadius
                v4LightDepth = GetDepth(fAltitude, (0.5 - fLightAngle * 0.5));

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
                v4SampleDepth = GetDepth(fAltitude, (0.5 - fSampleAngle * 0.5));
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

            vec3 col = GetRayleighPhase(fCos2) * rayleighColor + GetMiePhase(fCos, fCos2, g, g2) * mieColor;
            outputColor = vec4(col, 1.0);
            
            outputColor = vec4(debugColor, 1.0);
        }

        float GetMiePhase(float fCos, float fCos2, float g, float g2)
        {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
        }

        float GetRayleighPhase(float fCos2)
        {
            return 0.75 + 0.75 * fCos2;
        }

        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
        }

        vec4 GetDepth(float x, float y)
        {
            return texture(uTextureLUT, vec2(x, y));
        }
    `,
    "type": "x-shader/x-fragment"
};

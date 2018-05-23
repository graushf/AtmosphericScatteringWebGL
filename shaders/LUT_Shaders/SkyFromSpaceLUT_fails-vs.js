SkyFromSpaceLUT_vs = {
    "data": `#version 300 es
        precision mediump float;

        in vec3 aVertexPosition;
        //in vec2 aTextureCoord;
        
        out vec3 v3Direction;
        out vec3 frontPrimaryColor;
        out vec3 frontSecondaryColor;
        
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        uniform vec3 v3CameraPos;					// The camera's current position
        uniform vec3 v3LightPos;					// The direction vector to the light source
        uniform vec3 v3InvWavelength;				// 1 / pow(wavelength, 4) for the red, green, and blue channels
        uniform float fCameraHeight;				// The camera's current height
        uniform float fCameraHeight2;				// fCameraHeight^2
        uniform float fOuterRadius;					// The outer (atmosphere) radius
        uniform float fOuterRadius2;				// fOuterRadius^2
        uniform float fInnerRadius;					// The inner (planetary) radius
        uniform float fInnerRadius2;				// fInnerRadius^2
        uniform float fKrESun;						// Kr * ESun
        uniform float fKmESun;						// Km * ESun
        uniform float fKr4PI;						// Kr * 4 * PI;
        uniform float fKm4PI;						// Km * 4 * PI
        uniform float fScale;						// 1 / (fOuterRadius - fInnerRadius)
        uniform float fScaleDepth;					// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
        uniform float fScaleOverScaleDepth;			// fScale / fScaleDepth
        
        uniform sampler2D uTextureLUT;

        out vec3 debugColor;
        
        const int nSamples = 2;
        const float fSamples = 2.0;
        
        #define DELTA 0.000001
        
        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
        }
        
        vec4 GetDepth(float x, float y)
        {
            return texture(uTextureLUT, vec2(x, y));
        }
        
        void main(void)
        {
            // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)
            vec3 v3Pos = aVertexPosition.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;
        
            debugColor = vec3(1.0, 0.0, 0.0);
        
            // Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)
            float B = 2.0 * dot(v3CameraPos, v3Ray);
            float C = fCameraHeight2 - fOuterRadius2;
            float fDet = max(0.0, B*B - 4.0 * C);
            float fNear = 0.5 * (-B - sqrt(fDet));
            
            vec4 v4LightDepth;
            vec4 v4SampleDepth;
        
            // Calculate the ray's start and end positions in the atmosphere
            vec3 v3Start = v3CameraPos + v3Ray * fNear;
            fFar -= fNear;
        
        
            // Initialize the scattering loop variables
            vec3 v3RayleighSum = vec3(0.0, 0.0, 0.0);
            vec3 v3MieSum = vec3(0.0, 0.0, 0.0);
            
            float fSampleLength = fFar / fSamples;
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            
            // Start at the center of the first sample ray, and loop through each of the others
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;
            vec3 v3Attenuation;
        
            v4LightDepth = GetDepth(0.0, (0.5 - 0.0 * 0.5));

            // Now loop through the sample rays
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                // Start by looking up the optical depth coming from the light source to this point
                float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
                float fAltitude = (fHeight - fInnerRadius) * fScale; // How many times bigget than OutRadius
                //v4LightDepth = GetDepth(fAltitude, (0.5 - fLightAngle * 0.5));
                
                // If no light light reaches this part of the atmosphere, no light is scattered in at this point
                if (v4LightDepth.x < DELTA)
                    continue;
                // Get the density at this point, along with the optical depth from the light source to this point
                float fRayleighDensity = fScaledLength * v4LightDepth.x;
                float fRayleighDepth = v4LightDepth.y;
                float fMieDensity = fScaledLength * v4LightDepth.z;
                float fMieDepth = v4LightDepth.w;
                
                // If the camera is above the point we're shading, we calculate the optical depth from the sample point to the camera
                // Otherwise, we calculate the optical depth from the camera to the sample point
                float fSampleAngle = dot(-v3Ray, v3SamplePoint) / fHeight;
                //v4SampleDepth = GetDepth(fAltitude, (0.5 - fSampleAngle * 0.5));
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
        
            // Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader
            frontSecondaryColor.rgb = v3MieSum; // Mie color, not dependent on wavelength
            frontPrimaryColor.rgb = v3RayleighSum; // Rayleigh color, dependent on wavelength
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
            v3Direction = v3CameraPos - v3Pos;
        }
    `,
    "type": "x-shader/x-vertex"
};

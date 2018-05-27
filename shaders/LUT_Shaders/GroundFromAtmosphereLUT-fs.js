var GroundFromAtmosphereLUT_fs = {
    "data": `#version 300 es
        precision mediump float;

        #define DELTA 0.000001

        uniform sampler2D uSamplerTexture;
        uniform sampler2D uTextureLUT;

        uniform vec3 v3LightPos;
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
        in vec2 vTextureCoord;
        
        out vec4 outputColor;
        const int nSamples = 10;

        vec4 GetDepth(float x, float y);

        void main(void)
        {
            // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)
            vec3 v3Pos = v_vertexPos.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;

            vec4 v4LightDepth;
            vec4 v4SampleDepth;

            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos;

            // Initialize the scattering loop variables
            vec3 v3RayleighSum = vec3(0.0, 0.0, 0.0);
            vec3 v3MieSum = vec3(0.0, 0.0, 0.0);

            float fSampleLength = fFar / float(nSamples);
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

            float fHeightCam = length(v3CameraPos);
            float fCamAngle = dot(-v3Ray, v3CameraPos) / fHeightCam;
            float fAltitudeCam = (fHeightCam - fInnerRadius) * fScale; // How many times bigger
            vec4 v4CameraDepth = GetDepth(fAltitudeCam, (0.5 - fCamAngle * 0.5));

            float totalRayleighDepth;
            float totalMieDepth;

            vec3 v3Attenuation;
            // Now loop through the sample rays
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
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
                float fSampleAngle = dot(-v3Ray, v3CameraPos) / fHeightCam;
                v4SampleDepth = GetDepth(fAltitude, (0.5 - fSampleAngle * 0.5));
                fRayleighDepth += (v4SampleDepth.y - v4CameraDepth.y);
                fMieDepth += (v4SampleDepth.w - v4CameraDepth.w);

                totalRayleighDepth = fRayleighDepth;
                totalMieDepth = fMieDepth;


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

            vec3 v3SkyColor = rayleighColor + mieColor;
            vec3 v3AttenuationColor = v3Attenuation;
            
            vec2 uv = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);
            vec3 colorTexture = texture(uSamplerTexture, uv).xyz;
            colorTexture = vec3(1.0, 0.0, 0.0);
            outputColor.xyz = v3SkyColor + colorTexture * v3AttenuationColor;
            outputColor.xyz = v3SkyColor + 0.25 * v3AttenuationColor;

            outputColor.w = 1.0;

            //vec3 debugColor = vec3(totalRayleighDepth);
            //vec3 debugColor = v3SkyColor;

            //outputColor.xyz = debugColor;
        }

        vec4 GetDepth(float x, float y)
        {
            return texture(uTextureLUT, vec2(x, y));
        }
    `,
    "type": "x-shader/x-fragment"
};

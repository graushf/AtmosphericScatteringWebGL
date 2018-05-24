SkyFromSpaceLUT_fs = {
    "data": `#version 300 es
        precision mediump float;

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
        uniform float fCameraHeight2;				// fCameraHeight^2
        uniform float fOuterRadius2;				// fOuterRadius^2
        uniform float fOuterRadius;					// The outer (atmosphere) radius

        in vec3 v_vertexPos;
        in vec3 v3Direction;
        
        
        out vec4 outputColor;

        const int nSamples = 2;
        //const float fSamples = 2.0;

        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        vec4 GetDepth(float x, float y);
        float scale(float fCos);

        void main(void)
        {
            // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)
            vec3 v3Pos = v_vertexPos.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;

            // Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)
            float B = 2.0 * dot(v3CameraPos, v3Ray);
            float C = fCameraHeight2 - fOuterRadius2;
            float fDet = max(0.0, B*B - 4.0 * C);
            float fNear = 0.5 * (-B - sqrt(fDet));

            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos + v3Ray * fNear;
            fFar -= fNear;
            float fStartAngle = dot(v3Ray, v3Start) / fOuterRadius; // divided by fOuterRadius to obtain the angle only, v3Start is not normalized
            float fStartDepth = exp(-1.0 / fScaleDepth);
            float fStartOffset = fStartDepth * scale(fStartAngle);

            // Initialize the scattering loop variables
            float fSampleLength = fFar / float(nSamples);
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

            //vec4 v4LightDepth;
            //vec4 v4SampleDepth;

            vec3 rayleighColor;
            vec3 mieColor;

            // Now loop through the sample rays
            vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                // fScaleOverScaleDepth = fScale / fScaleHeight, fDepth = exp((fScale * (fInnerRadius - fHeight))/fScaleHeight)
                // (fScale * (fInnerRadius - fHeight)) will return the current height on negative value from 0.0 to 1.0, 0.0 bottom of atmosphere and 1.0 top of atmosphere
                // fScale multiplication is used to scale the height to the 0.0 to 1.0 value
                // Division by ScaleHeight implies this is the calculation of the density on the current atmosphere or depth on the current height of the atmosphere
                float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight)); 
                float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
                float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;
                float fScatter = (fStartOffset + fDepth*(scale(fLightAngle) - scale(fCameraAngle)));
                vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
                v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
                v3SamplePoint += v3SampleRay;
            }


            mieColor.rgb = v3FrontColor * fKmESun;
            rayleighColor.rgb = v3FrontColor * (v3InvWavelength * fKrESun);
        
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;
            float fMiePhase = GetMiePhase(fCos, fCos2, g, g2);
            
            outputColor.xyz = rayleighColor + fMiePhase * mieColor;
            outputColor.w = 1.0;

            //outputColor = vec4(v3FrontColor, 1.0);
        }
        
        float GetMiePhase(float fCos, float fCos2, float g, float g2)
        {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
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
    `,
    "type": "x-shader/x-fragment"
};

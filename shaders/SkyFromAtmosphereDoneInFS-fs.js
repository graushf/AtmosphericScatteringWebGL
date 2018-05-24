SkyFromAtmosphereDoneInFS_fs = {
    "data": `#version 300 es
        precision mediump float;

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;

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
        float scale(float fCos);

        void main(void)
        {
            // Get the ray from the camera to the vertex and its length
            vec3 v3Pos = v_vertexPos.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;

            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos;
            float fHeight = length(v3Start);
            float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fCameraHeight));

            float fStartAngle = dot(v3Ray, v3Start) / fHeight;
            float fStartOffset = fDepth * scale(fStartAngle);

            // Initialize the scattering loop variables
            float fSampleLength = fFar / float(nSamples);
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

            // Now loop through the sample rays
            vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
            
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
        
                float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
                float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;
        
                float fScatter = (fStartOffset + fDepth*(scale(fLightAngle) - scale(fCameraAngle)));
        
                vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
        
                v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
        
                v3SamplePoint += v3SampleRay;
            }

            vec3 mieColor = v3FrontColor * fKmESun;
            vec3 rayleighColor = v3FrontColor * (v3InvWavelength * fKrESun); // RayleighColor

            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;

            vec3 col = GetRayleighPhase(fCos2) * rayleighColor + GetMiePhase(fCos, fCos2, g, g2) * mieColor;

            vec3 debugColor = vec3(1.0, 0.0, 0.0);
            
            outputColor = vec4(col, 1.0); return;
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
    `,
    "type": "x-shader/x-fragment"
};

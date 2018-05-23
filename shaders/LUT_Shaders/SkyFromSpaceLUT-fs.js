SkyFromSpaceLUT_fs = {
    "data": `#version 300 es
        precision mediump float;

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;

        uniform sampler2D uTextureLUT;
        
        // loop stuff

        uniform float fScaleDepth;					// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
        uniform float fScaleOverScaleDepth;			// fScale / fScaleDepth
        uniform float fInnerRadius;					// The inner (planetary) radius
        uniform float fScale;						// 1 / (fOuterRadius - fInnerRadius)
        uniform vec3 v3InvWavelength;				// 1 / pow(wavelength, 4) for the red, green, and blue channels
        uniform float fKr4PI;						// Kr * 4 * PI
        uniform float fKm4PI;						// Km * 4 * PI
        uniform float fKrESun;						// Kr * ESun
        uniform float fKmESun;						// Km * ESun

        in vec3 v_v3SamplePoint;
        in vec3 v_v3Ray;
        in float v_fStartOffset;
        in float v_fScaledLength;
        in vec3 v_v3SampleRay;

        in vec3 v_vertexPos;

        in vec3 v3Direction;
        
        in vec3 debugColor;
        
        out vec4 outputColor;

        const int nSamples = 1;

        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        vec4 GetDepth(float x, float y);
        float scale(float fCos);

        void main(void)
        {
            vec4 v4LightDepth;
            vec4 v4SampleDepth;

            vec3 v3FrontColor;

            vec3 rayleighColor;
            vec3 mieColor;

            vec3 v3SamplePoint = v_v3SamplePoint;

            // Now loop through the sample rays
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
                float fLightAngle = dot(v3LightPos, v3SamplePoint);
                float fCameraAngle = dot(v_v3Ray, v3SamplePoint) / fHeight;
                float fScatter = (v_fStartOffset + fDepth*(scale(fLightAngle) - scale(fCameraAngle)));
                vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
                v3FrontColor += v3Attenuate * (fDepth * v_fScaledLength);
                v3SamplePoint += v_v3SampleRay;
            }
            mieColor.rgb = v3FrontColor * fKmESun;
            rayleighColor.rgb = v3FrontColor * (v3InvWavelength * fKrESun);
        
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;
            float fMiePhase = GetMiePhase(fCos, fCos2, g, g2);
            
            outputColor.xyz = rayleighColor + fMiePhase * mieColor;
            outputColor.w = 1.0;

            outputColor = vec4(v_vertexPos, 1.0);
            //outputColor = vec4(0.0, 1.0, 1.0, 1.0);
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

SkyFromSpaceLUT_fs = {
    "data": `#version 300 es
        precision mediump float;

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;

        uniform sampler2D uTextureLUT;
        
        in vec3 v3Direction;
        in vec3 frontPrimaryColor;
        in vec3 frontSecondaryColor;
        
        in vec3 debugColor;
        
        out vec4 outputColor;

        const int nSamples = 10;

        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        vec4 GetDepth(float x, float y);

        void main(void)
        {
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;
            float fMiePhase = GetMiePhase(fCos, fCos2, g, g2);
            outputColor.xyz = frontPrimaryColor + fMiePhase * frontSecondaryColor;
            outputColor.w = 1.0;
            
            vec4 v4LightDepth;
            vec4 v4SampleDepth;

            for (int i=0; i<nSamples; i++)
            {
                float fAltitude = 0.0;
                float fLightAngle = 0.0;
                float fSampleAngle = 0.0;
                v4LightDepth = GetDepth(fAltitude, (0.5 - fLightAngle * 0.5));
                v4SampleDepth = GetDepth(fAltitude, (0.5 - fSampleAngle * 0.5));
            }

            outputColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
        
        float GetMiePhase(float fCos, float fCos2, float g, float g2)
        {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
        }

        vec4 GetDepth(float x, float y)
        {
            return texture(uTextureLUT, vec2(x, y));
        }
    `,
    "type": "x-shader/x-fragment"
};

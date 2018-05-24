SkyFromSpace_fs = {
    "data": `#version 300 es
        precision mediump float;

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;
        
        in vec3 v3Direction;
        in vec3 frontPrimaryColor;
        in vec3 frontSecondaryColor;
        
        in vec3 debugColor;

        out vec4 outputColor;
        
        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        
        void main(void)
        {
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;
            float fMiePhase = GetMiePhase(fCos, fCos2, g, g2);
            outputColor.xyz = frontPrimaryColor + fMiePhase * frontSecondaryColor;
            outputColor.a = 1.0;

            //outputColor = vec4(debugColor, 1.0);
        }
        
        float GetMiePhase(float fCos, float fCos2, float g, float g2)
        {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
        }
    `,
    "type": "x-shader/x-fragment"
};

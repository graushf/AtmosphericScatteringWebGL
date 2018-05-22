SkyFromSpace_fs = {
    "data": `
        precision mediump float;

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;
        
        varying vec3 v3Direction;
        varying vec3 frontPrimaryColor;
        varying vec3 frontSecondaryColor;
        
        varying vec3 debugColor;
        
        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        
        void main(void)
        {
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;
            float fMiePhase = GetMiePhase(fCos, fCos2, g, g2);
            gl_FragColor.xyz = frontPrimaryColor + fMiePhase * frontSecondaryColor;
            gl_FragColor.a = 1.0;

            //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        
        float GetMiePhase(float fCos, float fCos2, float g, float g2)
        {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
        }
    `,
    "type": "x-shader/x-fragment"
};

SkyFromAtmosphere_fs = {
    "data": `
        precision mediump float;

        uniform vec3 v3LightPos;
        uniform float g;
        uniform float g2;

        uniform sampler2D uTextureDebug;

        varying vec3 v3Direction;
        varying vec3 frontColor;
        varying vec3 frontSecondaryColor;

        varying vec3 debugColor;

        float GetMiePhase(float fCos, float fCos2, float g, float g2);
        float GetRayleighPhase(float fCos2);

        void main(void)
        {

            //gl_FragColor = vec4(0.98, 0.54, 0.035, 1.0); return;
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fCos2 = fCos*fCos;

            vec3 col = GetRayleighPhase(fCos2) *  frontColor + GetMiePhase(fCos, fCos2, g, g2) * frontSecondaryColor;

            gl_FragColor = vec4(col, 1.0); return;
            gl_FragColor = vec4(debugColor, 1.0);
        }

        float GetMiePhase(float fCos, float fCos2, float g, float g2)
        {
            return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
        }

        float GetRayleighPhase(float fCos2)
        {
            return 0.75 + 0.75 * fCos2;
        }
    `,
    "type": "x-shader/x-fragment"
};

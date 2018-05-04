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

        void main(void)
        {
            //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); return;
            //gl_FragColor = vec4(debugColor, 1.0); return;
            //gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); return;
            float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);
            float fMiePhase = 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos*fCos) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
            gl_FragColor.xyz = frontPrimaryColor + fMiePhase * frontSecondaryColor;
            gl_FragColor.a = gl_FragColor.b;

            //gl_FragColor = vec4(v3Direction, 1.0);
            //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

            //gl_FragColor = vec4(debugColor, 1.0);
        }
    `,
    "type": "x-shader/x-fragment"
};

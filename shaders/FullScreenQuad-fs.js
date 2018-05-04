var FullScreenQuad_fs = {
    data: `
    precision mediump float;

    varying vec2 vTextureCoord;

    uniform sampler2D uSampler;

    uniform int uDrawBorder;

    uniform float fHdrExposure;

    void main(void) {
        if (uDrawBorder == 0) {
            const float gamma = 2.0;
            vec4 col_tex = texture2D(uSampler, vTextureCoord);
            vec3 col = texture2D(uSampler, vTextureCoord).xyz;
            //col = 1.0 - exp(-col * fHdrExposure);
            col = 1.0 - exp(col * -fHdrExposure);
            //col = vec3(1.0, 0.0, 0.0);
            //col = pow(col, vec3(1.0 / gamma));
            gl_FragColor = vec4(col, 1.0);
            //gl_FragColor = col_tex;

        } else {
            gl_FragColor = vec4(0.46, 0.71, 0.0, 1.0);
        }
        //gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
    }
    `,
    type: "x-shader/x-fragment"
};

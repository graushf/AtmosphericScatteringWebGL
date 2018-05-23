var FullScreenQuad_fs = {
    data: `#version 300 es
    precision mediump float;

    in vec2 vTextureCoord;

    uniform sampler2D uSampler;

    uniform int uDrawBorder;

    uniform float fHdrExposure;

    out vec4 outputColor;

    void main(void) {
        if (uDrawBorder == 0) {
            vec3 col = texture(uSampler, vTextureCoord).xyz;
            col = 1.0 - exp(col * -fHdrExposure);
            outputColor = vec4(col, 1.0);
        } else {
            outputColor = vec4(0.46, 0.71, 0.0, 1.0);
        }
    }
    `,
    type: "x-shader/x-fragment"
};

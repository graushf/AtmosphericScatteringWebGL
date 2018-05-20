var SimpleGeometryShader_fs = {
    data: `
    precision mediump float;

    uniform vec3 uColor;
    uniform float uOpacity;

    void main(void) {
        gl_FragColor = vec4(uColor, uOpacity);
    }
    `,
    type: "x-shader/x-fragment"
};

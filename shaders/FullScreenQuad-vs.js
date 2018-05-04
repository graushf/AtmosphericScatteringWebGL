var FullScreenQuad_vs = {
    data: `
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    varying vec2 vTextureCoord;

    uniform mat4 model;

    void main(void) {
        vTextureCoord = aTextureCoord;
        gl_Position = model * vec4(aVertexPosition, 1.0);
    }
    `,
    type: "x-shader/x-vertex"
};

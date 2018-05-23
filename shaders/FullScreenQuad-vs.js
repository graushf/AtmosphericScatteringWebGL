var FullScreenQuad_vs = {
    data: `#version 300 es
    precision mediump float;

    in vec3 aVertexPosition;
    in vec2 aTextureCoord;

    out vec2 vTextureCoord;

    uniform mat4 model;

    void main(void) {
        vTextureCoord = aTextureCoord;
        gl_Position = model * vec4(aVertexPosition, 1.0);
    }
    `,
    type: "x-shader/x-vertex"
};

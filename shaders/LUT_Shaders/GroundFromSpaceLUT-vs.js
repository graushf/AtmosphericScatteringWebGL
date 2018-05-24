var GroundFromSpaceLUT_vs = {
    "data": `#version 300 es
        precision mediump float;

        in vec3 aVertexPosition;
        in vec2 aTextureCoord;
        
        out vec2 vTextureCoord;
        out vec3 v3Direction;
        out vec3 v_vertexPos;

        uniform vec3 v3CameraPos;
        
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        void main(void)
        {
            vec3 v3Pos = aVertexPosition.xyz;
            v_vertexPos = aVertexPosition.xyz;

            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
            vTextureCoord = aTextureCoord;
            v3Direction = v3CameraPos - v3Pos;
        }
    `,
    "type": "x-shader/x-vertex"
};

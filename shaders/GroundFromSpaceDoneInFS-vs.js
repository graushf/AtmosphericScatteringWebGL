var GroundFromSpaceDoneInFS_vs = {
    "data": `#version 300 es
        precision mediump float;

        in vec3 aVertexPosition;
        in vec2 aTextureCoord;
        
        out vec2 vTextureCoord;
        out vec3 v_vertexPos; 

        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        uniform vec3 v3CameraPos;			// The camera's current position
        
        void main(void)
        {
            vec3 v3Pos = aVertexPosition.xyz;
            v_vertexPos = aVertexPosition.xyz;

            vTextureCoord = aTextureCoord;
           
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
        }
    `,
    "type": "x-shader/x-vertex"
};

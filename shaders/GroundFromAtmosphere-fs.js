var GroundFromAtmosphere_fs = {
    "data": `#version 300 es
        precision mediump float;

        //in vec2 vTextureCoord;

        in vec3 primaryColor;
        in vec3 secondaryColor;

        out vec4 outputColor;

        void main() {
            //outputColor = vec4(vTextureCoord.xy, 0.0, 1.0); return;
            outputColor = vec4(primaryColor + 0.25 * secondaryColor, 1.0);
        }
    `,
    "type": "x-shader/x-fragment"
};

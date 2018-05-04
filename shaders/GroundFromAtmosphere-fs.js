var GroundFromAtmosphere_fs = {
    "data": `
        precision mediump float;

        //varying vec2 vTextureCoord;

        varying vec3 primaryColor;
        varying vec3 secondaryColor;

        void main() {
            //gl_FragColor = vec4(vTextureCoord.xy, 0.0, 1.0); return;
            gl_FragColor = vec4(primaryColor + 0.25 * secondaryColor, 1.0);
        }
    `,
    "type": "x-shader/x-fragment"
};

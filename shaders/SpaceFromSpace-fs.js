var SpaceFromSpace_fs = {
    data: `
        precision mediump float;

        uniform sampler2D s2Test;

        varying vec2 vTextureCoord;

        void main(void)
        {
            gl_FragColor = gl_FrontSecondaryColor * texture2D(s2Test, vTextureCoord);
            //gl_FragColor = gl_SecondaryColor;
        }
    `,
    type: "x-shader/x-fragment"
};

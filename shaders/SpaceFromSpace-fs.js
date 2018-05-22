var SpaceFromSpace_fs = {
    data: `
        precision mediump float;

        uniform sampler2D uSamplerTexture;

        varying vec2 vTextureCoord;
        varying vec4 scatteredColor;

        void main(void)
        {
            gl_FragColor = scatteredColor * texture2D(uSamplerTexture, vTextureCoord);
            gl_FragColor = texture2D(uSamplerTexture, vTextureCoord);
            //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `,
    type: "x-shader/x-fragment"
};

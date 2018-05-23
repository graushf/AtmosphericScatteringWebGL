var SpaceFromSpace_fs = {
    data: `#version 300 es
        precision mediump float;

        uniform sampler2D uSamplerTexture;

        in vec2 vTextureCoord;
        in vec4 scatteredColor;

        out vec4 outputColor;

        void main(void)
        {
            outputColor = scatteredColor * texture(uSamplerTexture, vTextureCoord);
            outputColor = texture(uSamplerTexture, vTextureCoord);
        }
    `,
    type: "x-shader/x-fragment"
};

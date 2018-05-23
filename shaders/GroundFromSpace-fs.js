var GroundFromSpace_fs = {
    "data": `#version 300 es
        precision mediump float;
        //uniform sampler2D s2Tex1;
        //uniform sampler2D s2Tex2;
        uniform sampler2D uSamplerTexture;

        in vec2 vTextureCoord;
        in vec3 v3Debug;

        in vec3 primaryColor;
        in vec3 secondaryColor;

        out vec4 outputColor;

        void main(void)
        {
            vec2 uv = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);
            outputColor = vec4(vec3(primaryColor + 0.25 * secondaryColor).xyz, 1.0);
            vec3 colorTexture = texture(uSamplerTexture, uv).xyz;
            colorTexture = vec3(0.0, 0.0, 0.0);
            outputColor.xyz = primaryColor + 1.2 * colorTexture * secondaryColor;
            colorTexture = vec3(1.0, 0.0, 0.0);
            outputColor.xyz = primaryColor + colorTexture * secondaryColor;

            outputColor.w = 1.0;
        }
    `,
    "type": "x-shader/x-fragment"
};

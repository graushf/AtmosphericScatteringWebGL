var GroundFromSpace_fs = {
    "data": `
        precision mediump float;
        //uniform sampler2D s2Tex1;
        //uniform sampler2D s2Tex2;
        uniform sampler2D uSamplerTexture;

        varying vec2 vTextureCoord;
        varying vec3 v3Debug;

        varying vec3 primaryColor;
        varying vec3 secondaryColor;

        void main(void)
        {
            vec2 uv = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);
            //gl_FragColor = texture2D(uSamplerTexture, vTextureCoord);
            //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); return;
            //gl_FragColor = vec4(vTextureCoord.xy, 0.0, 1.0); return;
            gl_FragColor = vec4(vec3(primaryColor + 0.25 * secondaryColor).xyz, 1.0);
            vec3 colorTexture = 1.0 * texture2D(uSamplerTexture, uv).xyz;
            colorTexture = vec3(0.0, 0.0, 0.0);
            gl_FragColor.xyz = primaryColor + 1.2 * colorTexture * secondaryColor;
            colorTexture = vec3(1.0, 0.0, 0.0);
            gl_FragColor.xyz = primaryColor + colorTexture * secondaryColor;
            //gl_FragColor.xyz = colorTexture;


            //gl_FragColor.xyz = primaryColor + texture2D(uSamplerTexture, vTextureCoord).xyz * texture2D(uSamplerTexture, vTextureCoord).xyz * secondaryColor;
            //gl_FragColor.xyz = primaryColor.xyz +texture2D(uSamplerTexture, vTextureCoord).xyz + texture2D(uSamplerTexture, vTextureCoord).xyz* secondaryColor;
            gl_FragColor.w = 1.0;

            //gl_FragColor = vec4(v3Debug, 1.0);

            //gl_FragColor = texture2D(uSamplerTexture, uv);
            //gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
        }
    `,
    "type": "x-shader/x-fragment"
};

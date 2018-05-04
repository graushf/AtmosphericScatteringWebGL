var GroundFromAtmosphere_vs = {
    "data": `
        attribute vec3 aVertexPosition;
        //attribute vec2 aTextureCoord;

        varying vec2 vTextureCoord;
        varying vec3 primaryColor;
        varying vec3 secondaryColor;

        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;

        uniform vec3 v3CameraPos;
        uniform vec3 v3LightPos;
        uniform vec3 v3InvWavelength;
        uniform float fCameraHeight;
        uniform float fCameraHeight2;
        uniform float fOuterRadius;
        uniform float fOuterRadius2;
        uniform float fInnerRadius;
        uniform float fInnerRadius2;
        uniform float fKrESun;
        uniform float fKmESun;
        uniform float fKr4PI;
        uniform float fKm4PI;
        uniform float fScale;
        uniform float fScaleDepth;
        uniform float fScaleOverScaleDepth;

        const int nSamples = 2;
        const float fSamples = 2.0;

        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
        }

        void main(void) {
            // Get the ray from the camera to the vertex, and its length (which is the far point of the ray passing through the atmosphere)
            vec3 v3Pos = aVertexPosition;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;

            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos;
            float fDepth = exp((fInnerRadius - fCameraHeight) / fScaleDepth);
            float fCameraAngle = dot(-v3Ray, v3Pos) / length(v3Pos);
            float fLightAngle = dot(v3LightPos, v3Pos) / length(v3Pos);
            float fCameraScale = scale(fCameraAngle);
            float fLightScale = scale(fLightAngle);
            float fCameraOffset = fDepth * fCameraScale;
            float fTemp = (fLightScale + fCameraScale);

            // Initialize the scattering loop variables
            float fSampleLength = fFar / fSamples;
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

            // Now loop through the sample rays
            vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
            vec3 v3Attenuate;
            for (int i=0; i < nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
                float fScatter = fDepth*fTemp - fCameraOffset;
                v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
                v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
                v3SamplePoint += v3SampleRay;
            }

            primaryColor.rgb = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);

            // Calculate the attenuation factor for the ground
            secondaryColor.rgb = v3Attenuate;

            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
            //vTextureCoord = aTextureCoord;

        }
    `,
    "type": "x-shader/x-vertex"
};

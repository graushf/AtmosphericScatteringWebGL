var GroundFromAtmosphereDoneInFS_fs = {
    "data": `#version 300 es
        precision mediump float;

        in vec2 vTextureCoord;
        in vec3 v_vertexPos;
        
        uniform vec3 v3LightPos;
        uniform vec3 v3CameraPos;					// The camera's current position
        uniform float fScaleDepth;					// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
        uniform float fScaleOverScaleDepth;			// fScale / fScaleDepth
        uniform float fInnerRadius;					// The inner (planetary) radius
        uniform float fScale;						// 1 / (fOuterRadius - fInnerRadius)
        uniform vec3 v3InvWavelength;				// 1 / pow(wavelength, 4) for the red, green, and blue channels
        uniform float fKr4PI;						// Kr * 4 * PI
        uniform float fKm4PI;						// Km * 4 * PI
        uniform float fKrESun;						// Kr * ESun
        uniform float fKmESun;						// Km * ESun
        uniform float fCameraHeight;                
        uniform float fCameraHeight2;				// fCameraHeight^2
        uniform float fOuterRadius2;				// fOuterRadius^2
        uniform float fOuterRadius;					// The outer (atmosphere) radius

        out vec4 outputColor;
        const int nSamples = 2;

        float scale(float fCos);

        void main() {
            // Get the ray from the camera to the vertex, and its length (which is the far point of the ray passing through the atmosphere)
            vec3 v3Pos = v_vertexPos;
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
            float fSampleLength = fFar / float(nSamples);
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;
            
            // Now loop through the sample rays
            vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
            vec3 v3Attenuate;
            float opticalDepthDebug;
            vec3 debugColor;
            for (int i=0; i < nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
                float fScatter = fDepth*fTemp - fCameraOffset;

                opticalDepthDebug = fScatter;

                v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
                
                
                
                v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
                v3SamplePoint += v3SampleRay;
            }

            vec3 colorSky = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);
            vec3 attenuationColor = v3Attenuate;
            
            outputColor = vec4(colorSky + 0.25 * attenuationColor, 1.0);

            //debugColor = colorSky;

            //debugColor = vec3(opticalDepthDebug);
            //outputColor.xyz = debugColor;
        }

        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
        }
    `,
    "type": "x-shader/x-fragment"
};

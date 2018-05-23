SkyFromAtmosphere_vs = {
    "data": `#version 300 es
        precision mediump float;

        in vec3 aVertexPosition;
        
        out vec3 v3Direction;
        out vec3 frontColor;
        out vec3 frontSecondaryColor;
        
        out vec3 debugColor;
        
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        uniform vec3 v3CameraPos;				// The camera's current position
        
        uniform vec3 v3LightPos;				// The direction vector to the light source
        uniform vec3 v3InvWavelength;			// 1 / pow(wavelength, 4) for the red, green, and blue channels
        uniform float fCameraHeight;			// The camera's current height
        
        uniform float fCameraHeight2;			// fCameraHeight^2
        uniform float fOuterRadius;				// The outer (atmosphere) radius
        uniform float fOuterRadius2;			// fOuterRadius^2
        
        uniform float fInnerRadius;				// The inner (planetary) radius
        uniform float fInnerRadius2;			// fInnerRadius^2
        uniform float fKrESun;					// Kr * ESun
        
        uniform float fKmESun;					// Km * Esun
        uniform float fKr4PI;					// Kr * 4 * PI
        uniform float fKm4PI;					// Km * 4 * PI
        
        uniform float fScale;					// 1 / (fOuterRadius - fInnerRadius)
        uniform float fScaleDepth;				// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
        uniform float fScaleOverScaleDepth;		// fScale / fScaleDepth
        
        uniform sampler2D uTextureDebug;
        uniform sampler2D uOpticalDepthLUT;
        
        #define nSamples 2
        
        //const int nSamples = 2;
        const float fSamples = 2.0;
        
        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
        }
        
        void main(void)
        {
            // Get the ray from the camera to the vertex and its length
            vec4 aux = uModelMatrix * vec4(aVertexPosition, 1.0);
            vec3 v3Pos = aux.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;
        
            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos;
            float fHeight = length(v3Start);
            float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fCameraHeight));
        
            float fStartAngle = dot(v3Ray, v3Start) / fHeight;
            float fStartOffset = fDepth * scale(fStartAngle);
        
            vec4 v4LightDepth;
            vec4 v4SampleDepth;
        
            // Initialize the scattering loop variables
            //vec3 v3RayleighSum = vec3(0.0,0.0,0.0);
            //vec3 v3MieSum = vec3(0.0,0.0,0.0);
            //vec3 v3Attenuation;
            float fSampleLength = fFar / fSamples;
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;
        
            // Now loop through the sample rays
            vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
        
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
        
                float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
                float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;
        
                float fScatter = (fStartOffset + fDepth*(scale(fLightAngle) - scale(fCameraAngle)));
        
                vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
        
                v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
        
                v3SamplePoint += v3SampleRay;
            }
        
            // Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader
            frontSecondaryColor.rgb = v3FrontColor * fKmESun; // MieColour
            frontColor.rgb = v3FrontColor * (v3InvWavelength * fKrESun); // RayleighColour
        
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
            v3Direction = v3CameraPos - v3Pos;
        }
    `,
    "type": "x-shader/x-vertex"
};

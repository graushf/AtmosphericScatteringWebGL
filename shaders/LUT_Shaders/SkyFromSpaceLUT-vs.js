SkyFromSpaceLUT_vs = {
    "data": `#version 300 es
        precision mediump float;

        in vec3 aVertexPosition;
        //in vec2 aTextureCoord;
        
        out vec3 v3Direction;

        // fs loop stuff
        out vec3 v_v3SamplePoint;
        out vec3 v_v3Ray;
        out float v_fStartOffset;
        out float v_fScaledLength;
        out vec3 v_v3SampleRay;
        out vec3 v_vertexPos; 
        
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        uniform vec3 v3CameraPos;					// The camera's current position
        uniform float fCameraHeight2;				// fCameraHeight^2
        uniform float fOuterRadius;					// The outer (atmosphere) radius
        uniform float fOuterRadius2;				// fOuterRadius^2
        uniform float fScale;						// 1 / (fOuterRadius - fInnerRadius)
        uniform float fScaleDepth;					// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
        
        uniform sampler2D uTextureLUT;

        out vec3 debugColor;
        
        const int nSamples = 2;
        const float fSamples = 2.0;
        
        #define DELTA 0.000001
        
        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
        }
        
        vec4 GetDepth(float x, float y)
        {
            return texture(uTextureLUT, vec2(x, y));
        }
        
        void main(void)
        {
            // Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)
            vec3 v3Pos = aVertexPosition.xyz;
            vec3 v3Ray = v3Pos - v3CameraPos;
            float fFar = length(v3Ray);
            v3Ray /= fFar;
            
            debugColor = vec3(1.0, 0.0, 0.0);
        
            // Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)
            float B = 2.0 * dot(v3CameraPos, v3Ray);
            float C = fCameraHeight2 - fOuterRadius2;
            float fDet = max(0.0, B*B - 4.0 * C);
            float fNear = 0.5 * (-B - sqrt(fDet));
            
        
            // Calculate the ray's start and end positions in the atmosphere
            vec3 v3Start = v3CameraPos + v3Ray * fNear;
            fFar -= fNear;
            float fStartAngle = dot(v3Ray, v3Start) / fOuterRadius; // divided by fOuterRadius to obtain the angle only, v3Start is not normalized
            float fStartDepth = exp(-1.0 / fScaleDepth);
            float fStartOffset = fStartDepth * scale(fStartAngle);
        
            // Initialize the scattering loop variables
            float fSampleLength = fFar / fSamples;
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;
            
            // outputs to fragment shader
            v_v3SamplePoint = v3SamplePoint;
            v_v3Ray = v3Ray;
            v_fStartOffset = fStartOffset;
            v_fScaledLength = fScaledLength;
            v_v3SampleRay = v3SampleRay;

            v_vertexPos = aVertexPosition.xyz;
           
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
            v3Direction = v3CameraPos - v3Pos;
        }
    `,
    "type": "x-shader/x-vertex"
};

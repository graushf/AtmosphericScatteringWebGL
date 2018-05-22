SkyFromSpace_vs = {
    "data": `
        precision mediump float;

        attribute vec3 aVertexPosition;
        //attribute vec2 aTextureCoord;
        
        varying vec3 v3Direction;
        varying vec3 frontPrimaryColor;
        varying vec3 frontSecondaryColor;
        
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        uniform vec3 v3CameraPos;					// The camera's current position
        uniform vec3 v3LightPos;					// The direction vector to the light source
        uniform vec3 v3InvWavelength;				// 1 / pow(wavelength, 4) for the red, green, and blue channels
        uniform float fCameraHeight;				// The camera's current height
        uniform float fCameraHeight2;				// fCameraHeight^2
        uniform float fOuterRadius;					// The outer (atmosphere) radius
        uniform float fOuterRadius2;				// fOuterRadius^2
        uniform float fInnerRadius;					// The inner (planetary) radius
        uniform float fInnerRadius2;				// fInnerRadius^2
        uniform float fKrESun;						// Kr * ESun
        uniform float fKmESun;						// Km * ESun
        uniform float fKr4PI;						// Kr * 4 * PI;
        uniform float fKm4PI;						// Km * 4 * PI
        uniform float fScale;						// 1 / (fOuterRadius - fInnerRadius)
        uniform float fScaleDepth;					// The scale depth (i.e. the altitude at which the atmosphere's average density is found)
        uniform float fScaleOverScaleDepth;			// fScale / fScaleDepth
        
        varying vec3 debugColor;
        
        const int nSamples = 2;
        const float fSamples = 2.0;
        
        float scale(float fCos)
        {
            float x = 1.0 - fCos;
            return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
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
        
        
            // Calculate the ray's starting position, then calculate its scattering offset
            vec3 v3Start = v3CameraPos + v3Ray * fNear;
            fFar -= fNear;
            float fStartAngle = dot(v3Ray, v3Start) / fOuterRadius; // divided by fOuterRadius to obtain the angle only, v3Start is not normalized
            float fStartDepth = exp(-1.0 / fScaleDepth);
            float fStartOffset = fStartDepth * scale(fStartAngle);
        
        
            // Initialize the scattering loop variables
            // gl_FrontColor = vec4(0.0, 0.0, 0.0, 0.0);
            float fSampleLength = fFar / fSamples;
            float fScaledLength = fSampleLength * fScale;
            vec3 v3SampleRay = v3Ray * fSampleLength;
            vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;
        
            // Now loop through the sample rays
            vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);
            for (int i=0; i<nSamples; i++)
            {
                float fHeight = length(v3SamplePoint);
                // fScaleOverScaleDepth = fScale / fScaleHeight, fDepth = exp((fScale * (fInnerRadius - fHeight))/fScaleHeight)
                // (fScale * (fInnerRadius - fHeight)) will return the current height on negative value from 0.0 to 1.0, 0.0 bottom of atmosphere and 1.0 top of atmosphere
                // fScale multiplication is used to scale the height to the 0.0 to 1.0 value
                // Division by ScaleHeight implies this is the calculation of the density on the current atmosphere or depth on the current height of the atmosphere
                float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight)); 
                float fLightAngle = dot(v3LightPos, v3SamplePoint) / fHeight;
                float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;
                float fScatter = (fStartOffset + fDepth*(scale(fLightAngle) - scale(fCameraAngle)));
                vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));
                v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
                v3SamplePoint += v3SampleRay;
        
        
            }
            debugColor = v3FrontColor * (v3InvWavelength * fKrESun);
        
            // Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader
            frontSecondaryColor.rgb = v3FrontColor * fKmESun; // Mie color, not dependent on wavelength
            frontPrimaryColor.rgb = v3FrontColor * (v3InvWavelength * fKrESun); // Rayleigh color, dependent on wavelength
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
            v3Direction = v3CameraPos - v3Pos;
        }
    `,
    "type": "x-shader/x-vertex"
};

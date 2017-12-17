var m_fFPS;
var m_nTime;

var m_vLight;
var m_vLightDirection;

var m_3DCamera;

var DELTA = 1e-6

// Variables that can be tweaked with keypresses
var m_bUseHDR;
var m_nSamples;
//var m_nPolygonMode;
var m_Kr, m_Kr4PI;
var m_Km, m_Km4PI;
var m_ESun;
var m_g;
var m_fExposure;

var m_fInnerRadius;
var m_fOuterRadius
var m_fScale;
var m_fWavelength = [];
var m_fWavelength4 = [];
var m_fRayleighScaleDepth;
var m_fMieScaleDepth;

var m_pbOpticalDepth;

var m_tMoonGlow;
var m_tEarth;

var m_shSkyFromSpace;
var m_shSkyFromAtmosphere;
var m_shGroundFromSpace;
var m_shGroundFromAtmosphere;
var m_shSpaceFromSpace;
var m_shSpaceFromAtmosphere;

var m_pBuffer;

var planetGeomRenderData;
var atmosphereGeomRenderData;

var texturePlanet;

var pGroundShader;
var pSkyShader;

function initGameEngine() {
	
	gl.enable(gl.DEPTH_TEST);
	//gl.depthFunc(gl.GL_LEQUAL);
	gl.enable(gl.CULL_FACE);

	m_3DCamera = initCamera();

	//0.8422417044639587 8.989599227905273 4.677064418792725
	//m_3DCamera.CameraSetPos(vec3.fromValues(0.0, 0.0, 50.0), gl.viewportWidth, gl.viewportHeight);
	m_3DCamera.CameraSetPos(vec3.fromValues(0.0, 10.0, 1.0), gl.viewportWidth, gl.viewportHeight);

	var qOrientation = quat.fromValues(0.0, 0.0, 0.0, 1.0);
	quat.normalize(qOrientation, qOrientation);

	m_vLight = vec3.fromValues(0.0, 0.0, 1000.0);
	//m_vLight = vec3.fromValues(0.0, 700.0, 700.0);
	//m_vLight = vec3.fromValues(1000.0, 0.0, 0.0);
	var length = vec3.length(m_vLight);
	m_vLightDirection = vec3.create();
	vec3.scale(m_vLightDirection, m_vLight, 1/length);

	//m_vLight = vec3.fromValues(0.0, -0.9, -0.5);

	 m_Samples = 3;
	 m_Kr = 0.0025;
	 m_Kr4PI = m_Kr * 4.0 * Math.PI;
	 m_Km = 0.0010;
	 m_Km4PI = m_Km * 4.0 * Math.PI;
	 //m_ESun = 20.0;
	 m_ESun = 15.0;
	 m_g = -0.990;
	 m_fExposure = 2.0;

	 m_fInnerRadius = 10.0;
	 m_fOuterRadius = 10.25;
	 m_fScale = 1 / (m_fOuterRadius - m_fInnerRadius);

	 m_fWavelength[0] = 0.650;
	 m_fWavelength[1] = 0.570;
	 m_fWavelength[2] = 0.475;
	 m_fWavelength4[0] = Math.pow(m_fWavelength[0], 4.0);
	 m_fWavelength4[1] = Math.pow(m_fWavelength[1], 4.0);
	 m_fWavelength4[2] = Math.pow(m_fWavelength[2], 4.0);

	 m_fRayleighScaleDepth = 0.25;
	 m_fMieScaleDepth = 0.1;
	 m_pbOpticalDepth = makeOpticalDepthBuffer(m_fInnerRadius, m_fOuterRadius, m_fRayleighScaleDepth, m_fMieScaleDepth);

	 // GUSTAVO CREATE PLANET AND ATMOSPHERE GEOMETRY
	 planetGeomRenderData = generateSphereBuffersAdv(m_fInnerRadius, 100, 50);
	 atmosphereGeomRenderData = generateSphereBuffersAdv(m_fOuterRadius, 300, 150);

	 // CREATE SHADERS;
	 console.log("Creating Shaders");
	 m_shGroundFromSpace = createShader("GroundFromSpace-vs", "GroundFromSpace-fs");
	 m_shSkyFromSpace = createShader("SkyFromSpace-vs", "SkyFromSpace-fs");
	 m_shGroundFromAtmosphere = createShader("GroundFromAtmosphere-vs", "GroundFromAtmosphere-fs");
	 m_shSkyFromAtmosphere = createShader("SkyFromAtmosphere-vs", "SkyFromAtmosphere-fs");
	 // INIT MOON PIXEL BUFFER

	 // INIT EARTH PIXEL BUFFER
	 texturePlanet = loadTexture("http://localhost/AtmosphericScatteringWebGL/earthmap1k.jpg");
}

function renderFrame() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferSetupScene);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	drawShapesAtCameraPosition(vec3.fromValues(4.79, 6.62, 0.16), -42.5, -145.0);
	//renderPlanet(planetGeomRenderData);


	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	//drawShapesWithRay();
	renderPlanet(planetGeomRenderData);
	renderAtmosphere(atmosphereGeomRenderData);

	gl.viewport(3 * (gl.viewportWidth/4), 2*(gl.viewportHeight/4.0), gl.viewportWidth/4.0, gl.viewportHeight/4.0);
	drawScreenFillingTexture(textureFramebufferSetupScene);
}

function RenderFrameAtmosphere(nMilliseconds)
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Determine the FPS

	// Move the camera
	// handle input
	

	var mViewMatrix = mat4.create();
	mViewMatrix = m_3DCamera.GetViewMatrix();

	//var mModelMatrix = mat4.create();
	//mModelMatrix = m_3DCamera.GetModel

	var vCamera = vec3.create();
	vCamera = m_3DCamera.Position;
	var vUnitCamera = vec3.create();
	vec3.scale(vUnitCamera, vCamera, vec3.length(vCamera));

	// var pSpaceShader;
	// if (vec3.length(vCamera) < m_fOuterRadius) {
	// 	pSpaceShader = m_shSpaceFromAtmosphere;
	// }
	// else if (vCamera.z > 0.0) {
	// 	pSpaceShader = m_shSpaceFromSpace;
	// }

	// if (pSpaceShader) 
	// {
	// 	gl.useProgram(pSpaceShader);
	// 	gl.uniform3f(gl.getUniformLocation(pSpaceShader, "v3CameraPos"), vCamera[0], vCamera[1], vCamera[2]);
	// 	gl.uniform3f(gl.getUniformLocation(pSpaceShader, "v3LightPos"), m_vLightDirection[0], m_vLightDirection[1], m_vLightDirection[2]);
	// 	gl.uniform3f(gl.getUniformLocation(pSpaceShader, "v3InvWavelength"), 1/m_fWavelength4[0], 1/m_fWavelength4[1], 1/m_fWavelength4[2]);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fCameraHeight"), vec3.length(vCamera));
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fCameraHeight2"), Math.pow(vec3.length(vCamera), 2.0));
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fInnerRadius"), m_fInnerRadius);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fInnerRadius2"), Math.pow(m_fInnerRadius, 2.0))
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fOuterRadius"), m_fOuterRadius);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fOuterRadius2"), Math.pow(m_fOuterRadius, 2.0));
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKrESun"), m_Kr * m_ESun);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKmESun"), m_Km * m_Esun);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKr4PI"), m_Kr4PI);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKm4PI"), m_Km4PI);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fScale"), 1.0/(m_fOuterRadius - m_fInnerRadius));
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fScaleDepth"), m_fRayleighScaleDepth);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fScaleOverScaleDepth"), (1.0 / (m_fOuterRadius - m_fInnerRadius)) / m_fRayleighScaleDepth);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "g"), m_g);
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "g2"), Math.pow(m_g, 2));
	// 	gl.uniform1f(gl.getUniformLocation(pSpaceShader, "s2Test"), 0);
	// }

	// // MOON STUFF

	// if (pSpaceShader) {
	// 	// dissableProgram
	// }

	if (vec3.length(vCamera) >= m_fOuterRadius)
	{
		pGroundShader = m_shGroundFromSpace;
	} else {
		pGroundShader = m_shGroundFromAtmosphere;
	}

	if (pGroundShader)  
	{
		gl.useProgram(pGroundShader);
		gl.uniform3f(gl.getUniformLocation(pGroundShader, "v3CameraPos"), vCamera[0], vCamera[1], vCamera[2]);
		gl.uniform3f(gl.getUniformLocation(pGroundShader, "v3LightPos"), m_vLightDirection[0], m_vLightDirection[1], m_vLightDirection[2]);
		gl.uniform3f(gl.getUniformLocation(pGroundShader, "v3InvWavelength"), 1/m_fWavelength4[0], 1/m_fWavelength4[1], 1/m_fWavelength4[2]);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fCameraHeight"), vec3.length(vCamera));
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fCameraHeight2"), Math.pow(vec3.length(vCamera), 2.0));
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fInnerRadius"), m_fInnerRadius);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fInnerRadius2"), Math.pow(m_fInnerRadius, 2.0))
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fOuterRadius"), m_fOuterRadius);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fOuterRadius2"), Math.pow(m_fOuterRadius, 2.0));
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fKrESun"), m_Kr * m_ESun);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fKmESun"), m_Km * m_ESun);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fKr4PI"), m_Kr4PI);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fKm4PI"), m_Km4PI);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fScale"), 1.0/(m_fOuterRadius - m_fInnerRadius));
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fScaleDepth"), m_fRayleighScaleDepth);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "fScaleOverScaleDepth"), (1.0 / (m_fOuterRadius - m_fInnerRadius)) / m_fRayleighScaleDepth);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "g"), m_g);
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "g2"), Math.pow(m_g, 2));
		gl.uniform1f(gl.getUniformLocation(pGroundShader, "s2Test"), 0);

		//console.log(Math.pow(m_fOuterRadius, 2.0));
		//console.log(m_fInnerRadius);
		//console.log(Math.pow(m_fInnerRadius, 2.0));
		//console.log("m_Kr-Esun: "+ m_Kr * m_ESun);
		//console.log("fKmESun: "+ m_Km * m_ESun);
		//console.log("fKr4PI: "+ m_Kr4PI);
		//console.log("fKm4PI: "+  m_Km4PI);
		//console.log("fScale: "+  1.0/(m_fOuterRadius - m_fInnerRadius));
		//console.log("fScaleDepth: "+  m_fRayleighScaleDepth);
		//console.log("fScaleOverScaleDepth: "+  (1.0 / (m_fOuterRadius - m_fInnerRadius)) / m_fRayleighScaleDepth);
		//console.log("g: "+  m_g);
		console.log("g2: "+  Math.pow(m_g, 2));
	}

	renderPlanet(planetGeomRenderData, pGroundShader, texturePlanet);

	// SPHERE CREATION
	// Disable groundShader

	if (vec3.length(vCamera) >= m_fOuterRadius) {
		gl.enable(gl.CULL_FACE);

		pSkyShader = m_shSkyFromSpace;
	} else {
		gl.disable(gl.CULL_FACE);
		m_ESun = 20.0;
		pSkyShader = m_shSkyFromAtmosphere;
	}

	if (pSkyShader)
	{
		gl.useProgram(pSkyShader);
		gl.uniform3f(gl.getUniformLocation(pSkyShader, "v3CameraPos"), vCamera[0], vCamera[1], vCamera[2]);
		gl.uniform3f(gl.getUniformLocation(pSkyShader, "v3LightPos"), m_vLightDirection[0], m_vLightDirection[1], m_vLightDirection[2]);
		gl.uniform3f(gl.getUniformLocation(pSkyShader, "v3InvWavelength"), 1/m_fWavelength4[0], 1/m_fWavelength4[1], 1/m_fWavelength4[2]);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fCameraHeight"), vec3.length(vCamera));
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fCameraHeight2"), Math.pow(vec3.length(vCamera), 2.0));
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fInnerRadius"), m_fInnerRadius);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fInnerRadius2"), Math.pow(m_fInnerRadius, 2.0))
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fOuterRadius"), m_fOuterRadius);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fOuterRadius2"), Math.pow(m_fOuterRadius, 2.0));
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fKrESun"), m_Kr * m_ESun);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fKmESun"), m_Km * m_ESun);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fKr4PI"), m_Kr4PI);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fKm4PI"), m_Km4PI);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fScale"), 1.0/(m_fOuterRadius - m_fInnerRadius));
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fScaleDepth"), m_fRayleighScaleDepth);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "fScaleOverScaleDepth"), (1.0 / (m_fOuterRadius - m_fInnerRadius)) / m_fRayleighScaleDepth);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "g"), m_g);
		gl.uniform1f(gl.getUniformLocation(pSkyShader, "g2"), Math.pow(m_g, 2));
	}
	console.log("v3CameraPos: "+vCamera[0] + " " +vCamera[1] + " " + vCamera[2]);
	// TRY SETTING THE MOON AS LIGHT SOURCE

	gl.frontFace(gl.CW);
	//gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE);

	// Render Sphere ATMOSPHERE
 	renderAtmosphere(atmosphereGeomRenderData, pSkyShader);

 	gl.frontFace(gl.CCW);

}

function makeOpticalDepthBuffer(fInnerRadius, fOuterRadius, fRayleighScaleHeight, fMieScaleHeight)
{
	var nSize = 64;
	var nSamples = 50;
	var fScale = 1.0 / (fOuterRadius - fInnerRadius);

	var m_nChannels = 4;
	//var m_pBuffer = new ArrayBuffer(nSize * nSize * 4 * 4);
	var m_pBuffer = new Float32Array(nSize * nSize * m_nChannels);

	var nIndex = 0;
	var fPrev = 0;
	for (var nAngle = 0; nAngle < nSize; nAngle++)
	{
		// As the y tex coord gors from 0 to 1, the angle goes from 0 to 180 degrees
		var fCos = 1.0 - (nAngle+nAngle) / nSize;
		var fAngle = Math.acos(fCos);
		var vRay = vec3.fromValues(Math.sin(fAngle), Math.cos(fAngle), 0); // Ray pointing to the viewport

		// PRINT VALUES

		var fFirst = 0;
		for (var nHeight = 0; nHeight < nSize; nHeight++)
		{
			// As the x tex coord goes from 0 to 1, the height goes from the bottom of the atmosphere to the top
			var fHeight = DELTA + fInnerRadius + ((fOuterRadius - fInnerRadius) * nHeight) / nSize;
			var vPos = vec3.fromValues(0, fHeight, 0);	// The position of the camera

			// If the ray from vPos heading in the vRay direction intersects the inner radius (i.e. the planet), then this spot is not visible from the viewpoint
			var B = 2.0 * vec3.dot(vPos, vRay);
			var Bsq = B * B;
			var Cpart = vec3.dot(vPos, vPos);
			var C = Cpart - fInnerRadius*fInnerRadius;
			var fDet = Bsq - 4.0 * C;
			var bVisible = (fDet < 0 || (0.5 * (-B - Math.sqrt(fDet)) <= 0) && (0.5 * (-B + Math.sqrt(fDet)) <= 0));
			var fRayleighDensityRatio;
			var fMieDensityRatio;

			if (bVisible)
			{
				fRayleighDensityRatio = Math.exp(-(fHeight - fInnerRadius) * fScale / fRayleighScaleHeight);
				fMieDensityRatio = Math.exp(-(fHeight - fInnerRadius) * fScale / fMieScaleHeight);
			}
			else 
			{
				// Smooth the transition from light to shadow (it is soft shadow after all)
				fRayleighDensityRatio = m_pBuffer[nIndex - nSize * m_nChannels] * 0.5;
				fMieDensityRatio = m_pBuffer[nIndex+2 - nSize*m_nChannels] * 0.5;
			}

			// Determine where the ray intersects the outer radius (the top of the atmosphere)
			// This is the end of our ray for determining the optical depth (vPos is the start)
			C = Cpart - fOuterRadius*fOuterRadius;
			fDet = Bsq - 4.0 * C;
			var fFar = 0.5 * (-B + Math.sqrt(fDet));

			// Next determine the length of each sample, scale the sample ray, and make sure position checks are at the center of a sample ray
			var fSampleLength = fFar / nSamples;
			var fScaledLength = fSampleLength * fScale;
			var vSampleRay = vec3.create();
			vec3.scale(vSampleRay, vRay, fSampleLength);
			var aux = vec3.create();
			vec3.scale(aux, vSampleRay, 0.5);
			vec3.add(vPos, vPos, aux);

			// Iterate through the samples to sum up the optical depth for the distance the ray travels through the atmosphere
			var fRayleighDepth = 0;
			var fMieDepth = 0;
			for (var i = 0; i < nSamples; i++)
			{
				var fHeight = vec3.length(vPos);
				var fAltitude = (fHeight - fInnerRadius) * fScale;
				// fAltitude = Max(fAltitude, 0.0);
				fRayleighDepth += Math.exp(-fAltitude / fRayleighScaleHeight);
				fMieDepth += Math.exp(-fAltitude / fMieScaleHeight);
				vec3.add(vPos, vPos, vSampleRay);
			}

			// Multiply the sums by the length the ray traveled
			fRayleighDepth *= fScaledLength;
			fMieDepth *= fScaledLength;

			if (!isFinite(fRayleighDepth) || fRayleighDepth > 1.0e25) {
				fRayleighDepth = 0;
			}
			if (!isFinite(fMieDepth) || fMieDepth > 1.0e25) {
				fMieDepth = 0;
			}

			// Store the results for Rayleigh to the light source, Rayleigh to the camera, Mie to the light soure, and Mie to the camera
			m_pBuffer[nIndex++] = fRayleighDensityRatio;
			m_pBuffer[nIndex++] = fRayleighDepth;
			m_pBuffer[nIndex++] = fMieDensityRatio;
			m_pBuffer[nIndex++] = fMieDepth;

		}
	}

	return m_pBuffer;
}

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

var m_shFullScrQuad;

var m_shSkyFromSpace;
var m_shSkyFromAtmosphere;
var m_shGroundFromSpace;
var m_shGroundFromAtmosphere;
var m_shSpaceFromSpace;
var m_shSpaceFromAtmosphere;

// LUT shaders
var m_shSkyFromSpaceLUT;

var m_pBuffer;

var planetGeomRenderData;
var atmosphereGeomRenderData;

var texturePlanet;
var textureMoon;

var textureSun;

var textureDebug;

var pGroundShader;
var pSkyShader;

var pSpaceShader;
var pSunShader;

var exposureQuantity = 0.8;

var debugFloatTexture;
var opticalDepthLUT;

// config parameters
var cameraInSpace = undefined;
var renderWithLUT = false;

function initGameEngine() {

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	createFramebufferHDR();

	//initCameraSpace();
	m_3DCamera = new Camera3D();
	m_3DCamera.initCameraSpace();
	//m_3DCamera.initCameraEarth();

	m_vLight = vec3.fromValues(0.0, 0.0, -100.0);
	m_vLight = vec3.fromValues(35.355, 0.0, 35.355);
	m_vLight = vec3.fromValues(30, 0.0, 35.355);
	var length = vec3.length(m_vLight);
	m_vLightDirection = vec3.create();
	vec3.scale(m_vLightDirection, m_vLight, 1/length);

	 m_Samples = 3;
	 m_Kr = 0.0025;
	 m_Kr4PI = m_Kr * 4.0 * Math.PI;
	 m_Km = 0.0010;
	 m_Km4PI = m_Km * 4.0 * Math.PI;
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
	 //m_fMieScaleDepth = 0.1;
	 m_fMieScaleDepth = 0.25;
	 m_pbOpticalDepth = makeOpticalDepthBuffer(m_fInnerRadius, m_fOuterRadius, m_fRayleighScaleDepth, m_fMieScaleDepth);
	 //createOpticalDepthLUT();

	 // GUSTAVO CREATE PLANET AND ATMOSPHERE GEOMETRY
	 screenFillingPlaneRenderData = initBuffersPlane();
	 planetGeomRenderData = generateSphereBuffersUpgraded(m_fInnerRadius, 100, 50);
	 atmosphereGeomRenderData = generateSphereBuffersUpgraded(m_fOuterRadius, 300, 150);
	 // GIZMOS GEOMETRY
	 initBuffersCube();


	 // CREATE SHADERS;
	 console.log("Creating Shaders");
	 m_shFullScrQuad = createShaderByFilename(FullScreenQuad_vs, FullScreenQuad_fs);
	 m_shGroundFromSpace =  createShaderByFilename(GroundFromSpace_vs, GroundFromSpace_fs);
	 m_shSkyFromSpace = createShaderByFilename(SkyFromSpace_vs, SkyFromSpace_fs);
	 m_shGroundFromAtmosphere = createShaderByFilename(GroundFromAtmosphere_vs, GroundFromAtmosphere_fs);
	 m_shSkyFromAtmosphere = createShaderByFilename(SkyFromAtmosphere_vs, SkyFromAtmosphere_fs);
	 if (renderWithLUT) {
		//m_shSkyFromSpaceLUT = createShaderByFilename(SkyFromSpaceLUT_vs, SkyFromSpaceLUT_fs);
	 }

	 // Looking at space
	 m_shSpaceFromSpace = createShaderByFilename(SpaceFromSpace_vs, SpaceFromSpace_fs);
	 //m_shSpaceFromAtmosphere = createShadersByFilename();

	 // GIZMOS SHADER
	 //m_shGizmos = createShaderByFilename(SimpleGeometryShader_vs, SimpleGeometryShader_fs);

	 // INIT MOON PIXEL BUFFER
	 textureMoon = loadTexture("http://localhost/AtmosphericScatteringWebGL/resources/textures/moon_texture.jpg");

	 // INIT EARTH PIXEL BUFFER
	 texturePlanet = loadTexture("http://localhost/AtmosphericScatteringWebGL/resources/textures/BlueMarbleCloudy.png");
	 textureDebug = loadTexture("http://localhost/AtmosphericScatteringWebGL/resources/textures/nature.jpg");

	 // INIT SUN TEXTURES
	 textureSun = loadTexture("http://localhost/AtmosphericScatteringWebGL/resources/textures/8k_sun.jpg");


	 initManagerUI();
}

function renderPlanetAndAtmosphere()
{
	m_fWavelength4[0] = Math.pow(m_fWavelength[0], 4.0);
	m_fWavelength4[1] = Math.pow(m_fWavelength[1], 4.0);
	m_fWavelength4[2] = Math.pow(m_fWavelength[2], 4.0);

	//var mViewMatrix = mat4.create();
	//mViewMatrix = m_3DCamera.GetViewMatrix();

	var vCamera = vec3.create();
	vCamera = m_3DCamera.Position;
	//var vUnitCamera = vec3.create();
	//vec3.scale(vUnitCamera, vCamera, vec3.length(vCamera));

	var length = vec3.length(m_vLight);
	m_vLightDirection = vec3.create();
	vec3.scale(m_vLightDirection, m_vLight, 1/length);

	if (vec3.length(vCamera) >= m_fOuterRadius)
	{
		cameraInSpace = true;
	 	gl.frontFace(gl.CW);
		pGroundShader = m_shGroundFromSpace;
	} else {
		cameraInSpace = false;
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
	}

	renderPlanet(planetGeomRenderData, pGroundShader, texturePlanet);
 	gl.frontFace(gl.CCW);

	//gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	if (vec3.length(vCamera) >= m_fOuterRadius) {
		cameraInSpace = true; 
		gl.enable(gl.CULL_FACE);
		if (renderWithLUT) {
			pSkyShader = m_shSkyFromSpaceLUT;
		} else {
			pSkyShader = m_shSkyFromSpace;
		}
	} else {
		cameraInSpace = false;
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

		// ## debug
		if (renderWithLUT) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, opticalDepthLUT);
			gl.uniform1i(gl.getUniformLocation(pSkyShader, "uTextureLUT"), 0);
		}
	}
	// TRY SETTING THE MOON AS LIGHT SOURCE

	gl.frontFace(gl.CCW);
	//gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE);

	// Render Sphere ATMOSPHERE
 	renderAtmosphere(atmosphereGeomRenderData, pSkyShader);
	gl.frontFace(gl.CW);
	 gl.frontFace(gl.CCW);
	 
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

 	updateUI(clock, auxAngle);
}

function renderMoon() {
	var moonPosition = vec3.fromValues(30.0, 0.0, 0.0);

	m_fWavelength4[0] = Math.pow(m_fWavelength[0], 4.0);
	m_fWavelength4[1] = Math.pow(m_fWavelength[1], 4.0);
	m_fWavelength4[2] = Math.pow(m_fWavelength[2], 4.0);

	//var mViewMatrix = mat4.create();
	//mViewMatrix = m_3DCamera.GetViewMatrix();

	var vCamera = vec3.create();
	vCamera = m_3DCamera.Position;
	//var vUnitCamera = vec3.create();
	//vec3.scale(vUnitCamera, vCamera, vec3.length(vCamera));

	m_vLightDirection = vec3.create();
	m_vLightDirection = vec3.fromValues(m_vLight[0] - moonPosition[0], m_vLight[1] - moonPosition[1], m_vLight[2] - moonPosition[2]);
	//m_vLightDirection = vec3.fromValues( moonPosition[0] - m_vLight[0], moonPosition[1] - m_vLight[1], moonPosition[2] - m_vLight[2]);
	var length = vec3.length(m_vLightDirection);
	vec3.scale(m_vLightDirection, m_vLightDirection, 1/length);


	pSpaceShader = m_shGroundFromSpace;

	if (pSpaceShader == m_shGroundFromSpace)
	{
		gl.useProgram(pSpaceShader);
		gl.uniform3f(gl.getUniformLocation(pSpaceShader, "v3CameraPos"), vCamera[0], vCamera[1], vCamera[2]);
		gl.uniform3f(gl.getUniformLocation(pSpaceShader, "v3LightPos"), m_vLightDirection[0], m_vLightDirection[1], m_vLightDirection[2]);
		gl.uniform3f(gl.getUniformLocation(pSpaceShader, "v3InvWavelength"), 1/m_fWavelength4[0], 1/m_fWavelength4[1], 1/m_fWavelength4[2]);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fCameraHeight"), vec3.length(vCamera));
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fCameraHeight2"), Math.pow(vec3.length(vCamera), 2.0));
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fInnerRadius"), m_fInnerRadius);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fInnerRadius2"), Math.pow(m_fInnerRadius, 2.0))
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fOuterRadius"), m_fOuterRadius);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fOuterRadius2"), Math.pow(m_fOuterRadius, 2.0));
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKrESun"), m_Kr * m_ESun);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKmESun"), m_Km * m_ESun);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKr4PI"), m_Kr4PI);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fKm4PI"), m_Km4PI);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fScale"), 1.0/(m_fOuterRadius - m_fInnerRadius));
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fScaleDepth"), m_fRayleighScaleDepth);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "fScaleOverScaleDepth"), (1.0 / (m_fOuterRadius - m_fInnerRadius)) / m_fRayleighScaleDepth);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "g"), m_g);
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "g2"), Math.pow(m_g, 2));
		gl.uniform1f(gl.getUniformLocation(pSpaceShader, "s2Test"), 0);
	}
	gl.frontFace(gl.CW);

	renderSphereSurfaceAdvWithTexture(planetGeomRenderData, pSpaceShader, vec3.fromValues(30.0, 0.0, 0.0), vec3.fromValues(0.2, 0.2, 0.2), textureMoon);
}

function renderSun() {
	pSunShader = m_shSpaceFromSpace;
	gl.useProgram(pSunShader);
	gl.frontFace(gl.CW);
	renderSphereSurfaceAdvWithTexture(planetGeomRenderData, pSunShader, m_vLight, vec3.fromValues(0.3, 0.3, 0.3), textureSun);
}
function tickGameEngine() {
	resize(gl.canvas);

    requestAnimFrame(tickGameEngine);
	gl.enable(gl.DEPTH_TEST);
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferSetupSceneHDR);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if (cameraInSpace != undefined && cameraInSpace) {
		renderSun();
	}
	//renderMoon();
    renderPlanetAndAtmosphere();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	drawScreenFillingTextureHDR(m_shFullScrQuad, textureFramebufferSetupSceneHDR);
	gl.disable(gl.CULL_FACE);
	gl.disable(gl.DEPTH_TEST);
	//renderCameraRotationGizmos();

	handleKeys();

	calculateDeltaTime();
    animate();
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

function createOpticalDepthLUT() {
	var ext = gl.getExtension('OES_texture_float');
	var ext2 = gl.getExtension('OES_texture_float_linear');

	//createDebugFloatTexture();

	opticalDepthLUT = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, opticalDepthLUT);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.viewportWidth, gl.viewportHeight, 0, gl.RGBA, gl.FLOAT, null);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.FLOAT, debugFloatTextureBuffer);

	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 64;
	const height = 64;
	const border = 0;
	const format = gl.RGBA;
	const type = gl.FLOAT;

	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, m_pbOpticalDepth);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.bindTexture(gl.TEXTURE_2D, null);
}


function createDebugFloatTexture() {
	var nSize = 64;
	var m_nChannels = 4;
	debugFloatTextureBuffer = new Float32Array(nSize * nSize * m_nChannels);

	var nIndex = 0;
	for (var x = 0; x < nSize; x++) {
		for (var y = 0; y < nSize; y++) {

			var color = 255.0;
			debugFloatTextureBuffer[nIndex++] = color; 		// R Channel
			debugFloatTextureBuffer[nIndex++] = 0.0; 		// G Channel
			debugFloatTextureBuffer[nIndex++] = 0.0; 		// B Channel
			debugFloatTextureBuffer[nIndex++] = color; 		// A Channel

		}
	}
}

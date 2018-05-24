var xRot = 0;
var yRot = 0;
var zRot = 0;

var lastTime = 0;

var uiSpeed = 70.0; // 70 for super quick solar orbit
var enableRotation = true;

var elapsedFrame;

function renderSphere(sphereRenderData, translatePos, scaleAmount, color, opacity) {
	gl.useProgram(shaderProgram);

	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)	;

	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");

	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	mat4.identity(pMatrix);

	pMatrix = m_3DCamera.GetProjectionMatrix();
	vMatrix = m_3DCamera.GetViewMatrix();

	var aux = mat4.create();
	mat4.translate(mMatrix, mMatrix, [translatePos[0], translatePos[1], translatePos[2]]);
	mat4.fromScaling(aux, [scaleAmount[0], scaleAmount[1], scaleAmount[2]]);
	mat4.multiply(mMatrix, mMatrix, aux);


	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.uniform3f(shaderProgram.colorUniform, color[0], color[1], color[2])

	gl.uniform1f(gl.getUniformLocation(shaderProgram, "uOpacity"), opacity);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereRenderData.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereRenderData.sphereVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, sphereRenderData.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

}

function renderSphereSurface(sphereRenderData, centerSphere, radiusSphere, color, opacity) {
	gl.useProgram(shaderProgram);

	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)	;

	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");

	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	mat4.identity(pMatrix);

	pMatrix = m_3DCamera.GetProjectionMatrix();
	vMatrix = m_3DCamera.GetViewMatrix();

	var aux = mat4.create();
	mat4.translate(mMatrix, mMatrix, [centerSphere[0], centerSphere[1], centerSphere[2]]);
	mat4.fromScaling(aux, [radiusSphere, radiusSphere, radiusSphere]);
	mat4.multiply(mMatrix, mMatrix, aux);


	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.uniform3f(shaderProgram.colorUniform, color[0], color[1], color[2])

	gl.uniform1f(gl.getUniformLocation(shaderProgram, "uOpacity"), opacity);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereRenderData.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereRenderData.sphereVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, sphereRenderData.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

}


function renderSphereSurfaceAdv(sphereRenderData, shaderProgram) {
	var a = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var b = gl.getVertexAttrib(1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var c = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var d = gl.getVertexAttrib(3, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	//console.log(a);
	//console.log(b);
	//console.log(c);
	//console.log(d);


	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");
	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	var mMatrix = mat4.create();
	var vMatrix = mat4.create();
	var pMatrix = mat4.create();

	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	mat4.identity(pMatrix);

	pMatrix = m_3DCamera.GetProjectionMatrix();
	vMatrix = m_3DCamera.GetViewMatrix();

	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereRenderData.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	var a = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var b = gl.getVertexAttrib(1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var c = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var d = gl.getVertexAttrib(3, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	//console.log(a);
	//console.log(b);
	//console.log(c);
	//console.log(d);


	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereRenderData.sphereVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, sphereRenderData.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function renderSphereSurfaceAdvWithTexture(sphereRenderData, shaderProgram, posVecTransform, scaleVecTransform, texture) {

	gl.disableVertexAttribArray(m_shFullScrQuad.textureCoordAttribute);
	var a = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var b = gl.getVertexAttrib(1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var c = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var d = gl.getVertexAttrib(3, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	//console.log(a);
	//console.log(b);
	//console.log(c);
	//console.log(d);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");
	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.textureSamplerUniform = gl.getUniformLocation(shaderProgram, "uSamplerTexture");

	var mMatrix = mat4.create();
	var vMatrix = mat4.create();
	var pMatrix = mat4.create();

	mat4.identity(mMatrix);

	var aux = mat4.create();
	mat4.translate(mMatrix, mMatrix, [posVecTransform[0], posVecTransform[1], posVecTransform[2]]);
	mat4.fromScaling(aux, [scaleVecTransform[0], scaleVecTransform[1], scaleVecTransform[2]]);
	mat4.multiply(mMatrix, mMatrix, aux);
	mat4.rotate(mMatrix, mMatrix, degToRad(earthAngle), [0, 1, 0]);

	mat4.identity(vMatrix);
	mat4.identity(pMatrix);

	pMatrix = m_3DCamera.GetProjectionMatrix();
	vMatrix = m_3DCamera.GetViewMatrix();

	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shaderProgram.textureSamplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereRenderData.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereRenderData.sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	var a = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var b = gl.getVertexAttrib(1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var c = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	var d = gl.getVertexAttrib(3, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	//console.log(a);
	//console.log(b);
	//console.log(c);
	//console.log(d);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereRenderData.sphereVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, sphereRenderData.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function renderPlane(planeRenderData, translatePos, scaleAmount, anglesRot, axisRot, color) {
	gl.useProgram(shaderProgram);

	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);


	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");

	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");

	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");


	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	mat4.identity(pMatrix);
	//mat4.perspective(pMatrix, 45*(0.01745329251994329576923690768489), gl.viewportWidth/gl.viewportHeight, 0.1, 500);

	pMatrix = m_3DCamera.GetProjectionMatrix();
	vMatrix = m_3DCamera.GetViewMatrix();


	mat4.translate(mMatrix, mMatrix, [translatePos[0], translatePos[1], translatePos[2]]);

	mat4.rotate(mMatrix, mMatrix, degToRad(anglesRot), [axisRot[0], axisRot[1], axisRot[2]]);
	//mat4.rotate(mMatrix, mMatrix, degToRad(yRot), [0, 1, 0]);
	//mat4.rotate(mMatrix, mMatrix, degToRad(zRot), [0, 0, 1]);
	var aux = mat4.create();
	mat4.fromScaling(aux, [scaleAmount[0], scaleAmount[1], scaleAmount[2]]);
	mat4.multiply(mMatrix, mMatrix, aux);

	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);

	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);

	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.uniform3f(shaderProgram.colorUniform, color[0], color[1], color[2])

	gl.uniform1f(gl.getUniformLocation(shaderProgram, "uOpacity"), 1.0);

	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, planeRenderData.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeRenderData.planeVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, planeRenderData.planeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function renderCube(cubeRenderData, bUseView, matrixTransform, translateAmount, scaleAmount, color) {
	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");
	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	mat4.identity(pMatrix);

	if (bUseView) {
		vMatrix = m_3DCamera.GetViewMatrix();
	}

	pMatrix = m_3DCamera.GetProjectionMatrix();

	//mat4.translate(mMatrix, mMatrix, myCamera.Position);
	mat4.translate(mMatrix, mMatrix, [translateAmount[0], translateAmount[1], translateAmount[2]]);

	//mat4.rotate(mMatrix, mMatrix, degToRad(yRot), [0, 1, 0]);
	//mat4.rotate(mMatrix, mMatrix, degToRad(zRot), [0, 0, 1]);

	var aux = mat4.create();
	mat4.fromScaling(aux, [scaleAmount[0], scaleAmount[1], scaleAmount[2]]);
	mat4.multiply(mMatrix, mMatrix, aux);
	if (bUseView) {
		var _auxMat = mat4.create();
		mat4.invert(_auxMat, matrixTransform);
		mat4.multiply(mMatrix, _auxMat, mMatrix);
	}

	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.uniform3f(shaderProgram.colorUniform, color[0], color[1], color[2]);

	gl.uniform1f(gl.getUniformLocation(shaderProgram, "uOpacity"), 1.0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeRenderData.cubeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeRenderData.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeRenderData.cubeVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, cubeRenderData.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.disableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}

function renderGizmo(cubeRenderData, bUseView, matrixTransform, translateAmount, scaleAmount, color) {
	var shaderProgram = m_shGizmos;
	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");
	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	mat4.identity(pMatrix);

	if (bUseView) {
		//vMatrix = m_3DCamera.GetViewMatrix();
		
	}
	//console.log(matrixTransform);

	//pMatrix = m_3DCamera.GetProjectionMatrix();

	//mat4.translate(mMatrix, mMatrix, [translateAmount[0], translateAmount[1], translateAmount[2]]);
	var aux = mat4.create();
	mat4.fromScaling(mMatrix, [scaleAmount[0], scaleAmount[1], scaleAmount[2]]);
	
	if (bUseView) {
		var _auxMat = mat4.create();
		mat4.rotate(_auxMat, _auxMat, clock, vec3.fromValues(1.0, 0.0, 0.0));
		//mat4.invert(_auxMat, matrixTransform);
		mat4.multiply(mMatrix, _auxMat, mMatrix);


		//m_3DCamera.qRotation[0] *= -1.0;
        //m_3DCamera.qRotation[1] *= -1.0;
		//m_3DCamera.qRotation[2] *= -1.0;
		//var _auxMat2 = mat4.create();
        //mat4.fromQuat(_auxMat2, m_3DCamera.qRotation);
        //m_3DCamera.qRotation[0] *= -1.0;
        //m_3DCamera.qRotation[1] *= -1.0;
		//m_3DCamera.qRotation[2] *= -1.0;

		//var _auxMat = mat4.create();
		//mat4.invert(_auxMat, matrixTransform);
		//mat4.multiply(mMatrix, _auxMat, mMatrix);

		//mat4.multiply(mMatrix, _auxMat2, mMatrix);
	}
	//console.log(_auxMat2);

	
	//mat4.multiply(mMatrix, mMatrix, aux);

	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.uniform3f(shaderProgram.colorUniform, color[0], color[1], color[2]);

	gl.uniform1f(gl.getUniformLocation(shaderProgram, "uOpacity"), 1.0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeRenderData.cubeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeRenderData.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeRenderData.cubeVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, cubeRenderData.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.disableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}

function renderRay(bUseView, matrixTransform) {
	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
	shaderProgram.viewMatrixUniform = gl.getUniformLocation(shaderProgram, "uViewMatrix");
	shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");

	shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");

	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	mat4.identity(pMatrix);

	if (bUseView) {
		vMatrix = m_3DCamera.GetViewMatrix();
		//mat4.multiply(vMatrix, vMatrix, matrixTransform);
		//mat4.multiply(vMatrix, matrixTransform, vMatrix);
	}

	pMatrix = m_3DCamera.GetProjectionMatrix();

	mat4.translate(mMatrix, mMatrix, [0.0, 0.0, -1.0]);
	mat4.rotate(mMatrix, mMatrix, degToRad(90.0), [1.0, 0.0, 0.0])
	//mat4.rotate(mMatrix, mMatrix, degToRad(yRot), [0, 1, 0]);
	//mat4.rotate(mMatrix, mMatrix, degToRad(zRot), [0, 0, 1]);
	var aux = mat4.create();
	mat4.fromScaling(aux, [1.0, 1.0, 1.0]);
	mat4.multiply(mMatrix, mMatrix, aux);
	if (bUseView) {
		//mat4.multiply(mMatrix, mMatrix, matrixTransform);
		//mat4.invert(matrixTransform, matrixTransform);
		//mat4.multiply(mMatrix, matrixTransform, mMatrix);
	}


	gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, pMatrix);

	gl.uniform3f(shaderProgram.colorUniform, 1.0, 0.0, 0.0);


	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, planeRenderData.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeRenderData.planeVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, planeRenderData.planeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function animate() {
    var timeNow = new Date().getTime();
	var radius = 70.0;
	
	if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        elapsedFrame = elapsed;
        clock = timeNow - time_start;
        clock /= 1000;
        //console.log("COS: "+Math.cos(degToRad(clock*10)));
		//console.log(clock);
		if (enableRotation) {
			m_vLight = vec3.fromValues(radius * Math.cos(degToRad(clock*0.5*uiSpeed)), radius * 0.0, radius * Math.sin(degToRad(clock*0.5*uiSpeed))); // BUENA
		}
        //m_vLight = vec3.fromValues(radius * Math.cos(degToRad(clock*0.5)), radius * 0.0, radius * Math.sin(degToRad(clock*0.5)));

        auxAngle += 0.001 * elapsed;

        //earthAngle += 0.001 * elapsed;
        earthAngle = 0.0;

        //console.log(m_vLight);

        xRot += (90 * elapsed) / 1000.0;
        yRot += (90 * elapsed) / 1000.0;
		zRot += (90 * elapsed) / 1000.0;

    }
    lastTime = timeNow;
}

function drawShapes() {
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	renderSphereSurface(sphereRenderData, centerEarth, radiusEarth, vec3.fromValues(1.0, 0.0, 0.0), 0.5);
	renderSphereSurface(sphereRenderData, centerAtmosphere, radiusAtmosphere, vec3.fromValues(0.0, 0.0, 1.0), 0.5);

	//renderSphere(sphereRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(3.0, 3.0, 3.0), vec3.fromValues(1.0, 0.0, 0.0));
	//renderSphere(sphereRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(3.5, 3.5, 3.5), vec3.fromValues(0.0, 0.0, 1.0));
	renderPlane(planeRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.01, 10.0, 1.0), 90.0, vec3.fromValues(1.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 1.0));
	renderPlane(planeRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.01, 10.0, 0.01), 90.0, vec3.fromValues(0.0, 0.0, 1.0), vec3.fromValues(0.0, 1.0, 1.0));
	renderPlane(planeRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.01, 10.0, 0.01), 90.0, vec3.fromValues(0.0, 0.0, 1.0), vec3.fromValues(0.0, 1.0, 1.0));
}

// renderCube(cubeRenderData, bUseView, matrixTransform, translateAmount, scaleAmount, color)

function drawShapesWithRay() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//renderSphere(sphereRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(3.0, 3.0, 3.0), vec3.fromValues(1.0, 0.0, 0.0));
	//renderSphere(sphereRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(3.5, 3.5, 3.5), vec3.fromValues(0.0, 0.0, 1.0));

	renderSphereSurface(sphereRenderData, centerEarth, radiusEarth, vec3.fromValues(1.0, 0.0, 0.0), 0.5);
	renderSphereSurface(sphereRenderData, centerAtmosphere, radiusAtmosphere, vec3.fromValues(0.0, 0.0, 1.0), 0.5);


	renderPlane(planeRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.01, 10.0, 1.0), 90.0, vec3.fromValues(1.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 1.0));
	renderPlane(planeRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.01, 10.0, 0.01), 90.0, vec3.fromValues(0.0, 0.0, 1.0), vec3.fromValues(0.0, 1.0, 1.0));
	renderPlane(planeRenderData, vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.01, 10.0, 0.01), 90.0, vec3.fromValues(0.0, 0.0, 1.0), vec3.fromValues(0.0, 1.0, 1.0));

	// Render square dot ray position
	renderCube(cubeRenderData, false, mat4.create(), vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0005, 0.0005, 1.0), vec3.fromValues(1.0, 0.0, 0.0));
}


function drawShapesAtCameraPosition(positionCamera, PitchCamera, YawCamera) {
	var auxPositionCamera = m_3DCamera.Position;
	var auxPitchCamera = m_3DCamera.Pitch;
	var auxYawCamera = m_3DCamera.Yaw;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var matViewAux = mat4.create();
	matViewAux = m_3DCamera.GetViewMatrix();
	var aux = matViewAux;

	m_3DCamera.SetPositionAndDirectionCamera(positionCamera, PitchCamera, YawCamera);
	drawShapes();
	// Rendering Ray
	renderCube(cubeRenderData, true, matViewAux, vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.01, 0.01, 50.0), vec3.fromValues(1.0, 0.0, 0.0));
	// Rendering Camera Position
	renderCube(cubeRenderData, true, matViewAux, vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.1, 0.1, 0.1), vec3.fromValues(0.0, 1.0, 0.0));

	m_3DCamera.SetPositionAndDirectionCamera(auxPositionCamera, auxPitchCamera, auxYawCamera);
}

function renderCameraRotationGizmos() {
	//renderGizmo(cubeRenderData, true, m_3DCamera.GetViewMatrix(), vec3.fromValues(-0.75, -0.5, 0.0), vec3.fromValues(0.005, 0.1, 0.1), vec3.fromValues(1.0, 0.0, 0.0));
	//renderGizmo(cubeRenderData, true, m_3DCamera.GetViewMatrix(), vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.00025, 0.005, 0.1), vec3.fromValues(0.0, 0.0, 1.0));
	renderGizmo(cubeRenderData, true, m_3DCamera.GetViewMatrix(), vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.02, 0.5, 0.5), vec3.fromValues(1.0, 0.0, 0.0));
}




function renderPlanet(planetGeomRenderData, shaderProgram, texture) {
	renderSphereSurfaceAdvWithTexture(planetGeomRenderData, shaderProgram, vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), texture);
}

function renderAtmosphere(atmosphereGeomRenderData, shaderProgram) {
	//renderSphereSurface(atmosphereGeomRenderData, vec3.fromValues(0.0, 0.0, 0.0), 1.0, vec3.fromValues(0.0, 0.0, 1.0), 0.5);
	renderSphereSurfaceAdv(atmosphereGeomRenderData, shaderProgram);

}


function drawScreenFillingTexture(texture) {
	//gl.disableVertexAttribArray(pGroundShader.vertexPositionAttribute);
	//gl.disableVertexAttribArray(pGroundShader.textureCoordAttribute);
	// gl.disableVertexAttribArray(0);
	// gl.bindBuffer(gl.ARRAY_BUFFER, null);
	// gl.vertexAttribPointer(0, planeRenderData.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, null);
	// var a = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var b = gl.getVertexAttrib(1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var c = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var d = gl.getVertexAttrib(3, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// console.log(a);
	// console.log(b);
	// console.log(c);
	// console.log(d);

	gl.useProgram(shaderProgramFramebuffer);

	shaderProgramFramebuffer.vertexPositionAttribute = gl.getAttribLocation(shaderProgramFramebuffer, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgramFramebuffer.vertexPositionAttribute);

	// var a = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var b = gl.getVertexAttrib(1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var c = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var d = gl.getVertexAttrib(3, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// console.log(a);
	// console.log(b);
	// console.log(c);
	// console.log(d);

	shaderProgramFramebuffer.textureCoordAttribute = gl.getAttribLocation(shaderProgramFramebuffer, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgramFramebuffer.textureCoordAttribute);

	shaderProgramFramebuffer.samplerUniform = gl.getUniformLocation(shaderProgramFramebuffer, "uSampler");

	shaderProgramFramebuffer.modelMatrixUniform = gl.getUniformLocation(shaderProgramFramebuffer, "model");

	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.disable(gl.DEPTH_TEST);

	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgramFramebuffer.vertexPositionAttribute, planeRenderData.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgramFramebuffer.textureCoordAttribute, planeRenderData.planeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0 , 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shaderProgramFramebuffer.samplerUniform, 0);

	// var a = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var b = gl.getVertexAttrib(1, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var c = gl.getVertexAttrib(2, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// var d = gl.getVertexAttrib(3, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
	// console.log(a);
	// console.log(b);
	// console.log(c);
	// console.log(d);




	mat4.identity(mMatrix);
	var aux = mat4.create();

	mat4.fromScaling(aux, [1.0, 1.0, 1.0]);
	mat4.multiply(mMatrix, mMatrix, aux);

	gl.uniformMatrix4fv(shaderProgramFramebuffer.modelMatrixUniform, false, mMatrix);

	gl.uniform1i(gl.getUniformLocation(shaderProgramFramebuffer, "uDrawBorder"), 1);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeRenderData.planeVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, planeRenderData.planeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mat4.fromScaling(aux, [0.97, 0.97, 1.0]);
	mat4.multiply(mMatrix, mMatrix, aux);

	gl.uniformMatrix4fv(shaderProgramFramebuffer.modelMatrixUniform, false, mMatrix);

	gl.uniform1i(gl.getUniformLocation(shaderProgramFramebuffer, "uDrawBorder"), 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeRenderData.planeVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, planeRenderData.planeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.enable(gl.DEPTH_TEST);
}


function drawScreenFillingTextureHDR(shader, texture) {

	gl.disableVertexAttribArray(0);
	gl.disableVertexAttribArray(1);

	gl.useProgram(shader);

	shader.vertexPositionAttribute = gl.getAttribLocation(shader, "aVertexPosition");
	gl.enableVertexAttribArray(shader.vertexPositionAttribute);

	shader.textureCoordAttribute = gl.getAttribLocation(shader, "aTextureCoord");
	gl.enableVertexAttribArray(shader.textureCoordAttribute);

	shader.samplerUniform = gl.getUniformLocation(shader, "uSampler");

	shader.modelMatrixUniform = gl.getUniformLocation(shader, "model");

	shader.fExposureUniform = gl.getUniformLocation(shader, "fHdrExposure");

	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.disable(gl.DEPTH_TEST);

	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexPositionBuffer);
	gl.vertexAttribPointer(shader.vertexPositionAttribute, planeRenderData.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shader.textureCoordAttribute, planeRenderData.planeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0 , 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shader.samplerUniform, 0);


	mat4.identity(mMatrix);
	var aux = mat4.create();

	mat4.fromScaling(aux, [1.0, 1.0, 1.0]);
	mat4.multiply(mMatrix, mMatrix, aux);

	gl.uniformMatrix4fv(shader.modelMatrixUniform, false, mMatrix);

	gl.uniform1i(gl.getUniformLocation(shader, "uDrawBorder"), 0);
	gl.uniform1f(shader.fExposureUniform, exposureQuantity);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeRenderData.planeVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, planeRenderData.planeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.enable(gl.DEPTH_TEST);
}

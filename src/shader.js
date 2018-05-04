function createShader(vertexShaderId, fragmentShaderId) {
	var fragmentShader = getShader(gl, fragmentShaderId);
	var vertexShader = getShader(gl, vertexShaderId);

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		var info = gl.getProgramInfoLog(shaderProgram);
  		alert('Could not compile WebGL program. \n\n' + info);
	}

	return shaderProgram;
}

function createShaderByFilename(vertexShaderName, fragmentShaderName) {
	var fragmentShader = getShaderFromObject(gl, fragmentShaderName);
	var vertexShader = getShaderFromObject(gl, vertexShaderName);

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		var info = gl.getProgramInfoLog(shaderProgram);
		alert('Could not link WebGL program. \n\n' + info);
	}

	return shaderProgram;
}

function getShaderFromObject(gl, shaderObjName) {
	var shader;
	if (shaderObjName.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderObjName.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, shaderObjName.data);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

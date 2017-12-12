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
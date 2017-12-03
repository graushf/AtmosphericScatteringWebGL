/**
* Create a model of a sphere. The z-axis is the axis of the sphere,
* with the north pole on the positive z-axis and the center at (0,0,0).
* @param radius the radius of the sphere, default 0.5 if not specified.
* @param slices the number of lines of longitude, default 32
* @param stacks the number of latitude plus 1, default 16. (This
*	is the number of vertical slices, bounded by lines of latitude, the
*   north pole and the south pole.)
*/
var sphereRenderData = [];
var planeRenderData = [];
var cubeRenderData = [];

function uvSphere(radius, slices, stacks) {
	radius = radius || 0.5;
	slices = slices || 32;
	stacks = stacks || 16;
	var vertexCount = (slices+1)*(stacks+1);
	var vertices = new Float32Array( 3*vertexCount );
	var normals = new Float32Array( 3*vertexCount );
	var texCoords = new Float32Array( 2*vertexCount );
	var indices = new Uint16Array( 2*slices*stacks*3 );
	var du = 2*Math.PI/slices;
	var dv = Math.PI/stacks;
	var i,j,u,v,x,y,z;
	var indexV = 0;
	var indexT = 0;
	for (i = 0; i <= stacks; i++) {
		v = -Math.PI/2 + i*dv;
		for (j = 0; j <= slices; j++) {
			u = j*du;
			x = Math.cos(u)*Math.cos(v);
			y = Math.sin(u)*Math.cos(v);
			z = Math.sin(v);
			vertices[indexV] = radius*x;
			normals[indexV++] = x;
			vertices[indexV] = radius*y;
			normals[indexV++] = y;
			vertices[indexV] = radius*z;
			normals[indexV++] = z;
			texCoords[indexT++] = j/slices;
			texCoords[indexT++] = i/stacks;
		}
	}
	var k = 0;
	for (j = 0; j < stacks; j++) {
		var row1 = j*(slices+1);
		var row2 = (j+1)*(slices+1);
		for (i = 0; i < slices; i++) {
			indices[k++] = row1 + i;
			indices[k++] = row2 + i + 1;
			indices[k++] = row2 + i;
			indices[k++] = row1 + i;
			indices[k++] = row1 + i + 1;
			indices[k++] = row2 + i + 1;
		}
	}
	return {
		vertexPositions: vertices,
		vertexNormals: normals,
		vertexTextureCoords: texCoords, 
		indices: indices
	};
}

function generateSphereBuffers() {
	var sphereGeomParams = uvSphere(0.6, 64, 32);

	sphereRenderData.sphereVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sphereGeomParams.vertexPositions, gl.STATIC_DRAW);
	sphereRenderData.sphereVertexPositionBuffer.itemSize = 3;
	sphereRenderData.sphereVertexPositionBuffer.numItems = sphereGeomParams.vertexPositions.length;

	sphereRenderData.sphereVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sphereGeomParams.vertexNormals, gl.STATIC_DRAW);
	sphereRenderData.sphereVertexNormalBuffer.itemSize = 3;
	sphereRenderData.sphereVertexNormalBuffer.numItems = sphereGeomParams.vertexNormals.length;

	sphereRenderData.sphereTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereRenderData.sphereTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sphereGeomParams.vertexTextureCoords, gl.STATIC_DRAW);
	sphereRenderData.sphereTextureCoordBuffer.itemSize = 2;
	sphereRenderData.sphereTextureCoordBuffer.numItems = sphereGeomParams.vertexTextureCoords.length;

	sphereRenderData.sphereVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereRenderData.sphereVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphereGeomParams.indices, gl.STATIC_DRAW);
	sphereRenderData.sphereVertexIndexBuffer.itemSize = 1;
	sphereRenderData.sphereVertexIndexBuffer.numItems = sphereGeomParams.indices.length;

	return sphereRenderData;
}

function initBuffersPlane() {
	planeRenderData.planeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexPositionBuffer);
	var vertices = [
		-1.0, -1.0, 0.0,
		1.0, -1.0, 0.0,
		1.0, 1.0, 0.0,
		-1.0, 1.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	planeRenderData.planeVertexPositionBuffer.itemSize = 3;
	planeRenderData.planeVertexPositionBuffer.numItems = 4;

	planeRenderData.planeVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, planeRenderData.planeVertexTextureCoordBuffer);
	var textureCoords = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	planeRenderData.planeVertexTextureCoordBuffer.itemSize = 2;
	planeRenderData.planeVertexTextureCoordBuffer.numItems = 4;

	planeRenderData.planeVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeRenderData.planeVertexIndexBuffer);
	var indices = [
		0, 1, 2,
		0, 2, 3
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	planeRenderData.planeVertexIndexBuffer.itemSize = 1;
	planeRenderData.planeVertexIndexBuffer.numItems = 6;

	return planeRenderData;
}

function initBuffersCube() {
	cubeRenderData.cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeRenderData.cubeVertexPositionBuffer);
	var vertices = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,

		// Right face
		1.0, -1.0, -1.0, 
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,

		// Left face
		-1.0, -1.0, -1.0, 
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cubeRenderData.cubeVertexPositionBuffer.itemSize = 3;
	cubeRenderData.cubeVertexPositionBuffer.numItems = 24;

	cubeRenderData.cubeVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeRenderData.cubeVertexTextureCoordBuffer);
	var textureCoords = [
		// Front face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,

		// Back face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		// Top face
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,

		// Bottom face
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,

		// Right face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		// Left face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	cubeRenderData.cubeVertexTextureCoordBuffer.itemSize = 2;
	cubeRenderData.cubeVertexTextureCoordBuffer.numItems = 24;

	cubeRenderData.cubeVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeRenderData.cubeVertexIndexBuffer);
	var cubeVertexIndices = [
		0, 1, 2,		0, 2, 3,
		4, 5, 6,		4, 6, 7,
		8, 9, 10,		8, 10, 11,
		12, 13, 14,		12, 14, 15,
		16, 17, 18,		16, 18, 19,
		20, 21, 22,		20, 22, 23
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	cubeRenderData.cubeVertexIndexBuffer.itemSize = 1;
	cubeRenderData.cubeVertexIndexBuffer.numItems = 36;

	return cubeRenderData;
}
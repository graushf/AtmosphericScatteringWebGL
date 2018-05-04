
const ROTATE_SPEED = 1.0;
const THRUST = 0.5;				// Acceleration rate due to thrusters (units/s*s)
const RESISTANCE = 0.10;			// Damping effect on velocity

var cameraReady = false;

function Camera3D() {
	// Camera attributes
	this.Position = [];
	this.CQuaternion = [];
	this.Front = [];
	this.Up = [];
	this.Right = [];
	this.WorldUp = [];
	// Euler Angles
	this.Yaw = [];
	this.Pitch = [];
	// Camera options
	this.MovementSpeed = [];
	this.MouseSensitivity = [];
	this.Zoom = [];
	this.screenWIDTH = [];
	this.screenHEIGHT = [];
	// DEFAULT VALUES
	this.YAW = -90.0;
	this.PITCH = 0.0;
	this.SPEED = 0.2;
	this.SENSITIVITY = 0.25;
	this.ZOOM = 45.0;
	this.SCROLLSENSITIVITY = 0.05;

	this.Near = 0.1;
	this.Far = 8000;

	this.qRotation;
	this.matRot;

	this.vAccel;
	this.vVelocity;

	this.viewMatrix = [];

	this.recalcViewMatrix = true;

	this.Camera = function(WIDTH, HEIGHT) {
		var position = vec3.create();
		var up = vec3.create(0.0, 1.0, 0.0);
		var yaw = this.YAW;
		var pitch = this.PITCH;
		this.Front = vec3.fromValues(0.0, 0.0, -1.0);
		this.MovementSpeed = this.SPEED;
		this.MouseSensitivity = this.SENSITIVITY;
		this.Zoom = this.ZOOM;
		this.Position = position;
		this.WorldUp = up;
		this.Yaw = yaw;
		this.Pitch = pitch;
		this.screenWIDTH = WIDTH;
		this.screenHEIGHT = HEIGHT;
		this.updateCameraVectors();
		this.qRotation = quat.create();
		this.matRot = mat4.create();
		this.vAccel = vec3.create();
		this.vVelocity = vec3.create();

		cameraReady = true;

		this.viewMatrix = mat4.create();
	},

	this.CameraSetPos = function(position, WIDTH, HEIGHT) {
		var up = vec3.fromValues(0.0, 1.0, 0.0);
		var yaw = this.YAW;
		var pitch = this.PITCH;
		this.Front = vec3.fromValues(0.0, 0.0, -1.0);
		this.MovementSpeed = this.SPEED;
		this.MouseSensitivity = this.SENSITIVITY;
		this.Zoom = this.ZOOM;
		this.Position = position;
		this.WorldUp = up;
		this.Yaw = yaw;
		this.Pitch = pitch;
		this.screenWIDTH = WIDTH;
		this.screenHEIGHT = HEIGHT;
		this.updateCameraVectors();
		this.qRotation = quat.create();
		this.matRot = mat4.create();
		this.vAccel = vec3.create();
		this.vVelocity = vec3.create();

		cameraReady = true;

		this.viewMatrix = mat4.create();
	},

	this.CameraSetPosAndRot = function(position, quaternionRotation, WIDTH, HEIGHT) {
		var up = vec3.fromValues(0.0, 1.0, 0.0);
		var yaw = this.YAW;
		var pitch = this.PITCH;
		this.Front = vec3.fromValues(0.0, 0.0, -1.0);
		this.MovementSpeed = this.SPEED;
		this.MouseSensitivity = this.SENSITIVITY;
		this.Zoom = this.ZOOM;
		this.Position = position;
		this.WorldUp = up;
		this.Yaw = yaw;
		this.Pitch = pitch;
		this.screenWIDTH = WIDTH;
		this.screenHEIGHT = HEIGHT;
		this.updateCameraVectors();
		this.qRotation = quaternionRotation;
		this.matRot = mat4.create();
		this.vAccel = vec3.create();
		this.vVelocity = vec3.create();

		cameraReady = true;

		this.viewMatrix = mat4.create();
	},

	this.Camera = function(position, up, yaw, pitch, WIDTH, HEIGHT) {
		this.Front = vec3.fromValues(0.0, 0.0, -1.0);
		this.MovementSpeed = this.SPEED;
		this.MouseSensitivity = this.SENSITIVITY;
		this.Zoom = this.ZOOM;
		this.Position = position;
		this.WorldUp = up;
		this.Yaw = yaw;
		this.Pitch = pitch;
		this.screenWIDTH = WIDTH;
		this.screenHEIGHT = HEIGHT;
		this.updateCameraVectors();
		this.qRotation = quat.create();
		this.matRot = mat4.create();
		this.vAccel = vec3.create();
		this.vVelocity = vec3.create();

		cameraReady = true;

		this.viewMatrix = mat4.create();
	},

	this.Camera = function(posX, posY, posZ, upX, upY, upZ, yaw, pitch, WIDTH, HEIGHT) {
		this.Front = vec3.fromValues(0.0, 0.0, -1.0);
		this.MovementSpeed = this.SPEED;
		this.MouseSensitivity = this.SENSITIVITY;
		this.Zoom = this.ZOOM;
		this.Position = vec3.fromValues(posX, posY, posZ);
		this.WorldUp = vec3.fromValues(upX, upY, upZ);
		this.Yaw = yaw;
		this.Pitch = pitch;
		this.screenWIDTH = WIDTH;
		this.screenHEIGHT = HEIGHT;
		this.updateCameraVectors();
		this.qRotation = quat.create();
		this.matRot = mat4.create();
		this.vAccel = vec3.create();
		this.vVelocity = vec3.create();

		cameraReady = true;

		this.viewMatrix = mat4.create();
	},

	this.GetViewMatrix = function() {
		//console.log(this.viewMatrix);
		if (this.recalcViewMatrix) {
			var retMat = mat4.create();
			var center = vec3.create();
			vec3.add(center, this.Position, this.Front);

			//mat4.fromQuat(this.matRot, this.qRotation);

			//mat4.lookAt(retMat, this.Position, center, this.Up);


			//console.log("this.UP: "+this.Up);
			//console.log("this.RIGHT: "+ this.Right);
			//console.log("this.FORWARD: "+this.Front);



			//console.log("_up: "+_up);
			//console.log("_right: "+ _right);
			//console.log("_forward: "+_forward);
			//console.log("_Forward: "+_Forward);


			//mat4.multiply(retMat, this.matRot, retMat);

			//this.updateCameraVectorsWithQuatRot(retMat)

			//this.viewMatrix = retMat;


			this.qRotation[0] *= -1.0;
			this.qRotation[1] *= -1.0;
			this.qRotation[2] *= -1.0;
			mat4.fromQuat(this.viewMatrix, this.qRotation);
			this.qRotation[0] *= -1.0;
			this.qRotation[1] *= -1.0;
			this.qRotation[2] *= -1.0;

			var v = vec3.fromValues(-1.0 * this.Position[0], -1.0 * this.Position[1], -1.0 * this.Position[2]);
			mat4.translate(this.viewMatrix, this.viewMatrix, v);

			this.recalcViewMatrix = false;
		} if ((enableMouse == true) && (mouseDown == true)) {
			var retMat = mat4.create();
			var center = vec3.create();
			vec3.add(center, this.Position, this.Front);
			mat4.lookAt(retMat, this.Position, center, this.Up);
			this.viewMatrix = retMat;

		}

		return this.viewMatrix;
	},


	this.GetProjectionMatrix = function() {
		var pPatrix = mat4.create();
		mat4.perspective(pMatrix, this.convertToRadians(45), this.screenWIDTH/this.screenHEIGHT, this.Near, this.Far);
		return pMatrix;

	},

	this.ProcessKeyboard = function(direction, deltaTime) {
		var velocity = this.MovementSpeed * deltaTime;
		// FORWARD DIRECTION
		if (direction == 0) {
			var aux = vec3.fromValues(this.Front[0] * velocity, this.Front[1] * velocity, this.Front[2] * velocity);
			vec3.add(this.Position, this.Position, aux);
		}
		// BACKWARD DIRECTION
		if (direction == 1) {
			var aux = vec3.fromValues(-1 * this.Front[0] * velocity, -1 * this.Front[1] * velocity, -1 * this.Front[2] * velocity);
			vec3.add(this.Position, this.Position, aux);
		}
		// LEFT DIRECTION
		if (direction == 2) {
			var aux = vec3.fromValues(-1 * this.Right[0] * velocity, -1 * this.Right[1] * velocity, -1 * this.Right[2] * velocity);
			vec3.add(this.Position, this.Position, aux);
		}
		// RIGHT DIRECTION
		if (direction == 3) {
			var aux = vec3.fromValues(this.Right[0] * velocity, this.Right[1] * velocity, this.Right[2] * velocity);
			vec3.add(this.Position, this.Position, aux);
		}
	},

	this.ProcessMouseMovement = function(xoffset, yoffset, constrainPitch) {
		constrainPitch = true;
		xoffset = this.MouseSensitivity * xoffset;
		yoffset = this.MouseSensitivity * yoffset;

		this.Yaw = this.Yaw + xoffset;
		this.Pitch = this.Pitch + yoffset;

		// Make sure that when pitch is out of bounds, screen doesn't get flipped
		if (constrainPitch) {
			if (this.Pitch > 89.0) {
				this.Pitch = 89.0;
			}
			if (this.Pitch < -89.0) {
				this.Pitch = -89.0;
			}
		}
		// Update Front, Right and Up vectors using the updater Euler Angles
		this.updateCameraVectors();
	},

	this.ProcessMouseScroll = function(yoffset) {
		if (this.Zoom >= 1.0 && this.Zoom <= 45.0) {
			this.Zoom -= yoffset * SCROLLSENSITIVITY;
		}
		if (this.Zoom <= 1.0) {
			this.Zoom = 1.0;
		}
		if (this.Zoom >= 45.0) {
			this.Zoom = 45.0;
		}
	},

	this.convertToRadians = function(degrees) {
		return (degrees * (0.01745329251994329576923690768489));
	},

	this.updateCameraVectors = function() {
		console.log("CAMERA.UPDATECAMERAVECTORS");

		// Calculate the new Front vector
		var front = vec3.create();
		front[0] = Math.cos(this.convertToRadians(this.Yaw)) * Math.cos(this.convertToRadians(this.Pitch));
		front[1] = Math.sin(this.convertToRadians(this.Pitch));
		front[2] = Math.sin(this.convertToRadians(this.Yaw)) * Math.cos(this.convertToRadians(this.Pitch));
		var _aux = vec3.create();
		vec3.normalize(this.Front, front);
		//Also re-calculate the Right and Up Vectors
		// Normalize the vectors, because their length gets closer to 0 the more you look up or down which results in slower movement.
		var aux = vec3.create();
		vec3.cross(aux, this.Front, this.WorldUp);
		vec3.normalize(this.Right, aux);
		aux = vec3.create();
		vec3.cross(aux, this.Right, this.Front);
		vec3.normalize(this.Up, aux);

		// console.log("this.Up.x: "+this.Up[0]);
		// console.log("this.Up.y: "+this.Up[1]);
		// console.log("this.Up.z: "+this.Up[2]);

		// console.log("this.Right.x: "+ this.Right[0]);
		// console.log("this.Right.y: "+ this.Right[1]);
		// console.log("this.Right.z: "+ this.Right[2]);

		// console.log("this.Front.x: "+this.Front[0]);
		// console.log("this.Front.y: "+this.Front[1]);
		// console.log("this.Front.z: "+this.Front[2]);


		// var aux_Up = vec3.create();
		// var aux_Right = vec3.create();
		// var aux_Front = vec3.create();

		// aux_Up = vec3.fromValues(this.viewMatrix[1], this.viewMatrix[5], this.viewMatrix[9]);
		// vec3.normalize(aux_Up, aux_Up);
		// aux_Right = vec3.fromValues(this.viewMatrix[0], this.viewMatrix[4], this.viewMatrix[8]);
		// vec3.normalize(aux_Right, aux_Right);
		// aux_Front = vec3.fromValues(this.viewMatrix[2], this.viewMatrix[6], this.viewMatrix[10]);
		// vec3.scale(aux_Front, aux_Front, -1);
		// vec3.normalize(aux_Front, aux_Front);


		// console.log("aux.Up.x: "+aux_Up[0]);
		// console.log("aux.Up.y: "+aux_Up[1]);
		// console.log("aux.Up.z: "+aux_Up[2]);

		// console.log("aux.Right.x: "+ aux_Right[0]);
		// console.log("aux.Right.y: "+ aux_Right[1]);
		// console.log("aux.Right.z: "+ aux_Right[2]);

		// console.log("aux.Front.x: "+aux_Front[0]);
		// console.log("aux.Front.y: "+aux_Front[1]);
		// console.log("aux.Front.z: "+aux_Front[2]);

		// if (!(this.matRot === undefined)) {
		// 	var aux2 = vec4.fromValues(this.Front[0], this.Front[1], this.Front[2], 1.0);
		// 	vec4.transformMat4(aux2, aux2, this.matRot);
		// 	this.Front[0] = aux2[0];
		// 	this.Front[1] = aux2[1];
		// 	this.Front[2] = aux2[2];

		// 	aux2 = vec4.fromValues(this.Right[0], this.Right[1], this.Right[2], 1.0);
		// 	vec4.transformMat4(aux2, aux2, this.matRot);
		// 	this.Right[0] = aux2[0];
		// 	this.Right[1] = aux2[1];
		// 	this.Right[2] = aux2[2];

		// 	aux2 = vec4.fromValues(this.WorldUp[0], this.WorldUp[1], this.WorldUp[2], 1.0);
		// 	vec4.transformMat4(aux2, aux2, this.matRot);
		// 	this.WorldUp[0] = aux2[0];
		// 	this.WorldUp[1] = aux2[1];
		// 	this.WorldUp[2] = aux2[2];

		// }

	},

	this.GetNearValue = function() {
		return this.Near;
	},

	this.GetFarValue = function() {
		return this.Far;
	},

    this.SetPositionAndDirectionCamera = function(position, pitch, yaw) {
        this.Position = position;
        this.Yaw = yaw;
        this.Pitch = pitch;
        this.updateCameraVectors();
    },

    this.SetOrientation = function(orientation) {
    	this.CQuaternion = orientation;
    },

    this.GetUpAxis = function() {
    	return this.Up;
    },

    this.GetRightAxis = function() {
    	return this.Right;
    },

    this.Rotate = function(axis, fAngle) {
    	//console.log(fAngle);
    	//console.log("ROTATE");
    	var q = quat.create();
    	quat.setAxisAngle(q, axis, fAngle);

    	vec3.transformQuat(this.Up, this.Up, q);
    	vec3.transformQuat(this.Front, this.Front, q);

		//var aux = vec3.create();
		//vec3.cross(aux, this.Front, this.Up);
		//vec3.normalize(this.Right, aux);
		//this.Right = -this.Right;

    	quat.multiply(this.qRotation, q, this.qRotation);

    	this.registerRotation();
    	this.recalcViewMatrix = true;

    	//quat.multiply(q, q, this.qRotation);
    	//quat.normalize(this.qRotation, q);

    	//mat4.fromQuat(this.matRot, this.qRotation);

    	//var auxUp = vec4.fromValues(this.Up[0], this.Up[1], this.Up[2], 1.0);
    	//var auxRight = vec4.fromValues(this.Right[0], this.Right[1], this.Right[2], 1.0);
    	//var auxFront = vec4.fromValues(this.Front[0], this.Front[1], this.Front[2], 1.0);

    	//vec4.transformMat4(auxUp, auxUp, this.matRot);
    	//vec4.transformMat4(auxRight, auxRight, this.matRot);
    	//vec4.transformMat4(auxFront, auxFront, this.matRot);

    	//vec4.normalize(auxUp, auxUp);
    	//vec4.normalize(auxRight, auxRight);
    	//vec4.normalize(auxFront, auxFront);

    	//this.Up = auxUp;
    	//this.Right = auxRight;
    	//this.Front = auxFront;

    	//this.updateCameraVectors();

    	//this.updateCameraVectorsWithQuatRot();
    },

    this.GetViewAxis = function() {
    	return this.Front;
    },

    this.SetVelocity = function(velocity) {
    	this.vVelocity = velocity;
    },

    this.Accelerate = function(vAccel, fSeconds, fResistance) {
    	var aux = vec3.create();
    	vec3.scale(aux, vAccel, fSeconds);
    	vec3.add(this.vVelocity, this.vVelocity, aux);

    	if (fResistance > 0.0001) {
    		vec3.scale(this.vVelocity, this.vVelocity, 1.0 - fResistance * fSeconds);
    	}
    	vec3.scale(aux, this.vVelocity, fSeconds);

		vec3.add(this.Position, this.Position, aux);

		//if ((enableMouse == false) && (mouseDown == false)) {
			this.recalcViewMatrix = true;
		//}

		//vec3.add(this.Position, this.Position, vec3.fromValues(0.0, 0.0, 0.1));
		//this.recalcViewMatrix = true;
		//console.log(this.Position);

    },

    this.GetPosition = function() {
    	return this.Position;
    },

    this.SetPosition = function(position) {
    	this.Position = position;
    },

    this.GetVelocity = function() {
    	return this.vVelocity;
    },

    this.SetVelocity = function(velocity) {
    	this.vVelocity = velocity;
    },

    this.debugFrontVector = function() {
    	console.log("CAMERA FRONT: "+ this.Front[0]+ ", "+ this.Front[1] + ", " + this.Front[2]);
    },

    this.registerRotation = function() {
    	this.normalizeCamera();
    },

    this.normalizeCamera = function() {
    	vec3.normalize(this.Right, this.Right);
    	vec3.normalize(this.Up, this.Up);
    	vec3.normalize(this.Front, this.Front);
    	quat.normalize(this.qRotation, this.qRotation);

		// Assuming forward 'f' is correct
		var aux = vec3.create();
		vec3.cross(aux, this.Front, this.WorldUp);
		vec3.normalize(this.Right, aux);
		aux = vec3.create();
		vec3.cross(aux, this.Right, this.Front);
		vec3.normalize(this.Up, aux);
		//vec3.cross(this.Right, this.Up, this.Front);
		//vec3.cross(this.Up, this.Front, this.Right);
		//vec3.cross(this.Up, this.Front, this.Right);

		/*
			var aux = vec3.create();
			vec3.cross(aux, this.Front, this.WorldUp);
			vec3.normalize(this.Right, aux);
			aux = vec3.create();
			vec3.cross(aux, this.Right, this.Front);
			vec3.normalize(this.Up, aux);
		*/
    },

	this.debugCamera = function() {
	    console.log("POSITION: "+ this.Position);
	    console.log("DIR P-Y: "+ this.Pitch + "    " + this.Yaw);
		console.log("this.qRotation: "+m_3DCamera.qRotation);
		//m_3DCamera.debugFrontVector();
		//console.log("CAMERA FRONT: "+ m_3DCamera.Front[0]+ ", "+ m_3DCamera.Front[1] + ", " + m_3DCamera.Front[2]);
		//console.log("CAMERA UP: "+ m_3DCamera.Up[0]+ ", "+ m_3DCamera.Up[1] + ", " + m_3DCamera.Up[2]);
		//var aux = vec3.create();


		//console.log("CAMERA RIGHT: "+ m_3DCamera.Right[0]+ ", "+ m_3DCamera.Right[1] + ", " + m_3DCamera.Right[2]);
	}
}

function initCameraSpace() {
    //Camera : function(position, WIDTH, HEIGHT);
    var myCamera = new Camera3D();
    var pos = vec3.fromValues(0.0, 0.0, 50.0);
    myCamera.CameraSetPos(pos, gl.viewportWidth, gl.viewportHeight);
    console.log(myCamera);
    console.log("bla");

    return myCamera;
    //positionFocalPlane = myCamera.Position + 0.0 * myCamera.Front;
}

function initCameraEarth() {
    //Camera : function(position, WIDTH, HEIGHT);
    var myCamera = new Camera3D();
    var pos = vec3.fromValues(-4.9809, -0.1385, 8.7281);
	var qOrientation = quat.fromValues(0.6231, -0.6003, -0.3505, 0.3583);
	quat.normalize(qOrientation, qOrientation);
    myCamera.CameraSetPosAndRot(pos, qOrientation, gl.viewportWidth, gl.viewportHeight);
    console.log(myCamera);
    console.log("bla");

    return myCamera;
    //positionFocalPlane = myCamera.Position + 0.0 * myCamera.Front;
}

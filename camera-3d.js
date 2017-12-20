
const ROTATE_SPEED = 1.0;
const THRUST = 0.1;				// Acceleration rate due to thrusters (units/s*s)
const RESISTANCE = 0.05;			// Damping effect on velocity

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
	},

	this.GetViewMatrix = function() {
		var retMat = mat4.create();
		var center = vec3.create();
		vec3.add(center, this.Position, this.Front);

		mat4.fromQuat(this.matRot, this.qRotation);

		mat4.lookAt(retMat, this.Position, center, this.Up);
		
		

		//console.log("this.UP: "+this.Up);
		//console.log("this.RIGHT: "+ this.Right);
		//console.log("this.FORWARD: "+this.Front);



		_Forward = vec3.create();
		var aux = vec3.fromValues()
		vec3.add(_Forward, center, vec3.fromValues(-this.Position[0], -this.Position[1], -this.Position[2]));

		//console.log("_up: "+_up);
		//console.log("_right: "+ _right);
		//console.log("_forward: "+_forward);		
		//console.log("_Forward: "+_Forward);


		mat4.multiply(retMat, this.matRot, retMat);

		//this.updateCameraVectorsWithQuatRot(retMat)
		

		return retMat;
	},

	this.updateCameraVectorsWithQuatRot = function(retMat) {
		var _up = vec3.create();
		var _right = vec3.create();
		var _forward = vec3.create();

		console.log("this.UP: "+this.Up);
		console.log("this.RIGHT: "+ this.Right);
		console.log("this.FORWARD: "+this.Front);


		this.Up = vec3.fromValues(retMat[1], retMat[5], retMat[9]);
		this.Right = vec3.fromValues(retMat[0], retMat[4], retMat[8]);
		this.Front = vec3.fromValues(retMat[2], retMat[6], retMat[10]);
		vec3.scale(this.Front, this.Front, -1);

		console.log("this.UPMOD: "+this.Up);
		console.log("this.RIGHTMOD: "+ this.Right);
		console.log("this.FORWARDMOD: "+this.Front);
	}

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
	}

	this.updateCameraVectors = function() {
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
    	var q = quat.create();
    	quat.setAxisAngle(q, axis, fAngle);
    	quat.multiply(q, q, this.qRotation);
    	quat.normalize(this.qRotation, q);
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
    }
}

function initCamera() {
    //Camera : function(position, WIDTH, HEIGHT);
    var myCamera = new Camera3D();
    var aux = vec3.fromValues(0.0, 0.0, 0.0);
    myCamera.CameraSetPos(aux, gl.viewportWidth, gl.viewportHeight);
    console.log(myCamera);
    console.log("bla");

    return myCamera;
    //positionFocalPlane = myCamera.Position + 0.0 * myCamera.Front;
}

function debugCamera() {
    console.log("POSITION: "+ myCamera.Position);
    console.log("DIR P-Y: "+ myCamera.Pitch + "    " + myCamera.Yaw);
}
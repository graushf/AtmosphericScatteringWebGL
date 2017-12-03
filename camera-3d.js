function Camera3D() {
	// Camera attributes
	this.Position = [];
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
	},

	this.GetViewMatrix = function() {
		var retMat = mat4.create();
		var center = vec3.create();
		vec3.add(center, this.Position, this.Front);

		mat4.lookAt(retMat, this.Position, center, this.Up);
		return retMat;
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
	}

	this.updateCameraVectors = function() {
		// Calculate the new Front vector
		var front = vec3.create();
		front[0] = Math.cos(this.convertToRadians(this.Yaw)) * Math.cos(this.convertToRadians(this.Pitch));
		front[1] = Math.sin(this.convertToRadians(this.Pitch));
		front[2] = Math.sin(this.convertToRadians(this.Yaw)) * Math.cos(this.convertToRadians(this.Pitch));
		var _aux = vec3.create();
		vec3.normalize(this.Front, front);
		// Also re-calculate the Right and Up Vectors
		// Normalize the vectors, because their length gets closer to 0 the more you look up or down which results in slower movement.
		var aux = vec3.create();
		vec3.cross(aux, this.Front, this.WorldUp);
		vec3.normalize(this.Right, aux);
		aux = vec3.create();
		vec3.cross(aux, this.Right, this.Front);
		vec3.normalize(this.Up, aux);
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
    }
}

function initCamera() {
    //Camera : function(position, WIDTH, HEIGHT);
    myCamera = new Camera3D();
    var aux = vec3.fromValues(0.0, 0.0, 0.0);
    myCamera.CameraSetPos(aux, gl.viewportWidth, gl.viewportHeight);
    console.log(myCamera);
    console.log("bla");
    //positionFocalPlane = myCamera.Position + 0.0 * myCamera.Front;
}

function debugCamera() {
    console.log("POSITION: "+ myCamera.Position);
    console.log("DIR P-Y: "+ myCamera.Pitch + "    " + myCamera.Yaw);
}
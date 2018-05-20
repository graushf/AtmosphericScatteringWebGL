Camera3D = function()
{
    this.Position = [];
    
    // Camera options
    this.MovementSpeed = [];
    this.MouseSensitivity = [];
    
    this.Zoom = [];
    
    this.screenWIDTH = [];
    this.screenHEIGHT = [];

    this.SPEED = 0.2;
    this.SENSITIVITY = 0.25;
    this.ZOOM = 45.0;
    this.SCROLLSENSITIVITY = 0.05;

    this.Near = 0.01;
    this.Far = 8000;
    
    this.vAccel;
    this.vVelocity;

    this.key_yaw = 0.0;
    this.key_pitch = 0.0;
    this.key_roll = 0.0;
    this.camera_quat = quat.create();
    this._viewMatrix = mat4.create();
    this._Front = vec3.fromValues(0.0, 0.0, -1.0);
    this._Up = vec3.fromValues(0.0, 1.0, 0.0);
    this._Right = vec3.fromValues(1.0, 0.0, 0.0);
}

Camera3D.prototype.ROTATE_SPEED = 1.0;
Camera3D.prototype.THRUST = 0.5;
Camera3D.prototype.RESISTANCE = 0.20;

Camera3D.prototype.cameraReady = false;

Camera3D.prototype = new Camera3D()

Camera3D.prototype.Camera = function(WIDTH, HEIGHT) {
    this.MovementSpeed = this.SPEED;
    this.MouseSensitivity = this.SENSITIVITY;
    this.Zoom = this.ZOOM;
    this.Position = position;
    this.screenWIDTH = WIDTH;
    this.screenHEIGHT = HEIGHT;
    
    this.vAccel = vec3.create();
    this.vVelocity = vec3.create();

    this.cameraReady = true;

    this.UpdateView();
}

Camera3D.prototype.CameraSetPos = function(position, WIDTH, HEIGHT) {
    this.MovementSpeed = this.SPEED;
    this.MouseSensitivity = this.SENSITIVITY;
    this.Zoom = this.ZOOM;
    this.Position = position;
    this.screenWIDTH = WIDTH;
    this.screenHEIGHT = HEIGHT;
    
    this.vAccel = vec3.create();
    this.vVelocity = vec3.create();

    this.cameraReady = true;

    this.UpdateView();
}

Camera3D.prototype.CameraSetPosAndRot = function(position, pitch, yaw, roll, WIDTH, HEIGHT) {
    this.MovementSpeed = this.SPEED;
    this.MouseSensitivity = this.SENSITIVITY;
    this.Zoom = this.ZOOM;
    this.Position = position;
    this.screenWIDTH = WIDTH;
    this.screenHEIGHT = HEIGHT;

    this.vAccel = vec3.create();
    this.vVelocity = vec3.create();

    this.cameraReady = true;

    this.key_pitch = pitch;
    this.key_yaw = yaw;
    this.key_roll = roll;

    this.UpdateView();
}

Camera3D.prototype.UpdateView = function()
{
    // temporary frame quaternion from pitch, yaw, roll
    var key_quat = quat.create();
    quat.fromEuler(key_quat, this.key_pitch, this.key_yaw, this.key_roll);
    // reset values
    this.key_pitch = this.key_yaw = this.key_roll = 0;

    // order matters, update camera_quat
    quat.multiply(this.camera_quat, key_quat, this.camera_quat);
    quat.normalize(this.camera_quat, this.camera_quat);
    var rotate = mat4.create();
    mat4.fromQuat(rotate, this.camera_quat);

    var translate = vec3.fromValues(-1.0 * this.Position[0], -1.0 * this.Position[1], -1.0 * this.Position[2]);
    mat4.translate(this._viewMatrix, rotate, translate);

    this.RecalculateCameraVectors(rotate);
}

Camera3D.prototype.RecalculateCameraVectors = function(rotate)
{
    this._Front = vec3.fromValues(0.0, 0.0, -1.0);
    this._Up = vec3.fromValues(0.0, 1.0, 0.0);
    vec3.cross(this._Right, this._Front, this._Up);
    
    var invRot = mat4.create();
    mat4.invert(invRot, rotate);
    vec3.transformMat4(this._Front, this._Front, invRot);
    vec3.normalize(this._Front, this._Front);
    
    vec3.transformMat4(this._Up, this._Up, invRot);
    vec3.normalize(this._Up, this._Up);

    vec3.transformMat4(this._Right, this._Right, invRot);
    vec3.normalize(this._Right, this._Right);
}

Camera3D.prototype.GetViewMatrix = function() {
    return this._viewMatrix;
}

Camera3D.prototype.GetProjectionMatrix = function() {
    var pPatrix = mat4.create();
    var radZoom = this.Zoom * (0.01745329251994329576923690768489);
    mat4.perspective(pMatrix, radZoom, this.screenWIDTH/this.screenHEIGHT, this.Near, this.Far);
    return pMatrix;
}

Camera3D.prototype.ProcessMouseMovement = function(xoffset, yoffset) {
    xoffset = this.MouseSensitivity * xoffset;
    yoffset = this.MouseSensitivity * yoffset;

    this.key_yaw = xoffset;
    this.key_pitch = yoffset;

    this.UpdateView();
}

Camera3D.prototype.ProcessMouseMovementYaw = function(xoffset) {
    constrainPitch = true;
    xoffset = this.MouseSensitivity * xoffset;

    this.key_roll = xoffset;

    this.UpdateView();
}

Camera3D.prototype.ProcessMouseScroll = function(yoffset) {
    if (this.Zoom >= 1.0 && this.Zoom <= 45.0) {
        this.Zoom -= yoffset * SCROLLSENSITIVITY;
    }
    if (this.Zoom <= 1.0) {
        this.Zoom = 1.0;
    }
    if (this.Zoom >= 45.0) {
        this.Zoom = 45.0;
    }
}

Camera3D.prototype.GetNearValue = function() {
    return this.Near;
}

Camera3D.prototype.GerFarValue = function() {
    return this.Far;
}

Camera3D.prototype.GetUpAxis = function() {
    return this._Up;
}

Camera3D.prototype.GetRightAxis = function() {
    return this._Right;
}

Camera3D.prototype.GetViewAxis = function() {
    return this._Front;
}

Camera3D.prototype.SetVelocity = function(velocity) {
    this.vVelocity = velocity;
}

Camera3D.prototype.Accelerate = function(vAccel, fSeconds, fResistance) {
    var aux = vec3.create();
    vec3.scale(aux, vAccel, fSeconds);
    vec3.add(this.vVelocity, this.vVelocity, aux);

    if (fResistance > 0.0001) {
        vec3.scale(this.vVelocity, this.vVelocity, 1.0 - fResistance * fSeconds);
    }
    //vec3.scale(aux, this.vVelocity, fSeconds);

    vec3.add(this.Position, this.Position, aux);

    this.UpdateView();
}

Camera3D.prototype.GetPosition = function() {
    return this.Position;
}

Camera3D.prototype.SetPosition = function() {
    this.Position = position;
}

Camera3D.prototype.GetVelocity = function() {
    return this.vVelocity;
}

Camera3D.prototype.debugCamera = function() {
    
}

Camera3D.prototype.initCameraSpace = function() {
    var pos = vec3.fromValues(0.0, 0.0, 50.0);
    this.CameraSetPos(pos, gl.viewportWidth, gl.viewportHeight);
    console.log(this);
}

Camera3D.prototype.initCameraEarth = function() {
    var pos = vec3.fromValues(-4.9809, -0.1385, 8.7281);
    var qOrientation = quat.fromValues(0.6231, -0.6003, -0.3505, 0.3583);
    quat.normalize(qOrientation, qOrientation);
    this.CameraSetPosAndRot(pos, qOrientation, gl.viewportWidth, gl.viewportHeight);
    console.log(this);
    console.log("bla");
}
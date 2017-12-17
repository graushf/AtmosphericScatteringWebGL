var deltaTime = 0.0;	// Time between current frame and last frame
var lastFrame = 0.0;	// Time of last frame

var firstMouse = true;

var enableMouse = true;

var exposureQuantity = 0.8;

function calculateDeltaTime() {
	var currentFrame = new Date().getTime();
	//deltaTime = (currentFrame - lastFrame)/10000;
	//deltaTime = (currentFrame - lastFrame)/1000;
	deltaTime = (currentFrame - lastFrame)/100;
	//deltaTime = (currentFrame - lastFrame)/10;
	//deltaTime = (currentFrame - lastFrame)/1;
	lastFrame = currentFrame;
}

function handleKeyDown(event) {
	//console.log(event.keyCode);
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys() { 
	// FORWARD
	if (currentlyPressedKeys[87]) {
		//console.log("forward");
		m_3DCamera.ProcessKeyboard(0, deltaTime); // 0 is forward direction
	}
	// BACKWARD
	if (currentlyPressedKeys[83]) {
		m_3DCamera.ProcessKeyboard(1, deltaTime); // 0 is forward direction
	}
	// RIGHT
	if (currentlyPressedKeys[68]) {
		m_3DCamera.ProcessKeyboard(3, deltaTime); // 0 is forward direction
	}
	// LEFT
	if (currentlyPressedKeys[65]) {
		m_3DCamera.ProcessKeyboard(2, deltaTime); // 0 is forward direction
	}
	if (currentlyPressedKeys[27]) {
		enableMouse = !enableMouse;
	}

	if (currentlyPressedKeys[82]) {
		calculateIntersectionSphere();
	}

	if (currentlyPressedKeys[79]) {
		exposureQuantity -= 0.01;
	}

	if (currentlyPressedKeys[80]) {
		exposureQuantity += 0.01;
	}
}

function handleMouseMove(event) {
	//console.log(event);
	//console.log(event.screenX);
	//console.log(event.screenY);
	if (enableMouse) {
		var xpos = event.clientX;
		var ypos = event.clientY;

		if (firstMouse) {
			lastX = xpos;
			lastY = ypos;
			firstMouse = false;
		}

		var xoffset = xpos - lastX;
		var yoffset = lastY - ypos;	// Reversed since y-coordinates go from bottom to left

		lastX = xpos;
		lastY = ypos;

		//console.log(xoffset);
		//console.log(yoffset);

		m_3DCamera.ProcessMouseMovement(xoffset, yoffset, true);
	}
	
}
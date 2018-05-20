var deltaTime = 0.0;	// Time between current frame and last frame
var lastFrame = 0.0;	// Time of last frame

var firstMouse = true;

var enableMouse = true;
var mouseDown = false;
var mouseLeftClicked = false;
var mouseRightClicked = false;
var mouseMiddleClicked = false;

var xpos;
var ypos;

var lastX;
var lastY;

var key_press;
var key_code;

var vAccel = vec3.create();;

function calculateDeltaTime() {
	var currentFrame = new Date().getTime();
	deltaTime = (currentFrame - lastFrame)/100;
	lastFrame = currentFrame;
}

var shouldHandleKeyDown = true;

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;

	key_press = event.keyCode;
	key_code = event.keyCode;

	// Samples
	if (currentlyPressedKeys[107])  {
	 	m_Samples += 1;	
	}
	if (currentlyPressedKeys[109]) {
	 	if (m_Samples > 1) {
	 		m_Samples -= 1;	
	 	}
	}

}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;

	key_press = event.keyCode;
	key_code = event.keyCode;
}

function handleKeys() { 
	// Kr
	if ((currentlyPressedKeys[49]) && (!currentlyPressedKeys[16])) {
		m_Kr += 0.0001;
	}
	if ((currentlyPressedKeys[49]) && (currentlyPressedKeys[16])) {
		if (m_Kr > 0.0001) {
			m_Kr -= 0.0001;	
		}
	}
	// Km
	if ((currentlyPressedKeys[50]) && (!currentlyPressedKeys[16])) {
		m_Km += 0.0001;
	}
	if ((currentlyPressedKeys[50]) && (currentlyPressedKeys[16])) {
		if (m_Km > 0.0001) {
			m_Km -= 0.0001;	
		}
	}
	// g
	if ((currentlyPressedKeys[51]) && (!currentlyPressedKeys[16])) {
		if (m_g < 1.0) {
			m_g += 0.001;
		}
	}
	if ((currentlyPressedKeys[51]) && (currentlyPressedKeys[16])) {
		if (m_g > -1.0) {
			m_g -= 0.001;	
		}
	}

	// ESun
	if ((currentlyPressedKeys[52]) && (!currentlyPressedKeys[16])) {
		m_ESun += 0.01;
	}
	if ((currentlyPressedKeys[52]) && (currentlyPressedKeys[16])) {
		if (m_ESun > 0.0) {
			m_ESun -= 0.01;
		}
	}

	// Red
	if ((currentlyPressedKeys[53]) && (!currentlyPressedKeys[16])) {
		m_fWavelength[0] += 0.001;
	}
	if ((currentlyPressedKeys[53]) && (currentlyPressedKeys[16])) {
		if (m_fWavelength[0] > 0.0) {
			m_fWavelength[0] -= 0.001;
		}
	}

	// Green
	if ((currentlyPressedKeys[54]) && (!currentlyPressedKeys[16])) {
		m_fWavelength[1] += 0.001;
	}
	if ((currentlyPressedKeys[54]) && (currentlyPressedKeys[16])) {
		if (m_fWavelength[1] > 0.0) {
			m_fWavelength[1] -= 0.001;
		}
	}

	// Blue
	if ((currentlyPressedKeys[55]) && (!currentlyPressedKeys[16])) {
		m_fWavelength[2] += 0.001;
	}
	if ((currentlyPressedKeys[55]) && (currentlyPressedKeys[16])) {
		if (m_fWavelength[1] > 0.0) {
			m_fWavelength[2] -= 0.001;
		}
	}

	// Exposure
	if ((currentlyPressedKeys[56]) && (!currentlyPressedKeys[16])) {
		exposureQuantity += 0.01;
	}
	if ((currentlyPressedKeys[56]) && (currentlyPressedKeys[16])) {
		if (exposureQuantity > 0.0) {
			exposureQuantity -= 0.01;
		}
	}

	// Turn up/down means rotate around the right axis
	// Up arrow
	if (currentlyPressedKeys[38]) {
		//m_3DCamera.Rotate(m_3DCamera.GetRightAxis(), 1/2000 * elapsedFrame * m_3DCamera.ROTATE_SPEED);
		m_3DCamera.key_pitch = 1/100 * elapsedFrame * -m_3DCamera.ROTATE_SPEED;
		m_3DCamera.UpdateView();
	}
	// Down arrow
	if (currentlyPressedKeys[40]) {
		//m_3DCamera.Rotate(m_3DCamera.GetRightAxis(), 1/2000 * elapsedFrame * -m_3DCamera.ROTATE_SPEED);
		m_3DCamera.key_pitch = 1/100 * elapsedFrame * m_3DCamera.ROTATE_SPEED;
		m_3DCamera.UpdateView();
	}

	// Turn left/right means rotate around the up axis
	// Right arrow
	if (currentlyPressedKeys[39]) {
		//m_3DCamera.Rotate(m_3DCamera.GetUpAxis(), 1/2000*elapsedFrame * -m_3DCamera.ROTATE_SPEED);
		m_3DCamera.key_yaw = 1/100 * elapsedFrame * m_3DCamera.ROTATE_SPEED;
		m_3DCamera.UpdateView();
	}
	// Left arrow
	if (currentlyPressedKeys[37]) {
		//m_3DCamera.Rotate(m_3DCamera.GetUpAxis(), 1/2000*elapsedFrame* m_3DCamera.ROTATE_SPEED);
		m_3DCamera.key_yaw = 1/100 * elapsedFrame * -m_3DCamera.ROTATE_SPEED;
		m_3DCamera.UpdateView();
	}

	// Roll means rotate around the view axis
	if (currentlyPressedKeys[36]) {
		//m_3DCamera.Rotate(m_3DCamera.GetViewAxis(), 1/2000*elapsedFrame * -m_3DCamera.ROTATE_SPEED);
		m_3DCamera.key_roll = 1/100 * elapsedFrame * m_3DCamera.ROTATE_SPEED;
		m_3DCamera.UpdateView();
	}
	if (currentlyPressedKeys[33]) {
		//m_3DCamera.Rotate(m_3DCamera.GetViewAxis(), 1/2000*elapsedFrame * m_3DCamera.ROTATE_SPEED);
		m_3DCamera.key_roll = 1/100 * elapsedFrame * -m_3DCamera.ROTATE_SPEED;
		m_3DCamera.UpdateView();
	}

	// Space key 
	if (currentlyPressedKeys[32]) {
		m_3DCamera.SetVelocity(vec3.create());
	} else {
		// Add camera's acceleration due to thrusters
		var fThrust = m_3DCamera.THRUST;
		// Ctrl key
		if (currentlyPressedKeys[17]) {
			fThrust *= 10.0;
		}

		if (currentlyPressedKeys[16]) {
			vec3.scale(vAccel, vAccel, 1/500);
			vec3.scale(m_3DCamera.vVelocity, m_3DCamera.vVelocity, 1/2000);
		}

		// Thrust forward/reverse affects velocity along the view axis
		// W key
		if (currentlyPressedKeys[87]) {
			var aux = vec3.create();
			vec3.scale(aux, m_3DCamera.GetViewAxis(), fThrust);
			vec3.add(vAccel, aux, vAccel);
		}
		// S key
		if (currentlyPressedKeys[83]) {
			var aux = vec3.create();
			vec3.scale(aux, m_3DCamera.GetViewAxis(), -fThrust);	
			vec3.add(vAccel, aux, vAccel);
		}

		// Thrust left/right affects velocity along the right axis
		// D key
		if (currentlyPressedKeys[68]) {
			var aux = vec3.create();
			vec3.scale(aux, m_3DCamera.GetRightAxis(), fThrust);	
			vec3.add(vAccel, aux, vAccel);		
		}

		// A key
		if (currentlyPressedKeys[65]) {
			var aux = vec3.create();
			vec3.scale(aux, m_3DCamera.GetRightAxis(), -fThrust);	
			vec3.add(vAccel, aux, vAccel);		
		}

		// Thrust up/down affects velocity along the up axis
		// M key
		if (currentlyPressedKeys[77]) {
			var aux = vec3.create();
			vec3.scale(aux, m_3DCamera.GetUpAxis(), fThrust);	
			vec3.add(vAccel, aux, vAccel);
		}
		// N key
		if (currentlyPressedKeys[78]) {
			var aux = vec3.create();
			vec3.scale(aux, m_3DCamera.GetUpAxis(), -fThrust);	
			vec3.add(vAccel, aux, vAccel);
		}
		

		if (m_3DCamera.cameraReady) {
			if (!(elapsedFrame === undefined)) {
				//console.log("vAccel: "+vAccel);
				//console.log(1/60 * clock);
				//console.log("Elapsed Frame: " + elapsedFrame);
				//m_3DCamera.Accelerate(vAccel, 1/60*clock, RESISTANCE);
				var seconds = 1/100 * elapsedFrame;
				vec3.scale(vAccel, vAccel, 1.0 - m_3DCamera.RESISTANCE * seconds);
				m_3DCamera.Accelerate(vAccel, 1/1000 * elapsedFrame, m_3DCamera.RESISTANCE);
			}
		}
	}

}

function handleMouseDown(event) {
	mouseDown = true;
	if (event.button == 0) {
		mouseLeftClicked = true;
	} else if (event.button == 2) {
		mouseRightClicked = true;
	} else if (event.button == 1) {
		mouseMiddleClicked = true;
	}

	lastX = xpos;
	lastY = ypos;
}

function handleMouseUp(event) {
	mouseDown = false;
	if (event.button == 0) {
		mouseLeftClicked = false;
	} else if (event.button == 2) {
		mouseRightClicked = false;
	}
}

function handleMouseMove(event) {
	xpos = event.clientX;
	ypos = event.clientY;

	if (enableMouse && mouseDown && mouseLeftClicked) {
		if (firstMouse) {
			lastX = xpos;
			lastY = ypos;
			firstMouse = false;
		}

		var xoffset = xpos - lastX;
		var yoffset = ypos - lastY;

		lastX = xpos;
		lastY = ypos;

		m_3DCamera.ProcessMouseMovement(xoffset, yoffset);
	}
	
	if (enableMouse && mouseDown && mouseMiddleClicked) {
		if (firstMouse) {
			lastX = xpos;
			lastY = ypos;
			firstMouse = false;
		}

		var xoffset = xpos - lastX;

		lastX = xpos;
		lastY = ypos;

		m_3DCamera.ProcessMouseMovementYaw(xoffset);
	}
}
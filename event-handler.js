var deltaTime = 0.0;	// Time between current frame and last frame
var lastFrame = 0.0;	// Time of last frame

var firstMouse = true;

var enableMouse = false;

var key_press;
var key_code;

function calculateDeltaTime() {
	var currentFrame = new Date().getTime();
	//deltaTime = (currentFrame - lastFrame)/10000;
	//deltaTime = (currentFrame - lastFrame)/1000;
	deltaTime = (currentFrame - lastFrame)/100;
	//deltaTime = (currentFrame - lastFrame)/10;
	//deltaTime = (currentFrame - lastFrame)/1;
	lastFrame = currentFrame;
}

var shouldHandleKeyDown = true;

function handleKeyDown(event) {
	//if (!shouldHandleKeyDown) return;
	//shouldHandleKeyDown = false;

	//console.log(event.keyCode);
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
	//shouldHandleKeyDown = true;
	currentlyPressedKeys[event.keyCode] = false;

	// if (event.keyCode == 107) {
	// 	m_Samples += m_Samples;	
	// }
	// if (event.keyCode == 109) {
	// 	if (m_Samples > 1) {
	// 		m_Samples -= m_Samples;	
	// 	}
	// }

	key_press = event.keyCode;
	key_code = event.keyCode;
}

function handleKeys() { 
	//FORWARD
	if (currentlyPressedKeys[87]) {
		//console.log("forward");
		m_3DCamera.ProcessKeyboard(0, deltaTime); // 0 is forward direction
	}
	//BACKWARD
	if (currentlyPressedKeys[83]) {
		m_3DCamera.ProcessKeyboard(1, deltaTime); // 0 is forward direction
	}
	//RIGHT
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

	// if (currentlyPressedKeys[82]) {
	// 	calculateIntersectionSphere();
	// }


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
		m_3DCamera.Rotate(m_3DCamera.GetRightAxis(), 1/2000 * elapsedFrame * -ROTATE_SPEED);
	}
	// Down arrow
	if (currentlyPressedKeys[40]) {
		m_3DCamera.Rotate(m_3DCamera.GetRightAxis(), 1/2000 * elapsedFrame * ROTATE_SPEED);
	}

	// Turn left/right means rotate around the up axis
	// Right arrow
	if (currentlyPressedKeys[39]) {
		m_3DCamera.Rotate(m_3DCamera.GetUpAxis(), 1/2000*elapsedFrame * -ROTATE_SPEED);
	}
	// Left arrow
	if (currentlyPressedKeys[37]) {
		m_3DCamera.Rotate(m_3DCamera.GetUpAxis(), 1/2000*elapsedFrame* ROTATE_SPEED);
	}

	// Roll means rotate around the view axis
	if (currentlyPressedKeys[36]) {
		m_3DCamera.Rotate(m_3DCamera.GetViewAxis(), 1/2000*elapsedFrame * -ROTATE_SPEED);
	}
	if (currentlyPressedKeys[33]) {
		m_3DCamera.Rotate(m_3DCamera.GetViewAxis(), 1/2000*elapsedFrame * ROTATE_SPEED);
	}

	var vAccel = vec3.create();
	// Space key 
	if (currentlyPressedKeys[32]) {
		m_3DCamera.SetVelocity(vec3.create());
	} else {
		// Add camera's acceleration due to thrusters
		var fThrust = THRUST;
		// Ctrl key
		if (currentlyPressedKeys[17]) {
			fThrust *= 10.0;
		}

		if (currentlyPressedKeys[16]) {
			vec3.scale(m_3DCamera.vVelocity, m_3DCamera.vVelocity, 1/50);
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
		

		if (cameraReady) {
			if (!(clock === undefined)) {
				//console.log("vAccel: "+vAccel);
				m_3DCamera.Accelerate(vAccel, 1/60*clock, RESISTANCE);
			}
		}
	// 	var vPos = vec3.create();
	// 	vPos = m_3DCamera.GetPosition();
	// 	var fMagnitude = vec3.length(vPos);
	// 	// if (fMagnitude < m_fInnerRadius)
	// 	// {
	// 	// 	vec3.scale(vPos, vPos, (m_fInnerRadius * (1 + 1e-6)) / fMagnitude);
	// 	// 	m_3DCamera.SetPosition(vPos) ;
	// 	// 	m_3DCamera.SetVelocity(-m_3DCamera.GetVelocity());
	// 	// }
		
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




function handleKeysAdam() {

}
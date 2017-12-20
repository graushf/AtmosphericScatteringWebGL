var deltaTime = 0.0;	// Time between current frame and last frame
var lastFrame = 0.0;	// Time of last frame

var firstMouse = true;

var enableMouse = false;

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
	console.log(event.keyCode);
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys() { 
	// FORWARD
	// if (currentlyPressedKeys[87]) {
	// 	//console.log("forward");
	// 	m_3DCamera.ProcessKeyboard(0, deltaTime); // 0 is forward direction
	// }
	// BACKWARD
	// if (currentlyPressedKeys[83]) {
	// 	m_3DCamera.ProcessKeyboard(1, deltaTime); // 0 is forward direction
	// }
	// RIGHT
	// if (currentlyPressedKeys[68]) {
	// 	m_3DCamera.ProcessKeyboard(3, deltaTime); // 0 is forward direction
	// }
	// // LEFT
	// if (currentlyPressedKeys[65]) {
	// 	m_3DCamera.ProcessKeyboard(2, deltaTime); // 0 is forward direction
	// }
	if (currentlyPressedKeys[27]) {
		enableMouse = !enableMouse;
	}

	// if (currentlyPressedKeys[82]) {
	// 	calculateIntersectionSphere();
	// }

	if (currentlyPressedKeys[79]) {
		exposureQuantity -= 0.01;
	}

	if (currentlyPressedKeys[80]) {
		exposureQuantity += 0.01;
	}


	// Turn up/down means rotate around the right axis
	// Up arrow
	if (currentlyPressedKeys[38]) {
		m_3DCamera.Rotate(m_3DCamera.GetRightAxis(), 1/500 * clock * -ROTATE_SPEED);
	}
	// Down arrow
	if (currentlyPressedKeys[40]) {
		m_3DCamera.Rotate(m_3DCamera.GetRightAxis(), 1/500 * clock * ROTATE_SPEED);
	}

	// Turn left/right means rotate around the up axis
	// Right arrow
	if (currentlyPressedKeys[39]) {
		m_3DCamera.Rotate(m_3DCamera.GetUpAxis(), 1/500*clock * ROTATE_SPEED);
	}
	// Left arrow
	if (currentlyPressedKeys[37]) {
		m_3DCamera.Rotate(m_3DCamera.GetUpAxis(), 1/500*clock * -ROTATE_SPEED);
	}


	// Roll means rotate around the view axis
	if (currentlyPressedKeys[36]) {
		m_3DCamera.Rotate(m_3DCamera.GetViewAxis(), 1/500*clock * -ROTATE_SPEED);
	}
	if (currentlyPressedKeys[33]) {
		m_3DCamera.Rotate(m_3DCamera.GetViewAxis(), 1/500*clock * ROTATE_SPEED);
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
				m_3DCamera.Accelerate(vAccel, 1/60*clock, RESISTANCE);
			}
		}
		var vPos = vec3.create();
		vPos = m_3DCamera.GetPosition();
		var fMagnitude = vec3.length(vPos);
		// if (fMagnitude < m_fInnerRadius)
		// {
		// 	vec3.scale(vPos, vPos, (m_fInnerRadius * (1 + 1e-6)) / fMagnitude);
		// 	m_3DCamera.SetPosition(vPos) ;
		// 	m_3DCamera.SetVelocity(-m_3DCamera.GetVelocity());
		// }
		
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
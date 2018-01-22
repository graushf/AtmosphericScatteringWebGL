var timeElement;
var angleElement;

var timeNode;
var angleNode;

function initManagerUI() {
	fpsElement = document.getElementById("fps");
	samplesElement = document.getElementById("samples");
	krElement = document.getElementById("kr");
	kmElement = document.getElementById("km");
	gElement = document.getElementById("g");
	esunElement = document.getElementById("esun");
	redElement = document.getElementById("red");
	greenElement = document.getElementById("green");
	blueElement = document.getElementById("blue");
	exposureElement = document.getElementById("exposure");

	fpsNode = document.createTextNode("");
	samplesNode = document.createTextNode("");
	krNode = document.createTextNode("");
	kmNode = document.createTextNode("");
	gNode = document.createTextNode("");
	esunNode = document.createTextNode("");
	redNode = document.createTextNode("");
	greenNode = document.createTextNode("");
	blueNode = document.createTextNode("");
	exposureNode = document.createTextNode("");

	fpsElement.appendChild(fpsNode);
	samplesElement.appendChild(samplesNode);
	krElement.appendChild(krNode);
	kmElement.appendChild(kmNode);
	gElement.appendChild(gNode);
	esunElement.appendChild(esunNode);
	redElement.appendChild(redNode);
	greenElement.appendChild(greenNode);
	blueElement.appendChild(blueNode);
	exposureElement.appendChild(exposureNode);
}

function updateUI(time, angle) {
	// convert rotation from radians to degrees
	var _angle = radToDeg(angle);

	// only report 0 - 360
	angle = angle % 360;

	var fps = 1000.0/elapsedFrame;

	// set the nodes
	samplesNode.nodeValue = m_Samples.toFixed(0); // no decimal place
	fpsNode.nodeValue = fps.toFixed(2) + "FPS";	// 2 decimal places
	
	krNode.nodeValue = m_Kr.toFixed(4);
	kmNode.nodeValue = m_Km.toFixed(4);
	gNode.nodeValue = m_g.toFixed(3);
	esunNode.nodeValue = m_ESun.toFixed(1);
	redNode.nodeValue = m_fWavelength[0].toFixed(3);
	greenNode.nodeValue = m_fWavelength[1].toFixed(3);
	blueNode.nodeValue = m_fWavelength[2].toFixed(3);

	exposureNode.nodeValue = exposureQuantity.toFixed(1);

}

function radToDeg(r) {
	return r * 180 / Math.PI;
}
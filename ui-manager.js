window.onload = function() {
	// var sunSlowUI = document.getElementById("slow-check");
	// if (sunSlowUI.checked == true) {
	// 	console.log("sun slow");
	// }
}


function handleUI() {
	var sunSlowUI = document.getElementById("slow-check");
	if (sunSlowUI.checked == true) {
		console.log("sun slow");
		uiSpeed = 1/5.0;
	} else {
		uiSpeed = 1;
	}
}
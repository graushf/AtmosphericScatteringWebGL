var rayOrigin;
var rayDirection;

var intersectedPoints = [];

function updateRay(origin, direction) {
	rayOrigin = origin;
	rayDirection = direction;
}

function debugRay() {
	//console.log("RAY ORIGIN: "+rayOrigin);
	//console.log("RAY DIRECTION: "+rayDirection);
	var aux = vec3.length(rayDirection);
	
	console.log("RAY LENGTH: "+aux);
}

function calculateIntersectionSphere() {
	var B = 2 * (rayDirection[0] * (rayOrigin[0] - centerAtmosphere[0]) + rayDirection[1] * (rayOrigin[1] - centerAtmosphere[1]) + rayDirection[2] * (rayOrigin[2] - centerAtmosphere[2]));
	var C = Math.pow((rayOrigin[0] - centerAtmosphere[0]), 2) + Math.pow((rayOrigin[1] - centerAtmosphere[1]), 2) + Math.pow((rayOrigin[2] - centerAtmosphere[2]), 2) - Math.pow(radiusAtmosphere, 2);

	var t0 = (-1*B - Math.sqrt(Math.pow(B,2) - 4*C))/2.0;

	var t1 = (-1*B + Math.sqrt(Math.pow(B,2) - 4*C))/2.0;

	if (t0 > 0.0) {
		var Pint = vec3.create();
		var aux = vec3.create();
		vec3.scale(aux, rayDirection, t0);
		//var _aux2 = vec3.create();
		vec3.add(Pint, rayOrigin, aux);
		console.log("INTERSECTION! POINT: x:"+Pint[0] + " y:"+Pint[1] + " z:"+Pint[2]);
		//renderSphereSurface(sphereRenderData, Pint, 0.1, vec3.fromValues(1.0, 0.0, 0.0), 1.0);
		intersectedPoints.push(Pint);
	}
	if ((t0 < 0.0) && (t1 > 0.0)) {
		console.log("CASE B");
	}
	if (t1 < 0.0) {
		console.log("NO INTERSECTION");
	}
}

function debugIntersectedPoints() {
	console.log(intersectedPoints.length);
}
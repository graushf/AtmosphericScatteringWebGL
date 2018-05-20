var gl;
var shaderProgram;

var shaderProgramFramebuffer;

var planeRenderData;
var sphereRenderData;

var mMatrix = mat4.create();
var pMatrix = mat4.create();
var vMatrix = mat4.create();

var currentlyPressedKeys = {};

var radiusEarth = 3.0;
var radiusAtmosphere = 3.5;
var centerEarth = vec3.fromValues(0.0, 0.0, -5.0);
var centerAtmosphere = vec3.fromValues(0.0, 0.0, -5.0);

var earthAngle = 0.0;
var auxAngle = 0.0;

var time_start;
var clock = 0.0;

var shaderProgramSep;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        console.log(canvas.width);
        console.log(canvas.height);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.aspectRatio = canvas.width / canvas.height;
        resize(gl.canvas);
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL,sorry :-(");
    }
}

function degToRad(degrees) {
    return degrees * (0.01745329251994329576923690768489);
}

function resize(canvas) {
    // Lookup the size the browser is displaying the canvas

    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
}

function webGLStart() {
    var canvas = document.getElementById("Atmospheric-scattering-canvas");
    initGL(canvas);


    initGameEngine();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    time_start = new Date().getTime();

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;

    tickGameEngine();
    //tick();
}

// This is an Academic Project, and was published after finishing the lecture.
// @author Joao Elvas @ FCT/UNL
// @author Rodolfo Simoes @ FCT/UNL

var gl;


var canvas;
var d = 3;
var l = 0.5;
var a = 45;  // angle
var x = -45;
var y = 45;

var object = "Cubo"; // objecto corrente
//var fill = "Arame"; // esta de preenchimento corrente
var fill = "Arame";
var vertex_shader_area, fragment_shader_area;



var program;
var projection=mat4();

// Matrizes de projecao

var matriz_alçado_principal =mat4(
                 1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,0,1);


var matriz_projecao_perspetiva = mat4(
                 1,0,0,0,
                 0,1,0,0,
                 0,0,1,0,
                 0,0,-1/d,1); 

var  matriz_projecao_Obliqua = mat4(
                 1,0,-l*Math.cos(a),0,
                 0,1,-l*Math.sin(a),0,
                 0,0,0,0,
                 0,0,0,1);

var matrizProjecACT = matriz_alçado_principal;





function initialize() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    
    program = initShaders(gl, "vertex-default", "fragment-default");
    projection = matriz_alçado_principal;
    vertex_shader_area.value = document.getElementById(vtxName()).text;
    fragment_shader_area.value = document.getElementById(frgName()).text;
    document.getElementById("newoptions").style.visibility = "hidden";
    document.getElementById("perspectiva").style.visibility = "hidden";
    document.getElementById("L").style.visibility = "hidden";
    document.getElementById("X").style.visibility = "hidden";
    document.getElementById("Y").style.visibility = "hidden";
    // remaining initializations
    cubeInit(gl);
    
    
}

function updateShaderAreas()
{
    vertex_shader_area.value = document.getElementById(vtxName()).text;
    fragment_shader_area.value = document.getElementById(frgName()).text;    
}

function vtxName(){
    return "vertex-default";
}

function frgName(){
    return "fragment-default";
}

function setupGUI() {
    vertex_shader_area = document.getElementById("vertex-shader-area");
    vertex_shader_area.style.width="512px";
    vertex_shader_area.resize = "none";

    fragment_shader_area = document.getElementById("fragment-shader-area");
    fragment_shader_area.style.width="512px";
    fragment_shader_area.resize = "none";
  
    
    //Actualiza os shaders
	document.getElementById("shaders").onclick = function() {
        var vertex_shader;
        var fragment_shader;
        
        vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex_shader, document.getElementById("vertex-shader-area").value);
        gl.compileShader(vertex_shader);

        fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment_shader, document.getElementById("fragment-shader-area").value);
        gl.compileShader(fragment_shader);

        program = gl.createProgram();
        gl.attachShader( program, vertex_shader );
        gl.attachShader( program, fragment_shader );
        gl.linkProgram( program );
    }
    
    document.getElementById("shading").onchange = function() {
        switch(this.value) {
            case "Gouraud":
                break;
            case "Phong":
                break;
        }    
        updateShaderAreas();
    }
    
    document.getElementById("object").onchange = function() {
        switch(this.value) {
            case "Cubo":
                document.getElementById("newoptions").style.visibility = "hidden";  
                cubeInit(gl);
                object = "Cubo";
                break;
            case "Esfera":
                document.getElementById("newoptions").style.visibility = "visible";
                sphereInit(gl);
                object = "Esfera";
                break;
            case "Cilindro":
                document.getElementById("newoptions").style.visibility = "visible";
                cylinderInit(gl);
                object = "Cilindro";
                break;
        }
    }
    
    document.getElementById("projection").onchange = function() {
        matrizProjecACT = this.value;
        switch(matrizProjecACT) {
            case "AP":
                projection = matriz_alçado_principal;
                document.getElementById("perspectiva").style.visibility = "hidden";
                document.getElementById("L").style.visibility = "hidden";
                document.getElementById("X").style.visibility = "hidden";
                document.getElementById("Y").style.visibility = "hidden";
                break;
            case "Planta":
                projection = rotateX(90);
                document.getElementById("perspectiva").style.visibility = "hidden";
                document.getElementById("L").style.visibility = "hidden";
                document.getElementById("X").style.visibility = "hidden";
                document.getElementById("Y").style.visibility = "hidden";
                break;
            case "Axonometrica": 
                projection = mult(rotateX(x),rotateY(y));
                document.getElementById("perspectiva").style.visibility = "hidden";
                document.getElementById("L").style.visibility = "hidden";
                document.getElementById("X").style.visibility = "visible";
                document.getElementById("Y").style.visibility = "visible";
                break;
            case "Obliqua":
                projection = matriz_projecao_Obliqua;
                document.getElementById("perspectiva").style.visibility = "hidden";
                document.getElementById("L").style.visibility = "visible";
                document.getElementById("X").style.visibility = "visible";
                document.getElementById("Y").style.visibility = "hidden";
                break;
            case "Perspetiva":
                projection = matriz_projecao_perspetiva;
                document.getElementById("perspectiva").style.visibility = "visible";
                document.getElementById("L").style.visibility = "hidden";
                document.getElementById("X").style.visibility = "hidden";
                document.getElementById("Y").style.visibility = "hidden";
                break;
        }
    }
    
       document.getElementById("X").onchange = function() {
        switch(matrizProjecACT ) {
            case "Axonometrica": 
                x = document.getElementById("x").value;
                document.getElementById('display_X').innerHTML=(x);
                projection = mult(rotateX(x),rotateY(y));
                break;
            case "Obliqua":
                a = document.getElementById("x").value;
                document.getElementById('display_X').innerHTML=(a);
                mat_obliqua = mat4(
                            1,0,-l*Math.cos(a),0,
                            0,1,-l*Math.sin(a),0,
                            0,0,0,0,
                            0,0,0,1);
                projection = mat_obliqua;
                break;
        }
    }
    
    document.getElementById("Y").onchange = function() {
        y = document.getElementById("y").value;
        document.getElementById('display_Y').innerHTML=(y);
        projection = mult(rotateX(x),rotateY(y));
    }
    
    document.getElementById("perspectiva").onchange = function(){
        d = document.getElementById("a").value;
        document.getElementById('display_per').innerHTML=(d);
        matriz_projecao_perspetiva = mat4(
                        1,0,0,0,
                        0,1,0,0,
                        0,0,1,0,
                        0,0,-1/d,1); 
        projection = matriz_projecao_perspetiva;
    }
    
    document.getElementById("l").onchange = function(){
        l = document.getElementById("l").value;
        if(l>1)
            l=1;
        else if (l < 0)
            l=0;
        
        matriz_projecao_Obliqua = mat4(
                            1,0,-l*Math.cos(a),0,
                            0,1,-l*Math.sin(a),0,
                            0,0,0,0,
                            0,0,0,1);
            projection = matriz_projecao_Obliqua;
    }
    
    document.getElementById("preenchimento").onchange = function() {
        switch(this.value) {
            case "Wired":
                fill = "Arame";
                break;
            case "Fill":
                fill = "Preenchido";
                break;
        }
    }
    
    document.getElementById("box").onchange = function() {
       switch(object){
        case "Esfera":
                sphereSetLongitude(this.value);
                sphereSetLatitude(this.value);
                sphereInit(gl);
            break;
        case "Cilindro":
                cylinderSetSubDivideNum(this.value);
                cylinderInit(gl);
            break; 
        }
    }
}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    
    var projectionMatrixLoc = gl.getUniformLocation( program, "mProj" );
    gl.uniformMatrix4fv(  projectionMatrixLoc, false, flatten( projection) );
    switch(object){
        case "Cubo":
                if(fill =="Arame")
                    cubeDrawWireFrame(gl,program);   
                else if(fill == "Preenchido"){
                    cubeDrawFilled(gl,program);
                    }
            
            break;
        case "Esfera":
                if(fill =="Arame")
                    sphereDrawWireFrame(gl,program);   
                else if(fill == "Preenchido"){
                    sphereDrawFilled(gl,program);
                    }
            break;
        case "Cilindro":
            if(fill =="Arame")
                    cylinderDrawWireFrame(gl, program); 
                else if(fill == "Preenchido"){
                    cylinderDrawFilled(gl, program);
                    }
            break;
            
    }
    
    requestAnimFrame(render);
}

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    setupGUI();
    initialize();
    
    render();
}
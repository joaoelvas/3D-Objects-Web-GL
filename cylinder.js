// This is an Academic Project, and was published after finishing the lecture.
// @author Joao Elvas @ FCT/UNL
// @author Rodolfo Simoes @ FCT/UNL

var cilinder_vertices = [
				vec3(0.0,0.5,0.0),
				vec3(0.0,-0.5,0.0)
				];
 
var cilinder_points = [];
var cylinder_normals = [];
var cilinder_faces = [];
var cylinder_edges = [];
var cylinder_matrix = [];

var subdivideNum = 8;
var theta = 0;
var radius = 0.5;
var height = 1;

function cylinderInit(gl){
    cylinderClean();
    cilinderBuildPoints();
    cilinderUploadData(gl);
}

function cilinderUploadData(gl){

    cylinder_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cilinder_points), gl.STATIC_DRAW);
    
    cylinder_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cylinder_normals), gl.STATIC_DRAW);
    
    cylinder_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cilinder_faces), gl.STATIC_DRAW);
    
    cylinder_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinder_edges), gl.STATIC_DRAW);
}

function cylinderDrawWireFrame(gl, program){
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_edges_buffer);
    gl.drawElements(gl.LINES, cylinder_edges.length, gl.UNSIGNED_SHORT, 0);
}

function cylinderDrawFilled(gl, program) {
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_points_buffer);
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_normals_buffer);
	var vNormal = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_faces_buffer);
	gl.drawElements(gl.TRIANGLES, cilinder_faces.length, gl.UNSIGNED_SHORT, 0);
	
}



function cilinderBuildPoints() {
    var norma ;
    var p ;
    var p2 ;
    theta = 0;
    
	cilinder_points.push(cilinder_vertices[0]);
    
    p= vec3(0,0.5,0);
    norma =normalize(vec3(p));
    cylinder_normals.push(norma);
    
    
	while (theta <= (Math.PI*2)){
		var a = vec3(radius*Math.cos(theta),0.5,radius*Math.sin(theta));
		var b = vec3(radius*Math.cos(theta),-0.5,radius*Math.sin(theta));
        p = a;
        p2 = b;
		cilinder_points.push(a);
		cilinder_points.push(b);
        
        norma = normalize(vec3(a));
        cylinder_normals.push(norma);
        norma = normalize(vec3(b));
        cylinder_normals.push(norma);
		
		theta += (Math.PI*2)/subdivideNum;
	}
    
    cilinder_points.push(cilinder_vertices[1]);
    p=vec3(0.0,-0.5,0.0);
    norma = normalize(vec3(p));
    cylinder_normals.push(norma);
    
    createCylinderMatrix();
}


function createCylinderMatrix(){
    
    position = 1;
    cylinder_matrix[0] = [0];
    var tmp = [];
    var tmp2 = [];
    
        for(var j = 0; j <((cilinder_points.length - 2 )/2); j++) {
            tmp.push(position++);
            tmp2.push(position++);
        }  
        cylinder_matrix[1]=tmp;
        cylinder_matrix[2]=tmp2;
    
    cylinder_matrix[4] = [cilinder_points.length-1];
    
    cylinderBuildFaces();
    createCylinderEdges();
}


function cylinderBuildFaces(){
    
    for(var i = 0; i < subdivideNum; i++){
            
        if(i+1 == subdivideNum){
            cilinder_faces.push(cylinder_matrix[0][0]);
            cilinder_faces.push(cylinder_matrix[1][i]);
            cilinder_faces.push(cylinder_matrix[1][0]);
        } else {
            cilinder_faces.push(cylinder_matrix[0][0]);
            cilinder_faces.push(cylinder_matrix[1][i]);
            cilinder_faces.push(cylinder_matrix[1][i+1]);
        }
    }
    
  for(var i = 0; i < subdivideNum; i++){
        var x = i+1;

            cilinder_faces.push(cylinder_matrix[1][i]);
            cilinder_faces.push(cylinder_matrix[2][i]);
            cilinder_faces.push(cylinder_matrix[2][i+1]);
            
            cilinder_faces.push(cylinder_matrix[1][i]);
            cilinder_faces.push(cylinder_matrix[1][x]);
            cilinder_faces.push(cylinder_matrix[2][x]);
      
      if(x == subdivideNum){
            cilinder_faces.push(cylinder_matrix[1][i]);
            cilinder_faces.push(cylinder_matrix[2][i]);
            cilinder_faces.push(cylinder_matrix[2][0]);
            
            cilinder_faces.push(cylinder_matrix[1][0]);
            cilinder_faces.push(cylinder_matrix[1][i]);
            cilinder_faces.push(cylinder_matrix[2][0]);
        }
    }
    
    for(var i = 0; i < subdivideNum; i++){
        
        if(i+1 == subdivideNum){
            cilinder_faces.push(cylinder_matrix[4][0]);
            cilinder_faces.push(cylinder_matrix[2][i]);
            cilinder_faces.push(cylinder_matrix[2][0]);
        } else {
            cilinder_faces.push(cylinder_matrix[4][0]);
            cilinder_faces.push(cylinder_matrix[2][i]);
            cilinder_faces.push(cylinder_matrix[2][i+1]);
        }
    }
}



function createCylinderEdges(){
    
    for(var i = 0; i < subdivideNum; i++){
        cylinder_edges.push(cylinder_matrix[0][0]);
        cylinder_edges.push(cylinder_matrix[1][i]);
        
        if(i+1 == subdivideNum){
            cylinder_edges.push(cylinder_matrix[1][i]);
            cylinder_edges.push(cylinder_matrix[1][0]);
        } else {
            cylinder_edges.push(cylinder_matrix[1][i]);
            cylinder_edges.push(cylinder_matrix[1][i+1]);
        }
    }
    
    for(var i = 0; i < subdivideNum; i++){
        cylinder_edges.push(cylinder_matrix[1][i]);
        cylinder_edges.push(cylinder_matrix[2][i]);
        
        if(i+1 == subdivideNum){
            cylinder_edges.push(cylinder_matrix[1][i]);
            cylinder_edges.push(cylinder_matrix[2][0]);
        } else {
            cylinder_edges.push(cylinder_matrix[1][i]);
            cylinder_edges.push(cylinder_matrix[2][i+1]);
        }
        
    }
    
    for(var i = 0; i < subdivideNum; i++){
        cylinder_edges.push(cylinder_matrix[4][0]);
        cylinder_edges.push(cylinder_matrix[2][i]);
        
        if(i+1 == subdivideNum){
            cylinder_edges.push(cylinder_matrix[2][i]);
            cylinder_edges.push(cylinder_matrix[2][0]);
        } else {
            cylinder_edges.push(cylinder_matrix[2][i]);
            cylinder_edges.push(cylinder_matrix[2][i+1]);
        }
    }
}

function cylinderSetSubDivideNum(value){
    subdivideNum =  value;
}

function cylinderClean(){
    cilinder_points = [];
    cylinder_normals = [];
    cilinder_faces = [];
    cylinder_edges = [];
    cylinder_matrix = [];
}
// This is an Academic Project, and was published after finishing the lecture.
// @author Joao Elvas @ FCT/UNL
// @author Rodolfo Simoes @ FCT/UNL

var latitude = 8; // number of latitudes
var longitude = 8; // number of longitudes
var northPole = vec3(0,0.5,0);
var southPole = vec3(0,-0.5,0);
var r = 0.5;

var sphere_points_vec4 = []; // Array buffer
var sphere_points = [];

var sphere_normals = [];
var sphere_matrix = [];
var sphere_faces = [];
var sphere_edges = [];

function sphereInit(gl) {
    sphereClean();
    sphereBuild();
    sphereUploadData(gl);
}

function sphereBuild() {
    generatePoints();
    createSphereMatrix();
    createTriangles();
    createSphereEdges();
}

function sphereUploadData(gl){
    sphere_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere_points), gl.STATIC_DRAW);
    
    sphere_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere_normals), gl.STATIC_DRAW);
    
    sphere_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere_faces), gl.STATIC_DRAW);
    
    sphere_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere_edges), gl.STATIC_DRAW);
    
}

function sphereDrawWireFrame(gl,program){
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere_edges_buffer);
    gl.drawElements(gl.LINES, sphere_edges.length, gl.UNSIGNED_SHORT, 0);
}

function sphereDrawFilled(gl,program){
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere_points_buffer);
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere_normals_buffer);
	var vNormal = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere_faces_buffer);
	gl.drawElements(gl.TRIANGLES, sphere_faces.length, gl.UNSIGNED_SHORT, 0);

}

function generatePoints(north, south) {
    
    var deltaFi = Math.PI / latitude;
    var deltaTheta = (2*Math.PI) / longitude;
    var fi = 0;
    var theta = 0;
    var norma; 
    var p ;
    p= vec3(0,0.5,0);
    sphere_points.push(northPole);
    
    norma =normalize(p);
    sphere_normals.push(norma); 
    
    
    for (var i = 0 ; i< latitude; i++){
        fi += deltaFi;
        for (var j =0 ; j< longitude; j++){
            
            var x = r * Math.sin(fi) * Math.cos(theta);
            var z = r * Math.sin(fi) * Math.sin(theta);
            var y = r * Math.cos(fi);
            p = vec3(x,y,z);
            var y = p.slice(0,2);
            sphere_points.push(p);
            norma = normalize(y);
            sphere_normals.push(norma); 
            theta += deltaTheta;
        }
        theta=0;
    }
    sphere_points.push(southPole);
    var p2; 
    p2 = vec3(0,-0.5,0);
    norma =normalize(p2);
    sphere_normals.push(norma);
}

function createSphereMatrix(){
    
    offset = 0;
    position =1 ;
    sphere_matrix[0] = [0];
    var tmp = [];
    
    for(var i = 1; i <= latitude; i++) {
        for(var j = 0; j < longitude; j++) {
            tmp.push(position++);
        }  
        sphere_matrix[i]=tmp;
        tmp = [];
    }
    sphere_matrix[latitude +1] = [sphere_points.length-1];
}

function createTriangles() {
    
    for(var x = 0 ; x < longitude ; x++){
        var l = x+1;
        if(l == longitude) {
            l = 0;
        }
        sphere_faces.push(sphere_matrix[0][0]);
        sphere_faces.push(sphere_matrix[1][x]);
        sphere_faces.push(sphere_matrix[1][l]);
    }
    
    for(var lt = 1; lt < latitude; lt ++){
        for(var lg= 0 ; lg < longitude ; lg++ ){
            var a = lg+1;
            var b = lt+1;
            
            if( a == longitude ){
                a = 0;
            }
          
            sphere_faces.push(sphere_matrix[lt][lg]);
            sphere_faces.push(sphere_matrix[lt][a]);
            sphere_faces.push(sphere_matrix[b][lg]);
            
            sphere_faces.push(sphere_matrix[b][lg]);
            sphere_faces.push(sphere_matrix[b][a]);
            sphere_faces.push(sphere_matrix[lt][a]);
        }
    }
    
    for(var y = 1 ; y < longitude ; y++){
        var s = y+1;
        if(s == longitude) {
            s = 0;    
        }
        sphere_faces.push(sphere_matrix[longitude - 1][y]);
        sphere_faces.push(sphere_matrix[longitude - 1][s]);
        sphere_faces.push(sphere_matrix[latitude +1][0]);
    }

}

function createSphereEdges(){
    
    for(var lt = 1; lt <= latitude; lt ++){
        sphere_edges.push(sphere_matrix[lt][0]);
        for(var lg= 1 ; lg < longitude  ; lg++ ){
            sphere_edges.push(sphere_matrix[lt][lg]);
            sphere_edges.push(sphere_matrix[lt][lg]);
        }
        sphere_edges.push(sphere_matrix[lt][0]);   
    }

    for(var lg = 0; lg < longitude; lg ++){
    
        sphere_edges.push(sphere_matrix[0][0]);
        
        for(var lt= 1 ; lt <= latitude ; lt++ ){
            sphere_edges.push(sphere_matrix[lt][lg]);
            sphere_edges.push(sphere_matrix[lt][lg]);
        }
        sphere_edges.push(sphere_matrix[latitude +1][0]);
     }  
    
}



function sphereSetLongitude(value){
    longitude = value;
}
                
function sphereSetLatitude(value){
    latitude = value ;
}

function sphereClean(){
    sphere_points = [];
sphere_normals = [];
sphere_matrix = [];
sphere_faces = [];
sphere_edges = [];
}

/**
 * @module shaders/default
 */

define(['./mesh','glMatrix'], function(Mesh, glM) {



    /**
     * @constructor
     */
    var Cube = function(){
        Mesh.call(this);


        this.rotMatrix = glM.mat4.create();
        glM.mat4.identity(this.rotMatrix);

        
        /*#################*/
        // Just for the demo, should be removed

            this.rotation = 0;

            this.setRotation = function(r){
                this.rotMatrix = glM.mat4.create();
                glM.mat4.identity(this.rotMatrix);
                    
                glM.mat4.rotateY(this.rotMatrix,this.rotMatrix,-r);    
                this.rotation = r;  
            }

            this.addRotation = function(inc){
                this.setRotation((this.rotation + inc) % (Math.PI * 2));
            }

            this.setRotation(Math.random() * 2 * Math.PI);

        /*###############*/

    }

    Cube.prototype = Object.create(Mesh.prototype);
    Cube.prototype.constructor = Mesh;

    /**
     * Get the model matrix
     * @return {mat4}
     */
    Cube.prototype.getMatrix = function(){
        //combine position and rotation matrix
        var result = glM.mat4.create();
        glM.mat4.multiply(result,this.modelMatrix,this.rotMatrix);
        return result;
    }


    Cube.prototype.vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];



    var colors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0]     // Left face: purple
    ];

    var generatedColors = [];

    for (j=0; j<6; j++) {
        var c = colors[j];

        for (var i=0; i<4; i++) {
            generatedColors = generatedColors.concat(c);
        }
    }

    Cube.prototype.colors = generatedColors;

    Cube.prototype.vertexIndex =  [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
    ];

    return Cube;




});

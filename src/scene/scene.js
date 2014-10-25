/**
 * @module scene
 */

define(['glMatrix','./cube','../shaders/shader-program','../shaders/default/vertex','../shaders/default/fragment'],
 function(glM,          Cube,     ShaderProgram,                  VertexShader,                   FragmentShader) {


    /**
     * @constructor
     */
    var Scene = function(){


        var x,y;

        var cubes = [];
        for(x=-3; x<=3; x++){
            for(y=-2;  y<=1; y++){
                for(z = -3; z<=0; z++){

                     var cube = new Cube();

                    var matrix = glM.mat4.create();
                    glM.mat4.identity(matrix);
                    glM.mat4.translate(matrix,matrix,[x*3,y*3.8 +1.3, -10 + 3.8*z]); 

                    cube.modelMatrix = matrix;        
                    cubes.push(cube);       
                }
            }
        }

        this.cubes = cubes;

        this.shaderProgram = new ShaderProgram(gl, new VertexShader(), new FragmentShader());

        this.viewportWidth = 0;
        this.viewportHeight = 0;

    };

    Scene.prototype.viewportDimensionsProvider = null;


    Scene.prototype.render = function(gl){

        var shaderProgram = this.shaderProgram;



        shaderProgram.use();







        var perspectiveMatrix = glM.mat4.create();


        glM.mat4.perspective(perspectiveMatrix, 45, this.viewportWidth / this.viewportHeight, 0.1, 100);


        var uniformLoc = shaderProgram.getUniformLocation("uPMatrix");
        
        gl.uniformMatrix4fv(uniformLoc, false, perspectiveMatrix); // modify uniform 4x4 matrix



        for(var i in this.cubes){
            this.cubes[i].render(gl, shaderProgram);
        }

    }




    return Scene;

});

/**
 * @module scene
 */

define(['glMatrix','./cube','../shaders/shader-program','../shaders/default/vertex','../shaders/default/fragment'],
 function(glM,          Cube,     ShaderProgram,                  VertexShader,                   FragmentShader) {


    /**
     * @constructor
     */
    var Scene = function(viewportWidth, viewportHeight){


        this.viewportWidth = viewportWidth;

        this.viewportHeight = viewportHeight;

        /**
         * [objects description]
         * @type {Array.<Mesh>}
         */
        this.objects = [];





        //create shader program
        this.shaderProgram = new ShaderProgram(gl, new VertexShader(), new FragmentShader());

        this.viewportWidth = 0;
        this.viewportHeight = 0;

    };



    Scene.prototype.updateViewport = function(width, height){
        this.viewportWidth = width;
        this.viewportHeight = height;
    };


    Scene.prototype.add = function(what){
        if(arguments.length >1){
            for(var i in arguments){
                thia.add(arguments[i]);
            }
        } else 
        if(what instanceof Array){
            for(var j in what){
                this.add(what[j]);
            }
            return;
        } else {
            this.objects.push(what);
        }

    };


    Scene.prototype.render = function(gl){





        this.shaderProgram.use();


        var perspectiveMatrix = glM.mat4.create();


        glM.mat4.perspective(perspectiveMatrix, 45, this.viewportWidth / this.viewportHeight, 0.1, 100);


        var uniformLoc = this.shaderProgram.getUniformLocation("uPMatrix");
        
        gl.uniformMatrix4fv(uniformLoc, false, perspectiveMatrix); // modify uniform 4x4 matrix



        for(var i in this.objects){
            this.objects[i].render(gl, this.shaderProgram);
        }

    };




    return Scene;

});

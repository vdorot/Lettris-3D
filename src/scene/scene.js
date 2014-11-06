/**
 * @module scene
 */

define(['glMatrix','./cube','../shaders/shader-program','../shaders/letter/vertex','../shaders/letter/fragment'],
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

        this.viewAngle = 0;

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





        var point = glM.vec3.fromValues(-10,10,10);


        var mat = glM.mat4.create();

        glM.mat4.identity(mat);

        glM.mat4.rotateY(mat,mat,this.viewAngle);

        glM.vec3.transformMat4(point,point,mat);


        var viewMatrix = glM.mat4.create();

        glM.mat4.lookAt(viewMatrix,point,[0,0,0],[0,1,0]);


        var perspectiveMatrix = glM.mat4.create();


        glM.mat4.perspective(perspectiveMatrix, 45, this.viewportWidth / this.viewportHeight, 0.1, 100);

        glM.mat4.multiply(perspectiveMatrix, perspectiveMatrix,viewMatrix);


        var uniformLoc = this.shaderProgram.getUniformLocation("uProjectionMatrix");
        
        gl.uniformMatrix4fv(uniformLoc, false, perspectiveMatrix); // modify uniform 4x4 matrix



        for(var i in this.objects){
            this.objects[i].render(gl, this.shaderProgram);
        }

    };




    return Scene;

});

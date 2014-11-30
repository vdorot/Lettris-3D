

define(['glMatrix','../shaders/shader-program','../shaders/letter/vertex','../shaders/letter/fragment','../shaders/stand/vertex','../shaders/stand/fragment', '../shaders/glass/vertex','../shaders/glass/fragment'],
 function(glM,      ShaderProgram, LetterVertex, LetterFragment, StandVertex, StandFragment, GlassVertex, GlassFragment) {


    /**
     * @constructor
     */
    var Renderer = function(gl,scene,viewportWidth, viewportHeight){


        this.viewportWidth = viewportWidth;

        this.viewportHeight = viewportHeight;

        this.viewAngle = 0;

        this.scene = scene;

        this.gl = gl;

        this.letterShader = new ShaderProgram(gl, new LetterVertex(), new LetterFragment());

        this.standShader = new ShaderProgram(gl, new StandVertex(), new StandFragment());

        this.glassShader = new ShaderProgram(gl, new GlassVertex(), new GlassFragment());

    };

    Renderer.LAYER_LETTERS = 'letters';

    Renderer.LAYER_STAND = 'stand';

    Renderer.LAYER_GLASS = 'glass';


    Renderer.prototype.updateViewport = function(width, height){
        this.viewportWidth = width;
        this.viewportHeight = height;
    };


    /**
     * Render all layers and objects
     */
    Renderer.prototype.render = function(){

        var gl = this.gl;



        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

        //gl.clearColor(0.3, 0.3, 0.3, 1.0);                      // Set clear color to black, fully opaque
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.


        var cameraPosition = [0,5,4];
        var lightPosition = [2,4,2];

        var c = cameraPosition;
        var point = glM.vec3.fromValues(c[0],c[1],c[2]);


        var mat = glM.mat4.create();

        glM.mat4.identity(mat);

        glM.mat4.rotateY(mat,mat,this.viewAngle);

        glM.vec3.transformMat4(point,point,mat);


        var l = glM.vec3.create();
        glM.vec3.transformMat4(l,lightPosition,mat);


        var viewMatrix = glM.mat4.create();


        glM.mat4.lookAt(viewMatrix,point,[0,1.5,0],[0,1,0]);


        var perspectiveMatrix = glM.mat4.create();


        glM.mat4.perspective(perspectiveMatrix, 45, this.viewportWidth / this.viewportHeight, 0.1, 100);

        glM.mat4.multiply(perspectiveMatrix, perspectiveMatrix,viewMatrix);






        var lightPos = new Float32Array(l);




        this.letterShader.use();



        var uniformLoc = this.letterShader.getUniformLocation("uProjectionMatrix");
        
        gl.uniformMatrix4fv(uniformLoc, false, perspectiveMatrix); // modify uniform 4x4 matrix

        var resolutionLoc = this.letterShader.getUniformLocation("uRes");

        gl.uniform2fv(resolutionLoc, new Float32Array([this.viewportWidth, this.viewportHeight]));

        var lightPosLoc = this.letterShader.getUniformLocation("uLightPos");
        gl.uniform3fv(lightPosLoc, lightPos);





        this.scene.renderLayer(this.gl, Renderer.LAYER_LETTERS,this.letterShader);




        this.standShader.use();

        uniformLoc = this.standShader.getUniformLocation("uProjectionMatrix");
        
        gl.uniformMatrix4fv(uniformLoc, false, perspectiveMatrix); // modify uniform 4x4 matrix

        resolutionLoc = this.standShader.getUniformLocation("uRes");

        gl.uniform2fv(resolutionLoc, new Float32Array([this.viewportWidth, this.viewportHeight]));

        lightPosLoc = this.standShader.getUniformLocation("uLightPos");
        gl.uniform3fv(lightPosLoc, lightPos);




        this.scene.renderLayer(this.gl, Renderer.LAYER_STAND,this.standShader);


        this.glassShader.use();




        uniformLoc = this.glassShader.getUniformLocation("uProjectionMatrix");
        
        gl.uniformMatrix4fv(uniformLoc, false, perspectiveMatrix); // modify uniform 4x4 matrix

        resolutionLoc = this.glassShader.getUniformLocation("uRes");

        gl.uniform2fv(resolutionLoc, new Float32Array([this.viewportWidth, this.viewportHeight]));

        lightPosLoc = this.glassShader.getUniformLocation("uLightPos");
        gl.uniform3fv(lightPosLoc, lightPos);

        
        var transparentObjects = this.scene.getObjectsByLayer(Renderer.LAYER_GLASS);



        //###########
        //Z-SORTING (pseudocode):
        //###########
        //for each transparent object:
        //
        //objMatrix =  object.getMatrix()
        //
        //resultMatrix = perspectiveMatrix * objMatrix // using glM.mat4.multiply
        //
        //avgVertex = average of object vertices
        //
        //object.screenCoords = apply resultMatrix to avgVertex
        //
        //
        //sort objects by screencoords.z // using transparentObjects = transparentObjects.sort(comparatorFunction); //http://www.w3schools.com/jsref/jsref_sort.asp

        for(var i in transparentObjects){
            var object = transparentObjects[i];
            object.render(this.gl, this.glassShader);

            objMatrix =  object.getMatrix();
            resultMatrix = perspectiveMatrix * objMatrix;

            console.log(object.model.vertices[0]);
        }

    };




    return Renderer;

});

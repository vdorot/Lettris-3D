require(['jquery', 'glMatrix', 'text!./shaders/default/vertex.glsl', 'text!./shaders/default/fragment.glsl'], function($,glMatrix, vertexShaderTxt, fragmentShaderTxt,img) {

// jQuery DOMReady handler - wait for html document to load
$(function() {






        var initGLContext = function(canvas) {

            gl = null;

            try {
                // Try to grab the standard context. If it fails, fallback to experimental.
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            }
            catch(e) {}


            window.gl = gl;


            return gl;

        }

        var getCanvas = function() {
            return  document.getElementById("canvas");   
        }

        var getContext = function() {
            return initGLContext(getCanvas());
        }

        var gl = getContext();

        if(!gl){
            console.error("Unable to initialize WebGL.");
            return; //die
        }










        var compileShader = function(gl, shaderTxt, shaderType, shaderName) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderTxt);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
              console.error("An error occurred while compiling shader " + shaderName +": " + gl.getShaderInfoLog(shader)); 
              return null;  
            }
            console.log(shader);
            return shader;
        }





        var vertexShader = compileShader(gl, vertexShaderTxt, gl.VERTEX_SHADER, 'vertex.glsl');
        var fragmentShader = compileShader(gl, fragmentShaderTxt, gl.FRAGMENT_SHADER, 'gragment.glsl');

        if(!vertexShader || !fragmentShader){
            return;
        }

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("Unable to initialize shader program.");
            return;
        }

        gl.useProgram(shaderProgram);


        var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);


        var cubeVerticesBuffer = gl.createBuffer();

        // Select the cubeVerticesBuffer as the one to apply vertex
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

        var vertices = [
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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


        var cubeVerticesIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        var cubeVertexIndices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
        ]

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);


        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);     
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);


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


        var cubeVerticesColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);


 
        var vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
        gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);



        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);



        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);





        var rot = 0;


        var setMatrix = function(txX, txY){

            if(!txX){
                txX = 0.0;
            }

            if(!txY){
                txY = 0.0;
            }

            var matrix = glMatrix.mat4.create();
            glMatrix.mat4.identity(matrix);

            glMatrix.mat4.translate(matrix, matrix, [txX, txY, -10.0]);        


            glMatrix.mat4.rotateZ(matrix, matrix, rot);

            glMatrix.mat4.rotateY(matrix, matrix, rot);



            rot = rot + 2*Math.PI / 1000; //increment for animation



            var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            gl.uniformMatrix4fv(mvUniform, false, matrix);


        }


        var setPerspectiveMatrix = function(){
            var perspectiveMatrix = glMatrix.mat4.create();

            var canvas = getCanvas();

            glMatrix.mat4.perspective(perspectiveMatrix, 45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);


            var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            gl.uniformMatrix4fv(pUniform, false, perspectiveMatrix); // modify uniform 4x4 matrix


        }


        var drawScene = function(){

            gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
            gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

            gl.clearColor(0.3, 0.3, 0.3, 1.0);                      // Set clear color to black, fully opaque
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.



            setMatrix(0);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

            setMatrix(-3);   
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


            setMatrix(3);   
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);



            setMatrix(0,-3);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

            setMatrix(-3,-3);   
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


            setMatrix(3,-3);   
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);



            setMatrix(0,3);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

            setMatrix(-3,3);   
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


            setMatrix(3,3);   
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);



        }




        /** Set viewport handler */
        var resizeHandler = function(){

            var canvas = getCanvas();

            var width = canvas.clientWidth;

            var height = canvas. clientHeight;


            canvas.width = width;

            canvas.height = height;

            gl.viewport(0, 0, width, height);


            setPerspectiveMatrix();

            drawScene();
                
        }



        resizeHandler();
        window.addEventListener('resize', resizeHandler);



        var animator = function(){
            drawScene();
            window.requestAnimationFrame(animator);
        }


        animator();








});








});
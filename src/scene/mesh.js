/**
 * @module scene
 */


define(['glMatrix'], function(glM) {


    /**
     * @constructor
     */
    var Mesh = function(){





    };

    //create identity matrix
    var matrix = glM.mat4.create();
    glM.mat4.identity(matrix);

    Mesh.prototype = {
        vertices: [],

        colors: [],

        vertexIndex: [],

        physicsEnvelope: {
            vertices: [],
            vertexIndex: []
        },

        modelMatrix: matrix,

        //default values
        uniforms: {
            modelMatrix: "uMVMatrix"
        },

        attributes: {
            vertexColor: "aVertexColor",
            vertexPosition: "aVertexPosition"
        }

    }

    /**
     * Get the model matrix
     * @return {mat4} Transformation matrix
     */
    Mesh.prototype.getMatrix = function(){
        return this.modelMatrix;
    }

    /**
     * [getVertexBuffer description]
     * @param  {[type]} gl [description]
     * @return {WebGLBuffer}    [description]
     */
    Mesh.prototype.getVertexBuffer = function(gl){
        if(!this._vertexBuffer){
            var buffer = gl.createBuffer(); 
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);     
            this._vertexBuffer = buffer;
        }
        return this._vertexBuffer;
    };

    /**
     * [getVertexBuffer description]
     * @param  {[type]} gl [description]
     * @return {WebGLBuffer}    [description]
     */
    Mesh.prototype.getColorBuffer = function(gl){
        if(!this._colorBuffer){
            var buffer = gl.createBuffer(); 
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);     
            this._colorBuffer = buffer;
        }
        return this._colorBuffer;
    };

    Mesh.prototype.getElementBuffer = function(gl){
        if(!this._elementBuffer){
            var buffer = gl.createBuffer(); 
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndex), gl.STATIC_DRAW);     
            this._elementBuffer = buffer;
        }   
        return this._elementBuffer;
    };

    Mesh.prototype.render = function(gl, shaderProgram){


        //preparing vertex buffer
        var vertexBuffer = this.getVertexBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        var vertexPositionAttribute = shaderProgram.getAttribLocation(this.attributes.vertexPosition);        
        
        gl.enableVertexAttribArray(vertexPositionAttribute);

        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing color Buffer
        var colorBuffer = this.getColorBuffer(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        var vertexColorAttribute = shaderProgram.getAttribLocation(this.attributes.vertexColor);

        gl.enableVertexAttribArray(vertexColorAttribute);       
        gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);


        //preparing element buffer
        var elementBuffer = this.getElementBuffer(gl);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);



        //setting uniforms
        var modelMatrixLoc = shaderProgram.getUniformLocation(this.uniforms.modelMatrix);
        

        gl.uniformMatrix4fv(modelMatrixLoc, false, this.getMatrix());




        //rendering
        gl.drawElements(gl.TRIANGLES, this.vertexIndex.length, gl.UNSIGNED_SHORT, 0);





    };






    return Mesh;

});

/**
 * @module scene
 */


define(['glMatrix'], function(glM) {


    /**
     * @constructor
     */
    var Mesh = function(){

        this.position = {x: 0, y:0, z:0 }; //unclouple position from prototype
        this.quaternion = {x:0, y:0, z:0, w: 0};

    };


    Mesh.prototype = {
        vertices: [],

        colors: [],

        vertexIndex: [],

        //default values
        uniforms: {
            modelMatrix: "uMVMatrix"
        },

        attributes: {
            vertexColor: "aVertexColor",
            vertexPosition: "aVertexPosition"
        },

        position: {x: 0, y:0, z:0 },
        quaternion: {x:0, y:0, z:0, w: 0}

    };

    Mesh.prototype.setPosition = function(position){
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z; 
    };

    Mesh.prototype.getPosition = function(){
        return this.position;
    };

    Mesh.prototype.setQuaternion = function(quaternion){
        this.quaternion.x = quaternion.x;
        this.quaternion.y = quaternion.y;        
        this.quaternion.z = quaternion.z;
        this.quaternion.w = quaternion.w;
    };

    Mesh.prototype.getQuaternion = function(){
        return this.quaternion;
    };


    /**
     * Get the model matrix
     * @return {mat4} Transformation matrix
     */
    Mesh.prototype.getMatrix = function(){


        var matrix = glM.mat4.create();

        var v = glM.vec3.fromValues(this.position.x, this.position.y, this.position.z);

        var q = glM.vec4.fromValues(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);

        glM.mat4.fromRotationTranslation(matrix, q, v);

        return matrix;

    };



    /**
     * Prepare and return vertex buffer
     * @param  {WebGLRenderingContext} gl WebGL context
     * @return {WebGLBuffer}  
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
     * Prepare and return vertex color buffer
     * @param  {WebGLRenderingContext} gl WebGL context
     * @return {WebGLBuffer}  
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
    /**
     * Prepare and return element buffer containing vertex indices
     * @param  {WebGLRenderingContext} gl WebGL context
     * @return {WebGLBuffer}  
     */
    Mesh.prototype.getElementBuffer = function(gl){
        if(!this._elementBuffer){
            var buffer = gl.createBuffer(); 
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndex), gl.STATIC_DRAW);     
            this._elementBuffer = buffer;
        }   
        return this._elementBuffer;
    };



    /**
     * Render mesh
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {ShaderProgram} shaderProgram PRogram to use while rendering
     */
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

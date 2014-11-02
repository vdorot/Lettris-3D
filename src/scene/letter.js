/**
 * @module shaders/default
 */

define(['./mesh','glMatrix','../letters/letters'], function(Mesh, glM, letters) {



    /**
     * @constructor
     */
    var Letter = function(letter){
        Mesh.call(this);
        this.letter = letter;


    };

    Letter.prototype = Object.create(Mesh.prototype);
    Letter.prototype.constructor = Mesh;



    for(var i in letters){


        //prebuild Float32Array        

        var l = letters[i];

        l.vertices = new Float32Array(l.vertices);
        l.uvs = new Float32Array(l.uvs);
        l.sides = new Float32Array(l.sides);
        l.normals = new Float32Array(l.normals);

    }

    Letter.prototype.models = letters;
    console.log(letters);

    Letter.prototype.getConvexHull = function(){
        return this.models[this.letter].convexHull;
    };



    Letter.prototype.__buffers = {};


    /**
     * Create buffer and fill with data
     *
     * The buffer is only created once per name, further calls return cached buffers
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {string} name Buffer name as a cache id
     * @param  {TypedArray} data Buffer data
     * @return {WebGLBuffer}  
     */
    Letter.prototype.getBuffer = function(gl, name, data){

        //this.__buffers is stored in the prototype, so it is shared between all instances
        if(!this.__buffers || !this.__buffers[name]){
            var buffer = gl.createBuffer(); 
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);     
            this.__buffers[name] = buffer;
        }
        return this.__buffers[name];

    };

    Letter.prototype.attributes = {
        vertex: 'aVertexPosition',
        normal: 'aVertexNormal',
        uv: 'aVertexUV',
        side: 'aVertexSide'
    };

    Letter.prototype.uniforms = {
        modelMatrix: 'uModelMatrix' 
    };


 /**
     * Render mesh
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {ShaderProgram} shaderProgram Program to use while rendering
     */
    Letter.prototype.render = function(gl, shaderProgram){





        //preparing vertex buffer
        var vertexBuffer = this.getBuffer(gl,this.letter+'_vertex',this.models[this.letter].vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        var vertexAttribute = shaderProgram.getAttribLocation(this.attributes.vertex);        
        
        gl.enableVertexAttribArray(vertexAttribute);

        gl.vertexAttribPointer(vertexAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing normal Buffer
        var normalBuffer = this.getBuffer(gl,this.letter+'_normal',this.models[this.letter].normals);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        var normalAttribute = shaderProgram.getAttribLocation(this.attributes.normal);

        gl.enableVertexAttribArray(normalAttribute);       
        gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing uv Buffer
        var uvBuffer = this.getBuffer(gl,this.letter+'_uv',this.models[this.letter].uvs);
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

        var uvAttribute = shaderProgram.getAttribLocation(this.attributes.uv);

        gl.enableVertexAttribArray(uvAttribute);       
        gl.vertexAttribPointer(uvAttribute, 2, gl.FLOAT, false, 0, 0);


        //preparing side Buffer (front of letter =1, back =-1, sides =0)
        var sideBuffer = this.getBuffer(gl,this.letter+'_side',this.models[this.letter].sides);
        gl.bindBuffer(gl.ARRAY_BUFFER, sideBuffer);

        var sideAttribute = shaderProgram.getAttribLocation(this.attributes.side);

        gl.enableVertexAttribArray(sideAttribute);       
        gl.vertexAttribPointer(sideAttribute, 1, gl.FLOAT, false, 0, 0);



        //setting uniforms
        var modelMatrixLoc = shaderProgram.getUniformLocation(this.uniforms.modelMatrix);        


        gl.uniformMatrix4fv(modelMatrixLoc, false, this.getMatrix());



    
        gl.drawArrays(gl.TRIANGLES, 0, this.models[this.letter].vertices.length / 3);





    };






    return Letter;




});

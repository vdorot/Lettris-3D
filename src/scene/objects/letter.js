/**
 * @module shaders/default
 */

define(['./mesh','glMatrix','./letters/letters'], function(Mesh, glM, letters) {



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


    /**
     * Returns convex hull of letter
     * @return {Array} Vec3 vertices [x,y,z,x,y,z,...]
     */
    Letter.prototype.getConvexHull = function(){
        return this.models[this.letter].convexHull;
    };


    Letter.prototype.isPhysicsEnabled = function(){
        return true;
    };


    Letter.prototype.getPhysicsOptions = function(){
        return {shape: "convex", shapeData: this.getConvexHull(), mass: 1, friction: 0.5, restitution:0.01 };
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

/**
 * @module scene/models
 */

define(['./mesh','glMatrix','./models/models'], function(Mesh, glM, Models) {



    /**
     * @constructor
     */
    var Stand = function(){
        Mesh.call(this);

    };

    Stand.prototype = Object.create(Mesh.prototype); // Extending Mesh class
    Stand.prototype.constructor = Mesh;

    Stand.prototype.model = Models.stand;



    Stand.prototype.isPhysicsEnabled = function(){
        return false;
    };




    Stand.prototype.attributes = {
        vertex: 'aVertexPosition',
        normal: 'aVertexNormal',
        uv: 'aVertexUV',
        side: 'aVertexSide'
    };

    Stand.prototype.uniforms = {
        modelMatrix: 'uModelMatrix' 
    };


 /**
     * Render mesh
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {ShaderProgram} shaderProgram Program to use while rendering
     */
    Stand.prototype.render = function(gl, shaderProgram){





        //preparing vertex buffer
        var vertexBuffer = this.getBuffer(gl,'stand_vertex',this.model.vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        var vertexAttribute = shaderProgram.getAttribLocation(this.attributes.vertex);        
        
        gl.enableVertexAttribArray(vertexAttribute);

        gl.vertexAttribPointer(vertexAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing normal Buffer
        var normalBuffer = this.getBuffer(gl,'stand_normal',this.model.normals);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        var normalAttribute = shaderProgram.getAttribLocation(this.attributes.normal);

        gl.enableVertexAttribArray(normalAttribute);       
        gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing uv Buffer
        var uvBuffer = this.getBuffer(gl,'stand_uv',this.model.uvs);
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

        var uvAttribute = shaderProgram.getAttribLocation(this.attributes.uv);

        gl.enableVertexAttribArray(uvAttribute);       
        gl.vertexAttribPointer(uvAttribute, 2, gl.FLOAT, false, 0, 0);


        //preparing side Buffer (front of Stand =1, back =-1, sides =0)
        var sideBuffer = this.getBuffer(gl,'stand_side',this.model.sides);
        gl.bindBuffer(gl.ARRAY_BUFFER, sideBuffer);

        var sideAttribute = shaderProgram.getAttribLocation(this.attributes.side);

        gl.enableVertexAttribArray(sideAttribute);       
        gl.vertexAttribPointer(sideAttribute, 1, gl.FLOAT, false, 0, 0);



        //setting uniforms
        var modelMatrixLoc = shaderProgram.getUniformLocation(this.uniforms.modelMatrix);        


        gl.uniformMatrix4fv(modelMatrixLoc, false, this.getMatrix());



    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.vertices.length / 3);





    };



    return Stand;




});

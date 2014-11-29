/***
 * @module scene/models
 */

define(['./mesh','glMatrix','../../../models/models','../../textures/marble'], function(Mesh, glM, Models, MarbleTexture) {



    /**
     * @constructor
     */
    var StandSide = function(){
        Mesh.call(this);

        this.color = new Float32Array([0.9,0.9,1.0]);

    };

    StandSide.prototype = Object.create(Mesh.prototype); // Extending Mesh class
    StandSide.prototype.constructor = Mesh;

    StandSide.prototype.model = Models.stand.side;

    console.log(Models.stand);


    StandSide.prototype.texture = new MarbleTexture();


    StandSide.prototype.isPhysicsEnabled = function(){
        return false;
    };




    StandSide.prototype.attributes = {
        vertex: 'aVertexPosition',
        normal: 'aVertexNormal',
        uv: 'aVertexUV',
        side: 'aVertexSide'
    };

    StandSide.prototype.uniforms = {
        modelMatrix: 'uModelMatrix',
        textureUnit: 'uTextureUnit',
        color: 'uColor'
    };


 /**
     * Render mesh
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {ShaderProgram} shaderProgram Program to use while rendering
     */
    StandSide.prototype.render = function(gl, shaderProgram){





        //preparing vertex buffer
        var vertexBuffer = this.getBuffer(gl,'stand_side_vertex',this.model.vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        var vertexAttribute = shaderProgram.getAttribLocation(this.attributes.vertex);        
        
        gl.enableVertexAttribArray(vertexAttribute);

        gl.vertexAttribPointer(vertexAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing normal Buffer
        var normalBuffer = this.getBuffer(gl,'stand_side_normal',this.model.normals);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        var normalAttribute = shaderProgram.getAttribLocation(this.attributes.normal);

        gl.enableVertexAttribArray(normalAttribute);       
        gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing uv Buffer
        var uvBuffer = this.getBuffer(gl,'stand_side_uv',this.model.uvs);
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

        var uvAttribute = shaderProgram.getAttribLocation(this.attributes.uv);

        gl.enableVertexAttribArray(uvAttribute);       
        gl.vertexAttribPointer(uvAttribute, 2, gl.FLOAT, false, 0, 0);


        //preparing side Buffer (front of StandSide =1, back =-1, sides =0)
        var sideBuffer = this.getBuffer(gl,'stand_side_side',this.model.sides);
        gl.bindBuffer(gl.ARRAY_BUFFER, sideBuffer);

        var sideAttribute = shaderProgram.getAttribLocation(this.attributes.side);

        gl.enableVertexAttribArray(sideAttribute);       
        gl.vertexAttribPointer(sideAttribute, 1, gl.FLOAT, false, 0, 0);



        //set up texture        
        


        var texHandle = this.texture.getHandle(gl); //this.texture gets texture from prototype - it is shared among instances
        gl.activeTexture(gl.TEXTURE0); //texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texHandle);

        var textureUnitLoc = shaderProgram.getUniformLocation(this.uniforms.textureUnit);
        gl.uniform1i(textureUnitLoc, 0); //texture unit 0      




        //setting uniforms
        var modelMatrixLoc = shaderProgram.getUniformLocation(this.uniforms.modelMatrix);        
        gl.uniformMatrix4fv(modelMatrixLoc, false, this.getMatrix());

        var colorLoc = shaderProgram.getUniformLocation(this.uniforms.color);
        gl.uniform3fv(colorLoc,this.color);

    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.vertices.length / 3);





    };



    return StandSide;




});

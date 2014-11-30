/***
 * @module scene/models
 */

define(['./mesh','glMatrix','../../../models/models','../../textures/quartz'], function(Mesh, glM, Models, QuartzTexture) {

  function mat4Transpose(a, transposed) {
    var t = 0;
    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 4; ++j) {
        transposed[t++] = a[j * 4 + i];
      }
    }
  }

  function mat4Invert(m, inverse) {
    var inv = new Float32Array(16);
    inv[0] = m[5]*m[10]*m[15]-m[5]*m[11]*m[14]-m[9]*m[6]*m[15]+
             m[9]*m[7]*m[14]+m[13]*m[6]*m[11]-m[13]*m[7]*m[10];
    inv[4] = -m[4]*m[10]*m[15]+m[4]*m[11]*m[14]+m[8]*m[6]*m[15]-
             m[8]*m[7]*m[14]-m[12]*m[6]*m[11]+m[12]*m[7]*m[10];
    inv[8] = m[4]*m[9]*m[15]-m[4]*m[11]*m[13]-m[8]*m[5]*m[15]+
             m[8]*m[7]*m[13]+m[12]*m[5]*m[11]-m[12]*m[7]*m[9];
    inv[12]= -m[4]*m[9]*m[14]+m[4]*m[10]*m[13]+m[8]*m[5]*m[14]-
             m[8]*m[6]*m[13]-m[12]*m[5]*m[10]+m[12]*m[6]*m[9];
    inv[1] = -m[1]*m[10]*m[15]+m[1]*m[11]*m[14]+m[9]*m[2]*m[15]-
             m[9]*m[3]*m[14]-m[13]*m[2]*m[11]+m[13]*m[3]*m[10];
    inv[5] = m[0]*m[10]*m[15]-m[0]*m[11]*m[14]-m[8]*m[2]*m[15]+
             m[8]*m[3]*m[14]+m[12]*m[2]*m[11]-m[12]*m[3]*m[10];
    inv[9] = -m[0]*m[9]*m[15]+m[0]*m[11]*m[13]+m[8]*m[1]*m[15]-
             m[8]*m[3]*m[13]-m[12]*m[1]*m[11]+m[12]*m[3]*m[9];
    inv[13]= m[0]*m[9]*m[14]-m[0]*m[10]*m[13]-m[8]*m[1]*m[14]+
             m[8]*m[2]*m[13]+m[12]*m[1]*m[10]-m[12]*m[2]*m[9];
    inv[2] = m[1]*m[6]*m[15]-m[1]*m[7]*m[14]-m[5]*m[2]*m[15]+
             m[5]*m[3]*m[14]+m[13]*m[2]*m[7]-m[13]*m[3]*m[6];
    inv[6] = -m[0]*m[6]*m[15]+m[0]*m[7]*m[14]+m[4]*m[2]*m[15]-
             m[4]*m[3]*m[14]-m[12]*m[2]*m[7]+m[12]*m[3]*m[6];
    inv[10]= m[0]*m[5]*m[15]-m[0]*m[7]*m[13]-m[4]*m[1]*m[15]+
             m[4]*m[3]*m[13]+m[12]*m[1]*m[7]-m[12]*m[3]*m[5];
    inv[14]= -m[0]*m[5]*m[14]+m[0]*m[6]*m[13]+m[4]*m[1]*m[14]-
             m[4]*m[2]*m[13]-m[12]*m[1]*m[6]+m[12]*m[2]*m[5];
    inv[3] = -m[1]*m[6]*m[11]+m[1]*m[7]*m[10]+m[5]*m[2]*m[11]-
             m[5]*m[3]*m[10]-m[9]*m[2]*m[7]+m[9]*m[3]*m[6];
    inv[7] = m[0]*m[6]*m[11]-m[0]*m[7]*m[10]-m[4]*m[2]*m[11]+
             m[4]*m[3]*m[10]+m[8]*m[2]*m[7]-m[8]*m[3]*m[6];
    inv[11]= -m[0]*m[5]*m[11]+m[0]*m[7]*m[9]+m[4]*m[1]*m[11]-
             m[4]*m[3]*m[9]-m[8]*m[1]*m[7]+m[8]*m[3]*m[5];
    inv[15]= m[0]*m[5]*m[10]-m[0]*m[6]*m[9]-m[4]*m[1]*m[10]+
             m[4]*m[2]*m[9]+m[8]*m[1]*m[6]-m[8]*m[2]*m[5];

    var det = m[0]*inv[0]+m[1]*inv[4]+m[2]*inv[8]+m[3]*inv[12];
    if (det == 0) return false;
    det = 1.0 / det;
    for (var i = 0; i < 16; i++) inverse[i] = inv[i] * det;
    return true;
  }

    /**
     * @constructor
     */
    var Stand = function(){
        Mesh.call(this);

        this.color = new Float32Array([0.6,0.8,1.0]);
    };

    Stand.prototype = Object.create(Mesh.prototype); // Extending Mesh class

    Stand.prototype.constructor = Mesh;

    Stand.prototype.model = Models.stand;
    
    Stand.prototype.texture = new QuartzTexture();


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
        modelMatrix: 'uModelMatrix',
        textureUnit: 'uTextureUnit',
        normalMatrix: 'uNormalMatrix',
        color: 'uColor'
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

        //set up texture        
        var texHandle = this.texture.getHandle(gl); //this.texture gets texture from prototype - it is shared among instances
        gl.activeTexture(gl.TEXTURE2); //texture unit 2
        gl.bindTexture(gl.TEXTURE_2D, texHandle);

        var textureUnitLoc = shaderProgram.getUniformLocation(this.uniforms.textureUnit);
        gl.uniform1i(textureUnitLoc, 2); //texture unit 2      

        //setting uniforms
        var modelMatrixLoc = shaderProgram.getUniformLocation(this.uniforms.modelMatrix);        
        gl.uniformMatrix4fv(modelMatrixLoc, false, this.getMatrix());
   
        var colorLoc = shaderProgram.getUniformLocation(this.uniforms.color);
        gl.uniform3fv(colorLoc,this.color);

        gl.drawArrays(gl.TRIANGLES, 0, this.model.vertices.length / 3);

        var normalMatrixLoc = shaderProgram.getUniformLocation(this.uniforms.normalMatrix);
        var modelMatrixInv = new Float32Array(16);
        var normalMatrix = new Float32Array(16);
        mat4Invert(this.getMatrix(), modelMatrixInv);
        mat4Transpose(modelMatrixInv, normalMatrix);
        gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);

    };


    return Stand;




});

/***
 * @module scene/models
 */

define(['./mesh','glMatrix','../../../models/models'], function(Mesh, glM, letters) {


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
    
    var letterColors = [
        [0.929411, 0.490196, 0.482352], // red
        [0.815686, 0.521568, 0.968627], // pink
        [0.572549, 0.482352, 0.929411], // purple
        [0.482352, 0.603921, 0.929411], // blue 1
        [0.482352, 0.831372, 0.929411], // blue 2
        [0.482352, 0.929411, 0.819607], // cyan
        [0.482352, 0.929411, 0.498039], // green
        [0.729411, 0.929411, 0.482352], // lime
        [0.929411, 0.929411, 0.482352], // yellow
        [0.929411, 0.764705, 0.482352]  // orange
    ];

    /**
     * @constructor
     */
    var Letter = function(letter){
        Mesh.call(this);
        this.letter = letter;

        this.highlighted = false;
        this.selected = false;

        var i = Math.floor(Math.random() * (10));

        this.color = new Float32Array(letterColors[i]);
    };

    Letter.prototype = Object.create(Mesh.prototype);
    Letter.prototype.constructor = Mesh;

    Letter.prototype.getLetter = function(){
        return this.letter;
    };

    Letter.prototype.isHighlighted = function(){
        return this.highlighted;
    };

    Letter.prototype.setHighlighted = function(set){
        if(set === undefined){
            set = true;
        }
        this.highlighted = !!set;
    };

    Letter.prototype.isSelected = function(){
        return this.selected;
    };

    Letter.prototype.setSelected = function(set){
        if(set === undefined){
            set = true;
        }
        this.selected = !!set;
    };



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
        side: 'aVertexSide',
    };

    Letter.prototype.uniforms = {
        modelMatrix: 'uModelMatrix',
        normalMatrix: 'uNormalMatrix',
        selected: 'uSelected',
        highlighted: 'uHighlighted',
        color: 'uColor'
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


        var selectedLoc = shaderProgram.getUniformLocation(this.uniforms.selected);        
        gl.uniform1f(selectedLoc, this.selected?1.0:0.0);


        var highlightedLoc = shaderProgram.getUniformLocation(this.uniforms.highlighted);        
        gl.uniform1f(highlightedLoc, this.highlighted?1.0:0.0);


        var colorLoc = shaderProgram.getUniformLocation(this.uniforms.color);
        gl.uniform3fv(colorLoc,this.color);   

        var normalMatrixLoc = shaderProgram.getUniformLocation(this.uniforms.normalMatrix);
        var modelMatrixInv = new Float32Array(16);
        var normalMatrix = new Float32Array(16);
        mat4Invert(this.getMatrix(), modelMatrixInv);
        mat4Transpose(modelMatrixInv, normalMatrix);
        gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);

    
        gl.drawArrays(gl.TRIANGLES, 0, this.models[this.letter].vertices.length / 3);

    };

    return Letter;

});

/***
 * @module scene/models
 */

define(['./mesh','glMatrix','../../../models/models'], function(Mesh, glM, letters) {

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

        this.letterColorR = letterColors[i][1];
        this.letterColorG = letterColors[i][2];
        this.letterColorB = letterColors[i][3];
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
        side: 'aVertexSide',
    };

    Letter.prototype.uniforms = {
        modelMatrix: 'uModelMatrix',
        selected: 'uSelected',
        highlighted: 'uHighlighted',
        letterColorR: 'uLetterColorR',
        letterColorG: 'uLetterColorG',
        letterColorB: 'uLetterColorB' 
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


        var colorRLoc = shaderProgram.getUniformLocation(this.uniforms.uLetterColorR);        
        gl.uniform1f(colorRLoc, this.uniforms.letterColorR);
        var colorGLoc = shaderProgram.getUniformLocation(this.uniforms.uLetterColorG);        
        gl.uniform1f(colorGLoc, this.uniforms.letterColorG);
        var colorBLoc = shaderProgram.getUniformLocation(this.uniforms.uLetterColorB);        
        gl.uniform1f(colorBLoc, this.uniforms.letterColorB);

    
        gl.drawArrays(gl.TRIANGLES, 0, this.models[this.letter].vertices.length / 3);

    };

    return Letter;

});

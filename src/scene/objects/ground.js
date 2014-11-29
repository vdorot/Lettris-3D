/***
 * @module shaders/default
 */

define(['./mesh','glMatrix','../../textures/marble'], function(Mesh, glM, MarbleTexture) {


    /**
     * @constructor
     */
    var Ground = function(letter){
        Mesh.call(this);
        this.letter = letter;

        this.highlighted = false;
        this.selected = false;

        this.color = new Float32Array([0.0,0.0,0.0]);

    };

    Ground.prototype = Object.create(Mesh.prototype);
    Ground.prototype.constructor = Mesh;


    Ground.prototype.vertices = [
    -50, 0.0,  -50.0,
     50.0, 0.0,  -50.0,
     50.0, 0.0,  50.0,
    -50.0, 0.0,  50.0
  ];


    Ground.prototype.normals = [
        0.0,  1.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0
    ];

    Ground.prototype.uvs = [
        0,0,
        0,100,
        100,100,
        0,100
    ];

    Ground.prototype.sides = [
        0,
        0,
        0,
        0
    ];



    Ground.prototype.attributes = {
        vertex: 'aVertexPosition',
        normal: 'aVertexNormal',
        uv: 'aVertexUV',
        side: 'aVertexSide'
    };

    Ground.prototype.uniforms = {
        modelMatrix: 'uModelMatrix',
        textureUnit: 'uTextureUnit',
        color: 'uColor'
    };

    Ground.prototype.texture = new MarbleTexture();


 /**
     * Render mesh
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {ShaderProgram} shaderProgram Program to use while rendering
     */
    Ground.prototype.render = function(gl, shaderProgram){





        //preparing vertex buffer
        var vertexBuffer = this.getBuffer(gl,'ground_vertex',new Float32Array(this.vertices));
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        var vertexAttribute = shaderProgram.getAttribLocation(this.attributes.vertex);        
        
        gl.enableVertexAttribArray(vertexAttribute);

        gl.vertexAttribPointer(vertexAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing normal Buffer
        var normalBuffer = this.getBuffer(gl,'ground_normal',new Float32Array(this.normals));
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        var normalAttribute = shaderProgram.getAttribLocation(this.attributes.normal);

        gl.enableVertexAttribArray(normalAttribute);       
        gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);


        //preparing uv Buffer
        var uvBuffer = this.getBuffer(gl,'ground_uv',new Float32Array(this.uvs));
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

        var uvAttribute = shaderProgram.getAttribLocation(this.attributes.uv);

        gl.enableVertexAttribArray(uvAttribute);       
        gl.vertexAttribPointer(uvAttribute, 2, gl.FLOAT, false, 0, 0);


        //preparing side Buffer (front of Stand =1, back =-1, sides =0)
        var sideBuffer = this.getBuffer(gl,'ground_side',new Float32Array(this.sides));
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


    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 3);





    };


    return Ground;

});

/**
 * @module shaders
 */


define([], function() {

    /**
     * @constructor
     * @param {String} name Shader name
     * @param {ShaderType} type Shader type
     * @param {String} code GLSL shader code
     */
    var ShaderProgram = function(gl, vertexShader, fragmentShader){
       
        /**
         * @type {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * @type {Shader}
         */       
        this.vertexShader = vertexShader;

        /**
         * @type {Shader}
         */
        this.fragmentShader = fragmentShader;

        this._shaderProgram = null;

    }

    /**
     * Compiles and links the shader program
     */
    ShaderProgram.prototype.compile = function(){
        var gl = this.gl;

        var vertexCompiled = this.vertexShader.compile(gl);
        var fragmentCompiled = this.fragmentShader.compile(gl);


        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexCompiled);
        gl.attachShader(shaderProgram, fragmentCompiled);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("Unable to initialize shader program.");
            return;
        }
        console.log("Shader program linked");
        this._shaderProgram = shaderProgram;
    }

    /**
     * Compiles the program, if it hasn't been already
     */
    ShaderProgram.prototype.ensureCompiled = function(){
        if(this._shaderProgram === null){
            this.compile();
        }
    }

    /**
     * Sets the OpenGL pipeline to use this shader
     */
    ShaderProgram.prototype.use = function(){
        this.ensureCompiled();
        this.gl.useProgram(this._shaderProgram);
    }

    /**
     * Get the location of a uniform variable
     * @param  {string} name Variable name
     * @return {WebGLUniformLocation}   Variable location
     */
    ShaderProgram.prototype.getUniformLocation = function(name){
        this.ensureCompiled();
        return gl.getUniformLocation(this._shaderProgram,name);
    }

    /**
     * Get attribute location
     * @param  {string} name Attribute name
     * @return {int}     Attribute location
     */
    ShaderProgram.prototype.getAttribLocation = function(name){
        this.ensureCompiled();       
        return gl.getAttribLocation(this._shaderProgram, name);        
    }



    return ShaderProgram;

});

/***
 * @module shaders
 */


define([], function() {

    /**
     * @readonly
     * @enum {string}
     */
    var ShaderType = {
        VERTEX: 'vertex',
        FRAGMENT: 'fragment'
    };

    /**
     * @constructor
     * @param {String} name Shader name
     * @param {ShaderType} type Shader type
     * @param {String} code GLSL shader code
     */
    var Shader = function(name, type, code){

        /**
         * @type {string}
         */
        this.name = name;

        /**
         * @type {string}
         */      
        this.code = code;

         /**
         * @type {string}
         */       
        this.type = type;

    };

    Shader.prototype.ShaderType = ShaderType;

    /**
     * Compile shader
     * @param  {WebGLRenderingContext} gl WebGL context
     * @return {WebGLShader}   Compiled shader
     */
    Shader.prototype.compile = function(gl){
        var shaderType = this.type == ShaderType.VERTEX ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader,this.code);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
          console.error(gl.getShaderInfoLog(shader));
          throw new Error("An error occurred while compiling shader " + this.name); 
        }
        console.log("Shader "+ this.name + " compiled");
        return shader;
    };

    return Shader;

});

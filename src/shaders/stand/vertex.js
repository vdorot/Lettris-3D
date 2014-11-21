/***
 * @module shaders/letter
 */

define(['../shader','text!./vertex.glsl'], function(Shader, shaderCode) {



    /**
     * @constructor
     */
    var VertexShader = function(){
        Shader.call(this, "stand-vertex", 'vertex', shaderCode);
    };

    VertexShader.prototype = Object.create(Shader.prototype);
    VertexShader.prototype.constructor = Shader;

    return VertexShader;




});

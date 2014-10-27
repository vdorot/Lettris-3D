/**
 * @module shaders/default
 */

define(['../shader','text!./fragment.glsl'], function(Shader, shaderCode) {



    /**
     * @constructor
     */
    var FragmentShader = function(){
        Shader.call(this, "default-fragment", 'fragment', shaderCode);
    };

    FragmentShader.prototype = Object.create(Shader.prototype);
    FragmentShader.prototype.constructor = Shader;

    return FragmentShader;




});

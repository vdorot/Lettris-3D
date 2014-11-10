/**
 * @module shaders/default
 */

define(['./mesh',], function(Mesh) {



    /**
     * @constructor
     */
    var Box = function(dims,position){
        Mesh.call(this);

        this.dims = dims;
        this.position = position;


    };

    Box.prototype = Object.create(Mesh.prototype);
    Box.prototype.constructor = Mesh;





    Box.prototype.isPhysicsEnabled = function(){
        return true;
    };


    Box.prototype.getPhysicsOptions = function(){
        return {shape: "box", shapeData: this.dims, mass: 0 };
    };

    Box.prototype.getConvexHull = function(){
        /*return [
            this.position.x - this.dims.x, this.position.y - this.dims.y, this.position.z - this.dims.z,
            this.position.x - this.dims.x, this.position.y - this.dims.y, this.position.z + this.dims.z,
            this.position.x - this.dims.x, this.position.y + this.dims.y, this.position.z - this.dims.z,
            this.position.x - this.dims.x, this.position.y + this.dims.y, this.position.z + this.dims.z,
            this.position.x + this.dims.x, this.position.y - this.dims.y, this.position.z - this.dims.z,
            this.position.x + this.dims.x, this.position.y - this.dims.y, this.position.z + this.dims.z,
            this.position.x + this.dims.x, this.position.y + this.dims.y, this.position.z - this.dims.z,
            this.position.x + this.dims.x, this.position.y + this.dims.y, this.position.z + this.dims.z,

        ];*/
    };





 /**
     * Render mesh
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {ShaderProgram} shaderProgram Program to use while rendering
     */
    Box.prototype.render = function(gl, shaderProgram){



    };






    return Box;




});

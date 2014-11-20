/**
 * @module scene/models
 */


define(['glMatrix'], function(glM) {


    /**
     * @constructor
     */
    var Mesh = function(){

        this.position = {x: 0, y:0, z:0 }; //unclouple position from prototype
        this.quaternion = {x:0, y:0, z:0, w: 1};

    };


    Mesh.prototype = {
        vertices: [],

        colors: [],

        vertexIndex: [],

        //default values
        uniforms: {
            modelMatrix: "uModelMatrix"
        },

        attributes: {
            vertexColor: "aVertexColor",
            vertexPosition: "aVertexPosition"
        },

        position: {x: 0, y:0, z:0 },
        quaternion: {x:0, y:0, z:0, w: 1}

    };

    Mesh.prototype.setPosition = function(position){
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z; 
    };

    Mesh.prototype.getPosition = function(){
        return this.position;
    };

    Mesh.prototype.setQuaternion = function(quaternion){
        this.quaternion.x = quaternion.x;
        this.quaternion.y = quaternion.y;        
        this.quaternion.z = quaternion.z;
        this.quaternion.w = quaternion.w;
    };

    Mesh.prototype.getQuaternion = function(){
        return this.quaternion;
    };


    /**
     * Get the model matrix
     * @return {mat4} Transformation matrix
     */
    Mesh.prototype.getMatrix = function(){


        var matrix = glM.mat4.create();

        var v = glM.vec3.fromValues(this.position.x, this.position.y, this.position.z);

        var q = glM.vec4.fromValues(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);

        glM.mat4.fromRotationTranslation(matrix, q, v);

        return matrix;

    };


    Mesh.prototype.__buffers = {};

    Mesh.prototype.__textures = {};


    /**
     * Create buffer and fill with data
     *
     * The buffer is only created once per name, further calls return cached buffers
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {string} name Buffer name as a global cache id.
     * @param  {TypedArray} data Buffer data
     * @return {WebGLBuffer}  
     */
    Mesh.prototype.getBuffer = function(gl, name, data){

        //this.__buffers is stored in the prototype, so it is shared between all instances
        if(!this.__buffers || !this.__buffers[name]){
            var buffer = gl.createBuffer(); 
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);     
            this.__buffers[name] = buffer;
        }
        return this.__buffers[name];

    };


    /**
     * Render mesh
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param  {ShaderProgram} shaderProgram PRogram to use while rendering
     */
    Mesh.prototype.render = function(gl, shaderProgram){


    };


    /**
     * Return true if physics should apply to this mesh
     *
     * If using physics, getConvexHull and getPhysicsBody must be implemented
     * @return {Boolean} If true, physics will affect this object
     */
    Mesh.prototype.isPhysicsEnabled = function(){
        return false;
    };

    /**
     * Get convex hull of mesh
     * @return {Array} Vec3 vertices [x,y,z,x,y,z,...]
     */
    Mesh.prototype.getConvexHull = function(){
        return [];
    };


    Mesh.prototype.getPhysicsOptions = function(){
        //return {shape: "convex/plane/box", shapeArgs, mass, friction, restitution };
    };






    return Mesh;

});

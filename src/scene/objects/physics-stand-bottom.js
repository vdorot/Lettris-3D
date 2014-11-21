/***
 * @module scene/models
 */

define(['./mesh','glMatrix','../../../models/models'], function(Mesh, glM, Models) {



    /**
     * @constructor
     */
    var PhysicsStandBottom = function(){
        Mesh.call(this);

    };

    PhysicsStandBottom.prototype = Object.create(Mesh.prototype);
    PhysicsStandBottom.prototype.constructor = Mesh;



    PhysicsStandBottom.prototype.model = Models.stand.physicsBottom;


    /**
     * Returns convex hull of letter
     * @return {Array} Vec3 vertices [x,y,z,x,y,z,...]
     */
    PhysicsStandBottom.prototype.getConvexHull = function(){
        return this.model;
    };


    PhysicsStandBottom.prototype.isPhysicsEnabled = function(){
        return true;
    };


    PhysicsStandBottom.prototype.getPhysicsOptions = function(){
        return {shape: "convex", shapeData: this.getConvexHull(), mass: 0, friction: 0.5, restitution:0.01 };
    };


    PhysicsStandBottom.prototype.render = function(gl, shaderProgram){

    };






    return PhysicsStandBottom;




});

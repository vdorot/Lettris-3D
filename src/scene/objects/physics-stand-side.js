/***
 * @module scene/models
 */

define(['./mesh','glMatrix','../../../models/models'], function(Mesh, glM, Models) {



    /**
     * @constructor
     */
    var PhysicsStandSide = function(){
        Mesh.call(this);

    };

    PhysicsStandSide.prototype = Object.create(Mesh.prototype);
    PhysicsStandSide.prototype.constructor = Mesh;



    PhysicsStandSide.prototype.model = Models.stand.physicsSide;


    /**
     * Returns convex hull of letter
     * @return {Array} Vec3 vertices [x,y,z,x,y,z,...]
     */
    PhysicsStandSide.prototype.getConvexHull = function(){
        return this.model;
    };


    PhysicsStandSide.prototype.isPhysicsEnabled = function(){
        return true;
    };


    PhysicsStandSide.prototype.getPhysicsOptions = function(){
        return {shape: "convex", shapeData: this.getConvexHull(), mass: 0, friction: 0.5, restitution:0.01 };
    };


    PhysicsStandSide.prototype.render = function(gl, shaderProgram){

    };






    return PhysicsStandSide;




});

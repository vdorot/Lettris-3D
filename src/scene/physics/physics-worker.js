/**
 * @module scene/physics
 */

define(['ammo'],function(_Ammo) {

    var PhysicsWorker = function(messagePoster){
        this.messagePoster = messagePoster;
        this.bodies = [];



        var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); // every single |new| currently leaks...
        var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        var overlappingPairCache = new Ammo.btDbvtBroadphase();
        var solver = new Ammo.btSequentialImpulseConstraintSolver();
        var world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        world.setGravity(new Ammo.btVector3(0, -10, 0));

        this.world = world;


        this.timer = null;

        this.lastTime = null;



    };


    PhysicsWorker.prototype.postMessage = function(message){
        if(message.type == 'run'){
            this.run();
        }else if(message.type == 'add'){
            this.add(message);
        }else if(message.type == 'remove'){
            this.remove(message);
        }else if(message.type == 'pause'){
            this.pause();
        }
    };

    PhysicsWorker.prototype.run = function(){
        var self = this;
        if(this.timer === null){


            this.timer = setInterval(function(){
                self.step();
            },1000/60);
            
        }

    };

    PhysicsWorker.prototype.pause = function(){
        if(this.timer !== null){
            clearInterval(this.timer);
            this.timer = null;
            this.lastTime = null;
       }

    };

    PhysicsWorker.prototype.step = function(){
        if(this.lastTime !== null){
            //console.log('physics step');
            var now = Date.now();
            var dt  = (now - this.lastTime) / 1000; // seconds
            this.lastTime = now;

            this.world.stepSimulation(dt,2);

            this.updateBodies();
        }else{
            this.lastTime = Date.now();
        }
    };

    var trans = new Ammo.btTransform(); //avoid creating object every time

    PhysicsWorker.prototype.updateBodies = function(){
        var updateMessage = [];

        var objs = [];


        for(var i in this.bodies){
            var body = this.bodies[i];

            var motionState = body.getMotionState();
            if (motionState) {
                motionState.getWorldTransform(trans);

                var origin = trans.getOrigin();

                var rotation = trans.getRotation(); 

                var quat = {x: rotation.x(), y: rotation.y(), z: rotation.z(), w: rotation.w()};

                var pos = {x: origin.x(), y: origin.y(), z: origin.z()};

                var obj = {id: i,position: pos, quaternion: quat};

                objs.push(obj);


           }   



        }

        this.messagePoster({type: 'update', objects: objs});

    };

    PhysicsWorker.prototype.add = function(message){

        //console.log("physicsworker add", message);

        var id = message.id;
        if(this.bodies[id] !== undefined){
            return;
        }

        var mesh = message.mesh;

        if(!('mass' in mesh)){
            mesh.mass = 1;
        }
        var mass = mesh.mass;

        var shape = null;

        if(mesh.shape == 'convex'){

            shape = new Ammo.btConvexHullShape();


            var hull = mesh.shapeData;

            //console.log(hull);


            for(var h=0;h<hull.length/3;h++){

                var hx = hull[h*3];
                var hy = hull[h*3+1];
                var hz = hull[h*3+2];

                var pt = new Ammo.btVector3(hx, hy, hz);
                shape.addPoint(pt);               

            }
        }else if(mesh.shape == 'plane'){
            throw new Error("Not implemented");

        }else if(mesh.shape == 'box'){
            var dims = mesh.shapeData; // {x,y,z}
            var vec3 = new Ammo.btVector3(dims.x,dims.y,dims.z);
            shape = new Ammo.btBoxShape(vec3);
        }

        var pos = message.position;
        var quat = message.quaternion;

        var rotation = new Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w);

        /*console.log(rotation);

        rotation.setX(quat.x);
        rotation.setY(quat.y);
        rotation.setZ(quat.z);
        rotation.setW(quat.w);*/


        var origin = new Ammo.btVector3(pos.x, pos.y, pos.z);

        var startTransform = new Ammo.btTransform();

        startTransform.setIdentity();

        startTransform.setOrigin(origin);

        startTransform.setRotation(rotation);


        var localInertia = new Ammo.btVector3(0, 0, 0);

        shape.calculateLocalInertia(mass, localInertia);

        var myMotionState = new Ammo.btDefaultMotionState(startTransform);
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);





        if(!('friction' in mesh)){
            mesh.friction = 0.5;
        }

        if(!('restitution' in mesh)){
            mesh.restitution = 0.1;
        }

        body.setFriction(mesh.friction);
        body.setRestitution(mesh.restitution);

        this.world.addRigidBody(body);


        //this.bodies.push(body);

        this.bodies[id] = body;

    };

    PhysicsWorker.prototype.remove = function(message){
        var id = message.id;

        var body = this.bodies[id];
        if(body === undefined){
            throw new Error("Can't remove body from physics engine, body not found for id "+id+".");
        }

        this.world.removeRigidBody(body);
        delete this.bodies[id];

    };




    return PhysicsWorker;

});

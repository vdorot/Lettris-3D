/***
 * @module scene/physics
 */


define(['./blocking-worker','./threaded-worker'],function(BlockingWorker,ThreadedWorker) {

    var Physics = function(){
        this.running = null;

        var self = this;
        var onmessage = function(evt){
            self._workerMessage(evt);
        };

        this.worker = new ThreadedWorker(onmessage);

        this.objIndex = 0;
        this.objects = [];
    };


    Physics.prototype.run = function(){
        if(!this.running){
            this.running = true;
        }
        this.worker.postMessage({type: 'run'});
    };

    Physics.prototype.pause = function(){
        if(this.running){
            this.running = false;
            this.worker.postMessage({type: 'pause'});
        }
    };

  /*  Physics.prototype.init = function(){

        worker.postMessage();
    };*/

    Physics.prototype.add = function(mesh){
        var pos = this.objects.indexOf(mesh);
        if(pos !== -1){
            return; //already running physcis for this object
        }

        this.objIndex++;
        this.objects[this.objIndex] = mesh;

        //{shape: "convex/plane/box", shapeData, mass, friction, restitution };



        var data = {type: 'add', id: this.objIndex,  mesh: mesh.getPhysicsOptions(), position: mesh.getPosition(), quaternion: mesh.getQuaternion()};

        this.worker.postMessage(data);
    };

    Physics.prototype.remove = function(mesh){
        var pos = this.objects.indexOf(mesh);
        if(pos === -1){
            var err = new Error("Cannot remove object from physics simulation, object is not part of it");
            err.mesh = mesh;
            throw err;
        }
        delete this.objIndex[pos];
        this.worker.postMessage({type: "remove", id: pos});
    };

    Physics.prototype._workerMessage = function(message){
        //console.log('worker message', message);
        var data = message;
        if(data.type == 'update'){
            for(var i in data.objects){
                var obj = data.objects[i];
                var id = parseInt(obj.id);
                //console.log(obj);

                //console.log(this.objects);

                if(this.objects[id] !== undefined){
                    var mesh = this.objects[id];
                    //console.log('updating mesh ',mesh,'to',obj);

                    mesh.setPosition(obj.position);
                    mesh.setQuaternion(obj.quaternion);
                }
            }
        }
    };

    return Physics;

});

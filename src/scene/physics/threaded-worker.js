/**
 * @module scene/physics
 */


define(['./physics-worker'],function(PhysicsWorker) {

    var ThreadedWorker = function(messagePoster){





        this.worker = new Worker("src/_worker.js");

        this.worker.onmessage = function(evt){
        	//console.log("message form worker",evt);
        	messagePoster(evt.data);
        };


    };

    ThreadedWorker.prototype.postMessage = function(message){
        this.worker.postMessage(message);
    };

    return ThreadedWorker;

});

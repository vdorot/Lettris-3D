/***
 * @module scene/physics
 */


define(['./physics-worker'],function(PhysicsWorker) {

    var BlockingWorker = function(messagePoster){
        this.worker = new PhysicsWorker(messagePoster);
    };

    BlockingWorker.prototype.postMessage = function(message){
        this.worker.postMessage(message);
    };

    return BlockingWorker;

});

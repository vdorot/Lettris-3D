importScripts("../lib/require.js");

require.config({
    paths: {
        ammo: "../lib/ammo",
    }
});




var messagePoster = function(message){

	self.postMessage(message);
};

var events = [];
var worker = null;

require(['./scene/physics/physics-worker.js'], function(Worker){

	worker = new Worker(messagePoster);
	for(var i in events){
		worker.postMessage(events[i]);
	}
	events = [];




});

self.onmessage = function(event){

	var message = event.data;

	if(worker === null){
		events.push(message);
	}else{
		worker.postMessage(message);
	}

};
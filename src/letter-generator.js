define(['./scene/renderer', './random-letter', './scene/objects/letter'], function(Renderer, RandomLetter, Letter){


	var LetterGenerator = function(scene, period){
		this.scene = scene;

		this.timer = null;

		this.secondTimer = null;

		var defaultPeriod = 2000;

		this.period = period || defaultPeriod;

		this.secondPeriod = 1000;

		this.lastSecond = null;
		this.lastTick = null;
		this.secondLeft = this.secondPeriod;
		this.periodLeft = 0;
	};


	var randomQuat = function(){
	        //http://hub.jmonkeyengine.org/forum/topic/random-rotation/
	        

	        var u1 = Math.random();
	        var u2 = Math.random();
	        var u3 = Math.random();


	        var u1sqrt = Math.sqrt(u1);
	        var u1m1sqrt = Math.sqrt(1-u1);
	        var x = u1m1sqrt *Math.sin(2*Math.PI*u2);
	        var y = u1m1sqrt *Math.cos(2*Math.PI*u2);
	        var z = u1sqrt *Math.sin(2*Math.PI*u3);
	        var w = u1sqrt *Math.cos(2*Math.PI*u3);


	        return {x: x, y: y, z: z, w: w};


	};

	LetterGenerator.prototype.generateLetter = function(){


        var ltr = RandomLetter.get();


        var pos = {x:0,y: 6,z: 0 };


        var object = new Letter(ltr);


        object.setPosition(pos);

        object.setQuaternion(randomQuat());


        this.scene.add(Renderer.LAYER_LETTERS,object);      


	};

	LetterGenerator.prototype.getPeriod = function(){
		return this.period;
	};

	LetterGenerator.prototype.setPeriod = function(period){
		var diff = period - this.period;
		if(this.timer !==  null){

			this.period = period;

		}else{
			this.secondLeft = Math.max(0,this.secondLeft + diff);
			this.period = period;
		}
	};


	LetterGenerator.prototype.tick = function(){
		
		this.lastTick = Date.now();
		var self = this;
		this.timer = setTimeout(function(){self.tick();},this.period);
		this.generateLetter();
		console.log("generator tick");
	};

	LetterGenerator.prototype.secondTick = function(){
		this.lastSecond = Date.now();
		var self = this;
		this.secondTimer = setTimeout(function(){self.secondTick();},this.secondPeriod);
		if(this.onSecondTick){
			this.onSecondTick(this,this.period);
		}
	};

	LetterGenerator.prototype.everySecond = function(callback){
		this.onSecondTick = callback;
	};

	LetterGenerator.prototype.start = function(){
		var self = this;
		var now = Date.now();
		if(this.timer === null){
			if(this.lastTick === null){
				this.lastTick = now;
			}
			this.timer = setTimeout(function(){self.tick();},this.periodLeft);
		}
		if(this.secondTimer === null){
			if(this.lastSecond === null){
				this.lastSecond = now;
			}
			this.secondTimer = setTimeout(function(){self.secondTick();},this.secondLeft); 
		}
	};

	LetterGenerator.prototype.pause = function(){
		var now = Date.now();
		this.periodLeft = this.period - (now - this.lastTick);
		clearTimeout(this.timer);
		this.timer = null;

		this.secondLeft = this.secondPeriod - (now - this.lastSecond);
		clearTimeout(this.secondTimer);
		this.secondTimer = null;
	};





	return LetterGenerator;
});
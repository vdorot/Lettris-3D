/**
 * @module game
 */

define(['jquery','./letter-generator','./random-letter','./scene/objects/letter'],function($,LetterGenerator,RandomLetter,Letter){
	

	/**
	 * Game logic
	 * @constructor
	 * @alias module:game
	 * @class  Game
	 * @param {Scene} scene The scene
	 * @param {WordChecker} wordChecker Word checker
	 */
	var Game = function(scene, wordChecker){
		this.scene = scene;

		this.wordChecker = wordChecker;

		this.word = [];

		this.paused = true;

		this.letterGenerator = new LetterGenerator(scene);


		this.minPeriod = 400;

		var self = this;

		this.letterGenerator.everySecond(function(generator,period){

			var diff = -4;

			var newPeriod = Math.max(self.minPeriod,period+diff);

			generator.setPeriod(newPeriod);

			self.checkOverflow();

		});


		this.score = 0;

		this.isOver = false;
	};

	Game.prototype.start = function(){
        this.scene.physics.run();
		if(this.over){
			return;
		}
        this.letterGenerator.start();
        this.paused = false;
        $("#game-status").css("visibility",'hidden');
        this._update();
	};

	Game.prototype.pause = function(){
        this.scene.physics.pause();
		if(this.over){
			return;
		}
        this.letterGenerator.pause();
        this.paused = true;
        $("#game-status").css("visibility",'visible');
	};

	Game.prototype.faster = function(){
		this.minPeriod = 300;
		this.letterGenerator.setPeriod(300);
	};

	Game.prototype.isPaused = function(){
		return this.paused;
	};

	Game.prototype.isOver = function(){
		return this.over;
	};

	Game.prototype.gameOver = function(){

		console.log("GAME OVER");
		this.cancel();

		this.letterGenerator.pause();

		this.paused = true;

		this.over = true;
        $("#game-status").css("visibility",'visible');
		$("#paused").text("OVERFLOW").css({opacity: 0});

		var animFn = function(){
			$("#paused").animate({opacity: 1},500,'swing').animate({opacity: 0},500,'swing',animFn);
		};

		animFn();


	};

	/**
	 * Get letter object by letter
	 * @param  {string} letter Character
	 * @return {Letter}        Letter mesh
	 */
	Game.prototype.getObject = function(letter){
		var objects = this.scene.getObjects();
		for(var i in objects){
			if(objects[i] instanceof Letter){
				var letterObj = objects[i];
				if(letterObj.getLetter() == letter && !letterObj.isSelected()){
					return letterObj;
				}
			}
		}
		return null;

	};


	Game.prototype.checkOverflow = function(){
		var objects = this.scene.getObjects();
		for(var i in objects){
			if(objects[i] instanceof Letter){
				var letterObj = objects[i];
				var pos = letterObj.getPosition();
				if(pos.y < 0.7){ // letter has fallen out
					this.gameOver();
				}
			}
		}
	};


	/**
	 * Highlight Letter objects
	 * @param  {string} letter Character
	 */
	Game.prototype.highlightLetter = function(letter){
		var objects = this.scene.getObjects();
		for(var i in objects){
			if(objects[i] instanceof Letter){
				var letterObj = objects[i];
				if(letterObj.getLetter() == letter){
					letterObj.setHighlighted();
				}
			}
		}		
	};
	/**
	 * Handle letter pressed on ekyboard
	 * @param  {string} letter The letter
	 */
	Game.prototype.letter = function(letter){
		if(this.paused){
			return;
		}
		var object = this.getObject(letter);
		if(object === null){
			return false;
		}
		object.setSelected();
		var newState = {letter: letter, object: object};
		this.word.push(newState);
		this.unhighlight();
		this.highlightLetter(letter);
		this._update();
		return true;
	};

	/**
	 * Remove all highlights
	 */
	Game.prototype.unhighlight = function(){
		var objects = this.scene.getObjects();
		for(var i in objects){
			if(objects[i] instanceof Letter){
				objects[i].setHighlighted(false);				
			}
		}			
	};
	/**
	 * Deselect objects
	 */
	Game.prototype.unselect = function(){
		var objects = this.scene.getObjects();
		for(var i in objects){
			if(objects[i] instanceof Letter){
				objects[i].setSelected(false);				
			}
		}
	};
	/**
	 * Handle backspace
	 */
	Game.prototype.back = function(){ //backspace
		if(this.paused){
			return;
		}
		if(this.word.length < 1){
			return;
		}
		var old = this.word.pop().object;
		old.setSelected(false);
		this.unhighlight();
		if(this.word.length >=1){
			var state = this.word[this.word.length -1];
			this.highlightLetter(state.letter);
		}
		this._update();
		return true;

	};
	/**
	 * Update html word
	 */
	Game.prototype._update = function(){
		//update html ui
		var word = this.getWord();
		word = word.charAt(0).toUpperCase() + word.slice(1);
		$('#word').text(word);
		$('#score').text(this.score);
	};
	/**
	 * Cancel word
	 */
	Game.prototype.cancel = function(){ //escape
		if(this.paused){
			return;
		}
		this.unselect();
		this.word = [];
		this.unhighlight();
		this._update();
	};
	/**
	 * Accept word
	 */
	Game.prototype.accept = function(){ //enter
		if(this.paused){
			return;
		}
		if(this.word.length < 1){
			return;
		}
		var word = this.getWord();
		if(!this.isWord(word)){
			this.cancel();
			// show message
			
			word = word.charAt(0).toUpperCase() + word.slice(1);

			var message = $('<div class="not-a-word"></div>');
			message.text(word + ' is not a word!');
			message.hide();
			$('#word').empty().append(message);
			message.fadeIn('fast');

			return;
		}
		for(var i in this.word){
			var state = this.word[i];
			this.scene.remove(state.object);
		}
		this.unhighlight();
		this.score += this.getWordScore();
		this.word = [];
		this._update();
	};
	/**
	 * Computes score of current word
	 * @return {int} word score
	 */
	Game.prototype.getWordScore = function(){
		var word = this.getWord();
		var score = 0;
		for(var i=0;i<word.length;i++){
			score += RandomLetter.letterScore(word.charAt(i));
		}


		//multiplier:
		//3-letter word - 1.0
		//6-letter word - 2.0
		//9-letter word - 3.0
		//...
		
		score = score * (word.length/3);
		return Math.ceil(score);
	};

	/**
	 * Get current word as string
	 * @return {string} word
	 */
	Game.prototype.getWord = function(){
		var s = '';
		for(var i in this.word){
			s += this.word[i].letter;
		}
		return s;
	};
	/**
	 * Check if a word is legit
	 * @param  {string}  word The word
	 * @return {Boolean}      True, if the word was found ina  dictionary
	 */
	Game.prototype.isWord = function(word){
		return this.wordChecker.isValid(word);
	};

	return Game;

});
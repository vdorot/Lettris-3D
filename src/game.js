/**
 * @module game
 */

define(['jquery','./scene/objects/letter'],function($,Letter){
	

	/**
	 * Game logic
	 * @constructor
	 * @alias module:game
	 * @class  Game
	 * @param {Scene} scene The scene
	 */
	var Game = function(scene){
		this.scene = scene;

		this.word = [];
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
		$('#word').text(this.getWord());
	};
	/**
	 * Cancel word
	 */
	Game.prototype.cancel = function(){ //escape
		this.unselect();
		this.word = [];
		this.unhighlight();
		this._update();
	};
	/**
	 * Accept word
	 */
	Game.prototype.accept = function(){ //enter
		if(this.word.length < 1){
			return;
		}
		if(!this.isWord(this.getWord())){
			// show message
			this.cancel();
			return;
		}
		for(var i in this.word){
			var state = this.word[i];
			this.scene.remove(state.object);
		}
		this.unhighlight();
		this.word = [];
		this._update();
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
		return true;
	};

	return Game;

});
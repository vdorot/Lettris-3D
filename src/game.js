define(['jquery','./scene/objects/letter'],function($,Letter){

	var Game = function(scene){
		this.scene = scene;

		this.word = [];
	};

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

	Game.prototype.unhighlight = function(){
		var objects = this.scene.getObjects();
		for(var i in objects){
			if(objects[i] instanceof Letter){
				objects[i].setHighlighted(false);				
			}
		}			
	};

	Game.prototype.unselect = function(){
		var objects = this.scene.getObjects();
		for(var i in objects){
			if(objects[i] instanceof Letter){
				objects[i].setSelected(false);				
			}
		}
	};

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

	Game.prototype._update = function(){
		//update html ui
		$('#word').text(this.getWord());
	};

	Game.prototype.cancel = function(){ //escape
		this.unselect();
		this.word = [];
		this.unhighlight();
		this._update();
	};

	Game.prototype.accept = function(){ //enter
		if(this.word.length < 1){
			return;
		}
		if(!this._isWord(this.getWord())){
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

	Game.prototype.getWord = function(){
		var s = '';
		for(var i in this.word){
			s += this.word[i].letter;
		}
		return s;
	};

	Game.prototype._isWord = function(word){
		return true;
	};

	return Game;

});
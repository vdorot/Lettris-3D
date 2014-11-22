
define([],function(){


  //funkce pro ziskani znako o jednicku vyssi
  function nextChar(c){
     return String.fromCharCode(c.charCodeAt(0) + 1);
  }

  var globDictionary = {};

  //funkce pro naceteni jednoho souboru
  function loadFile(letter, done){

    var FILENAME_PREFIX = "./dictionary/";
    var FILENAME_SUFIX = " Words.csv";
    
    var resPre = FILENAME_PREFIX.concat(letter);
    var resName = resPre.concat(FILENAME_SUFIX);

    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", resName, true);
    txtFile.onreadystatechange = function()
    { 
      if (txtFile.readyState === 4) {
        if (txtFile.status === 200 || txtFile.status === 0) {
          allText = txtFile.responseText;
          globDictionary[letter] = txtFile.responseText.split("\n");

          done();
        
        }
      }

    };
    txtFile.send(null);
     

  }

  //funkce pro nacteni vsech souboru
  function initDictionary(done){
     
    var eventCnt = 0;

    var firstLetter = 'A';

    var fn = function(){
      eventCnt++;
      if(eventCnt == ('Z'.charCodeAt(0) - 'A'.charCodeAt(0) + 1)){
        done();
      }
    }; 
    
    while(firstLetter <= 'Z'){      
         

    loadFile(firstLetter,fn);     
    firstLetter = nextChar(firstLetter);
    }
     
  }


  //funkce pro kontrolu slova
  function isValid(textstring){
    
    var resText = textstring.toLowerCase();
    var firstLetter =  resText.charAt(0).toUpperCase();

    for(var i = 0; i < globDictionary[firstLetter].length;  i++){
      if(globDictionary[firstLetter][i] == textstring){
         //slovo nalezeno
         return true;
      }
    }  
    return false;

      
  }


  function MsgBox (textstring) {

  initDictionary();

  }

  return {init: initDictionary, isValid: isValid};


});

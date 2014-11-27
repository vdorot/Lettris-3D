require(['jquery','./scene/scene','./scene/renderer','./game','./scene/objects/letter','./scene/objects/physics-box','./scene/objects/ground','./scene/objects/stand','./scene/objects/physics-stand-bottom','./scene/objects/physics-stand-side','./scene/objects/stand-side','./fps-counter','glMatrix','./dictionary'],
function($,         Scene,          Renderer,         Game,       Letter,                 PhysicsBox,                 Ground,                   Stand,                  PhysicsStandBottom,                     PhysicsStandSide,                             StandSide,                  FpsCounter,     glM,  WordChecker) {


var ready = function() {






    var initGLContext = function(canvas) {

        gl = null;

        try {
            // Try to grab the standard context. If it fails, fallback to experimental.
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        }
        catch(e) {}


        window.gl = gl;


        return gl;

    };

    var getCanvas = function() {
        return  document.getElementById("canvas");   
    };

    var getContext = function() {
        return initGLContext(getCanvas());
    };

    var gl = getContext();

    if(!gl){
        console.error("Unable to initialize WebGL.");
        return; //die
    }





    var scene = new Scene();


    var stand = new Stand();


    var box = new PhysicsBox({x:30,y:10,z:30},{x:0,y:-10,z:0});






    var renderer = new Renderer(gl,scene);

    /** Set viewport handler */
    var resizeHandler = function(){

        var canvas = getCanvas();

        var width = canvas.clientWidth;

        var height = canvas. clientHeight;


        canvas.width = width;

        canvas.height = height;

        gl.viewport(0, 0, width, height);


        renderer.updateViewport(canvas.clientWidth, canvas.clientHeight);

        //drawScene();
            
    };



    resizeHandler();
    window.addEventListener('resize', resizeHandler);



    scene.addLayer(Renderer.LAYER_LETTERS);

    scene.add(Renderer.LAYER_LETTERS,box);


    scene.addLayer(Renderer.LAYER_STAND);

    scene.add(Renderer.LAYER_STAND,stand);

    standBottom = new PhysicsStandBottom();

    scene.add(Renderer.LAYER_STAND,standBottom);


    var ground = new Ground();
    scene.add(Renderer.LAYER_STAND,ground);

    scene.addLayer(Renderer.LAYER_GLASS);

    for(var  i=0;i<6;i++){

        var quat = glM.quat.create();

        glM.quat.setAxisAngle(quat,[0,1,0],Math.PI*2/6*i);

        var standSide = new StandSide();

        standSide.setQuaternion({x:quat[0],y:quat[1],z:quat[2],w:quat[3]});

        scene.add(Renderer.LAYER_GLASS,standSide);



        var physicsStandSide = new PhysicsStandSide();


        physicsStandSide.setQuaternion({x:quat[0],y:quat[1],z:quat[2],w:quat[3]});

        scene.add(Renderer.LAYER_STAND,physicsStandSide);


    }





    var canvas = getCanvas();


    var cubeCnt = 0;



    var letterIndex = [];

    var letterBodies = [];




        var drawScene = function(){


            renderer.render();


        };



        var fpsElement = $("#fps");

        var fpsCounter = new FpsCounter();



        var error_occured = false;



        var animator = function(){
            if(error_occured){
                return;
            }

            window.requestAnimationFrame(animator);

            try{
                fpsCounter.update(); 


                drawScene();

            }catch(e){
                console.error(e);
                error_occured = true;
            }

        };

        setInterval(function(){
                        fpsElement.text(fpsCounter.getCountPerSecond());  
        },1000);

        setInterval(function(){
                        renderer.viewAngle += 0.005;
        },1000/60);


        animator();

        scene.physics.run();


        var game = new Game(scene, WordChecker);


        $("#loading").remove();

        var startFn = function(){
            $("#introduction-screen").hide();
            $("#in-game-screen").show();
            game.start();

        };

        $("#start-game").click(startFn).keyup(function(evt){
            if(evt.keyCode == 13){
                startFn();
            }
        }).focus();


        var unpauseOnFocus = false;

        $(window).focus(function(){
            if(unpauseOnFocus){
                game.start();
            }
        });

        $(window).blur(function(){
            unpauseOnFocus = !game.isPaused();
            game.pause();
        });


        $(document).keydown(function(evt){

            if(!evt.ctrlKey && !evt.altKey && !evt.shiftKey && evt.keyCode >= 'A'.charCodeAt() && evt.keyCode <= 'Z'.charCodeAt()){
                evt.preventDefault();

                var letter = String.fromCharCode(evt.keyCode).toLowerCase();

                game.letter(letter);

            }

            if(evt.keyCode == 13){  //enter
                evt.preventDefault();
                game.accept();

            }

            if(evt.keyCode == 27){ //escape
                evt.preventDefault();
                game.cancel();
            }

            if(evt.keyCode == 8){ //backspace
                evt.preventDefault();
                game.back();
            }

            if(evt.ctrlKey && evt.keyCode == 'P'.charCodeAt(0)){ //pause game
                evt.preventDefault(); // don't print page
                if(game.isPaused()){
                    game.start();
                }else{
                    game.pause();
                }

            }

            if(evt.ctrlKey && evt.keyCode == 'F'.charCodeAt(0)){ //pause game
                evt.preventDefault();
                game.faster();

            }

            if(evt.ctrlKey && evt.keyCode == "H".charCodeAt(0)){
                evt.preventDefault();
                var objects = scene.getObjects();
                for(var i in objects){
                    if(objects[i] instanceof Letter){
                        var letterObj = objects[i];
                        console.log(letterObj.getPosition().y);
                    }
                }   
            }


        });






};


$(function(){
    WordChecker.init(function(){
        ready();
    });
});








});
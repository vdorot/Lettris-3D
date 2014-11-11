require(['jquery','./scene/scene','./scene/renderer','./game','./scene/objects/letter','./scene/objects/physics-box','./scene/objects/stand','./scene/objects/physics-stand-bottom','./scene/objects/physics-stand-side','./fps-counter','glMatrix','./random-letter'],
function($,         Scene,          Renderer,         Game,       Letter,                 PhysicsBox,                     Stand,                  PhysicsStandBottom,                 PhysicsStandSide,                       FpsCounter,     glM, RandomLetter) {

// jQuery DOMReady handler - wait for html document to load
$(function() {






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




    for(var  i=0;i<6;i++){

        var quat = glM.quat.create();

        glM.quat.setAxisAngle(quat,[0,1,0],Math.PI*2/6*i);

        var standSide = new PhysicsStandSide();

        standSide.setQuaternion({x:quat[0],y:quat[1],z:quat[2],w:quat[3]});

        scene.add(Renderer.LAYER_STAND,standSide);


    }





    var canvas = getCanvas();


    var cubeCnt = 0;



    var letterIndex = [];

    var letterBodies = [];




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


    var genTimer = null;




    var genObject = function(){



            var ltr = RandomLetter.get();


            var pos = {x:0,y: 6,z: 0 };


            var object = new Letter(ltr);


            object.setPosition(pos);

            /*var x = Math.random*Math.PI*2;
            var y = Math.random*Math.PI*2;
            var z = Math.random*Math.PI*2;

            var quat = glM.quat.create();

            glM.quat.setAxisAngle(quat,[Math.random(),Math.ran,0],1);

            glM.quat.normalize(quat,quat);

            object.setQuaternion({x: quat[0], y: quat[1], z: quat[2], w: quat[3]});

            //object.setQuaternion({x: 1, y: 0, z: 0, w: 1});*/

            object.setQuaternion(randomQuat());


            scene.add(Renderer.LAYER_LETTERS,object);      


            cubeCnt++;
            if(cubeCnt >=10){
                clearInterval(genTimer);
            }

            /*setTimeout(function(){ return function(){
                scene.remove(object);
            };}(object),10000);
*/

    };

        var OBJGEN_INTERVAL = 500;
        genTimer = setInterval(genObject,OBJGEN_INTERVAL);






        var drawScene = function(){


            renderer.render();


        };



        var fpsElement = $(".fps");

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


        var game = new Game(scene);






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

            if(evt.ctrlKey && evt.keyCode == 'P'.charCodeAt()){ //pause game
                evt.preventDefault(); // don't print page
                if(scene.physics.running){
                    scene.physics.pause();
                    clearInterval(genTimer);
                    genTimer = null;
                }else{
                    scene.physics.run();
                    genTimer = setInterval(genObject,OBJGEN_INTERVAL);
                }

            }


        });






});








});
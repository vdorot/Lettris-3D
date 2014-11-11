require(['jquery','./scene/scene','./scene/renderer','./scene/objects/letter','./scene/objects/physics-box','./scene/objects/stand','./scene/objects/physics-stand-bottom','./scene/objects/physics-stand-side','./fps-counter','glMatrix'], function($,Scene,Renderer,Letter,PhysicsBox,Stand,PhysicsStandBottom,PhysicsStandSide,FpsCounter,glM) {

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


    var getRandomLetter = function(){

            //http://en.wikipedia.org/wiki/Letter_frequency

            var letterProb = {
                'a': 8.167,
                'b': 1.492,
                'c': 2.782,
                'd': 4.253,
                'e': 12.702,
                'f': 2.228,
                'g': 2.015,
                'h': 6.094,
                'i': 6.966,
                'j': 0.153,
                'k': 0.772,
                'l': 4.025,
                'm': 2.406,
                'n': 6.749,
                'o': 7.507,
                'p': 1.929,
                'q': 0.095,
                'r': 5.987,
                's': 6.327,
                't': 9.056,
                'u': 2.758,
                'v': 0.978,
                'w': 2.360,
                'x': 0.150,
                'y': 1.974,
                'z': 0.075,
            };


            var sum = 0;

            for(var i in letterProb){
                sum += letterProb[i];
            }


            var rand = Math.random()*sum;

            var ltr = 'a';

            var rem = rand;

            while(rem - letterProb[ltr] > 0){
                rem = rem - letterProb[ltr];
                ltr = String.fromCharCode(ltr.charCodeAt() + 1);

            }

            return ltr;

    };





    var genObject = function(){



            var ltr = getRandomLetter();


            var pos = {x:0,y: 6,z: 0 };


            var object = new Letter(ltr);


            object.setPosition(pos);

            var x = Math.random*Math.PI*2;
            var y = Math.random*Math.PI*2;
            var z = Math.random*Math.PI*2;

            var quat = glM.quat.create();

            glM.quat.setAxisAngle(quat,[1,0,0],1);



            glM.quat.normalize(quat,quat);

            object.setQuaternion({x: quat[0], y: quat[1], z: quat[2], w: quat[3]});

            //object.setQuaternion({x: 1, y: 0, z: 0, w: 1});


            scene.add(Renderer.LAYER_LETTERS,object);      


            cubeCnt++;
            if(cubeCnt >=100){
                clearInterval(timer);
            }

            /*setTimeout(function(){ return function(){
                scene.remove(object);
            };}(object),10000);
*/

    };

    var timer = setInterval(genObject,400);




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



        $(document).keypress(function(){
            console.log('pausing physics');
            if(scene.physics.running){
                scene.physics.pause();
            }else{
                scene.physics.run();
            }
        });






});








});
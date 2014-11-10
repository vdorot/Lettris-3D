require(['jquery','./scene/scene','./scene/renderer','./scene/objects/letter','./scene/objects/physics-box','./fps-counter','glMatrix'], function($,Scene,Renderer,Letter,PhysicsBox,FpsCounter,glM) {

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



    var box = new PhysicsBox({x:30,y:10,z:30},{x:0,y:-12,z:0});






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

    var canvas = getCanvas();


    var cubeCnt = 0;



    var letterIndex = [];

    var letterBodies = [];


    var genObject = function(){




            var pos = {x:Math.random()*3-1.5,y: 6,z: Math.random()*3 -1.5 };
        

            var ltrs = "abcdefghijklmnopqrstuvxyz";

            var ltr = Math.floor(Math.random()*ltrs.length);


            var object = new Letter(ltrs[ltr]);


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

            setTimeout(function(){ return function(){
                scene.remove(object);
            };}(object),10000);


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
                        //renderer.viewAngle += 0.005;
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
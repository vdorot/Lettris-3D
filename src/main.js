require(['jquery','./scene/scene','./fps-counter'], function($,Scene,FpsCounter) {

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

        }

        var getCanvas = function() {
            return  document.getElementById("canvas");   
        }

        var getContext = function() {
            return initGLContext(getCanvas());
        }

        var gl = getContext();

        if(!gl){
            console.error("Unable to initialize WebGL.");
            return; //die
        }




        var dimensionsProvider = function(){
            var canvas = getCanvas();
            return {width: canvas.clientWidth,
                height: canvas.clientHeight}
        };


        var scene = new Scene();

        var canvas = getCanvas();

        scene.viewportWidth = canvas.clientWidth;
        scene.viewportHeight = canvas.clientHeight;








        var drawScene = function(){

            gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
            gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

            gl.clearColor(0.3, 0.3, 0.3, 1.0);                      // Set clear color to black, fully opaque
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.

            scene.render(gl);


        }




        /** Set viewport handler */
        var resizeHandler = function(){

            var canvas = getCanvas();

            var width = canvas.clientWidth;

            var height = canvas. clientHeight;


            canvas.width = width;

            canvas.height = height;

            gl.viewport(0, 0, width, height);

            scene.viewportWidth = canvas.clientWidth;
            scene.viewportHeight = canvas.clientHeight;


            //drawScene();
                
        }



        resizeHandler();
        window.addEventListener('resize', resizeHandler);


        var fpsElement = $(".fps");

        var fpsCounter = new FpsCounter();


        var animator = function(){
            window.requestAnimationFrame(animator);

            fpsCounter.update();





            for(var i in scene.cubes){
                scene.cubes[i].addRotation(0.02);
            }

            

            drawScene();

        }

        setInterval(function(){
                        fpsElement.text(fpsCounter.getCountPerSecond());  
        },1000);


        animator();








});








});
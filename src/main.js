require(['jquery','./scene/scene','./scene/cube','./scene/letter','./fps-counter', 'ammo','glMatrix'], function($,Scene,Cube,Letter,FpsCounter,Ammo__,glM) {

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




        var dimensionsProvider = function(){
            var canvas = getCanvas();
            return {width: canvas.clientWidth,
                height: canvas.clientHeight};
        };


        var scene = new Scene();

        var canvas = getCanvas();

        scene.viewportWidth = canvas.clientWidth;
        scene.viewportHeight = canvas.clientHeight;

        console.log(Ammo);


        var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); // every single |new| currently leaks...
        var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        var overlappingPairCache = new Ammo.btDbvtBroadphase();
        var solver = new Ammo.btSequentialImpulseConstraintSolver();
        var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

        var bodies = [];


        (function() {

            var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(30,10,30));

            var groundTransform = new Ammo.btTransform();
            groundTransform.setIdentity();
            groundTransform.setOrigin(new Ammo.btVector3(0, -12, 0));

            var mass = 0;
            var localInertia = new Ammo.btVector3(0, 0, 0);
            var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
            var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, groundShape, localInertia);
            var body = new Ammo.btRigidBody(rbInfo);


            body.setFriction(0.8);
            body.setRestitution(0.01);

            dynamicsWorld.addRigidBody(body);
            bodies.push(body);
        })();



/*



        var world = new CANNON.World();
        world.gravity.set(0,-20.81,0); // m/s²
        world.broadphase = new CANNON.NaiveBroadphase();

        var groundMat = new CANNON.Material();



        // Create a plane
        var groundBody = new CANNON.Body({
            mass: 0, // mass == 0 makes the body static
            material: groundMat
        });
        var groundShape = new CANNON.Box(new CANNON.Vec3(30,0.01,30));
        groundBody.addShape(groundShape);

        groundBody.position.set(0,-5,0);


        world.add(groundBody);

*/



/*


    var cubeMat = new CANNON.Material();

            var cube_ground = new CANNON.ContactMaterial(groundMat, cubeMat, { friction: 0.1, restitution: 0.4 });
            var cube_cube = new CANNON.ContactMaterial(cubeMat, cubeMat, { friction: 0.01, restitution: 0.3 });
            //var mat3_ground = new CANNON.ContactMaterial(groundMaterial, mat3, { friction: 0.0, restitution: 0.9 });

            world.addContactMaterial(cube_ground);
            world.addContactMaterial(cube_cube);
*/

    var cubeCnt = 0;



    var letterIndex = [];

    var letterBodies = [];


    var genCube = function(){


            var pos = {x:Math.random()*10-5,y: 20,z: Math.random()*10 -5 };
        

            var ltrs = "abcdefghijklmnopqrstuvxyz";

            var ltr = Math.floor(Math.random()*ltrs.length);


            var cube = new Letter(ltrs[ltr]);


            cube.setPosition(pos);

            var x = Math.random*Math.PI*2;
            var y = Math.random*Math.PI*2;
            var z = Math.random*Math.PI*2;

            var quat = glM.quat.create();

            glM.quat.setAxisAngle(quat,[Math.random(),Math.random(),Math.random()],Math.random()*Math.PI*2);
            glM.quat.normalize(quat,quat);

            cube.setQuaternion({x: quat[0], y: quat[1], z: quat[2], w: quat[3]});


            scene.add(cube);      



            /*var hull = cube.getConvexHull();

            var hullVerts = [];

            for(var h=0;h<hull.vertices.length/3;h++){

                var hx = hull.vertices[h*3];
                var hy = hull.vertices[h*3+1];
                var hz = hull.vertices[h*3+2];

                vert = new CANNON.Vec3(hx,hy,hz);
                hullVerts.push(vert);
            }

            console.log(hull);*/

            var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1));

            var hullShape = new Ammo.btConvexHullShape();


            var hull = cube.getConvexHull();

            //console.log(hull);


            for(var h=0;h<hull.length/3;h++){

                var hx = hull[h*3];
                var hy = hull[h*3+1];
                var hz = hull[h*3+2];

                var pt = new Ammo.btVector3(hx, hy, hz);
                hullShape.addPoint(pt);               

            }


            var quat = cube.getQuaternion();

            var rotation = Ammo.btQuaternion(quat.x,quat.y,quat.z,quat.w);

            var pos = cube.getPosition();
            var origin = new Ammo.btVector3(pos.x, pos.y, pos.z);

            var startTransform = new Ammo.btTransform(rotation,origin);
            //startTransform.setIdentity();

            var origin = startTransform.getOrigin();

            origin.setX(pos.x);
            origin.setY(pos.y);
            origin.setZ(pos.z);





            

            /*var rotation = startTransform.getRotation();
            rotation.setX(quat.x);
            rotation.setY(quat.y);
            rotation.setZ(quat.z);
            rotation.setW(quat.w);
*/


            var mass = 1;
            var localInertia = new Ammo.btVector3(0, 0, 0);
            boxShape.calculateLocalInertia(mass, localInertia);

            var myMotionState = new Ammo.btDefaultMotionState(startTransform);
            var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, hullShape, localInertia);
            var body = new Ammo.btRigidBody(rbInfo);





            body.setFriction(0.8);
            body.setRestitution(0.01);

            dynamicsWorld.addRigidBody(body);
 


            bodies.push(body);
            letterBodies.push(body);
            letterIndex.push(cube);

/*

            var shape = new CANNON.ConvexPolyhedron(hullVerts,hull.faces);
            var boxBody = new CANNON.Body({ mass: Math.random(10), material: cubeMat });
            boxBody.addShape(shape);
            boxBody.position.set(cube.position.x, cube.position.y, cube.position.z);
            boxBody.quaternion.copy(cube.quaternion);
            boxBody.__cube = cube;

            world.add(boxBody);

*/



            cubeCnt++;
            if(cubeCnt > 150){
                clearInterval(timer);
            }


    };

    var timer = setInterval(genCube,0);




        var drawScene = function(){

            gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
            gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

            gl.clearColor(0.3, 0.3, 0.3, 1.0);                      // Set clear color to black, fully opaque
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.

            scene.render(gl);


        };




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
                
        };



        resizeHandler();
        window.addEventListener('resize', resizeHandler);


        var fpsElement = $(".fps");

        var fpsCounter = new FpsCounter();


        var last = null;

        var error_occured = false;

        

        var trans = new Ammo.btTransform(); 




        var animator = function(){
            if(error_occured){
                return;
            }

            window.requestAnimationFrame(animator);

            try{
                fpsCounter.update();


                

                var now = Date.now();

                if(last){
                    var dt = (now - last) / 1000; // seconds



                    dynamicsWorld.stepSimulation(dt, 2);



                    for(var ii=0;ii<letterBodies.length;ii++){
                        var body = letterBodies[ii];
                        var motionState = body.getMotionState();
                        var motionState = body.getMotionState();
                        if (motionState) {
                            motionState.getWorldTransform(trans);

                            var letter = letterIndex[ii];

                            var origin = trans.getOrigin();
                            //console.log(origin);

                            letter.setPosition({x: origin.x(), y: origin.y(), z: origin.z()});

                            var rotation = trans.getRotation(); 

                            var quat = {x: rotation.x(), y: rotation.y(), z: rotation.z(), w: rotation.w()};

                            letter.setQuaternion(quat);



                            //console.log(rotation);                           

                            //console.log(letterIndex[ii],"world pos = " + [trans.getOrigin().x().toFixed(2), trans.getOrigin().y().toFixed(2), trans.getOrigin().z().toFixed(2)]);
                        }                       
                    }


                   /* bodies.forEach(function(body) {
                        console.log(body);
                        var motionState = body.getMotionState();
                      if (motionState) {
                        motionState.getWorldTransform(trans);



                        console.log("world pos = " + [trans.getOrigin().x().toFixed(2), trans.getOrigin().y().toFixed(2), trans.getOrigin().z().toFixed(2)]);
                      }
                    });
*/



                   /* for(var i=0; i!==world.bodies.length; i++){
                        var b = world.bodies[i],
                            p = b.position,
                            q = b.quaternion;
                            if(b.__cube){
                                var c = b.__cube;
                                c.setPosition(p);
                                c.setQuaternion(q);
                            }
                    }   */             


                }

                    last = now;
                


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
                        scene.viewAngle += 0.005;
        },1000/60);


        animator();








});








});
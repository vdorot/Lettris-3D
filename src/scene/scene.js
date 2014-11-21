
define(['./physics/physics'],
 function(Physics) {


    /**
     * @constructor
     */
    var Scene = function(){


        /**
         * [objects description]
         * @type {Array.<Mesh>}
         */


        this.layerIndex = {};
        this.objects = [];


        this.physics = new Physics();

    };

    Scene.prototype.getObjects = function(){
        return this.objects;
    };

    /**
     * This callback is displayed as a global member.
     * @callback layerBeforeRender
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {ShaderProgram} gl Shader program
     * @param {Mesh[]} objects Objects on layer
     */

    /**
     * This callback is displayed as a global member.
     * @callback layerBeforeObject
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {ShaderProgram} gl Shader program
     * @param {Mesh} objects Object to be rendered
     */


    /**
     * Add a scene layer
     * @param {string} name          Layer identifier
     * @param {layerBeforeRender} onBeforeRender Called before rendering the layer
     * @param {layerBeforeObject} onBeforeObject Called before rendering each object
     */
    Scene.prototype.addLayer = function(name, onBeforeRender, onBeforeObject){
        if(name in this.layerIndex){
            throw new Error("Layer "+name+" already exists");
        }

        var layer = {
            name: name,
            onBeforeRender: onBeforeRender,
            onBeforeObject: onBeforeObject,
            objects: []
        };
        this.layerIndex[name] = layer;
    };

    /**
     * Add object to scene
     * @param {(string|string[])} layers Layer identifier(s)
     * @param {(Mesh|Mesh[])} what  Object(s) to add
     */
    Scene.prototype.add = function(layer,what){
        if(arguments.length >2){
            var args = arguments.slice(1);
            for(var i in args){
                thia.add(layer,args[i]);
            }
        } else {
            if(what instanceof Array){
                for(var j in what){
                    this.add(layer,what[j]);
                }
                return;
            } else {
                if(!(layer in this.layerIndex)){
                    throw new Error("Layer "+layer+" does not exist");
                }
                var pos = this.objects.indexOf(what);
                if(pos === -1){
                    this.objects.push(what);
                }
                if(!(layer instanceof Array)){
                    layer = [layer];
                }
                for(var l in layer){
                    this.layerIndex[layer[l]].objects.push(what);
                }

                if(what.isPhysicsEnabled()){
                    this.physics.add(what);
                }

                //if physics enabled, add object to physics


            }
        }

    };

    Scene.prototype.remove = function(object){
        for(var i in this.layerIndex){
            var layer = this.layerIndex[i];
            var pos = layer.objects.indexOf(object);
            if(pos > -1){
                layer.objects.splice(pos,1);
            }
        }

        var pos2 = this.objects.indexOf(object);
        if(pos2 > 1){
            this.objects.splice(pos2,1);
        }

        if(object.isPhysicsEnabled()){
            this.physics.remove(object);
        }

    };

    /**
     * Render all layers and objects
     * @param  {WebGLRenderingContext} gl WebGL context
     * @param {string} layer Layer identifier
     */
    Scene.prototype.renderLayer = function(gl,layer, shaderProgram){


        layer = this.layerIndex[layer];

        if(layer === undefined){
            throw new Error("Cannot render layer, there is no layer "+layer);
        }


        if(layer.onBeforeRender){
            layer.onBeforeRender(gl,shaderProgram, layer.objects);
        }

        for(var j in layer.objects){
            if(layer.onBeforeObject){
                layer.onBeforeObject(gl,shaderProgram, layer.objects[i]);
            }
            layer.objects[j].render(gl,shaderProgram);
        }

        

    };




    return Scene;

});

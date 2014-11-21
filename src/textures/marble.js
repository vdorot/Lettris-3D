/***
 * @module textures
 */

define(['./texture','image!../../textures/marble.jpg!rel'], function(Texture, image) {



	//http://naldzgraphics.net/textures/free-textures-seamless-marble/

    /**
     * @constructor
     */
    var MarbleTexture = function(){
        Texture.call(this,"marble",image);
    };

    MarbleTexture.prototype = Object.create(Texture.prototype);
    MarbleTexture.prototype.constructor = Texture;

    return MarbleTexture;




});

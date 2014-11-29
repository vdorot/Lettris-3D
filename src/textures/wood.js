/***
 * @module textures
 */

define(['./texture','image!../../textures/wood.jpg!rel'], function(Texture, image) {




    /**
     * @constructor
     */
    var WoodTexture = function(){
        Texture.call(this,"wood",image);
    };

    WoodTexture.prototype = Object.create(Texture.prototype);
    WoodTexture.prototype.constructor = Texture;

    return WoodTexture;




});

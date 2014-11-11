/**
 * @module textures
 */

require(['../texture','image!./marble.jpg!rel'], function(Texture, image) {



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

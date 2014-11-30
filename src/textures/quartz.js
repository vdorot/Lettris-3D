/***
 * @module textures
 */

define(['./texture','image!../../textures/quartz2.jpg!rel'], function(Texture, image) {




    /**
     * @constructor
     */
    var QuartzTexture = function(){
        Texture.call(this,"quartz",image);
    };

    QuartzTexture.prototype = Object.create(Texture.prototype);
    QuartzTexture.prototype.constructor = Texture;

    return QuartzTexture;




});

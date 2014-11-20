/**
 * @module textures
 */

define([], function() {



    var Texture = function(name, image){
        this.name = name;

        this.image = image;

        this.handle = null;


    };


    Texture.prototype.prepare = function(gl){
    	var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.handle = tex;
    };

    Texture.prototype.getHandle = function(gl){
    	if(!this.handle){
    		this.prepare(gl);
		}
    	return this.handle;
    };

    return Texture;

});

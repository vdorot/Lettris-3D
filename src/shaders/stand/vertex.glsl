attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexUV;
attribute lowp float aVertexSide;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;
varying mediump vec2 vTexCoord;


void main(void) {

    gl_Position = uProjectionMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

    lowp vec3 faceColor;

    if(aVertexSide == 0.0){ //side of letter
    	faceColor = vec3(0.8,0.8,0.8);
    }else{
    	faceColor = vec3(0.8,0.1,0.1);
    }

    faceColor = faceColor + 0.0*aVertexNormal; //prevent aVertexNormal from being optimised away

    vColor = vec4(faceColor,1.0);

    vTexCoord = aVertexUV;
}
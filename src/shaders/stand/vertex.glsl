
attribute highp vec3 aVertexPosition;
attribute highp vec3 aVertexNormal;
attribute highp vec2 aVertexUV;
attribute lowp float aVertexSide;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying lowp vec3 vColor;
varying highp vec2 vTexCoord;

varying vec3 vNormalInterp;
varying vec3 vVertPos;


void main(void) {

    gl_Position = uProjectionMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

    lowp vec3 faceColor;

    if(aVertexSide == 0.0){ //side
    	faceColor = vec3(0.8,0.8,0.8);
    }else{
    	faceColor = vec3(0.1,0.4,0.8);
    }

    faceColor = faceColor + 0.0*aVertexNormal; //prevent aVertexNormal from being optimised away

    vColor = faceColor;

    vTexCoord = aVertexUV;

    vec4 vertPos4 = uModelMatrix * vec4(aVertexPosition, 1.0);
    vVertPos = vec3(vertPos4) / vertPos4.w;
    vNormalInterp = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
}

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexUV;
attribute lowp float aVertexSide;

uniform lowp vec3 uColor;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

uniform lowp float uSelected;
uniform lowp float uHighlighted;

varying lowp vec3 vColor;
varying mediump vec2 vTextureCoord;

varying vec3 vNormalInterp;
varying vec3 vVertPos;


void main(void) {

    gl_Position = uProjectionMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

    lowp vec3 faceColor;

    if(aVertexSide == 0.0){ //side of letter
        faceColor = vec3(uColor[0]*0.9,uColor[1]*0.9,uColor[2]*0.9);
    }
    else{
    	faceColor = vec3(uColor[0],uColor[1],uColor[2]);
    }
    

    if(uHighlighted == 1.0){
        if(aVertexSide == 0.0){ //side of letter
            faceColor = vec3(uColor[0]*0.25,uColor[1]*0.25,uColor[2]*0.25);
        }
        else{
            faceColor = vec3(uColor[0]*0.21,uColor[1]*0.21,uColor[2]*0.21);
        }
    }

    if(uSelected == 1.0){
        if(aVertexSide == 0.0){ //side of letter
            faceColor = vec3(uColor[0]*0.07,uColor[1]*0.07,uColor[2]*0.07);
        }
        else{
            faceColor = vec3(uColor[0]*0.04,uColor[1]*0.04,uColor[2]*0.04);
        }
    }

    faceColor = faceColor + 0.0*aVertexNormal; //prevent aVertexNormal from being optimised away

    vColor = faceColor;

    vTextureCoord = aVertexUV;

    vec4 vertPos4 = uModelMatrix * vec4(aVertexPosition, 1.0);
    vVertPos = vec3(vertPos4) / vertPos4.w;
    vNormalInterp = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
}
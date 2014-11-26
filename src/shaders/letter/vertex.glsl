attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexUV;
attribute lowp float aVertexSide;

uniform lowp vec3 uColor;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;

uniform lowp float uSelected;
uniform lowp float uHighlighted;

varying lowp vec4 vColor;
varying mediump vec2 vTextureCoord;


void main(void) {

    gl_Position = uProjectionMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

    lowp vec3 faceColor;

    if(aVertexSide == 0.0){ //side of letter
        faceColor = vec3(uColor[0]*0.85,uColor[1]*0.85,uColor[2]*0.85);
    }
    else{
    	faceColor = vec3(uColor[0],uColor[1],uColor[2]);
    }
    

    if(uHighlighted == 1.0){
        if(aVertexSide == 0.0){ //side of letter
            faceColor = vec3(uColor[0]*1.4,uColor[1]*1.4,uColor[2]*1.4);
        }
        else{
            faceColor = vec3(uColor[0]*1.45,uColor[1]*1.45,uColor[2]*1.45);
        }
    }

    if(uSelected == 1.0){
        if(aVertexSide == 0.0){ //side of letter
            faceColor = vec3(uColor[0]*1.8,uColor[1]*1.8,uColor[2]*1.8);
        }
        else{
            faceColor = vec3(uColor[0]*1.9,uColor[1]*1.9,uColor[2]*1.9);
        }
    }

    faceColor = faceColor + 0.0*aVertexNormal; //prevent aVertexNormal from being optimised away

    vColor = vec4(faceColor,1.0);
    //vColor = vec4(color,1.0);

    vTextureCoord = aVertexUV;
}
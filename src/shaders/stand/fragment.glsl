uniform sampler2D uTextureUnit;

varying lowp vec4 vColor;

varying mediump vec2 vTexCoord;

void main(void) {
    gl_FragColor = texture2D(uTextureUnit,vTexCoord);
}
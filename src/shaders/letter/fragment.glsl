precision mediump float;

uniform sampler2D uTextureUnit;

varying lowp vec3 vColor;
varying mediump vec2 vTexCoord;

varying vec3 vNormalInterp;
varying vec3 vVertPos;

uniform vec3 uLightPos;
const vec3 diffuseColor = vec3(0.2, 0.2, 0.2);
const vec3 specColor = vec3(1.0, 1.0, 1.0);

void main(void) {

  vec3 normal = normalize(vNormalInterp);
  vec3 lightDir = normalize(uLightPos - vVertPos);

  float lambertian = max(dot(lightDir,normal), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {

    vec3 viewDir = normalize(-vVertPos);

    //this is blinn phong
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, 16.0);
  
  }

  vec4 colorFinal;
  colorFinal = vec4(vColor + lambertian * diffuseColor + specular * specColor, 1.0);
    
  gl_FragColor = colorFinal * 0.5 * texture2D(uTextureUnit,vTexCoord);
}
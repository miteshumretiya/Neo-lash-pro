// Shared GLSL chunks for the Neo Lash WebGL layer.

/** Ashima Arts / Stefan Gustavson 3D simplex noise (MIT). */
export const simplex3 = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/** Signed distance to a rounded rectangle, used to clip planes to CSS radii. */
export const roundedRect = /* glsl */ `
float roundedAlpha(vec2 uv, vec2 size, float radius){
  vec2 p=(uv-0.5)*size;
  vec2 q=abs(p)-size*0.5+radius;
  float d=length(max(q,0.0))+min(max(q.x,q.y),0.0)-radius;
  return 1.0-smoothstep(-1.0,0.5,d);
}
`;

export const planeVertex = /* glsl */ `
uniform float uVelocity;
uniform float uTime;
varying vec2 vUv;
void main(){
  vUv=uv;
  vec3 pos=position;
  // Bend the plane along its width with scroll velocity.
  pos.y+=sin(uv.x*3.14159265)*uVelocity;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
}
`;

export const silkFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uSize;
uniform vec2 uMouse;
uniform float uHover;
uniform float uProgress;
uniform float uRadius;
uniform float uDetail;
uniform vec3 uBase;
uniform vec3 uSage;
uniform vec3 uBlush;
uniform vec3 uSand;
uniform vec3 uEnd;
varying vec2 vUv;
${simplex3}
${roundedRect}
float fbm(vec3 p){
  float a=0.5;
  float s=0.0;
  for(int i=0;i<4;i++){
    if(float(i)>=uDetail) break;
    s+=a*snoise(p);
    p=p*2.03+vec3(1.7,-3.1,0.9);
    a*=0.5;
  }
  return s;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  float aspect=uSize.x/uSize.y;
  vec2 p=(vUv-0.5)*vec2(aspect,1.0);
  vec2 m=(uMouse-0.5)*vec2(aspect,1.0);
  float t=uTime*0.032+uProgress*0.45;

  // A slow swirl around the cursor.
  vec2 d=p-m;
  float pull=exp(-dot(d,d)*3.5)*uHover;
  float ang=pull*0.8;
  p=m+mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*d;

  // Gentle domain warping: large, soft satin folds rather than marbling.
  vec2 s=p*0.55;
  vec2 q=vec2(fbm(vec3(s,t)),fbm(vec3(s+vec2(5.2,1.3),t+3.1)));
  vec2 r=vec2(fbm(vec3(s+1.4*q+vec2(1.7,9.2),t*1.2)),fbm(vec3(s+1.4*q+vec2(8.3,2.8),t*1.1)));
  float f=fbm(vec3(s+1.1*r,t*0.7));

  // Long diagonal ribbons give the fabric its direction.
  float ribbon=sin((p.x*1.1-p.y*0.75+r.x*1.3+f*0.9)*1.6+t*2.2);
  float fold=smoothstep(-0.3,1.0,ribbon);

  vec3 col=uBase;
  col=mix(col,uSand,smoothstep(-0.5,0.6,f)*0.7);
  col=mix(col,uSage,smoothstep(0.15,0.95,length(r))*0.42);
  col=mix(col,uBlush,smoothstep(0.3,0.95,q.y+0.3*f)*0.32);
  // Satin sheen along the folds, a soft shade in the troughs.
  col+=pow(fold,6.0)*0.075;
  col-=(1.0-fold)*0.018;
  // Quiet vignette for depth inside the frame.
  col*=mix(0.965,1.0,smoothstep(0.95,0.25,length((vUv-0.5)*vec2(1.0,1.2))));

  col=mix(col,uEnd,smoothstep(0.05,0.95,uProgress));
  col+=(hash(vUv*uSize+fract(uTime))-0.5)*(1.6/255.0);

  float alpha=roundedAlpha(vUv,uSize,uRadius);
  gl_FragColor=vec4(col,alpha);
}
`;

export const imageFragment = /* glsl */ `
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uSize;
uniform vec2 uImage;
uniform vec2 uMouse;
uniform float uHover;
uniform float uReveal;
uniform float uRadius;
uniform float uTime;
uniform vec3 uTint;
uniform float uUseTint;
varying vec2 vUv;
${roundedRect}
vec2 coverUv(vec2 uv,vec2 plane,vec2 image){
  float pr=plane.x/plane.y;
  float ir=image.x/image.y;
  vec2 scale=pr>ir?vec2(1.0,ir/pr):vec2(pr/ir,1.0);
  return (uv-0.5)*scale+0.5;
}
void main(){
  vec2 uv=vUv;
  // Ripple rings radiating from the pointer while hovered.
  vec2 aspect=vec2(uSize.x/uSize.y,1.0);
  vec2 d=(uv-uMouse)*aspect;
  float dist=length(d);
  float wave=sin(dist*28.0-uTime*5.0)*exp(-dist*5.0)*0.012*uHover;
  uv+=normalize(d+1e-4)*wave/aspect;
  // Gentle zoom on hover.
  uv=(uv-0.5)*(1.0-0.06*uHover)+0.5;
  vec2 tuv=coverUv(uv,uSize,uImage);
  float shift=0.0035*uHover;
  vec3 col=vec3(
    texture2D(uTexture,tuv+vec2(shift,0.0)).r,
    texture2D(uTexture,tuv).g,
    texture2D(uTexture,tuv-vec2(shift,0.0)).b
  );
  col=mix(col,col*uTint,uUseTint);

  // Wavy reveal from the bottom edge.
  float edge=uReveal*1.25-0.12+sin(vUv.x*9.0+uTime*1.5)*0.025;
  float revealMask=smoothstep(edge-0.06,edge,1.0-vUv.y);
  float alpha=roundedAlpha(vUv,uSize,uRadius)*(1.0-revealMask);
  gl_FragColor=vec4(col,alpha);
}
`;

export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uInfluence;
uniform float uSize;
uniform float uPixelRatio;
uniform float uReveal;
uniform float uScale;
attribute float aSeed;
attribute float aOrder;
varying float vAlpha;
${simplex3}
void main(){
  // Curve is authored in a unit box; scale it to the element width in pixels.
  vec3 pos=vec3(position.xy*uScale,position.z);
  float n=snoise(vec3(pos.xy*0.004,uTime*0.18+aSeed*3.0));
  pos.xy+=vec2(n,snoise(vec3(pos.yx*0.004+7.0,uTime*0.15)))*6.0;
  // Push particles away from the cursor; they drift back once it leaves.
  vec2 diff=pos.xy-uMouse;
  float dist=length(diff);
  float force=smoothstep(140.0,0.0,dist)*uInfluence;
  pos.xy+=normalize(diff+1e-4)*force*(60.0+aSeed*70.0);
  pos.z+=force*40.0;
  float shown=smoothstep(aOrder-0.08,aOrder,uReveal);
  vAlpha=(0.35+0.65*aSeed)*shown;
  gl_PointSize=uSize*(0.7+aSeed*0.9)*uPixelRatio*(1.0+force*0.6);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
}
`;

export const particlesFragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
varying float vAlpha;
void main(){
  vec2 c=gl_PointCoord-0.5;
  float d=length(c);
  float a=smoothstep(0.5,0.15,d)*vAlpha;
  if(a<0.01) discard;
  gl_FragColor=vec4(uColor,a);
}
`;

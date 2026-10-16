'use strict';

const defaultCartridge = {
  title: 'Neon Bastion',
  tagline: 'Hold the last electric line against a falling swarm.',
  controls: [
    { input: 'Arrow keys / WASD', action: 'Move the interceptor' },
    { input: 'Space', action: 'Fire pulse' },
    { input: 'Mouse / click', action: 'Aim and fire' },
    { input: 'R', action: 'Restart after a loss' }
  ],
  changeSummary: 'Factory cartridge loaded.',
  html: String.raw`<!doctype html><html><head><meta charset="utf-8"><title>Neon Bastion</title><style>*{box-sizing:border-box}html,body{margin:0;overflow:hidden;background:#020712;color:#d9ffff;font-family:monospace}canvas{display:block;width:100vw;height:100vh;outline:none;cursor:crosshair}</style></head><body><canvas id="game" tabindex="0"></canvas><script>
const c=document.getElementById('game'),x=c.getContext('2d'); let W,H,D=1,run=false,dead=false,last=0,score=0,shield=100,fire=0,spawn=0;
const keys={},p={x:0,y:0,down:false},ship={x:0,y:0,r:16},shots=[],bugs=[],stars=[];
function size(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);ship.x=W/2;ship.y=H*.79;for(let i=0;i<110;i++)stars[i]={x:Math.random()*W,y:Math.random()*H,z:Math.random()*2+1}}size();addEventListener('resize',size);
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key===' '&&!dead)run=true;if(e.key.toLowerCase()==='r'&&dead)reset()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
addEventListener('message',e=>{if(e.data&&e.data.type==='arcade-key'){const k=e.data.key.toLowerCase();if(k==='r'&&dead)reset();else if(k===' ')run=true;else {keys[k]=true;setTimeout(()=>keys[k]=false,120)}}});
c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();p.x=e.clientX-r.left;p.y=e.clientY-r.top});c.addEventListener('pointerdown',()=>{c.focus();p.down=true;run=true});c.addEventListener('pointerup',()=>p.down=false);
function reset(){score=0;shield=100;shots.length=bugs.length=0;spawn=fire=0;dead=false;run=true;ship.x=W/2;ship.y=H*.79}
function shot(tx,ty){const dx=tx-ship.x,dy=ty-ship.y,l=Math.hypot(dx,dy)||1;shots.push({x:ship.x,y:ship.y,vx:dx/l*620,vy:dy/l*620})}
function tick(dt){if(!run||dead)return;const mv=360*dt;if(keys.arrowleft||keys.a)ship.x-=mv;if(keys.arrowright||keys.d)ship.x+=mv;if(keys.arrowup||keys.w)ship.y-=mv;if(keys.arrowdown||keys.s)ship.y+=mv;ship.x=Math.max(20,Math.min(W-20,ship.x));ship.y=Math.max(H*.45,Math.min(H-20,ship.y));fire-=dt;spawn-=dt;if(spawn<=0){spawn=Math.max(.22,.85-score/6500);bugs.push({x:40+Math.random()*(W-80),y:-28,r:10+Math.random()*12,v:66+Math.random()*85+score/120,h:1+Math.floor(score/2300)})}if((keys[' ']||p.down)&&fire<=0){shot(p.x||ship.x, p.y||0);fire=.13}for(const s of shots){s.x+=s.vx*dt;s.y+=s.vy*dt}for(const b of bugs)b.y+=b.v*dt;for(let i=bugs.length-1;i>=0;i--){const b=bugs[i];if(b.y>H+30){bugs.splice(i,1);shield-=14;continue}for(let j=shots.length-1;j>=0;j--){const s=shots[j];if(Math.hypot(s.x-b.x,s.y-b.y)<b.r+6){b.h--;shots.splice(j,1);if(b.h<=0){bugs.splice(i,1);score+=125;break}}}}for(let i=shots.length-1;i>=0;i--)if(shots[i].y<-30||shots[i].x<-30||shots[i].x>W+30)shots.splice(i,1);if(shield<=0){shield=0;dead=true}}
function poly(cx,cy,r,n,rot=0){x.beginPath();for(let i=0;i<n;i++){let a=rot+i*Math.PI*2/n;let X=cx+Math.cos(a)*r,Y=cy+Math.sin(a)*r;i?x.lineTo(X,Y):x.moveTo(X,Y)}x.closePath()}
function draw(){x.fillStyle='#020712';x.fillRect(0,0,W,H);for(const s of stars){s.y+=s.z*.25;if(s.y>H)s.y=0;x.fillStyle='rgba(100,210,255,'+(s.z/3)+')';x.fillRect(s.x,s.y,s.z,s.z)}let g=x.createRadialGradient(ship.x,ship.y,1,ship.x,ship.y,190);g.addColorStop(0,'rgba(0,180,255,.11)');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(ship.x-190,ship.y-190,380,380);for(const b of bugs){x.save();x.shadowBlur=18;x.shadowColor='#ff2fb3';x.strokeStyle='#ff5cc8';x.lineWidth=2;poly(b.x,b.y,b.r,6,Math.PI/6);x.stroke();x.restore()}x.strokeStyle='#9dffff';x.shadowBlur=16;x.shadowColor='#00d9ff';x.lineWidth=2;for(const s of shots){x.beginPath();x.moveTo(s.x,s.y);x.lineTo(s.x-s.vx*.025,s.y-s.vy*.025);x.stroke()}x.save();x.translate(ship.x,ship.y);x.shadowBlur=22;x.shadowColor='#00eaff';x.strokeStyle='#54faff';x.lineWidth=2;poly(0,0,19,3,-Math.PI/2);x.stroke();x.fillStyle='rgba(20,180,255,.18)';x.fill();x.restore();x.shadowBlur=0;x.fillStyle='#9efbff';x.font='bold 14px monospace';x.fillText('SCORE '+String(score).padStart(6,'0'),22,30);x.fillText('SHIELD '+Math.ceil(shield)+'%',W-130,30);x.fillStyle='rgba(0,240,255,.35)';x.fillRect(W-130,38,100,4);x.fillStyle='#64faff';x.fillRect(W-130,38,shield,4);if(!run||dead){x.fillStyle='rgba(0,4,15,.72)';x.fillRect(0,0,W,H);x.textAlign='center';x.shadowBlur=20;x.shadowColor='#00eaff';x.fillStyle='#c9ffff';x.font='bold '+Math.min(36,W/15)+'px monospace';x.fillText(dead?'BASTION LOST':'NEON BASTION',W/2,H/2-18);x.shadowBlur=0;x.font='14px monospace';x.fillStyle='#7effb7';x.fillText(dead?'PRESS R TO REBOOT':'PRESS SPACE OR CLICK TO DEPLOY',W/2,H/2+22);x.textAlign='left'}}
function loop(t){const dt=Math.min(.035,(t-last)/1000||0);last=t;tick(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);c.focus();
</script></body></html>`
};

module.exports = { defaultCartridge };

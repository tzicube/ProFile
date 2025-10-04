/*** Animated counters ***/
function animateCount(el){
  const end = +el.dataset.count, dur = 1000, start = performance.now();
  function tick(t){
    const p = Math.min((t-start)/dur,1), n = end*p;
    el.textContent = (end%1 ? n.toFixed(2) : Math.round(n));
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
document.querySelectorAll('.stat .num').forEach(animateCount);

/*** Reveal animation ***/
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('show');
    io.unobserve(e.target);
  }
}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/*** Gallery reveal ***/
const gObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const d=(Number(e.target.dataset.delay)||0)*80;
      setTimeout(()=>e.target.classList.add('show'),d);
      gObserver.unobserve(e.target);
    }
  })
},{threshold:.18});
document.querySelectorAll('.gallery .gup').forEach((el,i)=>{
  el.dataset.delay=i; gObserver.observe(el);
});

/*** Card tilt ***/
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    const rx=((y/r.height)-.5)*10, ry=((x/r.width)-.5)*-10;
    card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='rotateX(0) rotateY(0)');
});


/*** Year auto update ***/
document.getElementById('y').textContent=new Date().getFullYear();

/*** Background particles ***/
const c=document.getElementById('p'),ctx=c.getContext('2d');let w,h,px,parts=[];
function resize(){w=c.width=innerWidth;h=c.height=innerHeight;px=Math.min(w,h)/800}
addEventListener('resize',resize,{passive:true});resize();
for(let i=0;i<120;i++){parts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.55,vy:(Math.random()-0.5)*0.55,r:Math.random()*2.2+0.6})}
function draw(){
  ctx.clearRect(0,0,w,h);
  for(const p of parts){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>w)p.vx*=-1;
    if(p.y<0||p.y>h)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r*px,0,Math.PI*2);
    const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5*px);
    g.addColorStop(0,"rgba(126,214,255,.9)");g.addColorStop(1,"rgba(124,86,255,0)");
    ctx.fillStyle=g;ctx.fill();
  }
  for(let i=0;i<parts.length;i++){
    for(let j=i+1;j<parts.length;j++){
      const a=parts[i],b=parts[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy);
      if(dist<120){
        ctx.strokeStyle="rgba(180,210,255,"+(1-dist/120)*.18+")";
        ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();
// ===== Contact: send form data to Google Sheet =====
// ===== Contact: send form data to Google Sheet =====
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwrJuw7rjVStTKFhh_kwG123kKKOeUSgYA_oweH9IIZYlNn0efs78sceW2uZSBXKmtZGg/exec';

(function () {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('sendBtn');
  const btnText = btn?.querySelector('.btnText');
  const status  = document.getElementById('formStatus');
  if (!form || !btn) return;

  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill out all fields.';
      return;
    }
    if (!isEmail(email)) {
      status.textContent = 'Invalid email address.';
      return;
    }

    btn.disabled = true;
    if (btnText) btnText.textContent = 'Sending...';
    status.textContent = '';

    try {
  const res = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
    mode: 'no-cors'   // ✅ thêm dòng này để không bị chặn phản hồi
  });

  status.textContent = 'Sent ✓';
  form.reset();
} catch (err) {
  status.textContent = 'Error: ' + err.message;
}

  }, true);
})();

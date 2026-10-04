(() => {
'use strict';
const scenes = [
['01-moonbound-hero','Moonbound Hero','Hood Inu flying toward a giant green moon, cape streaming behind him.'],
['02-rooftop-guardian','Rooftop Guardian','Hood Inu standing above a rain-soaked neon green city.'],
['03-coingecko-power-up','CoinGecko Power-Up','Hood Inu holding a glowing CoinGecko coin as green energy charges his armor.'],
['04-wall-street-takeover','Wall Street Takeover','Hood Inu striding through Wall Street in sunglasses and flying dollar bills.'],
['05-emerald-throne','Emerald Throne','Hood Inu sitting confidently on a black and emerald throne.'],
['06-green-candle-surfer','Green Candle Surfer','Hood Inu surfing a giant rising price candle.'],
['07-secret-headquarters','Secret Headquarters','Hood Inu studying a holographic map in an underground command center.'],
['08-hooded-samurai','Hooded Samurai','Hood Inu drawing a glowing green katana under midnight cherry blossoms.'],
['09-victory-punch','Victory Punch','Hood Inu smashing through concrete with a burst of lime lightning.'],
['10-beach-millionaire','Beach Millionaire','Hood Inu in sunglasses relaxing with a tropical drink on a beach.'],
['11-rocket-rider','Rocket Rider','Hood Inu riding a lime and black rocket above Earth.'],
['12-luxury-getaway','Luxury Getaway','Hood Inu leaning against a lime supercar outside a futuristic penthouse.'],
['13-training-arc','Training Arc','Hood Inu lifting enormous weights in a gritty gym.'],
['14-tiny-hero-huge-shadow','Tiny Hero, Huge Shadow','A puppy Hood Inu in an oversized hood casting a giant superhero shadow.'],
['15-portal-entrance','Portal Entrance','Hood Inu stepping out of a swirling green portal and reaching forward.']
];
const gallery = document.getElementById('gallery');
scenes.forEach(([slug,title,alt],index) => {
  const card = document.createElement('button'); card.className='art-card reveal'; card.type='button';card.setAttribute('aria-label',`View ${title}`);
  const img=document.createElement('img'); img.src=`assets/generated/${slug}.png`;img.alt=alt;img.loading='lazy';img.decoding='async';
  const caption=document.createElement('div');caption.className='art-caption';const label=document.createElement('strong');label.textContent=title;const count=document.createElement('span');count.textContent=String(index+1).padStart(2,'0');caption.append(label,count);card.append(img,caption);card.addEventListener('click',()=>openArt(index));gallery.append(card);
});
const dialog=document.getElementById('art-dialog');let activeArt=0;
function showArt(index){activeArt=(index+scenes.length)%scenes.length;const [slug,title,alt]=scenes[activeArt];document.getElementById('dialog-image').src=`assets/generated/${slug}.png`;document.getElementById('dialog-image').alt=alt;document.getElementById('dialog-title').textContent=title;document.getElementById('dialog-count').textContent=`${String(activeArt+1).padStart(2,'0')} / 15`;}
function openArt(index){showArt(index);dialog.showModal();document.body.style.overflow='hidden';}
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.style.overflow='';});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.getElementById('previous-art').addEventListener('click',()=>showArt(activeArt-1));document.getElementById('next-art').addEventListener('click',()=>showArt(activeArt+1));dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')showArt(activeArt-1);if(e.key==='ArrowRight')showArt(activeArt+1);});
const menu=document.querySelector('.menu-toggle'),navigation=document.getElementById('navigation');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');}});
const config=window.HOOD_CONFIG||{};
function safeURL(value){try{const url=new URL(value);return url.protocol==='https:'?url:null;}catch{return null;}}
if(config.contract){document.getElementById('contract-address').textContent=config.contract;const copy=document.getElementById('copy-contract');copy.disabled=false;copy.textContent='Copy contract';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(config.contract);copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy contract',2000);}catch{copy.textContent='Select address to copy';}});}
const pair=safeURL(config.dexscreenerPairUrl);
if(pair && pair.hostname==='dexscreener.com' && /^\/[^/]+\/[^/]+\/?$/.test(pair.pathname)){const embed=new URL(pair);embed.search='';embed.searchParams.set('embed','1');embed.searchParams.set('theme','dark');embed.searchParams.set('trades','0');embed.searchParams.set('info','0');const iframe=document.createElement('iframe');iframe.src=embed.href;iframe.title='Hood Inu live chart on Dexscreener';iframe.loading='lazy';iframe.allow='clipboard-write';document.getElementById('chart-container').replaceChildren(iframe);document.querySelectorAll('a[href*="dexscreener.com"]').forEach(a=>a.href=pair.href);}
const uni=safeURL(config.uniswapUrl);if(uni && uni.hostname==='app.uniswap.org')document.querySelectorAll('a[href*="app.uniswap.org"]').forEach(a=>a.href=uni.href);
const x=safeURL(config.xUrl);if(x && x.hostname==='x.com')document.querySelectorAll('a[href*="x.com"]').forEach(a=>a.href=x.href);
document.getElementById('year').textContent=new Date().getFullYear();
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window && !reduceMotion.matches){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
const progress=document.querySelector('.scroll-progress');let scrollQueued=false;function updateProgress(){const height=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${height>0?scrollY/height*100:0}%`;scrollQueued=false;}addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});updateProgress();
const canvas=document.getElementById('atmosphere'),ctx=canvas.getContext('2d');let width,height,particles=[],frame=0,last=0;
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:width<760?18:38},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.4+.3,speed:Math.random()*.3+.12,alpha:Math.random()*.4+.1}));}
function draw(time){if(document.hidden||reduceMotion.matches){frame=0;return;}if(time-last>32){ctx.clearRect(0,0,width,height);particles.forEach(p=>{p.y-=p.speed;p.x+=Math.sin(p.y/140)*.08;if(p.y<0)p.y=height;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(185,246,55,${p.alpha})`;ctx.fill();});last=time;}frame=requestAnimationFrame(draw);}
function resume(){if(!document.hidden&&!reduceMotion.matches&&!frame)frame=requestAnimationFrame(draw);else if(reduceMotion.matches){cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,width,height);}}
resize();addEventListener('resize',resize);document.addEventListener('visibilitychange',resume);reduceMotion.addEventListener('change',resume);resume();
})();

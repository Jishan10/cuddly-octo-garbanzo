const songs = [ 
    { 
        title: "My Song", 
        artist: "My Artist", 
        album: "My Album", 
        duration: "3:25", 
        src: "songs/Song1.mp3",
        covers: "covers/image1.jfif"
    },
    {
        title: "My Song",
        artist: "My Artist",
        album: "My Album",
        duration: "4:10",
        src: "songs/Song2.mp3" 
    }
]

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
let current = 0, shuffled = false, repeated = false;

function render(list=songs){
  document.getElementById("trackList").innerHTML = list.map((s,i)=>trackHTML(s,i)).join("");
  document.getElementById("libraryList").innerHTML = songs.map((s,i)=>trackHTML(s,i)).join("");
  document.getElementById("searchResults").innerHTML = list.map((s,i)=>trackHTML(s,i)).join("");
  document.getElementById("cards").innerHTML = songs.slice(0,6).map((s,i)=>`
    <div class="card" data-index="${i}">
      <div class="cover">♪</div><strong>${s.title}</strong><span>${s.artist}</span>
    </div>`).join("");
  bindTrackClicks();
}
function trackHTML(s,i){
  return `<div class="track ${i===current?"active":""}" data-index="${i}">
    <div class="track-number">${i+1}</div>
    <div class="track-info"><strong>${s.title}</strong><span>${s.artist} · ${s.album}</span></div>
    <div class="track-time">${s.duration}</div>
  </div>`;
}
function loadSong(i,autoplay=true){
  current=(i+songs.length)%songs.length;
  const s=songs[current];
  audio.src=s.src;
  document.getElementById("nowTitle").textContent=s.title;
  document.getElementById("nowArtist").textContent=`${s.artist} · ${s.album}`;
  document.getElementById("nowCover").textContent="♪";
  render();
  if(autoplay){audio.play().catch(()=>{});}
}
function togglePlay(){
  if(!audio.src) loadSong(current,false);
  if(audio.paused){audio.play().catch(()=>{});} else audio.pause();
}
function next(){
  let n=shuffled ? Math.floor(Math.random()*songs.length) : current+1;
  if(shuffled && songs.length>1 && n===current) n=(n+1)%songs.length;
  loadSong(n,true);
}
function prev(){ if(audio.currentTime>3) audio.currentTime=0; else loadSong(current-1,true); }
function fmt(t){if(!isFinite(t))return"0:00";return Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");}

audio.addEventListener("play",()=>playBtn.textContent="Ⅱ");
audio.addEventListener("pause",()=>playBtn.textContent="▶");
audio.addEventListener("loadedmetadata",()=>document.getElementById("duration").textContent=fmt(audio.duration));
audio.addEventListener("timeupdate",()=>{
  document.getElementById("currentTime").textContent=fmt(audio.currentTime);
  progress.value=audio.duration?(audio.currentTime/audio.duration)*100:0;
});
audio.addEventListener("ended",()=> repeated ? loadSong(current,true) : next());
progress.addEventListener("input",()=>{if(audio.duration)audio.currentTime=(progress.value/100)*audio.duration});
volume.addEventListener("input",()=>audio.volume=volume.value);
playBtn.addEventListener("click",togglePlay);
document.getElementById("next").addEventListener("click",next);
document.getElementById("prev").addEventListener("click",prev);
document.getElementById("shuffle").addEventListener("click",()=>{shuffled=!shuffled;document.getElementById("shuffle").style.opacity=shuffled?1:.55});
document.getElementById("repeat").addEventListener("click",()=>{repeated=!repeated;document.getElementById("repeat").style.opacity=repeated?1:.55});
document.getElementById("heroPlay").addEventListener("click",()=>{if(!audio.src)loadSong(0,true);else togglePlay()});
document.getElementById("shuffleBtn").addEventListener("click",()=>{shuffled=true;loadSong(Math.floor(Math.random()*songs.length),true)});
document.getElementById("likeBtn").addEventListener("click",e=>e.currentTarget.textContent=e.currentTarget.textContent==="♡"?"♥":"♡");

function bindTrackClicks(){
  document.querySelectorAll("[data-index]").forEach(el=>el.addEventListener("click",()=>loadSong(Number(el.dataset.index),true)));
}
document.getElementById("searchInput").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();
  const results=songs.filter(s=>(s.title+" "+s.artist+" "+s.album).toLowerCase().includes(q));
  document.getElementById("searchResults").innerHTML=results.map(s=>trackHTML(s,songs.indexOf(s))).join("");
  bindTrackClicks();
  if(q) showView("search");
});
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
function showView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
  document.getElementById(name+"View").classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
}
document.getElementById("back").onclick=()=>history.back();
document.getElementById("forward").onclick=()=>history.forward();
audio.volume=.8;
render();

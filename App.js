const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let sustain = false;
let activeNodes = [];

function openPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
}

/* Sustain Pedal */
document.addEventListener("keydown", e=>{
  if(e.code==="Space") sustain=true;
});
document.addEventListener("keyup", e=>{
  if(e.code==="Space"){
    sustain=false;
    activeNodes.forEach(node=>node.stop());
    activeNodes=[];
  }
});

/* Piano Notes (Main Octave) */
const notes = {
  C4:261.63,
  D4:293.66,
  E4:329.63,
  F4:349.23,
  G4:392.00,
  A4:440.00,
  B4:493.88,
  C5:523.25
};

function createPiano(containerId){
  let container=document.getElementById(containerId);
  for(let note in notes){
    let key=document.createElement("div");
    key.classList.add("key");
    key.innerText=note;

    key.addEventListener("mousedown",()=>playPiano(notes[note],key));
    container.appendChild(key);
  }
}

createPiano("pianoKeys");
createPiano("pianoKeysPan");

/* Clean Piano Sound */
function playPiano(freq,key){
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  osc.type = "triangle"; // softer piano-like tone
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.4,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime+1);

  if(sustain) activeNodes.push(osc);

  key.classList.add("active");
  setTimeout(()=>key.classList.remove("active"),200);
}

/* Drum Pads */
const drums = {
  Kick:80,
  Snare:180,
  HiHat:300,
  Tom:120
};

function createDrums(containerId){
  let container=document.getElementById(containerId);
  for(let drum in drums){
    let pad=document.createElement("div");
    pad.classList.add("drum");
    pad.innerText=drum;

    pad.addEventListener("mousedown",()=>playDrum(drums[drum],pad));
    container.appendChild(pad);
  }
}

createDrums("drumSet");
createDrums("drumSetPan");

/* Separate Drum Engine */
function playDrum(freq,pad){
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  osc.type="square"; // punchy drum tone
  osc.frequency.value=freq;

  gain.gain.setValueAtTime(0.8,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.4);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime+0.4);

  pad.classList.add("active");
  setTimeout(()=>pad.classList.remove("active"),200);
}

const canvas = document.getElementById('sineCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;


let amplitude = 50;
let frequency = 0.05;
let phase = 0;
let speed = 0.4;


const waveforms = ["sine", "square", "triangle", "sawtooth"];
let currentWaveIndex = 0;
let currentWaveform = waveforms[currentWaveIndex];


const graphBtn = document.getElementById("graph");
graphBtn.addEventListener("click", () => {
    currentWaveIndex = (currentWaveIndex + 1) % waveforms.length;
    currentWaveform = waveforms[currentWaveIndex];
});


function getY(x) {
    const t = frequency * x + phase;
    switch (currentWaveform) {
        case "sine":
            return height / 2 + amplitude * Math.sin(t);
        case "square":
            return height / 2 + amplitude * (Math.sin(t) >= 0 ? 1 : -1);
        case "triangle":
            return height / 2 + (2 * amplitude / Math.PI) * Math.asin(Math.sin(t));
        case "sawtooth":
            return height / 2 + (2 * amplitude / Math.PI) * (t % (2 * Math.PI) - Math.PI);
        default:
            return height / 2;
    }
}



// verciu dip
const ampValue = document.getElementById('ampValue');
const freqValue = document.getElementById('freqValue');
const speedValue = document.getElementById('speedValue');

function updateDisplay() {
  ampValue.textContent = amplitude.toFixed(0);
  freqValue.textContent = frequency.toFixed(3);
  speedValue.textContent = speed.toFixed(2);
}



// Mygtukai ir ju funkt
const ampPlus = document.getElementById('ampPlus');
const ampMinus = document.getElementById('ampMinus');
const freqPlus = document.getElementById('fPlus');
const freqMinus = document.getElementById('fMinus');
const speedPlus = document.getElementById('spPlus');
const speedMinus = document.getElementById('spMinus');

const Reset = document.getElementById('reset');

ampPlus.addEventListener('click', () => { amplitude += 5; });
ampMinus.addEventListener('click', () => { amplitude = Math.max(0, amplitude - 5); });

freqPlus.addEventListener('click', () => { frequency += 0.01; });
freqMinus.addEventListener('click', () => { frequency = Math.max(0, frequency - 0.01); });

speedPlus.addEventListener('click', () => { speed += 0.02; });
speedMinus.addEventListener('click', () => { speed = Math.max(0, speed - 0.02); });

Reset.addEventListener('click', () => {currentWaveform = 'sine'; amplitude = 50; speed = 0.4; frequency = 0.05; currentColorIndex = 0; WaweColor = wavecolors[currentColorIndex]});


const wavecolors = ["#000000ff", "#b9df0eff;", "#c40000ff", "#0c0091ff", "#00aa1cff", "#00a87bff", "#650054ff", "#FF5733","#33FF57","#3357FF","#FF33A8","#33FFF6","#F6FF33","#FF8C33","#8C33FF","#FF3333","#33FF8C"];
let currentColorIndex = 0;
let WaweColor = wavecolors[currentColorIndex];

const colorBtn = document.getElementById("color");
colorBtn.addEventListener("click", () => {
    currentColorIndex = (currentColorIndex + 1) % wavecolors.length;
    WaweColor = wavecolors[currentColorIndex];
});






function drawWave() {
    ctx.clearRect(0, 0, width, height);

    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.stroke();

    
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const y = getY(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = WaweColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    
    phase += speed;

    updateDisplay();

    requestAnimationFrame(drawWave);
}


drawWave();

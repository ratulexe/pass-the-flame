// All sound is synthesised with Web Audio; the app ships no audio files.

const STORAGE_KEY = 'ptf-sound-muted';
const MASTER_GAIN = 0.8;
const BELL_PARTIALS = [
  [1, 1, 2.6],
  [2.76, 0.45, 1.4],
  [5.4, 0.22, 0.8],
  [8.93, 0.1, 0.5],
];
// Raag Bhupali: Sa Re Ga Pa Dha across two octaves.
const BHUPALI = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
const BHUPALI_STEPS = [-2, -1, -1, 1, 1, 2];

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeMuted(muted) {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch {
    // Private windows can block storage; the toggle still works for this visit.
  }
}

let ctx = null;
let master = null;
let wet = null;
let noiseBuffer = null;
let muted = readMuted();
let ambientStarted = false;

function buildGraph() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  try {
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_GAIN;
    const compressor = ctx.createDynamicsCompressor();
    master.connect(compressor);
    compressor.connect(ctx.destination);

    // Echo send that gives the bells their courtyard feel.
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.33;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 2400;
    delay.connect(lowpass);
    lowpass.connect(feedback);
    feedback.connect(delay);
    lowpass.connect(master);
    wet = ctx.createGain();
    wet.gain.value = 0.35;
    wet.connect(delay);

    const length = ctx.sampleRate * 2;
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) channel[i] = Math.random() * 2 - 1;

    // Stop the drone when the visitor switches away from the app.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') ctx.suspend().catch(() => {});
      else ctx.resume().catch(() => {});
    });
  } catch {
    ctx = null;
  }
}

/** Must run inside a user gesture: browsers keep audio locked until then. */
function unlock() {
  if (!ctx) buildGraph();
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
}

function bell(frequency, volume = 0.1, when = 0) {
  if (!ctx) return;
  const t = ctx.currentTime + when;
  BELL_PARTIALS.forEach(([ratio, gain, duration]) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = frequency * ratio;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(volume * gain, t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(env);
    env.connect(master);
    env.connect(wet);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  });
}

function noise(duration, type, fromHz, toHz, volume, when = 0, q = 1) {
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(fromHz, t);
  filter.frequency.exponentialRampToValueAtTime(toHz, t + duration);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  source.connect(filter);
  filter.connect(env);
  env.connect(master);
  source.start(t, Math.random());
  source.stop(t + duration + 0.05);
}

export const sound = {
  unlock,

  get muted() {
    return muted;
  },

  setMuted(value) {
    muted = value;
    writeMuted(value);
    if (ctx) master.gain.setTargetAtTime(value ? 0 : MASTER_GAIN, ctx.currentTime, 0.05);
  },

  ignite() {
    noise(0.5, 'bandpass', 300, 2200, 0.25, 0, 0.8);
    bell(659.25, 0.12, 0.15);
    bell(987.77, 0.08, 0.45);
  },

  /** Plays one note of the Bhupali scale. */
  note(index) {
    bell(BHUPALI[index % BHUPALI.length], 0.14);
  },

  /** A rising run up the scale. */
  flourish() {
    BHUPALI.forEach((frequency, i) => bell(frequency, 0.09, i * 0.12));
  },

  whoosh() {
    noise(1.8, 'bandpass', 200, 1400, 0.12, 0, 0.6);
  },

  launch() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.8);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.022, t + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + 0.9);
    noise(0.7, 'highpass', 2000, 4000, 0.03);
  },

  boom(size = 1) {
    noise(1.2 * size, 'lowpass', 1600, 120, 0.5 * Math.min(1.2, size));
    for (let i = 0; i < 9; i++) {
      noise(0.03, 'highpass', 3000, 5000, 0.05 + Math.random() * 0.05, 0.25 + Math.random() * 1.1);
    }
  },

  /** Tanpura-like drone on Sa and Pa, with soft bells wandering through Bhupali. */
  ambient() {
    if (!ctx || ambientStarted) return;
    ambientStarted = true;
    const t = ctx.currentTime;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 520;
    lowpass.Q.value = 2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.045, t + 3);
    lowpass.connect(gain);
    gain.connect(master);
    [130.81, 196, 261.63, 131.2].forEach((frequency) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = frequency;
      osc.connect(lowpass);
      osc.start();
    });
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();

    let note = 2;
    const step = () => {
      if (!muted && document.visibilityState === 'visible') {
        const move = BHUPALI_STEPS[Math.floor(Math.random() * BHUPALI_STEPS.length)];
        note = Math.max(0, Math.min(BHUPALI.length - 1, note + move));
        bell(BHUPALI[note], 0.04);
      }
      setTimeout(step, 650 + Math.random() * 1100);
    };
    setTimeout(step, 1200);
  },
};

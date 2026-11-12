/**
 * One shared Web Audio context. Browsers only allow audio after a user gesture,
 * so this is created when the player presses PLAY.
 */
let audio = null;

export function initAudio() {
  if (audio) {
    audio.ctx.resume();
    return;
  }
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    // One second of white noise, reused by every gunshot and explosion.
    const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    audio = { ctx, master, noise };
  } catch {
    audio = null;
  }
}

/** @returns {{ctx: AudioContext, master: GainNode, noise: AudioBuffer} | null} */
export const getAudio = () => audio;

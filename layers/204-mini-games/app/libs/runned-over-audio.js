
/* responsibility */

// Plays the synthesized sound effects
// of the Runned Over minigame.


let audioContext;


function getAudioContext() {

  if (import.meta.server) {
    return null;
  }


  if (!audioContext) {
    audioContext = new AudioContext();
  }


  return audioContext;

}

export function playBeep(frequency, duration, gainValue) {

  const context = getAudioContext();

  if (!context) {
    return;
  }


  if (context.state === 'suspended') {
    context.resume();
  }


  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  gain.gain.value = gainValue;

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);

}

export function closeAudioContext() {
  audioContext?.close();
  audioContext = undefined;
}

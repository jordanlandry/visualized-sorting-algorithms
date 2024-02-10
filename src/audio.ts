const audioContext = new window.AudioContext();

async function loadAudio(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

let currentSource: AudioBufferSourceNode | null = null;

function playSound(buffer: AudioBuffer, rate: number) {
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain(); // Create a GainNode

  if (currentSource) {
    currentSource.stop();
  }
  
  
  source.buffer = buffer;
  source.playbackRate.value = rate;
  
  gainNode.gain.value = 0.01;
  gainNode.connect(audioContext.destination);
  source.connect(audioContext.destination);
  source.start();

  currentSource = source;
}

// Load the audio file
const audioUrl = "audio.wav";
let audioBuffer;

export const startAudio = () =>
  loadAudio(audioUrl)
    .then((buffer) => (audioBuffer = buffer))
    .catch((error) => {
      console.error("Error loading audio file:", error);
    });


export const playAudio = (rate: number) => {
  playSound(audioBuffer!, rate);
}

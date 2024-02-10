import "./style.css";
import { properties } from "./properties";
import { getRandomInt } from "./util/randomInt";
import { sort } from "./sort";
import { startAudio, playAudio } from "./audio";
import { sleep } from "./util/sleep";

// Creating the canvas
const canv = document.createElement("canvas") as HTMLCanvasElement;
const ctx = canv.getContext("2d") as CanvasRenderingContext2D;
const app = document.getElementById("app") as HTMLElement;
app.appendChild(canv);

// Drawing helpers
const clear = () => ctx.clearRect(0, 0, canv.width, canv.height);
const drawBg = () => {
  ctx.fillStyle = properties.bg;
  ctx.fillRect(0, 0, canv.width, canv.height);
};

// Drawing a bar
const barWidth = 5;
export const drawBar = (
  x: number,
  index: number,
  color = properties.unsortedColor,
  shouldPlayAudio = false
) => {
  ctx.fillStyle = color;
  ctx.fillRect(index * barWidth, canv.height - x, barWidth, x);

  // Draw the border
  ctx.strokeStyle = properties.bg;
  ctx.lineWidth = 1;
  ctx.strokeRect(index * barWidth, canv.height - x, barWidth, x);

  if (shouldPlayAudio) {
    const rate = (x / canv.height) * 2 + 0.5;
    playAudio(rate);
  }
};

export const drawBars = async (arr: number[], i: number, min: number) => {
  // Clear canvas and draw background before each frame
  clear();
  drawBg();

  // Draw bars
  arr.forEach((bar, index) => {
    if (index === i) drawBar(bar, index, properties.sortedColor, true);
    else if (index === min) drawBar(bar, index, properties.selectedColor);
    else drawBar(bar, index);
  });
};

export const playSortedArray = async (arr: number[]) => {
  const len = arr.length;

  // Draw them all in unsorted color first
  arr.forEach((bar, index) => drawBar(bar, index));

  for (let i = 0; i < len; i++) {
    drawBar(arr[i], i, properties.sortedColor, true); 
    await sleep(properties.delay); // Delay for visualization
  }
};

let bars: number[] = [];

let audioLoaded = false;
// Initial setup
const init = async () => {
  if (!audioLoaded) await startAudio();
  audioLoaded = true;

  canv.width = window.innerWidth;
  canv.height = window.innerHeight;

  clear();
  drawBg();

  // Get some bars
  const barCount = Math.floor(canv.width / barWidth);
  bars = [];
  for (let i = 0; i < barCount; i++) {
    bars.push(getRandomInt(1, canv.height));
  }

  // Draw the bars
  bars.forEach((bar, index) => drawBar(bar, index));
};

init();

// Re-initialize on window resize
window.addEventListener("resize", init);

// Sort the bars
window.addEventListener("keydown", async (e) => {
  if (e.key === " ") sort(bars);
});

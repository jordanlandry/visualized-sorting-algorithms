import { drawBars, playSortedArray } from "./main";
import { properties } from "./properties";
import { sleep } from "./util/sleep";

export async function sort(arr: number[]) {
  const deep = arr.slice();
  const sorted = deep.sort((a, b) => a - b);

  if (JSON.stringify(arr) === JSON.stringify(sorted)) {
    return;
  }

  const sortingMethods = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort,
    shell: shellSort,
    heap: heapSort,
    radix: radixSort,
    cocktail: cocktailSort,
    gnome: gnomeSort,
    stooge: stoogeSort,
    comb: combSort,
    pancake: pancakeSort,
    cycle: cycleSort,
    bogo: bogoSort,
    bitonic: bitonicSort,
  } as Record<string, (arr: number[]) => Promise<void>>;

  const method = sortingMethods[properties.sortedMethod];
  if (!method) {
    throw new Error(`Sorting method ${properties.sortedMethod} not found`);
  }

  await method(arr);
  await playSortedArray(sorted);
}

const selectionSort = async (arr: number[]) => {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
    await drawBars(arr, i, min);
    await sleep(properties.delay);
  }
};

const bubbleSort = async (arr: number[]) => {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        await drawBars(arr, j, j + 1); // Visualize the swapping
        await sleep(properties.delay); // Delay for visualization
      }
    }
  }
};

const insertionSort = async (arr: number[]) => {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      await drawBars(arr, j + 1, j); // Visualize the swapping
      await sleep(properties.delay); // Delay for visualization
      j--;
    }
    arr[j + 1] = current;
    await drawBars(arr, j + 1, i); // Visualize the insertion
    await sleep(properties.delay); // Delay for visualization
  }
};

const mergeSort = async (arr: number[], left: number = 0, right: number = arr.length - 1) => {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(arr, left, mid);
  await mergeSort(arr, mid + 1, right);
  await merge(arr, left, mid, right);
};

const merge = async (arr: number[], left: number, mid: number, right: number) => {
  const temp: number[] = [];
  let i = left, j = mid + 1, k = 0;
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
  }
  while (i <= mid) {
    temp[k++] = arr[i++];
  }
  while (j <= right) {
    temp[k++] = arr[j++];
  }
  for (let p = 0; p < k; p++) {
    arr[left + p] = temp[p];
    await drawBars(arr, left + p, left + p); // Visualize the merging
    await sleep(properties.delay); // Delay for visualization
  }
};

const quickSort = async (arr: number[], low: number = 0, high: number = arr.length - 1) => {
  if (low < high) {
    const pivot = await partition(arr, low, high);
    await quickSort(arr, low, pivot - 1);
    await quickSort(arr, pivot + 1, high);
  }
};

const partition = async (arr: number[], low: number, high: number) => {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      await drawBars(arr, i, j); // Visualize the swapping
      await sleep(properties.delay); // Delay for visualization
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  await drawBars(arr, i + 1, high); // Visualize the pivot placement
  await sleep(properties.delay); // Delay for visualization
  return i + 1;
};


const shellSort = async (arr: number[]) => {
  const len = arr.length;
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < len; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        await drawBars(arr, j, j - gap); // Visualize the swapping
        await sleep(properties.delay); // Delay for visualization
        j -= gap;
      }
      arr[j] = temp;
      await drawBars(arr, j, i); // Visualize the insertion
      await sleep(properties.delay); // Delay for visualization
    }
  }
};

const heapSort = async (arr: number[]) => {
  const len = arr.length;

  const heapify = async (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      await drawBars(arr, i, largest); // Visualize the swapping
      await sleep(properties.delay); // Delay for visualization
      await heapify(arr, n, largest);
    }
  };

  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    await heapify(arr, len, i);
  }

  for (let i = len - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    await drawBars(arr, 0, i); // Visualize the swapping
    await sleep(properties.delay); // Delay for visualization
    await heapify(arr, i, 0);
  }
};

const radixSort = async (arr: number[]) => {
  const getMax = (arr: number[]) => {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  };

  const countSort = async (arr: number[], exp: number) => {
    const output: number[] = new Array(arr.length);
    const count: number[] = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
      count[Math.floor(arr[i] / exp) % 10]--;
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      await drawBars(arr, i, i); // Visualize the sorting
      await sleep(properties.delay); // Delay for visualization
    }
  };

  const max = getMax(arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countSort(arr, exp);
  }
};


const cocktailSort = async (arr: number[]) => {
  const len = arr.length;
  let swapped = true;
  let start = 0;
  let end = len - 1;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        await drawBars(arr, i, i + 1); // Visualize the swapping
        await sleep(properties.delay); // Delay for visualization
        swapped = true;
      }
    }

    if (!swapped) break;

    swapped = false;
    end--;

    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        await drawBars(arr, i, i + 1); // Visualize the swapping
        await sleep(properties.delay); // Delay for visualization
        swapped = true;
      }
    }

    start++;
  }
};

const gnomeSort = async (arr: number[]) => {
  let index = 0;
  const len = arr.length;

  while (index < len) {
    if (index === 0 || arr[index] >= arr[index - 1]) {
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      await drawBars(arr, index, index - 1); // Visualize the swapping
      await sleep(properties.delay); // Delay for visualization
      index--;
    }
  }
};

const stoogeSort = async (arr: number[], low: number = 0, high: number = arr.length - 1) => {
  if (low >= high) return;

  if (arr[low] > arr[high]) {
    [arr[low], arr[high]] = [arr[high], arr[low]];
    await drawBars(arr, low, high); // Visualize the swapping
    await sleep(properties.delay); // Delay for visualization
  }

  if (high - low + 1 > 2) {
    const t = Math.floor((high - low + 1) / 3);
    await stoogeSort(arr, low, high - t);
    await stoogeSort(arr, low + t, high);
    await stoogeSort(arr, low, high - t);
  }
};

const combSort = async (arr: number[]) => {
  const len = arr.length;
  let gap = len;
  let swapped = true;

  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / 1.3)); // Shrink gap
    swapped = false;

    for (let i = 0; i + gap < len; i++) {
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]]; // Swap elements
        await drawBars(arr, i, i + gap); // Visualize the swapping
        await sleep(properties.delay); // Delay for visualization
        swapped = true;
      }
    }
  }
};

const pancakeSort = async (arr: number[]) => {
  const len = arr.length;

  const flip = async (arr: number[], i: number) => {
    let start = 0;
    while (start < i) {
      [arr[start], arr[i]] = [arr[i], arr[start]]; // Swap elements
      await drawBars(arr, start, i); // Visualize the swapping
      await sleep(properties.delay); // Delay for visualization
      start++;
      i--;
    }
  };

  for (let end = len - 1; end > 0; end--) {
    let maxIndex = 0;
    for (let i = 1; i <= end; i++) {
      if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
      }
    }

    if (maxIndex !== end) {
      await flip(arr, maxIndex);
      await flip(arr, end);
    }
  }
};

const cycleSort = async (arr: number[]) => {
  const len = arr.length;

  for (let cycleStart = 0; cycleStart < len - 1; cycleStart++) {
    let value = arr[cycleStart];
    let pos = cycleStart;

    for (let i = cycleStart + 1; i < len; i++) {
      if (arr[i] < value) {
        pos++;
      }
    }

    if (pos === cycleStart) {
      continue;
    }

    while (value === arr[pos]) {
      pos++;
    }

    if (pos !== cycleStart) {
      [arr[pos], value] = [value, arr[pos]]; // Swap elements
      await drawBars(arr, pos, cycleStart); // Visualize the swapping
      await sleep(properties.delay); // Delay for visualization
    }

    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < len; i++) {
        if (arr[i] < value) {
          pos++;
        }
      }

      while (value === arr[pos]) {
        pos++;
      }

      if (value !== arr[pos]) {
        [arr[pos], value] = [value, arr[pos]]; // Swap elements
        await drawBars(arr, pos, cycleStart); // Visualize the swapping
        await sleep(properties.delay); // Delay for visualization
      }
    }
  }
};

const isSorted = (arr: number[]): boolean => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) {
      return false;
    }
  }
  return true;
};

const shuffleArray = (arr: number[]): void => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
};


const bogoSort = async (arr: number[]) => {
  let iterations = 0;

  while (!isSorted(arr)) {
    shuffleArray(arr);
    iterations++;
    // Visualize the shuffled array
    const randomIndex1 = Math.floor(Math.random() * arr.length);
    const randomIndex2 = Math.floor(Math.random() * arr.length);

    drawBars(arr, randomIndex1, randomIndex2); // Visualize the swapping
    await sleep(properties.delay); // Delay for visualization
  }

  console.log(`Sorted in ${iterations} iterations`);
};

const bitonicSort = async (arr: number[], direction: "ASC" | "DESC" = "ASC") => {
  const len = arr.length;
  await bitonicSortRecursive(arr, 0, len, direction, len);
};

const bitonicSortRecursive = async (arr: number[], low: number, count: number, direction: "ASC" | "DESC", n: number) => {
  if (count > 1) {
    const k = count / 2;

    // Sort in ascending order
    await bitonicSortRecursive(arr, low, k, "ASC", n);

    // Sort in descending order
    await bitonicSortRecursive(arr, low + k, k, "DESC", n);

    // Merge the bitonic sequences
    await bitonicMerge(arr, low, count, direction, n);
  }
};

const bitonicMerge = async (arr: number[], low: number, count: number, direction: "ASC" | "DESC", n: number) => {
  if (count > 1) {
    const k = greatestPowerOfTwoLessThanN(count);

    for (let i = low; i < low + count - k; i++) {
      if ((i < low + k && direction === "ASC") || (i >= low + k && direction === "DESC")) {
        if (arr[i] > arr[i + k]) {
          [arr[i], arr[i + k]] = [arr[i + k], arr[i]]; // Swap elements
          await drawBars(arr, i, i + k); // Visualize the swapping
          await sleep(properties.delay); // Delay for visualization
        }
      } else {
        if (arr[i] < arr[i + k]) {
          [arr[i], arr[i + k]] = [arr[i + k], arr[i]]; // Swap elements
          await drawBars(arr, i, i + k); // Visualize the swapping
          await sleep(properties.delay); // Delay for visualization
        }
      }
    }

    await bitonicMerge(arr, low, k, direction, n);
    await bitonicMerge(arr, low + k, k, direction, n);
  }
};

const greatestPowerOfTwoLessThanN = (n: number): number => {
  let k = 1;
  while (k < n) {
    k = k << 1;
  }
  return k >> 1;
};

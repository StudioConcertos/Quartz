const time = ref(0);
const playing = ref(false);
const duration = ref(0);

let frame = 0;
let last = 0;

function stop() {
  cancelAnimationFrame(frame);
  playing.value = false;
}

function step(now: number) {
  const delta = now - last;

  last = now;
  time.value += delta;

  if (time.value >= duration.value) {
    time.value = duration.value;
    stop();
    return;
  }

  frame = requestAnimationFrame(step);
}

const canPlay = computed(() => duration.value > 0);

export function usePlayhead() {
  function play() {
    if (playing.value || !canPlay.value) return;
    if (time.value >= duration.value) time.value = 0;

    playing.value = true;
    last = performance.now();
    frame = requestAnimationFrame(step);
  }

  function pause() {
    stop();
  }

  function toggle() {
    playing.value ? pause() : play();
  }

  function seek(to: number) {
    stop();
    time.value = Math.min(Math.max(to, 0), duration.value);
  }

  function reset() {
    stop();
    time.value = 0;
  }

  return { time, playing, duration, canPlay, play, pause, toggle, seek, reset };
}

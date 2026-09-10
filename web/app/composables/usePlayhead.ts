import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion";

const state = reactive({ time: 0 });
const time = toRef(state, "time");
const playing = ref(false);
const duration = ref(0);

const canPlay = computed(() => duration.value > 0);

let controls: AnimationPlaybackControls | null = null;
let builtFor = -1;

function dispose() {
  controls?.stop();
  controls = null;
  builtFor = -1;
}

function timeline() {
  if (controls && builtFor === duration.value) return controls;

  const at = Math.min(state.time, duration.value);

  dispose();

  controls = animate(
    state,
    { time: [0, duration.value] },
    {
      duration: duration.value / 1000,
      ease: "linear",
      autoplay: false,
      onComplete: () => (playing.value = false),
    },
  );

  builtFor = duration.value;
  controls.time = at / 1000;

  return controls;
}

export function usePlayhead() {
  function play() {
    if (playing.value || !canPlay.value) return;
    if (state.time >= duration.value) seek(0);

    timeline().play();
    playing.value = true;
  }

  function pause() {
    controls?.pause();
    playing.value = false;
  }

  function toggle() {
    playing.value ? pause() : play();
  }

  function seek(to: number) {
    playing.value = false;

    if (!canPlay.value) {
      dispose();
      state.time = 0;
      return;
    }

    const controls = timeline();

    controls.pause();
    controls.time = Math.min(Math.max(to, 0), duration.value) / 1000;
  }

  function reset() {
    dispose();
    state.time = 0;
    playing.value = false;
  }

  return { time, playing, duration, canPlay, play, pause, toggle, seek, reset };
}

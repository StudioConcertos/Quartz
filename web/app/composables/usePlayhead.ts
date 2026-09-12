import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion";

const MIN_SPAN = 5000;

const state = reactive({ time: 0 });
const time = toRef(state, "time");
const playing = ref(false);
const end = ref(0);
const canPlay = ref(false);

const duration = computed(() =>
  canPlay.value ? Math.max(end.value, MIN_SPAN) : 0,
);

const playable = computed(() => end.value > 0);

watch(time, (t) => {
  if (playing.value && t >= end.value) pause();
});

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

function pause() {
  controls?.pause();
  playing.value = false;
}

function play() {
  if (playing.value || !playable.value) return;
  if (state.time >= end.value) seek(0);

  timeline().play();
  playing.value = true;
}

function seek(to: number) {
  playing.value = false;

  if (!canPlay.value) {
    dispose();
    state.time = 0;
    return;
  }

  timeline();

  controls!.pause();
  controls!.time = Math.min(Math.max(to, 0), duration.value) / 1000;
}

function setLength(ms: number, hasKeys: boolean) {
  end.value = ms;
  canPlay.value = hasKeys;
}

export function usePlayhead() {
  function toggle() {
    playing.value ? pause() : play();
  }

  function reset() {
    dispose();
    state.time = 0;
    playing.value = false;
  }

  return {
    time,
    playing,
    duration,
    canPlay,
    playable,
    setLength,
    play,
    pause,
    toggle,
    seek,
    reset,
  };
}

export function useKeyDrag(
  duration: () => number,
  emit: (event: "move", from: number, to: number) => void,
) {
  const { start } = usePointerDrag();

  return function startDrag(event: PointerEvent, key: { t: number }) {
    event.preventDefault();

    const lane = (event.currentTarget as HTMLElement).parentElement!;
    const box = lane.getBoundingClientRect();

    let current = key.t;

    start("Move key", (e) => {
      const ratio = Math.min(
        Math.max((e.clientX - box.left) / box.width, 0),
        1,
      );
      const to = Math.round(ratio * duration());

      if (to === current) return;

      emit("move", current, to);
      current = to;
    });
  };
}

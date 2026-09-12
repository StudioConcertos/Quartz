export function useMergedFields(
  components: MaybeRefOrGetter<ComponentModel[]>,
) {
  const { updateComponent, addComponent, patchAnimation } = useDeckStore();
  const { time } = usePlayhead();
  const { getStoredComponent } = useNodeComponents();
  const comps = computed(() => toValue(components));

  function field(path: string[]) {
    return mergedValue(comps.value, path);
  }

  function set(path: string[], value: unknown) {
    for (const c of comps.value) {
      updateComponent({ ...c, data: setNested(c.data, path, value) });
    }
  }

  function keyed(path: string[]) {
    const now = Math.round(time.value);

    return (
      comps.value.length > 0 &&
      comps.value.every((c) =>
        keyedAt(
          getStoredComponent(c.node, "core.animation")?.data?.tracks,
          c.type,
          path,
          now,
        ),
      )
    );
  }

  function tracked(path: string[]) {
    return comps.value.some((c) =>
      findTrack(
        getStoredComponent(c.node, "core.animation")?.data?.tracks,
        c.type,
        path,
      ),
    );
  }

  function unkey(path: string[]) {
    const now = Math.round(time.value);

    for (const c of comps.value) {
      patchAnimation(c.node, (data) => ({
        tracks: removeKey(data?.tracks, c.type, path, now),
      }));
    }
  }

  function key(path: string[]) {
    const now = Math.round(time.value);

    for (const c of comps.value) {
      addComponent(c.node, "core.animation");

      const anim = getStoredComponent(c.node, "core.animation");

      if (!anim) continue;

      const value = at(
        sampleTracks(anim.data?.tracks, now, c.type, c.data),
        path,
      );

      if (value === undefined) continue;

      updateComponent({
        ...anim,
        data: {
          ...anim.data,
          tracks: upsertKey(anim.data.tracks, c.type, path, now, value),
        },
      });
    }
  }

  return { field, set, key, unkey, keyed, tracked };
}

export function useMergedFields(
  components: MaybeRefOrGetter<ComponentModel[]>,
) {
  const { updateComponent, addComponent } = useDeckStore();
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

  function key(path: string[]) {
    for (const c of comps.value) {
      addComponent(c.node, "core.animation");

      const anim = getStoredComponent(c.node, "core.animation");

      if (!anim) continue;

      const value = at(
        sampleTracks(anim.data?.tracks, time.value, c.type, c.data),
        path,
      );

      if (value === undefined) continue;

      updateComponent({
        ...anim,
        data: {
          ...anim.data,
          tracks: upsertKey(anim.data.tracks, c.type, path, time.value, value),
        },
      });
    }
  }

  return { field, set, key };
}

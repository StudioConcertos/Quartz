<template>
  <div v-if="url" class="snapshot">
    <NuxtImg :src="url" :alt="`snapshot of ${props.deck}`" loading="lazy" />
  </div>
</template>

<style scoped lang="postcss">
.snapshot {
  @apply relative w-full h-full border-rd overflow-hidden;

  img {
    @apply absolute w-full h-full object-cover;
  }
}
</style>

<script setup lang="ts">
const { fetchSlides } = useDeckStore();
const { trees } = storeToRefs(useDeckStore());

const { snapshotUrl } = useSnapshotsStore();

const props = defineProps<{
  deck: string;
  slides?: string;
}>();

const unlisted = asyncComputed(async () => {
  if (props.slides) return undefined;

  const id = (await fetchSlides(props.deck, 0)).id;

  return await signStorageObject("snapshots", props.deck, `${id}.png`);
});

const url = computed(() => {
  if (!props.slides) return unlisted.value;

  const tree = trees.value.get(props.slides);

  return tree && isEmptyTree(tree) ? undefined : snapshotUrl(props.slides);
});
</script>

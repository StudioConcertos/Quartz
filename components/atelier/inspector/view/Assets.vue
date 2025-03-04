<template>
  <AtelierInspectorView
    name="Assets"
    :actions="[
      {
        icon: 'i-carbon-cloud-upload',
        tooltip: 'Upload asset',
        onClick: () => open(),
      },
    ]"
  >
    <div v-if="assets.length" class="grid grid-cols-4 gap-4">
      <div v-for="asset in assets">
        <div
          v-if="
            asset.name.endsWith('.png') ||
            asset.name.endsWith('.jpg') ||
            asset.name.endsWith('.jpeg')
          "
          class="relative aspect-square overflow-hidden rounded-lg"
        >
          <NuxtImg
            :src="asset.url.toString()"
            :alt="asset.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-else>
          <p>Unspported asset - {{ asset.name }}</p>
        </div>
      </div>
    </div>
  </AtelierInspectorView>
</template>

<style scoped lang="postcss"></style>

<script setup lang="ts">
const client = useSupabaseClient<Database>();

const { currentSlides } = storeToRefs(useDeckStore());
const { assets } = storeToRefs(useAssetsStore());

const { open, onChange } = useFileDialog({
  accept: "image/*, .fbx, .glb, .gltf, .obj",
});

onChange(async (files) => {
  if (!files?.length) return;

  for (const file of files) {
    const { error } = await client.storage
      .from("assets")
      .upload(`${currentSlides.value.deck}/${file.name}`, file);

    if (error) {
      console.error(error);
    }
  }
});
</script>

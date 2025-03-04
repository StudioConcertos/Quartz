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
    <div v-if="assets.length" class="list">
      <div v-for="asset in assets">
        <button v-if="isImage(asset.name)" @click="openModal(asset)">
          <NuxtImg :src="asset.url.toString()" :alt="asset.name" />
        </button>
        <div v-else>
          <p>Unsupported asset - {{ asset.name }}</p>
        </div>
      </div>
    </div>
    <Modal ref="modal" :title="`${previewImage?.name}`">
      <NuxtImg
        @click="modal?.close()"
        :src="previewImage?.url.toString()"
        alt="preview"
      />
    </Modal>
  </AtelierInspectorView>
</template>

<style scoped lang="postcss">
.list {
  @apply grid grid-cols-4 gap-4;

  button {
    @apply relative aspect-square overflow-hidden rounded-lg;

    img {
      @apply w-full h-full object-cover;
    }
  }
}
</style>

<script setup lang="ts">
import type Modal from "@/components/Modal.vue";

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

const isImage = (asset: string) => {
  return (
    asset.endsWith(".png") || asset.endsWith(".jpg") || asset.endsWith(".jpeg")
  );
};

const previewImage = ref<{ name: string; url: URL }>();
const modal = ref<typeof Modal>();

function openModal(asset: { name: string; url: URL }) {
  modal.value?.open();

  previewImage.value = asset;
}
</script>

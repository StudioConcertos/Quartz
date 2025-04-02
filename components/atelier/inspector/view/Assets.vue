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
      <div
        v-for="asset in assets"
        @contextmenu.prevent="
          useContextMenu().open($event, [
            {
              label: 'Delete',
              action: () => deleteSelectedAsset(currentSlides.deck, asset),
            },
          ])
        "
      >
        <button v-if="isImage(asset.name)" @click="openImageModal(asset)">
          <NuxtImg :src="asset.url.toString()" :alt="asset.name" />
        </button>
        <button v-else-if="isFont(asset.name)" @click="openFontModal(asset)">
          <p>{{ asset.name }}</p>
        </button>
        <div v-else>
          <p>Unsupported asset - {{ asset.name }}</p>
        </div>
      </div>
    </div>
    <Modal ref="imagePreviewModal" :title="`${selectedAsset?.name}`">
      <NuxtImg
        class="w-full h-full"
        @click="imagePreviewModal?.close()"
        :src="selectedAsset?.url.toString()"
        alt="preview"
      />
    </Modal>
    <Modal ref="fontPreviewModal" :title="`${selectedAsset?.name}`">
      <p class="text-3xl" :style="{ fontFamily: selectedAsset?.name }">
        A lazy fox jumps over the lazy dog.
      </p>
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

const { fetchAssets, deleteSelectedAsset } = useAssetsStore();
const { assets } = storeToRefs(useAssetsStore());

const { open, onChange } = useFileDialog({
  accept: "image/*, .ttf, .otf, .woff, .woff2, .fbx, .glb, .gltf, .obj",
});

const imagePreviewModal = ref<typeof Modal>();
const fontPreviewModal = ref<typeof Modal>();

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

  await fetchAssets(currentSlides.value.deck);
});

const isImage = (asset: string) => {
  return (
    asset.endsWith(".png") || asset.endsWith(".jpg") || asset.endsWith(".jpeg")
  );
};

const isFont = (asset: string) => {
  return (
    asset.endsWith(".ttf") ||
    asset.endsWith(".otf") ||
    asset.endsWith(".woff") ||
    asset.endsWith(".woff2")
  );
};

const selectedAsset = ref<{ name: string; url: URL }>();

function openImageModal(asset: { name: string; url: URL }) {
  imagePreviewModal.value?.open();

  selectedAsset.value = asset;
}

function openFontModal(asset: { name: string; url: URL }) {
  fontPreviewModal.value?.open();

  selectedAsset.value = asset;
}
</script>

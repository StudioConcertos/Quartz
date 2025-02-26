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
    <p>test</p>
  </AtelierInspectorView>
</template>

<style scoped lang="postcss"></style>

<script setup lang="ts">
const client = useSupabaseClient<Database>();

const { currentSlides } = storeToRefs(useDeckStore());

const { files, open, onChange } = useFileDialog({
  accept: "image/*",
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

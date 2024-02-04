<template>
  <div class="atelier">
    <AtelierToolbar :title="$props.data?.title" />
    <AtelierPreview />
  </div>
</template>

<style scoped lang="postcss"></style>

<script setup lang="ts">
defineProps({
  data: Object,
});
</script>

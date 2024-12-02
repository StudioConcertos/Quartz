<template>
  <NodeComponent name="transform">
    <div class="field">
      <label>x:</label>
      <input type="number" step="0.01" />
    </div>
    <div class="field">
      <label>y:</label>
      <input type="number" step="0.01" />
    </div>
    <div class="field">
      <label>z:</label>
      <input type="number" step="0.01" />
    </div>
    <div class="field">
      <label>scale:</label>
      <input type="number" step="0.01" />
    </div>
  </NodeComponent>
</template>

<script setup lang="ts">
const props = defineProps<{
  component: ComponentModel;
}>();
</script>

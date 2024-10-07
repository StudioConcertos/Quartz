<template>
  <NodeComponent>
    <h4>TRANSFORM:</h4>
    <div class="whitespace"></div>
    <div class="row">
      <div class="column">
        <p>x:</p>
        <input type="number" step="0.01" />
      </div>
      <div class="column">
        <p>y:</p>
        <input type="number" step="0.01" />
      </div>
      <div class="column">
        <p>z:</p>
        <input type="number" step="0.01" />
      </div>
    </div>
    <div class="whitespace"></div>
    <div class="row">
      <div class="column">
        <p>scale:</p>
        <input type="number" step="0.01" />
      </div>
    </div>
  </NodeComponent>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

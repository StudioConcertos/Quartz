<template>
  <NodeComponent>
    <h4>TEXT:</h4>
    <div class="whitespace"></div>
    <div class="row">
      <div class="column">
        <p>string:</p>
        <input type="text" />
      </div>
    </div>
    <div class="whitespace"></div>
    <div class="row">
      <div class="column">
        <p>colour:</p>
        <input type="text" />
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

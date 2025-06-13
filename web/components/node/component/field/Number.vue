<template>
  <div class="field">
    <label>{{ props.name }}</label>
    <input
      type="number"
      :value="props.value"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      @input="
        $emit('update:value', ($event.target as HTMLInputElement).valueAsNumber)
      "
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
}>();

defineEmits<{
  "update:value": [value: number];
}>();
</script>

<template>
  <div class="field">
    <label>{{ props.name }}</label>
    <select
      :value="props.value"
      @change="
        $emit('update:value', ($event.target as HTMLSelectElement).value)
      "
    >
      <option v-for="option in props.options" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="postcss">
.field {
  select {
    @apply border-neutral-500;
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  value: string;
  options: string[];
}>();

defineEmits<{
  "update:value": [value: string];
}>();
</script>

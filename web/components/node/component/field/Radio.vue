<template>
  <div class="field">
    <label>{{ props.name }}</label>
    <fieldset>
      <button
        v-for="option in props.options"
        @click="$emit('update:value', option.value)"
        :class="option.icon"
        class="option"
        :key="option.value"
      />
    </fieldset>
  </div>
</template>

<style scoped lang="postcss">
.field {
  fieldset {
    @apply flex items-center gap-6;

    .option {
      @apply opacity-60 hover:opacity-100 transition-opacity;
      @apply text-lg;
    }
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  options: {
    value: string;
    icon: string;
  }[];
}>();

defineEmits<{
  "update:value": [value: string];
}>();
</script>

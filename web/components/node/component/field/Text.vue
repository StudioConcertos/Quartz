<template>
  <div class="field">
    <label>{{ props.name }}</label>
    <textarea
      :class="{
        'cursor-not-allowed opacity-60': props.disabled,
      }"
      :disabled="props.disabled"
      @keydown.enter.exact.prevent="handleEnter"
      :rows="props.isParagraph ? 5 : 1"
      :maxlength="props.isParagraph ? 300 : 30"
      :value="props.value ?? ''"
      @input="
        $emit('update:value', ($event.target as HTMLTextAreaElement).value)
      "
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  isParagraph?: boolean;
  value: string;
  disabled?: boolean;
}>();

defineEmits<{
  "update:value": [value: string];
}>();

function handleEnter(event: KeyboardEvent) {
  (event.target as HTMLTextAreaElement).blur();
}
</script>

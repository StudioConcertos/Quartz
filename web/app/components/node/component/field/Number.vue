<template>
  <div class="field">
    <label>{{ props.name }}</label>
    <div v-if="props.isMultiple" class="inputs">
      <input
        v-for="field in fields"
        type="number"
        :value="field.value ?? 0"
        :min="field.min"
        :max="field.max"
        :step="field.step"
        @input="
          $emit(
            'update:value',
            field.label,
            ($event.target as HTMLInputElement).valueAsNumber
          )
        "
      />
    </div>
    <input
      type="number"
      :value="props.value ?? 0"
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
type Field = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
};

const props = defineProps<{
  name: string;
  field?: Field;
  isMultiple?: { boolean: boolean; fields: Field[] };
}>();

defineEmits<{
  "update:value": [label: string, value: number];
}>();

const fields = computed(() => {
  return Array.isArray(props.fields) ? props.fields : [props.fields];
});
</script>

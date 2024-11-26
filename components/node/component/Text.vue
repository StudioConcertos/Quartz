<template>
  <NodeComponent name="text">
    <div class="row">
      <div class="column">
        <p>string:</p>
        <textarea v-model.lazy="props.component.data.string" rows="3" />
      </div>
    </div>
  </NodeComponent>
</template>

<script setup lang="ts">
const { updateNodeComponent } = useDeckStore();

const props = defineProps<{
  component: ComponentModel;
}>();

watch(props.component, () => {
  updateNodeComponent(props.component);
});
</script>

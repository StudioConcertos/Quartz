<template>
  <NodeComponent name="text">
    <div class="row">
      <div class="column">
        <p>content:</p>
        <textarea v-model.lazy="props.component.data.content" rows="3" />
      </div>
    </div>
    <div class="row">
      <div class="column">
        <p>size:</p>
        <input type="number" v-model.lazy="props.component.data.size" />
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

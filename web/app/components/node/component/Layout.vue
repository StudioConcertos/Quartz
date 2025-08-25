<template>
  <NodeComponent name="layout">
    <NodeComponentFieldColour
      name="background"
      v-model:value="props.component.data.background"
    />
    <NodeComponentFieldNumber
      name="spacing"
      v-model:value="props.component.data.margin"
      :fields="{ label: 'spacing', value: props.component.data.margin }"
    />
    <NodeComponentFieldRadio
      name="align"
      :options="[
        { value: 'start', icon: 'i-carbon-align-vertical-top' },
        { value: 'center', icon: 'i-carbon-align-vertical-center' },
        { value: 'end', icon: 'i-carbon-align-vertical-bottom' },
      ]"
      v-model:value="props.component.data.align"
    />
    <NodeComponentFieldRadio
      name="direction"
      :options="[
        { value: 'row', icon: 'i-carbon-align-horizontal-left' },
        { value: 'column', icon: 'i-carbon-align-horizontal-center' },
      ]"
      v-model:value="props.component.data.direction"
    />
    <NodeComponentFieldNumber
      name="columns"
      :fields="{ label: 'columns', value: props.component.data.columns }"
    />
    <NodeComponentFieldNumber
      name="rows"
      :fields="{ label: 'rows', value: props.component.data.rows }"
    />
    <NodeComponentFieldNumber
      name="gap"
      :fields="{ label: 'gap', value: props.component.data.gap }"
    />
  </NodeComponent>
</template>

<script setup lang="ts">
const { updateNodeComponent } = useDeckStore();

const props = defineProps<{
  component: ComponentModel;
}>();

watch(props.component.data, () => {
  updateNodeComponent(props.component);

  console.log(props.component.data);
});
</script>

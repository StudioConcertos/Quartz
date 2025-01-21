<template>
  <NodeComponent name="typography">
    <div class="field">
      <label>content</label>
      <textarea
        @keydown.enter.exact.prevent="handleEnter"
        v-model.lazy="props.component.data.content"
        rows="5"
      />
    </div>
    <div class="field">
      <label>font</label>
      <select class="border-neutral-500">
        <option value="azeret-mono">Azeret Mono</option>
      </select>
    </div>
    <div class="field">
      <label>size</label>
      <input type="number" v-model.lazy="props.component.data.size" />
    </div>
    <div class="field">
      <label>weight</label>
      <input
        type="number"
        min="100"
        max="900"
        step="100"
        v-model.lazy="props.component.data.weight"
      />
    </div>
    <div class="field">
      <label>colour</label>
      <input v-model.lazy="props.component.data.colour" type="color" />
    </div>
    <div class="field">
      <label>style</label>
      <div class="flex items-center gap-6">
        <button>
          <div class="i-carbon-text-italic" />
        </button>
        <button>
          <div class="i-carbon-text-underline" />
        </button>
        <button>
          <div class="i-carbon-text-strikethrough" />
        </button>
      </div>
    </div>
    <div class="field">
      <label>alignment</label>
      <div class="flex items-center gap-6">
        <button>
          <div class="i-carbon-text-align-left" />
        </button>
        <button>
          <div class="i-carbon-text-align-center" />
        </button>
        <button>
          <div class="i-carbon-text-align-right" />
        </button>
        <button>
          <div class="i-carbon-text-align-justify" />
        </button>
      </div>
    </div>
  </NodeComponent>
</template>

<script setup lang="ts">
const { updateNodeComponent } = useDeckStore();

const props = defineProps<{
  component: ComponentModel;
}>();

watch(props.component.data, () => {
  updateNodeComponent(props.component);
});

function handleEnter(event: KeyboardEvent) {
  (event.target as HTMLTextAreaElement).blur();
}
</script>

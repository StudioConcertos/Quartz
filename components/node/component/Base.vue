<template>
  <NodeComponent name="base">
    <div class="row">
      <div class="column">
        <p>reference:</p>
        <input
          class="w-50!"
          type="text"
          maxlength="20"
          :value="useDeckStore().selectedNode?.dataset.reference"
        />
      </div>
    </div>
  </NodeComponent>
</template>

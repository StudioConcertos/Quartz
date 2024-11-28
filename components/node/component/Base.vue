<template>
  <NodeComponent name="base">
    <div class="row">
      <div class="column">
        <p>reference:</p>
        <input
          :value="useDeckStore().selectedNode?.reference"
          class="w-50!"
          type="text"
          maxlength="20"
        />
      </div>
    </div>
  </NodeComponent>
</template>

<script setup lang="ts"></script>

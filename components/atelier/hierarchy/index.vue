<template>
  <div
    class="hierarchy"
    @keydown.esc="useSlidesStore().selectedNode = undefined"
  >
    <h3>
      Hierarchy
      <div class="actions">
        <Tooltip description="New node">
          <button @click="dialog?.showModal()">
            <div class="i-carbon-new-tab"></div>
          </button>
        </Tooltip>
        <Tooltip description="Sort">
          <button>
            <div class="i-carbon-sort-ascending"></div>
          </button>
        </Tooltip>
      </div>
    </h3>
    <div class="whitespace"></div>
    <AtelierHierarchyTree
      :page="props.pages[useSlidesStore().selectedPageIndex]"
    />
    <dialog ref="dialog">
      <h4>Create new node:</h4>
      <div class="whitespace" />
      <form @submit.prevent="pushNewNode()" ref="form">
        <input
          v-model="nodeName"
          ref="nodeNameInput"
          class="px-1"
          maxlength="20"
          placeholder="Name"
          type="text"
          required
        />
        <select v-model="nodeType" required>
          <option value="text">Text</option>
          <option value="group">Group</option>
        </select>
      </form>
      <div class="whitespace" />
      <button
        @click="pushNewNode()"
        :class="{ disabled: !nodeNameInput?.value }"
        class="primaryBtn w-full text-sm"
      >
        Confirm
      </button>
    </dialog>
  </div>
</template>

<style scoped lang="postcss">
.hierarchy {
  h3 {
    @apply flex justify-between items-center;

    .actions {
      @apply flex justify-between items-center;

      .tooltip {
        @apply flex mx-2;

        button {
          @apply text-xl;
        }
      }

      .tooltip:first-of-type {
        @apply ml-0;
      }

      .tooltip:last-of-type {
        @apply mr-0;
      }
    }
  }
}
</style>

<script setup lang="ts">
import type { Database } from "~/types/database";

const client = useSupabaseClient<Database>();

const props = defineProps({
  pages: {
    type: [Object],
    required: true,
  },
});

const dialog = ref<HTMLDialogElement>();
const form = ref<HTMLFormElement>();

const nodeName = ref<String>();
const nodeType = ref<String>();

const nodeNameInput = ref<HTMLInputElement>();

watch(nodeName, () => {
  if (nodeName.value) {
    nodeNameInput.value?.classList.add("border-light-200");
  } else {
    nodeNameInput.value?.classList.remove("border-light-200");
  }
});

function pushNewNode() {
  useSlidesStore().selectedPage.push({
    name: nodeName?.value,
    type: nodeType?.value,
  });

  dialog.value?.close();

  nodeName.value = "";
  nodeNameInput.value?.classList.remove("border-light-200");
}

onMounted(() => {
  nodeType.value = "text";
});
</script>

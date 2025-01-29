<template>
  <div class="hierarchy" @keydown.esc="selectedNode = null">
    <h3>
      Hierarchy
      <div class="actions">
        <Tooltip description="New node">
          <button @click="modal?.open()">
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
    <AtelierHierarchyTree />
    <Modal ref="modal" title="Node creation">
      <form @submit="onSubmit">
        <FormInput name="name" type="text" placeholder="Name" :maxlength="20" />
        <Field name="type" v-slot="{ field }">
          <select v-bind="field">
            <option v-for="type in types.options" :value="type">
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>
        </Field>
        <button
          type="submit"
          :class="{ disabled: !meta.valid }"
          class="primaryButton w-full text-sm mt-10"
        >
          Confirm
        </button>
        <div v-if="error" class="whitespace"></div>
        <p v-if="error" class="text-center text-red-500">ERROR: {{ error }}</p>
      </form>
    </Modal>
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
import zod from "zod";

import type Modal from "@/components/Modal.vue";

const { currentSlides, selectedNode } = storeToRefs(useDeckStore());

const modal = ref<typeof Modal>();

const types = zod.enum(["group", "text", "webgl_canvas"]);

const nodeSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1, "Required"),
    type: zod.enum(types.options),
  })
);

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: nodeSchema,
  initialValues: {
    type: types.options[0],
  },
});

const error = ref("");

const onSubmit = handleSubmit(async (values) => {
  try {
    error.value = "";

    await useDeckStore().insertNewNode(
      `${currentSlides.value.id}`,
      `${values.name}`,
      values.type
    );

    modal.value?.close();

    resetForm();
  } catch (err) {
    error.value = (err as Error).message;
  }
});
</script>

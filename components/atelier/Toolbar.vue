<template>
  <header class="toolbar">
    <NuxtLink to="/atelier">
      <div class="i-carbon-switcher"></div>
    </NuxtLink>
    <input type="text" maxlength="30" v-model.lazy="title" />
    <button @click="modal?.open()">
      <div class="i-carbon-run"></div>
    </button>
    <Modal ref="modal" title="Presentation mode">
      <form @submit.prevent="onSubmit">
        <div class="side">
          <div>
            <h5>Local</h5>
            <div class="whitespace"></div>
            <p>Your regular presentation experience.</p>
          </div>
          <button type="submit" class="primaryButton">Confirm</button>
        </div>
        <div class="divider">
          <span>OR</span>
        </div>
        <div class="side">
          <div>
            <h5>Online (WIP)</h5>
            <div class="whitespace"></div>
            <p>Audience can join the presentation, and interact with you.</p>
          </div>
          <button class="primaryButton disabled">Confirm</button>
        </div>
      </form>
    </Modal>
  </header>
</template>

<style scoped lang="postcss">
.toolbar {
  @apply flex justify-between items-center;
  @apply bg-dark-500 w-full h-20;
  @apply border-solid border-0 border-b-2 border-dark-200;

  a,
  button {
    @apply h-full px-6 flex items-center transition-colors;
    @apply hover-bg-light-200 hover-text-dark-500;

    [class*="i-"] {
      @apply text-2xl;
    }
  }

  form {
    @apply flex flex-row gap-4;

    .side {
      @apply flex flex-col flex-1 m-0 gap-40 justify-between;

      h5 {
        @apply text-lg text-center;
      }

      p {
        @apply text-center opacity-60;
      }

      button {
        @apply h-auto! text-sm w-1/2 mx-auto;
      }
    }

    .divider {
      @apply relative mx-4;

      &::before {
        content: "";
        @apply absolute w-px h-full bg-dark-200;
      }

      span {
        @apply absolute left-1/2 top-1/2 bg-dark-900 py-6;
        @apply translate-x-[-50%] translate-y-[-50%];
      }
    }
  }

  input {
    @apply w-sm text-4;
    @apply text-center border-none;
    @apply hover-underline focus-underline;
  }
}
</style>

<script setup lang="ts">
import type Modal from "@/components/Modal.vue";

const { updateDeckTitle } = useDeckStore();

const props = defineProps<{
  title: string;
}>();

const modal = ref<typeof Modal>();

const title = computed({
  get() {
    return props.title;
  },
  async set(value) {
    if (!value.length) return;

    await updateDeckTitle(value);
  },
});

function onSubmit() {
  navigateTo(`/live/${useRoute().params.id}`, { open: { target: "_blank" } });
}
</script>

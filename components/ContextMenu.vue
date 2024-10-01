<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        :style="{ top: `${y}px`, left: `${x}px` }"
        class="contextMenu"
        @contextmenu.prevent
      >
        <button
          v-for="item in menuItems"
          :key="item.label"
          @click="item.action(), (isVisible = false)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="postcss">
.contextMenu {
  @apply w-40 bg-dark-900 z-99 absolute;
  @apply border-rd border-solid border-1 border-dark-200;

  button {
    @apply w-full h-12 cursor-pointer transition-colors;

    &:hover {
      @apply bg-light-200 text-dark-900;
    }
  }
}
</style>

<script setup lang="ts">
const isVisible = ref(false);
const menuItems = ref<ContextMenuItem[]>([]);

const x = ref(0);
const y = ref(0);

const openContextMenu = (event: MouseEvent, _menuItems: ContextMenuItem[]) => {
  x.value = event.clientX + 10;
  y.value = event.clientY + 10;

  isVisible.value = true;
  menuItems.value = _menuItems;
};

const handleOpenContextMenu = (event: Event) => {
  const e = event as ContextMenuEvent;

  openContextMenu(e.detail.event, e.detail.menuItems);
};

onMounted(() => {
  window.addEventListener("openContextMenu", handleOpenContextMenu);
});

onUnmounted(() => {
  window.removeEventListener("openContextMenu", handleOpenContextMenu);
});
</script>

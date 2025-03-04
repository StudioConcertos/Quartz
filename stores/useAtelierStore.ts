// @unocss-include

export const useAtelierStore = defineStore("atelier", () => {
  const tabs = ref([
    { name: "Inspector", icon: "i-carbon-legend" },
    { name: "Assets", icon: "i-carbon-folders" },
  ]);

  const activeTab = ref<number>(0);

  function setActiveTab(index: number) {
    activeTab.value = index;
  }

  return { tabs, activeTab, setActiveTab };
});

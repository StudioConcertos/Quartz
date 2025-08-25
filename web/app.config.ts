export default defineAppConfig({
  contentMermaid: {
    enabled: true,
    /**
     * @default 'default'
     * @description 'default' or '@nuxtjs/color-mode'
     */
    color: "default",
    spinnerComponent: "DAnimationSpinner",
  },
});

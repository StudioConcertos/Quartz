export default defineNuxtRouteMiddleware((to) => {
  if (!useAuthStore().isSignedIn) {
    if (to.path === "/" || to.path === "/auth") return;

    return navigateTo("/auth", { replace: true });
  }
});

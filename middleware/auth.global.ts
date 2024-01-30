export default defineNuxtRouteMiddleware((to) => {
  if (!useAuthStore().isSignedIn) {
    if (to.path === "/") return;

    return navigateTo("/", { replace: true });
  }
});

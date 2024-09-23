import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const client = useSupabaseClient();

  const user = ref<User | null>(useSupabaseUser().value);
  const isSignedIn = computed(() => !!user.value);

  client.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
  });

  async function signIn() {
    await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/atelier`,
      },
    });
  }

  async function signOut() {
    await client.auth.signOut();

    navigateTo("/", { replace: true });
  }

  return { user, isSignedIn, signIn, signOut };
});

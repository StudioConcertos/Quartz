export const useAuth = () => {
  const client = useSupabaseClient();

  async function signIn() {
    const { error } = await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/atelier`,
      },
    });

    if (error) return console.log(error);
  }

  async function signOut() {
    const { error } = await client.auth.signOut();

    if (error) return console.log(error);

    navigateTo("/", { replace: true });
  }

  return { signIn, signOut };
};

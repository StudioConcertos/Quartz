import { DiscordSDK } from "@discord/embedded-app-sdk";

const discord = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

async function setupDiscordSdk() {
  await discord.ready();
}

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Hello World from Quartz</h1>
  </div>
`;

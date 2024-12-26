import html2canvas from "html2canvas";

export function useSnapshot() {
  const client = useSupabaseClient<Database>();

  const { currentSlides } = storeToRefs(useDeckStore());

  const capture = async (deck: string) => {
    if (!currentSlides.value || useRoute().params.id !== deck) return;

    const blob = await html2canvas(document.querySelector(".render")!, {
      scale: 2,
      useCORS: true,
    }).then(
      (canvas) =>
        new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), "image/png")
        )
    );

    const { error } = await client.storage
      .from("snapshots")
      .upload(`${deck}/${currentSlides.value.id}.png`, blob, {
        upsert: true,
        contentType: "image/png",
      });

    if (error) throw error;
  };

  return {
    capture,
  };
}

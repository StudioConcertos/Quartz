import html2canvas from "html2canvas";

export function useSnapshot() {
  const client = useSupabaseClient<Database>();

  const { currentSlides } = storeToRefs(useDeckStore());

  const capture = async () => {
    if (!currentSlides.value) return;

    const blob = await html2canvas(document.querySelector(".render")!, {
      scale: 1,
      useCORS: true,
      onclone: (document, element) => {
        element.style.width = "1920px";
        element.style.height = "1080px";
      },
    }).then(
      (canvas) =>
        new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), "image/png")
        )
    );

    const { error } = await client.storage
      .from("snapshots")
      .upload(
        `${currentSlides.value.deck}/${currentSlides.value.id}.png`,
        blob,
        {
          upsert: true,
          contentType: "image/png",
        }
      );

    if (error) throw error;
  };

  return {
    capture,
  };
}

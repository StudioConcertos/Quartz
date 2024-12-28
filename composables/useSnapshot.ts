import html2canvas from "html2canvas";

export function useSnapshot() {
  const client = useSupabaseClient<Database>();

  const { slides, currentSlides, trees } = storeToRefs(useDeckStore());

  const bucket = "snapshots";

  const capture = async () => {
    if (!trees.value[currentSlides.value.index].children.length) return;
    if (
      localStorage.getItem(
        `snapshot-${currentSlides.value.deck}-${currentSlides.value.id}.png`
      )
    )
      return;

    const blob = await html2canvas(document.querySelector(".render")!, {
      width: 192,
      height: 108,
      scale: 10,
      useCORS: true,
      onclone: (document, clone) => {
        clone.style.borderRadius = "0px";

        // TODO: Use another method to get the elements.
        const elements = document.querySelectorAll(".element");

        elements.forEach((element) => {
          (element as HTMLElement).style.transform = `scale(${192 / 1920})`;
        });
      },
    }).then(
      (canvas) =>
        new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), "image/png")
        )
    );

    const { error } = await client.storage
      .from(bucket)
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

  const fetch = async (
    deck: string = currentSlides.value.deck,
    slidesId: string = currentSlides.value.id
  ) => {
    if (!deck || !slidesId) return;

    const key = `snapshot-${deck}-${slidesId}`;
    const expires = 60 * 60; // 1 hour.

    if (localStorage.getItem(key)) {
      const item = JSON.parse(localStorage.getItem(key)!);

      if (item.expires > Date.now()) return item.url;

      localStorage.removeItem(key);
    }

    if (
      !trees.value[slides.value.findIndex((slide) => slide.id === slidesId)]
        .children.length
    )
      return;

    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(`${deck}/${slidesId}.png`, expires);

    if (error) throw error;

    localStorage.setItem(
      key,
      JSON.stringify({
        url: data.signedUrl,
        expires: Date.now() + expires * 1000,
      })
    );

    return data.signedUrl;
  };

  return {
    capture,
    fetch,
  };
}

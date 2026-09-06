import type { TypographyMarks } from "../components/typography/types";

const DECORATION: Record<string, string> = {
  underline: "underline",
  strikethrough: "line-through",
};

function typographyStyle(marks: Partial<TypographyMarks> = {}) {
  const style: Record<string, string | number> = {};

  if (marks.colour !== undefined) style.color = marks.colour;
  if (marks.font !== undefined) style.fontFamily = marks.font;
  if (marks.size !== undefined) style.fontSize = `${marks.size}px`;
  if (marks.weight !== undefined) style.fontWeight = marks.weight;
  if (marks.textTransform !== undefined) {
    style.textTransform = marks.textTransform;
  }
  if (marks.letterSpacing !== undefined) {
    style.letterSpacing = `${marks.letterSpacing}px`;
  }
  if (marks.opacity !== undefined) style.opacity = marks.opacity;

  if (marks.style !== undefined) {
    const lines = marks.style.map((entry) => DECORATION[entry]).filter(Boolean);

    style.fontStyle = marks.style.includes("italic") ? "italic" : "normal";
    style.textDecoration = lines.length ? lines.join(" ") : "none";
  }

  return style;
}

export default {
  type: "core.text",
  label: "Text",
  icon: "i-carbon-text-short-paragraph",
  accepts: [],
  defaultComponents: ["core.base", "core.transform", "core.typography"],
  renderer: {
    element: "p",
    render: (node, ctx) => {
      const typography = ctx.data(node, "core.typography");
      const transform = ctx.data(node, "core.transform");

      const runs = toRuns(typography.content);

      const split = runs.some((run) => run.marks?.style !== undefined);
      const spans = runs.some((run) => run.marks)
        ? runs.map((run) => ({
            text: run.text,
            style: typographyStyle(
              split ? { style: typography.style, ...run.marks } : run.marks,
            ),
          }))
        : null;

      const autoWidth = transform.size.width === "auto";

      return {
        content: spans ?? runsText(runs),
        style: {
          ...boxStyle(transform, ctx.scale),
          ...typographyStyle(typography),
          ...(split && { textDecoration: "none" }),
          textAlign: typography.alignment,
          width: autoWidth ? "max-content" : `${transform.size.width}px`,
          height:
            transform.size.height === "auto"
              ? "auto"
              : `${transform.size.height}px`,
          whiteSpace: "pre-wrap",
          lineHeight: typography.lineHeight,
        },
      };
    },
  },
} satisfies NodeTypeDef;

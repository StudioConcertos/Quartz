export interface Highlighted {
  spans: RenderSpan[];
  bg: string;
  fg: string;
}

const LIMIT = 200;

const ITALIC = 1;
const BOLD = 2;
const UNDERLINE = 4;

const DELAY = 200;

const cache = shallowReactive(new Map<string, Highlighted>());
const pending = new Set<string>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function tokenStyle(token: { color?: string; fontStyle?: number }) {
  const style: Record<string, string | number> = {};

  if (token.color) style.color = token.color;

  const font = token.fontStyle ?? 0;

  if (font & ITALIC) style.fontStyle = "italic";
  if (font & BOLD) style.fontWeight = "bold";
  if (font & UNDERLINE) style.textDecoration = "underline";

  return style;
}

async function compute(
  key: string,
  source: string,
  language: string,
  theme: string,
) {
  try {
    const { codeToTokens } = await import("shiki");
    const result = await codeToTokens(source, {
      lang: language as any,
      theme: theme as any,
    });

    const spans: RenderSpan[] = [];

    result.tokens.forEach((line, index) => {
      if (index) spans.push({ text: "\n" });

      for (const token of line)
        spans.push({ text: token.content, style: tokenStyle(token) });
    });

    cache.set(key, { spans, bg: result.bg ?? "", fg: result.fg ?? "" });
  } catch {
    cache.set(key, { spans: [{ text: source }], bg: "", fg: "" });
  } finally {
    pending.delete(key);

    if (cache.size > LIMIT) {
      const oldest = cache.keys().next().value;

      if (oldest !== undefined) cache.delete(oldest);
    }
  }
}

export function highlight(
  id: string,
  source: string,
  language: string,
  theme: string,
): Highlighted | undefined {
  const key = `${language}\u0000${theme}\u0000${source}`;
  const hit = cache.get(key);

  if (hit) return hit;

  if (!pending.has(key)) {
    clearTimeout(timers.get(id));

    timers.set(
      id,
      setTimeout(() => {
        timers.delete(id);

        if (cache.has(key) || pending.has(key)) return;

        pending.add(key);

        void compute(key, source, language, theme);
      }, DELAY),
    );
  }

  return undefined;
}

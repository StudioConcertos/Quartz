import type {
  Run,
  TypographyMarks,
} from "~/modules/core/components/typography/types";

const NO_MARKS: Partial<TypographyMarks> = {};

function copyRun(run: Run, text = run.text): Run {
  return run.marks ? { text, marks: { ...run.marks } } : { text };
}

function cleanMarks(
  marks: Partial<TypographyMarks>,
  base?: Record<string, any>,
): Partial<TypographyMarks> | undefined {
  const entries = Object.entries(marks).filter(
    ([key, value]) =>
      value !== undefined && (!base || !deepEqual(value, base[key])),
  );

  return entries.length
    ? (Object.fromEntries(entries) as Partial<TypographyMarks>)
    : undefined;
}

export function toRuns(content: unknown): Run[] {
  if (typeof content === "string") return [{ text: content }];
  if (Array.isArray(content) && content.length) return content as Run[];

  return [{ text: "" }];
}

export function runsText(runs: Run[]): string {
  return runs.map((run) => run.text).join("");
}

export function fromRuns(runs: Run[]): string | Run[] {
  const [first] = runs;

  return runs.length === 1 && first && !first.marks ? first.text : runs;
}

export function mergeRuns(runs: Run[]): Run[] {
  const out: Run[] = [];

  for (const run of runs) {
    if (!run.text) continue;

    const last = out[out.length - 1];

    if (last && deepEqual(last.marks ?? NO_MARKS, run.marks ?? NO_MARKS)) {
      last.text += run.text;
    } else out.push(copyRun(run));
  }

  return out.length ? out : [{ text: "" }];
}

export function applyMarks(
  runs: Run[],
  start: number,
  end: number,
  patch: Partial<TypographyMarks>,
  base?: Record<string, any>,
): Run[] {
  if (end <= start) return runs;

  const out: Run[] = [];
  let at = 0;

  for (const run of runs) {
    const from = at;
    const to = at + run.text.length;

    at = to;

    if (to <= start || from >= end) {
      out.push(copyRun(run));
      continue;
    }

    const head = run.text.slice(0, Math.max(0, start - from));
    const body = run.text.slice(
      Math.max(0, start - from),
      Math.min(run.text.length, end - from),
    );
    const tail = run.text.slice(Math.min(run.text.length, end - from));

    if (head) out.push(copyRun(run, head));

    if (body) {
      const marks = cleanMarks({ ...run.marks, ...patch }, base);

      out.push(marks ? { text: body, marks } : { text: body });
    }

    if (tail) out.push(copyRun(run, tail));
  }

  return mergeRuns(out);
}

export function selectionMark(
  runs: Run[],
  start: number,
  end: number,
  key: keyof TypographyMarks,
  base: Record<string, any>,
): any {
  const values: any[] = [];
  let at = 0;

  for (const run of runs) {
    const from = at;
    const to = at + run.text.length;

    at = to;

    if (to <= start || from >= end) continue;

    values.push(run.marks?.[key] ?? base[key]);
  }

  if (!values.length) return undefined;

  const first = values[0];

  return values.every((value) => deepEqual(value, first)) ? first : undefined;
}

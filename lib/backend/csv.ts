export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") { row.push(field.trim()); field = ""; }
    else if (character === "\n") { row.push(field.trim()); rows.push(row); row = []; field = ""; }
    else if (character !== "\r") field += character;
  }
  if (field.length || row.length) { row.push(field.trim()); rows.push(row); }
  const headers = rows.shift()?.map((header) => header.replace(/^\uFEFF/, "")) ?? [];
  return rows.filter((values) => values.some(Boolean)).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

export const list = (value: string) => value ? value.split(/[|;]/).map((item) => item.trim()).filter(Boolean) : [];
export const numberOrUndefined = (value: string) => value === "" ? undefined : Number(value);
export const truthy = (value: string) => ["true", "1", "yes"].includes(value.toLowerCase());

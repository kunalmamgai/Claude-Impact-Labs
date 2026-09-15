import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import "regenerator-runtime/runtime";
import fontkit from "@pdf-lib/fontkit";
import type { UserProfile } from "@/lib/backend/types";

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) line = next;
      else { if (line) lines.push(line); line = word; }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function drawSection(page: PDFPage, font: PDFFont, x: number, y: number, width: number, title: string, content: string[]) {
  page.drawText(title, { x, y, size: 10, font, color: rgb(0.1, 0.42, 0.31) });
  let cursor = y - 18;
  for (const line of content.flatMap((item) => wrap(item, font, 9.3, width))) {
    page.drawText(line, { x, y: cursor, size: 9.3, font, color: rgb(0.19, 0.28, 0.24) });
    cursor -= 14;
  }
  return cursor - 15;
}

async function loadFont(filename: string) {
  return readFile(path.join(process.cwd(), "node_modules", "@fontsource", "noto-sans-devanagari", "files", filename));
}

export async function createResumePdf(profile: UserProfile, language: "bilingual" | "hindi" | "english") {
  const [latinBytes, devanagariBytes] = await Promise.all([
    loadFont("noto-sans-devanagari-latin-400-normal.woff"),
    loadFont("noto-sans-devanagari-devanagari-400-normal.woff"),
  ]);
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  document.setTitle(`${profile.name || "Candidate"} — BhashaHire Resume`);
  document.setAuthor("BhashaHire");
  const latinFont = await document.embedFont(latinBytes, { subset: true });
  const devanagariFont = await document.embedFont(devanagariBytes, { subset: true });
  const page = document.addPage([595.28, 841.89]);
  page.drawRectangle({ x: 0, y: 735, width: 595.28, height: 107, color: rgb(0.09, 0.25, 0.2) });
  page.drawText(profile.name || "Candidate", { x: 42, y: 785, size: 25, font: latinFont, color: rgb(1, 1, 1) });
  page.drawText([profile.location_city, profile.location_state, profile.contact?.phone].filter(Boolean).join("  -  "), { x: 42, y: 758, size: 9, font: latinFont, color: rgb(0.83, 0.91, 0.86) });
  const bilingual = language === "bilingual";
  const columnWidth = bilingual ? 238 : 510;
  const englishX = 42;
  const hindiX = bilingual ? 315 : 42;
  if (bilingual) page.drawLine({ start: { x: 297.5, y: 710 }, end: { x: 297.5, y: 65 }, thickness: 0.7, color: rgb(0.84, 0.89, 0.85) });

  if (language !== "hindi") {
    let y = 705;
    y = drawSection(page, latinFont, englishX, y, columnWidth, "PROFILE", [`Career candidate based in ${profile.location_city || "Madhya Pradesh"}, ready for suitable work and apprenticeship opportunities.`]);
    y = drawSection(page, latinFont, englishX, y, columnWidth, "EDUCATION", profile.education.map((item) => `${item.level}${item.trade_or_stream ? ` - ${item.trade_or_stream}` : ""}${item.year ? ` (${item.year})` : ""}`));
    y = drawSection(page, latinFont, englishX, y, columnWidth, "CERTIFICATIONS", profile.certifications.length ? profile.certifications.map((item) => item.name) : ["Not provided"]);
    y = drawSection(page, latinFont, englishX, y, columnWidth, "EXPERIENCE", profile.work_experience.length ? profile.work_experience.map((item) => `${item.role || "Practical experience"} - ${item.duration_months} months. ${item.description || ""}`) : ["Entry-level candidate; no formal work experience claimed."]);
    y = drawSection(page, latinFont, englishX, y, columnWidth, "SKILLS", [profile.skills.join("  -  ") || "To be reviewed with the candidate"]);
    drawSection(page, latinFont, englishX, y, columnWidth, "LANGUAGES & AVAILABILITY", [[profile.languages.join(", "), profile.availability.shift_preference ? `${profile.availability.shift_preference} shift` : ""].filter(Boolean).join("  -  ")]);
  }
  if (language !== "english") {
    const educationHi: Record<string, string> = { "10th": "दसवीं", "12th": "बारहवीं", ITI: "आईटीआई", Diploma: "डिप्लोमा", Graduate: "स्नातक", Other: "अन्य" };
    const toHindiDigits = (value: number) => String(value).replace(/[0-9]/g, (digit) => "०१२३४५६७८९"[Number(digit)]);
    let y = 705;
    y = drawSection(page, devanagariFont, hindiX, y, columnWidth, "परिचय", ["मध्य प्रदेश में रहने वाले उम्मीदवार। उपयुक्त नौकरी या अप्रेंटिसशिप के लिए तैयार।"]);
    y = drawSection(page, devanagariFont, hindiX, y, columnWidth, "पढ़ाई", profile.education.map((item) => educationHi[item.level] || "अन्य पढ़ाई"));
    y = drawSection(page, devanagariFont, hindiX, y, columnWidth, "प्रमाण", [profile.certifications.length ? "प्रमाण की जानकारी उपलब्ध है।" : "प्रमाण उपलब्ध नहीं।"]);
    y = drawSection(page, devanagariFont, hindiX, y, columnWidth, "अनुभव", profile.work_experience.length ? profile.work_experience.map((item) => `${toHindiDigits(item.duration_months)} महीने का उम्मीदवार द्वारा बताया गया अनुभव।`) : ["प्रारंभिक स्तर के उम्मीदवार; औपचारिक अनुभव का दावा नहीं।"]);
    y = drawSection(page, devanagariFont, hindiX, y, columnWidth, "कौशल", [profile.skills.length ? "उम्मीदवार ने अपने कौशल बताए हैं। अंग्रेजी भाग में पूरी सूची देखें।" : "उम्मीदवार के साथ कौशल की समीक्षा करें।"]);
    drawSection(page, devanagariFont, hindiX, y, columnWidth, "भाषाएँ और उपलब्धता", [profile.languages.length ? "उम्मीदवार ने भाषा और उपलब्धता की जानकारी दी है।" : "जानकारी नहीं दी गई।"]);
  }
  page.drawText("Candidate-reviewed profile - Snapshot-based guidance - No application submitted", { x: 112, y: 35, size: 7.5, font: latinFont, color: rgb(0.42, 0.5, 0.46) });
  return document.save();
}

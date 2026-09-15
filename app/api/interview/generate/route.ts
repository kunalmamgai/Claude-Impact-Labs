import { userProfileSchema } from "@/lib/backend/schemas";
import type { Opportunity } from "@/lib/backend/types";

function fallbackQuestions(profile: ReturnType<typeof userProfileSchema.parse>, opportunity: Opportunity) {
  const experience = profile.work_experience[0]?.description || "the practical experience in my profile";
  const skills = opportunity.skills_required.slice(0, 2);
  const entries = [
    ["अपने पिछले काम या व्यावहारिक अनुभव के बारे में बताइए।", "Tell us about your previous work or practical experience.", `मैंने ${experience} किया है। इससे मैंने जिम्मेदारी से काम करना और निर्देश समझना सीखा।`, `I have experience with ${experience}. It taught me to work responsibly and follow instructions.`],
    [`आप ${skills[0] || "इस काम"} का उपयोग कैसे करते हैं?`, `How do you use ${skills[0] || "the main skill for this role"}?`, `मेरी प्रोफ़ाइल में ${skills[0] || "यह कौशल"} का व्यावहारिक आधार है। मैं पहले सुरक्षा और सही प्रक्रिया की जाँच करता/करती हूँ।`, `My profile includes practical exposure to ${skills[0] || "this skill"}. I first check safety and the correct process.`],
    [`${skills[1] || "गुणवत्ता"} में गलती से कैसे बचेंगे?`, `How would you avoid mistakes in ${skills[1] || "quality work"}?`, "मैं निर्देश दोहराकर समझूँगा/समझूँगी, काम को छोटे चरणों में करूँगा/करूँगी और अंत में जाँचूँगा/जाँचूँगी।", "I repeat the instruction, work in small steps, and check the result before completing the task."],
    ["आप यह भूमिका क्यों चाहते हैं?", "Why do you want this role?", `यह ${opportunity.title} भूमिका मेरे मौजूदा कौशल से जुड़ी है और मुझे निगरानी में आगे सीखने का अवसर देती है।`, `This ${opportunity.title} role connects to my current skills and gives me a chance to keep learning under supervision.`],
    ["आप कब से काम शुरू कर सकते हैं?", "When can you start work?", `मेरी उपलब्धता ${profile.availability.start_date || profile.availability.shift_preference || "लचीली"} है। मैं employer के schedule की पुष्टि कर सकता/सकती हूँ।`, `My availability is ${profile.availability.start_date || profile.availability.shift_preference || "flexible"}. I can confirm the employer's schedule.`],
  ];
  return entries.map(([question_hindi, question_english, model_answer_hindi, model_answer_english]) => ({ question_hindi, question_english, model_answer_hindi, model_answer_english }));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { profile?: unknown; opportunity?: Opportunity; language?: string } | null;
  const profile = userProfileSchema.safeParse(body?.profile);
  if (!profile.success || !body?.opportunity?.source_listing_id) return Response.json({ error: "A valid profile and opportunity are required" }, { status: 400 });
  return Response.json({ questions: fallbackQuestions(profile.data, body.opportunity), provider: "deterministic", language: body.language || "bilingual" });
}

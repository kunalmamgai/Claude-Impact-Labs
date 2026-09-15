import Image from "next/image";
import type { Opportunity } from "@/lib/product-types";
import { cn } from "@/lib/utils";

type OpportunityVisualKind = "electrical" | "workshop" | "office";

const visuals: Record<OpportunityVisualKind, { src: string; label: string; labelHi: string; alt: string; altHi: string; position: string }> = {
  electrical: {
    src: "/images/category-electrical.jpg",
    label: "Electrical work",
    labelHi: "इलेक्ट्रिकल काम",
    alt: "Electrician checking an electrical panel with a multimeter",
    altHi: "मल्टीमीटर से इलेक्ट्रिकल पैनल जाँचता इलेक्ट्रीशियन",
    position: "center 38%",
  },
  workshop: {
    src: "/images/category-workshop.jpg",
    label: "Workshop skills",
    labelHi: "वर्कशॉप हुनर",
    alt: "Young technician using test tools at a workshop bench",
    altHi: "वर्कशॉप बेंच पर जाँच के औज़ार इस्तेमाल करता युवा टेक्नीशियन",
    position: "center 48%",
  },
  office: {
    src: "/images/category-office.jpg",
    label: "Computer & office work",
    labelHi: "कंप्यूटर और ऑफिस काम",
    alt: "Indian worker using a computer at her work station",
    altHi: "अपने कार्यस्थल पर कंप्यूटर इस्तेमाल करती भारतीय कर्मचारी",
    position: "center 44%",
  },
};

export function getOpportunityVisual(opportunity: Opportunity) {
  const name = `${opportunity.title} ${opportunity.titleHi}`;
  if (/office|data entry|customer support/i.test(name)) return visuals.office;
  if (/fitter|assembly|maintenance trainee/i.test(name)) return visuals.workshop;
  return visuals.electrical;
}

export function OpportunityVisual({ opportunity, hi, className, sizes = "(max-width: 640px) 100vw, 190px", priority = false }: { opportunity: Opportunity; hi: boolean; className?: string; sizes?: string; priority?: boolean }) {
  const visual = getOpportunityVisual(opportunity);

  return (
    <div className={cn("relative overflow-hidden bg-[#dce8df]", className)}>
      <Image
        src={visual.src}
        alt={hi ? visual.altHi : visual.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-500 group-hover:scale-[1.025]"
        style={{ objectPosition: visual.position }}
      />
      <span className="absolute bottom-2 left-2 rounded-lg bg-[#17332d]/88 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-white shadow-sm backdrop-blur-sm">
        {hi ? visual.labelHi : visual.label}
      </span>
    </div>
  );
}

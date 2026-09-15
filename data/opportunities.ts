import type { Course, InterviewQuestion, Opportunity } from "@/lib/product-types";

const electricalQuestions: InterviewQuestion[] = [
  {
    id: "eq-1",
    question: "Tell us about yourself and why you want this apprenticeship.",
    questionHi: "अपने बारे में बताइए और आप यह अप्रेंटिसशिप क्यों करना चाहते हैं?",
    answer: "I completed 12th and ITI Electrician. I have practised household wiring and small repairs safely. I now want supervised industry experience so I can become a dependable electrician.",
    answerHi: "मैंने 12वीं और ITI Electrician पूरा किया है। मैंने घरेलू वायरिंग और छोटे रिपेयर का सुरक्षित अभ्यास किया है। अब मैं निगरानी में औद्योगिक अनुभव लेकर एक भरोसेमंद इलेक्ट्रीशियन बनना चाहता हूँ।",
    tip: "Keep it under 45 seconds and connect your training to this role.",
  },
  {
    id: "eq-2",
    question: "What safety checks do you do before electrical work?",
    questionHi: "बिजली का काम शुरू करने से पहले आप कौन-सी सुरक्षा जाँच करेंगे?",
    answer: "I isolate and switch off the supply, verify that power is off with a tester, wear suitable PPE, check tools and keep the work area dry before touching wiring.",
    answerHi: "मैं सप्लाई अलग करके बंद करता हूँ, टेस्टर से बिजली बंद होने की पुष्टि करता हूँ, सही PPE पहनता हूँ, औज़ार जाँचता हूँ और वायरिंग छूने से पहले जगह सूखी रखता हूँ।",
    tip: "Always mention isolation and testing before touching a conductor.",
  },
  {
    id: "eq-3",
    question: "How would you find the cause of a tripping circuit?",
    questionHi: "बार-बार ट्रिप होने वाले सर्किट की खराबी कैसे खोजेंगे?",
    answer: "First I make the circuit safe. Then I inspect for loose or burnt connections, separate loads, test continuity and insulation step by step, and report anything outside my authority.",
    answerHi: "पहले मैं सर्किट सुरक्षित करूँगा। फिर ढीले या जले कनेक्शन देखूँगा, लोड अलग करूँगा, एक-एक करके continuity और insulation जाँचूँगा और अपनी सीमा से बाहर की समस्या सुपरवाइज़र को बताऊँगा।",
    tip: "Show a safe, step-by-step approach rather than guessing.",
  },
  {
    id: "eq-4",
    question: "Describe practical electrical work you have done.",
    questionHi: "आपने जो व्यावहारिक बिजली का काम किया है, उसके बारे में बताइए।",
    answer: "During ITI and at home I practised connecting switches and sockets, replacing damaged holders and tracing simple faults. This was informal practice, not professional employment.",
    answerHi: "ITI और घर पर मैंने स्विच-सॉकेट जोड़ने, खराब होल्डर बदलने और साधारण फॉल्ट ढूँढने का अभ्यास किया। यह अनौपचारिक अभ्यास था, पेशेवर नौकरी नहीं।",
    tip: "Be honest about informal experience; explain exactly what you did.",
  },
  {
    id: "eq-5",
    question: "What will you do if you do not understand an instruction?",
    questionHi: "अगर कोई निर्देश समझ न आए तो आप क्या करेंगे?",
    answer: "I will pause, repeat what I understood, ask the supervisor to clarify, and only continue when I am sure the task and safety steps are clear.",
    answerHi: "मैं रुककर जो समझा हूँ उसे दोहराऊँगा, सुपरवाइज़र से स्पष्ट करने को कहूँगा और काम व सुरक्षा के कदम साफ़ होने पर ही आगे बढ़ूँगा।",
    tip: "Employers value safe communication more than pretending to know.",
  },
];

const officeQuestions: InterviewQuestion[] = [
  {
    id: "oq-1", question: "Tell us about your computer skills.", questionHi: "अपने कंप्यूटर कौशल के बारे में बताइए।",
    answer: "I completed a basic computer course and used Word and Excel to maintain attendance and fee records. I focus on accurate entries and check my work before saving.",
    answerHi: "मैंने बेसिक कंप्यूटर कोर्स किया है और Word व Excel में उपस्थिति और फीस रिकॉर्ड बनाए हैं। मैं सही एंट्री पर ध्यान देती हूँ और सेव करने से पहले काम जाँचती हूँ।", tip: "Give one real example for each skill.",
  },
  {
    id: "oq-2", question: "How do you avoid mistakes in data entry?", questionHi: "डेटा एंट्री में गलती से कैसे बचती हैं?",
    answer: "I work in small batches, compare entries with the source, use consistent formats and do a final row-by-row check.",
    answerHi: "मैं छोटे हिस्सों में काम करती हूँ, एंट्री को स्रोत से मिलाती हूँ, एक जैसा फ़ॉर्मेट रखती हूँ और अंत में हर पंक्ति जाँचती हूँ।", tip: "Mention accuracy and confidentiality.",
  },
  {
    id: "oq-3", question: "How would you handle a visitor who is confused?", questionHi: "किसी उलझन में आए आगंतुक की मदद कैसे करेंगी?",
    answer: "I would listen calmly, confirm what they need, explain the next step in simple language and ask a senior if I do not know the answer.",
    answerHi: "मैं शांति से सुनूँगी, उनकी ज़रूरत समझूँगी, आसान भाषा में अगला कदम बताऊँगी और जवाब न पता हो तो वरिष्ठ से पूछूँगी।", tip: "Show patience and clear communication.",
  },
  {
    id: "oq-4", question: "Which Excel tasks can you do?", questionHi: "Excel में आप कौन-कौन से काम कर सकती हैं?",
    answer: "I can enter and format data, sort lists, use simple SUM formulas and prepare a clean attendance or payment sheet.",
    answerHi: "मैं डेटा एंट्री और फ़ॉर्मेटिंग, सूची sort करना, साधारण SUM formula और साफ़ attendance या payment sheet बना सकती हूँ।", tip: "Only claim functions you can demonstrate.",
  },
  {
    id: "oq-5", question: "Why should we hire a fresher?", questionHi: "हम एक fresher को क्यों रखें?",
    answer: "I may be new to formal work, but I am careful, comfortable with basic office tools and ready to learn your process with discipline.",
    answerHi: "मैं औपचारिक काम में नई हूँ, लेकिन सावधानी से काम करती हूँ, बेसिक office tools जानती हूँ और आपकी प्रक्रिया अनुशासन से सीखने को तैयार हूँ।", tip: "Be confident without overstating experience.",
  },
];

const fitterQuestions: InterviewQuestion[] = [
  {
    id: "fq-1", question: "Tell us about your ITI workshop practice.", questionHi: "अपने ITI workshop practice के बारे में बताइए।",
    answer: "In ITI I practised bench fitting, filing, marking, drilling and measurement with vernier callipers. I followed PPE and housekeeping rules.",
    answerHi: "ITI में मैंने bench fitting, filing, marking, drilling और vernier calliper से measurement का अभ्यास किया। मैंने PPE और housekeeping नियमों का पालन किया।", tip: "Name tools and safety habits.",
  },
  {
    id: "fq-2", question: "How do you check a part before filing?", questionHi: "किसी part को file करने से पहले कैसे जाँचेंगे?",
    answer: "I read the drawing, check material and dimensions, mark the reference lines, clamp the part safely and measure regularly while filing.",
    answerHi: "मैं drawing पढ़ूँगा, material और dimensions जाँचूँगा, reference lines mark करूँगा, part को सुरक्षित clamp करूँगा और filing के दौरान बार-बार मापूँगा।", tip: "Explain the sequence clearly.",
  },
  {
    id: "fq-3", question: "Which measuring tools have you used?", questionHi: "आपने कौन-कौन से measuring tools इस्तेमाल किए हैं?",
    answer: "I have used a steel rule, try square, outside calliper and vernier calliper during supervised workshop practice.",
    answerHi: "मैंने supervised workshop practice में steel rule, try square, outside calliper और vernier calliper इस्तेमाल किए हैं।", tip: "Say where you used each tool.",
  },
  {
    id: "fq-4", question: "What does good workshop housekeeping mean?", questionHi: "अच्छी workshop housekeeping का क्या मतलब है?",
    answer: "Tools return to their place, scrap and oil are cleared, walkways stay open, guards remain in place and hazards are reported quickly.",
    answerHi: "औज़ार अपनी जगह लौटें, scrap और oil साफ़ हों, रास्ते खुले रहें, guards लगे रहें और खतरे की सूचना तुरंत दी जाए।", tip: "Connect housekeeping to accident prevention.",
  },
  {
    id: "fq-5", question: "How do you learn a new machine task?", questionHi: "नई machine task कैसे सीखेंगे?",
    answer: "I first observe the supervisor, confirm the steps and risks, perform the task slowly under supervision and ask for feedback.",
    answerHi: "मैं पहले supervisor को देखूँगा, steps और risks समझूँगा, निगरानी में धीरे-धीरे task करूँगा और feedback लूँगा।", tip: "Show that safety comes before speed.",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "electrical-apprentice-bhel", title: "Electrical Apprentice", titleHi: "इलेक्ट्रिकल अप्रेंटिस", organisation: "BHEL Training Centre (Demo)", location: "Bhopal", type: "apprenticeship", workMode: "On-site", compensation: "₹9,000–₹12,000 / month", posted: "Snapshot: Sep 2026", summary: "Structured shop-floor training in electrical maintenance under a qualified supervisor.", sourceName: "Apprenticeship India demo snapshot", sourceRowId: "APS-BPL-014", interviewQuestions: electricalQuestions,
    requirements: [
      { id: "ea-edu", type: "education", minEducationLevel: 10, formal: "Applicant must have passed Class 10 or an equivalent examination.", simple: "You need to have passed Class 10. Your 12th qualification meets this.", simpleHi: "कम से कम 10वीं पास होना ज़रूरी है। आपकी 12वीं की योग्यता इसे पूरा करती है।" },
      { id: "ea-cert", type: "certification", requiredCertification: "electrician", formal: "Candidate must possess NCVT/SCVT recognised ITI certification in Electrician trade.", simple: "You need a recognised ITI Electrician certificate.", simpleHi: "मान्यता प्राप्त ITI Electrician प्रमाणपत्र चाहिए।" },
      { id: "ea-exp", type: "experience", minExperienceMonths: 0, formal: "Fresh candidates are eligible; prior industrial experience is not mandatory.", simple: "Freshers can apply. No previous job is required.", simpleHi: "Fresher पात्र हैं। पिछली नौकरी ज़रूरी नहीं है।" },
      { id: "ea-skill", type: "skill", skill: "Basic safety practices", formal: "Foundational knowledge of electrical safety and hand tools is expected.", simple: "You should understand basic electrical safety and common tools.", simpleHi: "बिजली की बुनियादी सुरक्षा और आम औज़ारों की समझ होनी चाहिए।" },
    ],
  },
  {
    id: "junior-technician", title: "Junior Electrical Technician", titleHi: "जूनियर इलेक्ट्रिकल टेक्नीशियन", organisation: "Vindhya Facilities Services", location: "Bhopal", type: "job", workMode: "On-site", compensation: "₹14,000–₹17,000 / month", posted: "Snapshot: Sep 2026", summary: "Assist with building maintenance, preventive checks and fault reporting across client sites.", sourceName: "NCS-style demo snapshot", sourceRowId: "NCS-MP-221", interviewQuestions: electricalQuestions,
    requirements: [
      { id: "jt-edu", type: "education", minEducationLevel: 10, formal: "Minimum educational qualification: 10th pass.", simple: "You need at least Class 10.", simpleHi: "कम से कम 10वीं पास होना चाहिए।" },
      { id: "jt-cert", type: "certification", requiredCertification: "electrician", formal: "ITI Electrician certification from a recognised institute is mandatory.", simple: "A recognised ITI Electrician certificate is required.", simpleHi: "मान्यता प्राप्त ITI Electrician प्रमाणपत्र ज़रूरी है।" },
      { id: "jt-exp", type: "experience", minExperienceMonths: 12, formal: "Minimum one year of documented electrical maintenance experience.", simple: "You need proof of at least one year of maintenance work. Informal household work does not meet this rule yet.", simpleHi: "कम से कम एक साल के maintenance work का दस्तावेज़ी प्रमाण चाहिए। घरेलू अनौपचारिक काम अभी यह शर्त पूरी नहीं करता।" },
      { id: "jt-skill", type: "skill", skill: "Electrical troubleshooting", formal: "Basic fault diagnosis capability required.", simple: "You should be able to trace simple electrical faults.", simpleHi: "साधारण electrical fault ढूँढने की क्षमता होनी चाहिए।" },
    ],
  },
  {
    id: "maintenance-trainee", title: "Maintenance Trainee", titleHi: "मेंटेनेंस ट्रेनी", organisation: "Mandideep Components Co. (Demo)", location: "Mandideep, Raisen", type: "job", workMode: "On-site", compensation: "₹12,500–₹15,000 / month", posted: "Snapshot: Sep 2026", summary: "Entry-level production maintenance support with rotational training.", sourceName: "MP employment portal demo snapshot", sourceRowId: "MPEMP-078", interviewQuestions: electricalQuestions,
    requirements: [
      { id: "mt-edu", type: "education", minEducationLevel: 10, formal: "10th pass with ITI in a relevant engineering trade.", simple: "You need Class 10 and a relevant ITI trade.", simpleHi: "10वीं और संबंधित ITI trade चाहिए।" },
      { id: "mt-cert", type: "certification", requiredCertification: "electrician", formal: "ITI Electrician or Fitter accepted.", simple: "ITI Electrician or Fitter is accepted.", simpleHi: "ITI Electrician या Fitter दोनों स्वीकार हैं।" },
      { id: "mt-exp", type: "experience", minExperienceMonths: 0, formal: "Experience not essential.", simple: "Freshers are accepted.", simpleHi: "Fresher स्वीकार हैं।" },
      { id: "mt-skill", type: "skill", skill: "Hand tools", formal: "Familiarity with basic engineering hand tools.", simple: "You should know common workshop or electrical hand tools.", simpleHi: "आम workshop या electrical hand tools की जानकारी होनी चाहिए।" },
    ],
  },
  {
    id: "office-assistant", title: "Office Assistant Trainee", titleHi: "ऑफिस असिस्टेंट ट्रेनी", organisation: "Bhopal District Services Centre (Demo)", location: "Bhopal", type: "job", workMode: "On-site", compensation: "₹11,000–₹14,000 / month", posted: "Snapshot: Sep 2026", summary: "Support visitor records, document preparation and routine spreadsheet updates.", sourceName: "NCS-style demo snapshot", sourceRowId: "NCS-MP-305", interviewQuestions: officeQuestions,
    requirements: [
      { id: "oa-edu", type: "education", minEducationLevel: 12, formal: "Higher Secondary (10+2) pass from a recognised board.", simple: "You need to have passed Class 12.", simpleHi: "मान्यता प्राप्त बोर्ड से 12वीं पास होना चाहिए।" },
      { id: "oa-exp", type: "experience", minExperienceMonths: 0, formal: "Freshers may apply.", simple: "No previous formal job is required.", simpleHi: "पहली औपचारिक नौकरी न होना कोई बाधा नहीं है।" },
      { id: "oa-word", type: "skill", skill: "MS Word", formal: "Working knowledge of word processing is essential.", simple: "You should be able to create and format a document in Word.", simpleHi: "Word में document बनाना और format करना आना चाहिए।" },
      { id: "oa-excel", type: "skill", skill: "MS Excel", formal: "Basic spreadsheet and data entry skills required.", simple: "You should be able to enter and organise data in Excel.", simpleHi: "Excel में डेटा भरना और व्यवस्थित करना आना चाहिए।" },
    ],
  },
  {
    id: "data-entry", title: "Data Entry Operator", titleHi: "डेटा एंट्री ऑपरेटर", organisation: "Sarthak Digital Seva (Demo)", location: "Bhopal", type: "job", workMode: "Hybrid", compensation: "₹13,000–₹16,000 / month", posted: "Snapshot: Sep 2026", summary: "Digitise application records and perform quality checks on bilingual entries.", sourceName: "MP employment portal demo snapshot", sourceRowId: "MPEMP-109", interviewQuestions: officeQuestions,
    requirements: [
      { id: "de-edu", type: "education", minEducationLevel: 12, formal: "12th pass mandatory.", simple: "You need Class 12.", simpleHi: "12वीं पास होना ज़रूरी है।" },
      { id: "de-exp", type: "experience", minExperienceMonths: 0, formal: "Entry-level applicants accepted.", simple: "Freshers may apply.", simpleHi: "Fresher आवेदन कर सकते हैं।" },
      { id: "de-excel", type: "skill", skill: "MS Excel", formal: "Basic Excel proficiency and accurate data entry required.", simple: "You need basic Excel and careful typing.", simpleHi: "Basic Excel और सावधानी से typing आनी चाहिए।" },
      { id: "de-hindi", type: "skill", skill: "Hindi typing", formal: "Hindi Unicode typing desirable.", simple: "Hindi typing is preferred and improves your fit.", simpleHi: "Hindi typing को प्राथमिकता दी जाएगी और यह आपका match बेहतर बनाती है।" },
    ],
  },
  {
    id: "customer-support", title: "Customer Support Associate", titleHi: "कस्टमर सपोर्ट एसोसिएट", organisation: "MP Citizen Connect (Demo)", location: "Bhopal", type: "job", workMode: "On-site", compensation: "₹14,000–₹18,000 / month", posted: "Snapshot: Sep 2026", summary: "Guide citizens on service requests using clear Hindi and basic computer tools.", sourceName: "NCS-style demo snapshot", sourceRowId: "NCS-MP-337", interviewQuestions: officeQuestions,
    requirements: [
      { id: "cs-edu", type: "education", minEducationLevel: 12, formal: "Minimum 12th pass.", simple: "You need Class 12.", simpleHi: "12वीं पास होना चाहिए।" },
      { id: "cs-exp", type: "experience", minExperienceMonths: 0, formal: "Freshers with strong communication may apply.", simple: "Freshers can apply if they communicate clearly.", simpleHi: "साफ़ communication वाले Fresher आवेदन कर सकते हैं।" },
      { id: "cs-skill", type: "skill", skill: "Customer communication", formal: "Clear spoken Hindi and customer handling ability required.", simple: "You should be able to listen and explain next steps politely in Hindi.", simpleHi: "Hindi में ध्यान से सुनकर विनम्रता से अगला कदम समझाना आना चाहिए।" },
      { id: "cs-word", type: "skill", skill: "MS Word", formal: "Basic computer operation required.", simple: "You need basic computer confidence.", simpleHi: "Basic computer चलाना आना चाहिए।" },
    ],
  },
  {
    id: "fitter-apprentice", title: "Fitter Apprentice", titleHi: "फिटर अप्रेंटिस", organisation: "Central Workshop Bhopal (Demo)", location: "Bhopal", type: "apprenticeship", workMode: "On-site", compensation: "₹9,500–₹11,500 / month", posted: "Snapshot: Sep 2026", summary: "Supervised apprenticeship in fitting, assembly and preventive workshop maintenance.", sourceName: "Apprenticeship India demo snapshot", sourceRowId: "APS-BPL-032", interviewQuestions: fitterQuestions,
    requirements: [
      { id: "fa-edu", type: "education", minEducationLevel: 10, formal: "Class 10 pass required.", simple: "You need Class 10.", simpleHi: "10वीं पास होना चाहिए।" },
      { id: "fa-cert", type: "certification", requiredCertification: "fitter", formal: "ITI Fitter certificate recognised by NCVT/SCVT.", simple: "You need a recognised ITI Fitter certificate.", simpleHi: "मान्यता प्राप्त ITI Fitter certificate चाहिए।" },
      { id: "fa-exp", type: "experience", minExperienceMonths: 0, formal: "No prior employment required.", simple: "Freshers are eligible.", simpleHi: "Fresher पात्र हैं।" },
      { id: "fa-skill", type: "skill", skill: "Bench fitting", formal: "Foundational bench fitting practice expected.", simple: "You should have practised filing, marking and fitting at a bench.", simpleHi: "Bench पर filing, marking और fitting का अभ्यास होना चाहिए।" },
    ],
  },
  {
    id: "assembly-trainee", title: "Assembly Line Trainee", titleHi: "असेंबली लाइन ट्रेनी", organisation: "Sehore Auto Parts (Demo)", location: "Sehore", type: "job", workMode: "On-site", compensation: "₹12,000–₹14,500 / month", posted: "Snapshot: Sep 2026", summary: "Entry-level mechanical assembly with quality and safety training.", sourceName: "MP employment portal demo snapshot", sourceRowId: "MPEMP-144", interviewQuestions: fitterQuestions,
    requirements: [
      { id: "at-edu", type: "education", minEducationLevel: 10, formal: "10th pass with technical trade exposure.", simple: "You need Class 10 and some technical training.", simpleHi: "10वीं और कुछ technical training चाहिए।" },
      { id: "at-cert", type: "certification", requiredCertification: "fitter", formal: "ITI Fitter preferred.", simple: "ITI Fitter is preferred for this role.", simpleHi: "इस role के लिए ITI Fitter को प्राथमिकता है।" },
      { id: "at-exp", type: "experience", minExperienceMonths: 0, formal: "Freshers accepted after practical assessment.", simple: "Freshers can qualify after a practical test.", simpleHi: "Fresher practical test के बाद qualify कर सकते हैं।" },
      { id: "at-skill", type: "skill", skill: "Measurement tools", formal: "Ability to use basic measurement instruments.", simple: "You should know basic measuring tools.", simpleHi: "Basic measuring tools का इस्तेमाल आना चाहिए।" },
    ],
  },
];

export const courses: Course[] = [
  { id: "course-industrial-electrical", title: "Industrial Electrical Maintenance", titleHi: "औद्योगिक इलेक्ट्रिकल मेंटेनेंस", provider: "Govt. ITI Bhopal — Continuing Skills (Demo)", location: "Govindpura, Bhopal", duration: "12 weeks", closesGap: "Industrial maintenance exposure and documented supervised practice", sourceName: "Bhopal skills catalogue demo snapshot", sourceRowId: "SKL-BPL-018", relatedTrades: ["electrician"] },
  { id: "course-apprentice-readiness", title: "Apprenticeship Readiness — Electrical", titleHi: "इलेक्ट्रिकल अप्रेंटिसशिप तैयारी", provider: "Model Career Centre Bhopal (Demo)", location: "Bhopal", duration: "2 weeks", closesGap: "Safety revision, documentation and interview readiness", sourceName: "Bhopal skills catalogue demo snapshot", sourceRowId: "SKL-BPL-021", relatedTrades: ["electrician"] },
  { id: "course-office-excel", title: "Workplace Excel & Data Accuracy", titleHi: "वर्कप्लेस Excel और डेटा शुद्धता", provider: "Skill Centre MP Nagar (Demo)", location: "MP Nagar, Bhopal", duration: "6 weeks", closesGap: "Spreadsheet formulas, formatting and data quality checks", sourceName: "Bhopal skills catalogue demo snapshot", sourceRowId: "SKL-BPL-044", relatedTrades: ["office"] },
  { id: "course-customer-service", title: "Front Desk & Customer Service", titleHi: "फ्रंट डेस्क और कस्टमर सर्विस", provider: "District Employment Office (Demo)", location: "Bhopal", duration: "4 weeks", closesGap: "Professional communication and service desk practice", sourceName: "Bhopal skills catalogue demo snapshot", sourceRowId: "SKL-BPL-047", relatedTrades: ["office"] },
  { id: "course-cnc-basics", title: "CNC & Precision Measurement Basics", titleHi: "CNC और प्रिसीजन मेज़रमेंट बेसिक्स", provider: "Govt. ITI Govindpura (Demo)", location: "Bhopal", duration: "8 weeks", closesGap: "Machine-shop measurement and entry-level CNC familiarity", sourceName: "Bhopal skills catalogue demo snapshot", sourceRowId: "SKL-BPL-061", relatedTrades: ["fitter"] },
  { id: "course-workshop-safety", title: "Workshop Safety & Quality Basics", titleHi: "वर्कशॉप सेफ्टी और क्वालिटी बेसिक्स", provider: "Sehore Skill Hub (Demo)", location: "Sehore", duration: "3 weeks", closesGap: "Documented safety, inspection and quality practice", sourceName: "MP skills catalogue demo snapshot", sourceRowId: "SKL-MP-073", relatedTrades: ["fitter"] },
];

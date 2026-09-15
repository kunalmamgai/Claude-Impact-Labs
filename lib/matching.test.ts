import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessOpportunity } from "./matching";
import type { CandidateProfile, Opportunity } from "./product-types";

const baseCandidate: CandidateProfile = {
  id: "c1",
  name: "Test Candidate",
  initials: "TC",
  phone: "+91 98765 43210",
  email: "test@example.com",
  location: "Bhopal, Madhya Pradesh",
  district: "Bhopal",
  education: "ITI",
  educationLevel: 13,
  certification: "ITI Electrician",
  trade: "electrician",
  experienceLabel: "12 months",
  experienceMonths: 12,
  practicalExperience: "Installed wiring in residential sites.",
  availability: "Morning shift",
  preferredRoles: ["Electrician"],
  skills: [{ name: "customer handling", evidence: "Mentioned in profile", confidence: 80 }],
  languages: ["Hindi"],
  transcript: "I have worked on wiring and customer-facing tasks.",
  summary: "Entry-level electrician with hands-on site work.",
  clarification: {
    question: "Do you have any formal trade certificate?",
    questionHi: "क्या आपके पास कोई औपचारिक ट्रेड प्रमाणपत्र है?",
    options: ["Yes", "No"],
  },
};

const unknownSkillOpportunity: Opportunity = {
  id: "opp-unknown",
  title: "Site Electrician",
  titleHi: "साइट इलेक्ट्रीशियन",
  organisation: "City Works Ltd",
  location: "Bhopal",
  type: "job",
  workMode: "On-site",
  compensation: "₹12,000/month",
  posted: "Demo snapshot",
  summary: "Electrical site work with basic maintenance.",
  requirements: [{
    id: "skill-1",
    formal: "Must know residential wiring",
    simple: "Residential wiring experience",
    simpleHi: "रिज़िडेंशियल वायरिंग अनुभव",
    type: "skill",
    skill: "residential wiring",
  }],
  sourceName: "Demo snapshot",
  sourceRowId: "demo-unknown",
  interviewQuestions: [],
};

describe("assessOpportunity", () => {
  it("marks missing evidence as needs-info instead of treating it as a pass", () => {
    const result = assessOpportunity(baseCandidate, unknownSkillOpportunity);

    assert.equal(result.eligible, false);
    assert.ok(result.needsInfo.length > 0);
    assert.equal(result.missing.length, 0);
    assert.ok(result.relevanceScore < 80);
  });
});

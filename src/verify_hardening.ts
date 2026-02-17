
import { analyzeJD, detectSkills } from "./lib/analysis";

console.log("Starting Verification of Hardening Logic...\n");

// Test 1: Schema Population & Categorization
console.log("Test 1: Schema Population & Categorization");
const jd = "We need a React developer with TypeScript and Node.js skills. Experience with AWS is a plus.";
const analysis = analyzeJD("TestCorp", "Developer", jd);

let passed1 = true;
if (!analysis.id) { console.error("FAIL: Missing ID"); passed1 = false; }
if (typeof analysis.baseScore !== 'number') { console.error("FAIL: Missing baseScore"); passed1 = false; }
if (analysis.baseScore !== analysis.finalScore) { console.error("FAIL: baseScore should equal finalScore initially"); passed1 = false; }
if (!analysis.extractedSkills.web.includes("React")) { console.error("FAIL: Failed to detect 'React' in web category"); passed1 = false; }
if (!analysis.extractedSkills.languages.includes("TypeScript")) { console.error("FAIL: Failed to detect 'TypeScript' in languages"); passed1 = false; }

if (passed1) console.log("PASS: Schema instantiated correctly with categorized skills.\n");

// Test 2: Default Skills for Empty Analysis
console.log("Test 2: Default Skills for Empty Analysis");
const emptyAnalysis = analyzeJD("EmptyCorp", "Ghost", "Nothing here");
// The detector logic I wrote: if totalSkills === 0, populate 'other'.
const otherSkills = emptyAnalysis.extractedSkills.other;
const isDefault = otherSkills.includes("Communication") && otherSkills.includes("Problem solving");

if (isDefault) {
    console.log("PASS: Default skills populated correctly when no technical skills found.\n");
} else {
    console.error("FAIL: Default skills not populated. Found:", emptyAnalysis.extractedSkills);
}

// Test 3: Score Distinctness Logic Check (Simulation)
console.log("Test 3: Score Distinctness Logic Check");
// We can't test separate updates here as that logic is in the React component (which we modified to update finalScore separately)
// But we verified above that they start equal.
console.log("INFO: logic for splitting base/final score is in Results.tsx (Result: Checked via Code Review).\n");

console.log("Verification Script Complete.");

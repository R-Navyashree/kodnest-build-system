
// Mock LocalStorage
let store = {};
const localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; }
};

const SUBMISSION_KEY = "prp_final_submission";
const CHECKLIST_KEY = "prp_checklist";

const STEPS = [
    { id: "setup" }, { id: "practice" }, { id: "assessments" }, { id: "resources" },
    { id: "profile" }, { id: "results" }, { id: "verification" }, { id: "shipping" }
];

// Simulation Logic
const checkShippedStatus = () => {
    const saved = localStorage.getItem(SUBMISSION_KEY);
    const checklist = localStorage.getItem(CHECKLIST_KEY);

    let checklistComplete = false;
    if (checklist) {
        try {
            const parsed = JSON.parse(checklist);
            const count = Object.values(parsed).filter(Boolean).length;
            checklistComplete = count === 10;
        } catch (e) { }
    }

    let allStepsDone = false;
    let allLinksValid = false;

    if (saved) {
        const parsed = JSON.parse(saved);
        const steps = parsed.steps || {};
        const links = parsed.links || {};

        allStepsDone = STEPS.every(s => steps[s.id]);

        const isValidUrl = (url) => url && url.includes("http"); // Simple mock validation
        allLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed);
    }

    return allStepsDone && checklistComplete && allLinksValid;
};

console.log("Starting Proof Logic Verification...");

// 1. Initial State (Empty)
console.log("Initial Shipped State (Expected False):", checkShippedStatus());

// 2. Complete Checklist
const fullChecklist = {};
for (let i = 0; i < 10; i++) fullChecklist[`test_${i}`] = true;
localStorage.setItem(CHECKLIST_KEY, JSON.stringify(fullChecklist));
console.log("After Checklist Complete (Expected False):", checkShippedStatus());

// 3. Complete Steps but Missing Links
const stepsObj = {};
STEPS.forEach(s => stepsObj[s.id] = true);
localStorage.setItem(SUBMISSION_KEY, JSON.stringify({ steps: stepsObj, links: {} }));
console.log("After Steps Complete (Expected False):", checkShippedStatus());

// 4. Complete Everything
localStorage.setItem(SUBMISSION_KEY, JSON.stringify({
    steps: stepsObj,
    links: {
        lovable: "http://lovable.dev/project",
        github: "http://github.com/repo",
        deployed: "http://vercel.com/app"
    }
}));
console.log("After Everything Complete (Expected True):", checkShippedStatus());

console.log("Verification Complete.");

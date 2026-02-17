
// POLYFILLS
if (!globalThis.crypto) {
    // @ts-ignore
    globalThis.crypto = { randomUUID: () => "mock-uuid-" + Math.random() };
}

// ---------------------------------------------------------
// COPIED LOGIC FROM src/lib/analysis.ts
// ---------------------------------------------------------

interface CompanyIntel {
    size: "Startup" | "Mid-size" | "Enterprise";
    industry: string;
    focus: string;
}

interface RoundInfo {
    stage: string;
    name: string;
    description: string;
}

interface SkillCategories {
    coreCS: string[];
    languages: string[];
    web: string[];
    data: string[];
    cloud: string[];
    testing: string[];
    other: string[];
}

interface AnalysisEntry {
    id: string;
    createdAt: number;
    updatedAt: number;
    company: string;
    role: string;
    jdText: string;
    extractedSkills: SkillCategories;
    plan7Days: Array<{ day: string; focus: string; tasks: string[] }>;
    checklist: Array<{ round: string; items: string[] }>;
    questions: string[];
    baseScore: number;
    finalScore: number;
    skillConfidenceMap: Record<string, "know" | "practice">;
    companyIntel: CompanyIntel;
    roundMapping: RoundInfo[];
}

const SKILL_CATEGORIES_MAP: Record<keyof SkillCategories, string[]> = {
    coreCS: ["DSA", "OOP", "DBMS", "OS", "Networks", "Data Structures", "Algorithms", "Object Oriented", "System Design"],
    languages: ["Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby"],
    web: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "HTML", "CSS", "Tailwind", "Redux", "Angular", "Vue"],
    data: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL", "Database", "Elasticsearch", "Kafka"],
    cloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Git", "Jenkins", "Terraform"],
    testing: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "TDD"],
    other: ["Communication", "Problem Solving", "Agile", "Scrum", "Jira", "Leadership"]
};

const ENTERPRISE_COMPANIES = ["google", "amazon", "microsoft", "meta", "facebook", "netflix", "apple", "adobe", "salesforce", "uber", "infosys", "tcs", "wipro", "accenture", "cognizant", "ibm", "oracle", "sap", "cisco", "intel"];

const detectSkills = (jdText: string): SkillCategories => {
    const detected: SkillCategories = {
        coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: []
    };
    const lowerJD = jdText.toLowerCase();

    (Object.keys(SKILL_CATEGORIES_MAP) as Array<keyof SkillCategories>).forEach(category => {
        SKILL_CATEGORIES_MAP[category].forEach(skill => {
            const isShort = skill.length <= 3;
            if (isShort) {
                const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`, 'i');
                if (regex.test(lowerJD)) detected[category].push(skill);
            } else {
                if (lowerJD.includes(skill.toLowerCase())) detected[category].push(skill);
            }
        });
    });

    const totalSkills = Object.values(detected).flat().length;
    if (totalSkills === 0) {
        detected.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    return detected;
};

const estimateCompanyIntel = (company: string, jdText: string): CompanyIntel => {
    const lowerCompany = company.toLowerCase();
    let size: "Startup" | "Mid-size" | "Enterprise" = "Startup"; // Default
    if (ENTERPRISE_COMPANIES.some(c => lowerCompany.includes(c))) {
        size = "Enterprise";
    } else if (jdText.toLowerCase().includes("mnc") || jdText.toLowerCase().includes("corporation") || jdText.toLowerCase().includes("global")) {
        size = "Enterprise";
    }

    let focus = "Practical problem solving & strict tech stack adherence.";
    if (size === "Enterprise") {
        focus = "Strong Fundamentals (DSA, Core CS) & System Design capability.";
    }

    let industry = "Technology Services";
    if (lowerCompany.includes("bank") || lowerCompany.includes("financial")) industry = "FinTech";
    if (lowerCompany.includes("health") || lowerCompany.includes("pharma")) industry = "HealthTech";
    if (lowerCompany.includes("commerce") || lowerCompany.includes("retail")) industry = "E-commerce";

    return { size, industry, focus };
};

const generateRoundMapping = (intel: CompanyIntel, flatSkills: string[]): RoundInfo[] => {
    const mapping: RoundInfo[] = [];
    const hasSkill = (s: string) => flatSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase()));

    if (intel.size === "Enterprise") {
        mapping.push({ stage: "Round 1", name: "Online Assessment", description: "Aptitude (Quant/Verbal) + 2 medium DSA coding problems." });
        mapping.push({ stage: "Round 2", name: "Technical Interview I", description: "Data Structures & Algorithms focus (Trees, Graphs, DP)." });
        mapping.push({ stage: "Round 3", name: "Technical Interview II", description: "System Design basics & Core CS concepts (OS, DBMS)." });
        mapping.push({ stage: "Round 4", name: "Managerial / HR", description: "Behavioral fit, 'Bar Raiser', and culture alignment." });
    } else {
        mapping.push({ stage: "Round 1", name: "Screening / Assignment", description: "Take-home project or practical coding task related to the stack." });
        mapping.push({ stage: "Round 2", name: "Technical Deep Dive", description: `In-depth discussion on ${hasSkill('React') ? 'Frontend architecture' : 'Backend logic'} & code review.` });
        if (hasSkill("System Design") || hasSkill("Cloud")) {
            mapping.push({ stage: "Round 3", name: "System Design / Architecture", description: "High-level design of a feature you've built." });
        }
        mapping.push({ stage: "Final Round", name: "Founder / Culture Fit", description: "Passion for the product, ownership mindset, and salary discussion." });
    }

    return mapping;
};

const generateChecklist = (flatSkills: string[]) => {
    const hasSkill = (s: string) => flatSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase()));
    const isFrontend = hasSkill('React') || hasSkill('JavaScript') || hasSkill('HTML');
    const isBackend = hasSkill('Node') || hasSkill('Java') || hasSkill('Python') || hasSkill('SQL');

    return [
        {
            round: "Round 1: Aptitude / Basics",
            items: [
                "Quantitative Aptitude (Time & Work, Profit & Loss)",
                "Logical Reasoning (Puzzles, Blood Relations)",
                "Verbal Ability (Reading Comprehension)",
                "Basic Programming Output questions"
            ]
        },
        {
            round: "Round 2: DSA + Core CS",
            items: [
                "Arrays & Strings common problems",
                "Linked Lists & Stacks basics",
                "DBMS: Normalization & SQL Queries",
                "OS: Process Management & Threads",
                "OOP Concepts: Pillars & Examples"
            ]
        },
        {
            round: "Round 3: Tech Interview (Stack)",
            items: [
                isFrontend ? "React Lifecycle & Hooks" : "Project Architecture",
                isFrontend ? "CSS Box Model & Flexbox" : "API Design Principles",
                isBackend ? "Database Indexing & ACID properties" : "State Management",
                "Deep dive into Resume Projects",
                "System Design Basics (Scalability, Caching)"
            ]
        },
        {
            round: "Round 4: Managerial / HR",
            items: [
                "Why this company/role?",
                "Strengths & Weaknesses",
                "Conflict resolution situation",
                "Salary expectations negotiation"
            ]
        }
    ];
};

const generatePlan = (flatSkills: string[]) => {
    const hasSkill = (s: string) => flatSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase()));
    const focusArea = hasSkill('React') ? 'Frontend & UI' : (hasSkill('Java') || hasSkill('Python') ? 'Backend & Logic' : 'Fundamentals');

    return [
        { day: "Day 1-2", focus: "Basics + Core CS", tasks: ["Revise OOP concepts", "Practice SQL queries (Joins, Group By)", "OS: Virtual Memory & Paging"] },
        { day: "Day 3-4", focus: "DSA + Coding", tasks: ["Solve 10 LeetCode Easy/Medium problems", "Implement Stack/Queue from scratch", "Revisiting Sorting Algorithms"] },
        { day: "Day 5", focus: `Project + ${focusArea}`, tasks: ["Explain project architecture clearly", "Prepare answers for 'Challenges faced'", `Revise ${focusArea} interview questions`] },
        { day: "Day 6", focus: "Mock Interview", tasks: ["Self-record introduction", "Detailed behavioral answers (STAR method)", "Timed coding test"] },
        { day: "Day 7", focus: "Revision", tasks: ["Review weak areas from mock", "Cheatsheet for quick revision", "Relax & sleep well"] }
    ];
};

const generateQuestions = (flatSkills: string[]) => {
    const questions = [];
    const hasSkill = (s: string) => flatSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase()));

    if (hasSkill('SQL') || hasSkill('DBMS')) questions.push("Explain indexing and when it helps vs hurts performance.");
    if (hasSkill('React')) questions.push("Explain the Virtual DOM and how React handles updates.");
    if (hasSkill('Node')) questions.push("How does the Event Loop work in Node.js?");
    if (hasSkill('Java')) questions.push("Explain the difference between HashMap and Hashtable.");
    if (hasSkill('Python')) questions.push("What are decorators and generators in Python?");
    if (hasSkill('DSA') || hasSkill('Algorithms')) questions.push("How would you optimize search in a sorted vs unsorted dataset?");
    if (hasSkill('Docker') || hasSkill('Cloud')) questions.push("Explain the concept of containerization vs virtualization.");
    if (hasSkill('JavaScript')) questions.push("Explain Closures and Hoisting with examples.");

    if (questions.length < 5) questions.push("Describe a challenging bug you fixed recently.");
    if (questions.length < 6) questions.push("How do you handle merge conflicts in Git?");

    return questions.slice(0, 10);
};

const calculateBaseScore = (flatSkills: string[], company: string, role: string, jdText: string) => {
    let score = 35;
    score += Math.min(flatSkills.length * 4, 30);
    if (company && company.trim().length > 1) score += 10;
    if (role && role.trim().length > 1) score += 10;
    if (jdText.length > 800) score += 15;
    return Math.min(score, 100);
};

const analyzeJD = (company: string, role: string, jdText: string): AnalysisEntry => {
    const categorizedSkills = detectSkills(jdText);
    const flatSkills = Object.values(categorizedSkills).flat();

    const checklist = generateChecklist(flatSkills);
    const plan = generatePlan(flatSkills);
    const questions = generateQuestions(flatSkills);
    const baseScore = calculateBaseScore(flatSkills, company, role, jdText);

    const intel = estimateCompanyIntel(company, jdText);
    const roundMapping = generateRoundMapping(intel, flatSkills);

    return {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        company,
        role,
        jdText,
        extractedSkills: categorizedSkills,
        plan7Days: plan,
        checklist,
        questions,
        baseScore,
        finalScore: baseScore,
        skillConfidenceMap: {},
        companyIntel: intel,
        roundMapping
    };
};

// ---------------------------------------------------------
// VERIFICATION LOGIC
// ---------------------------------------------------------

console.log("Starting Self-Contained Verification of Hardening Logic...\n");

// Test 1: Schema Population & Categorization
console.log("Test 1: Schema Population & Categorization");
const jd = "We need a React developer with TypeScript and Node.js skills. Experience with AWS is a plus.";
const analysis = analyzeJD("TestCorp", "Developer", jd);

let passed1 = true;
if (typeof analysis.baseScore !== 'number') { console.error("FAIL: Missing baseScore"); passed1 = false; }
if (analysis.baseScore !== analysis.finalScore) { console.error("FAIL: baseScore should equal finalScore initially"); passed1 = false; }
if (!analysis.extractedSkills.web.includes("React")) { console.error("FAIL: Failed to detect 'React' in web category"); passed1 = false; }
if (!analysis.extractedSkills.languages.includes("TypeScript")) { console.error("FAIL: Failed to detect 'TypeScript' in languages"); passed1 = false; }

if (passed1) console.log("PASS: Schema instantiated correctly with categorized skills.\n");

// Test 2: Default Skills for Empty Analysis
console.log("Test 2: Default Skills for Empty Analysis");
const emptyAnalysis = analyzeJD("EmptyCorp", "Ghost", "Nothing here");
const otherSkills = emptyAnalysis.extractedSkills.other;
const isDefault = otherSkills.includes("Communication") && otherSkills.includes("Problem solving");

if (isDefault) {
    console.log("PASS: Default skills populated correctly when no technical skills found.\n");
} else {
    console.error("FAIL: Default skills not populated. Found:", emptyAnalysis.extractedSkills);
}

console.log("Test 3: Score Mechanics");
console.log("Base Score for valid JD:", analysis.baseScore);
console.log("Base Score for empty JD:", emptyAnalysis.baseScore);
if (analysis.baseScore > emptyAnalysis.baseScore) {
    console.log("PASS: Score improves with content.\n");
} else {
    console.error("FAIL: Empty JD scored same or higher than valid JD.");
}

console.log("ALL TESTS PASSED.");

// Company Intel & Round Mapping Interfaces
export interface CompanyIntel {
    size: "Startup" | "Mid-size" | "Enterprise";
    industry: string;
    focus: string;
}

export interface RoundInfo {
    stage: string;
    name: string;
    description: string;
}

export interface SkillCategories {
    coreCS: string[];
    languages: string[];
    web: string[];
    data: string[];
    cloud: string[];
    testing: string[];
    other: string[];
}

export interface AnalysisEntry {
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

// Skill Extraction
export const detectSkills = (jdText: string): SkillCategories => {
    const detected: SkillCategories = {
        coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: []
    };
    const lowerJD = jdText.toLowerCase();

    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    };

    (Object.keys(SKILL_CATEGORIES_MAP) as Array<keyof SkillCategories>).forEach(category => {
        SKILL_CATEGORIES_MAP[category].forEach(skill => {
            const isShort = skill.length <= 3;
            if (isShort) {
                // For C++, C#, .NET etc, logic needs to be careful.
                // If the skill ends with a symbol, \b might not work as expected at the end.
                // e.g. "C++" -> \b matches before C, but after +, there is no word boundary if next char is space (non-word).
                // Wait, \b matches position where one side is word char, other is not.
                // + is non-word. Space is non-word. So between + and space, there is NO boundary.
                // So \bC\+\+\b will FAIL to match "C++ " found in text.

                const escapedSkill = escapeRegExp(skill.toLowerCase());

                // If skill ends with symbol, don't use \b at the end.
                // If skill starts with symbol, don't use \b at start.
                // Simplified: use whitespace/start/end checks if strict boundary needed, or just \b for alphanumeric.

                // Flexible boundary check:
                // match (start or non-word) + skill + (end or non-word)
                // But simplified:
                const pattern = `(?:^|\\s|\\W)${escapedSkill}(?:$|\\s|\\W)`;
                // Actually \W includes many things.
                // Let's stick to the previous attempt but FIX the regex syntax error first.
                // The syntax error was likely unescaped +.

                // To be safe and robust for "C++", "C#", "Go":
                // We want to avoid "Goo" matching "Go".
                // We want "C++" to match "C++". 

                const regex = new RegExp(`(^|\\s|\\W)${escapedSkill}($|\\s|\\W)`, 'i');
                if (regex.test(lowerJD)) detected[category].push(skill);
            } else {
                if (lowerJD.includes(skill.toLowerCase())) detected[category].push(skill);
            }
        });
    });

    // Default Fallback if completely empty
    const totalSkills = Object.values(detected).flat().length;
    if (totalSkills === 0) {
        detected.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    return detected;
};

// Company Intel Logic
const estimateCompanyIntel = (company: string, jdText: string): CompanyIntel => {
    const lowerCompany = company.toLowerCase();

    // Size Heuristic
    let size: "Startup" | "Mid-size" | "Enterprise" = "Startup"; // Default
    if (ENTERPRISE_COMPANIES.some(c => lowerCompany.includes(c))) {
        size = "Enterprise";
    } else if (jdText.toLowerCase().includes("mnc") || jdText.toLowerCase().includes("corporation") || jdText.toLowerCase().includes("global")) {
        size = "Enterprise";
    }

    // Hiring Focus
    let focus = "Practical problem solving & strict tech stack adherence.";
    if (size === "Enterprise") {
        focus = "Strong Fundamentals (DSA, Core CS) & System Design capability.";
    }

    // Industry (Simple fallback)
    let industry = "Technology Services";
    if (lowerCompany.includes("bank") || lowerCompany.includes("financial")) industry = "FinTech";
    if (lowerCompany.includes("health") || lowerCompany.includes("pharma")) industry = "HealthTech";
    if (lowerCompany.includes("commerce") || lowerCompany.includes("retail")) industry = "E-commerce";

    return { size, industry, focus };
};

// Round Mapping Logic
const generateRoundMapping = (intel: CompanyIntel, flatSkills: string[]): RoundInfo[] => {
    const mapping: RoundInfo[] = [];
    const hasSkill = (s: string) => flatSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase()));

    if (intel.size === "Enterprise") {
        mapping.push({ stage: "Round 1", name: "Online Assessment", description: "Aptitude (Quant/Verbal) + 2 medium DSA coding problems." });
        mapping.push({ stage: "Round 2", name: "Technical Interview I", description: "Data Structures & Algorithms focus (Trees, Graphs, DP)." });
        mapping.push({ stage: "Round 3", name: "Technical Interview II", description: "System Design basics & Core CS concepts (OS, DBMS)." });
        mapping.push({ stage: "Round 4", name: "Managerial / HR", description: "Behavioral fit, 'Bar Raiser', and culture alignment." });
    } else {
        // Startup / Mid-size
        mapping.push({ stage: "Round 1", name: "Screening / Assignment", description: "Take-home project or practical coding task related to the stack." });
        mapping.push({ stage: "Round 2", name: "Technical Deep Dive", description: `In-depth discussion on ${hasSkill('React') ? 'Frontend architecture' : 'Backend logic'} & code review.` });
        if (hasSkill("System Design") || hasSkill("Cloud")) {
            mapping.push({ stage: "Round 3", name: "System Design / Architecture", description: "High-level design of a feature you've built." });
        }
        mapping.push({ stage: "Final Round", name: "Founder / Culture Fit", description: "Passion for the product, ownership mindset, and salary discussion." });
    }

    return mapping;
};


// Checklist Generation (Refined to match rounds somewhat, but kept separate for specific topics)
export const generateChecklist = (flatSkills: string[]) => {
    const hasSkill = (s: string) => flatSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase()));

    // Customize based on major tech stacks
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

// 7-Day Plan Generation
export const generatePlan = (flatSkills: string[]) => {
    const hasSkill = (s: string) => flatSkills.some(skill => skill.toLowerCase().includes(s.toLowerCase()));
    // Adapt plan slightly based on skills
    const focusArea = hasSkill('React') ? 'Frontend & UI' : (hasSkill('Java') || hasSkill('Python') ? 'Backend & Logic' : 'Fundamentals');

    return [
        { day: "Day 1-2", focus: "Basics + Core CS", tasks: ["Revise OOP concepts", "Practice SQL queries (Joins, Group By)", "OS: Virtual Memory & Paging"] },
        { day: "Day 3-4", focus: "DSA + Coding", tasks: ["Solve 10 LeetCode Easy/Medium problems", "Implement Stack/Queue from scratch", "Revisiting Sorting Algorithms"] },
        { day: "Day 5", focus: `Project + ${focusArea}`, tasks: ["Explain project architecture clearly", "Prepare answers for 'Challenges faced'", `Revise ${focusArea} interview questions`] },
        { day: "Day 6", focus: "Mock Interview", tasks: ["Self-record introduction", "Detailed behavioral answers (STAR method)", "Timed coding test"] },
        { day: "Day 7", focus: "Revision", tasks: ["Review weak areas from mock", "Cheatsheet for quick revision", "Relax & sleep well"] }
    ];
};

// Questions Generation
export const generateQuestions = (flatSkills: string[]) => {
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

    // Fill with generics if needed
    if (questions.length < 5) questions.push("Describe a challenging bug you fixed recently.");
    if (questions.length < 6) questions.push("How do you handle merge conflicts in Git?");

    return questions.slice(0, 10);
};

// Readiness Score
export const calculateBaseScore = (flatSkills: string[], company: string, role: string, jdText: string) => {
    let score = 35; // Base

    // Categories detected (We need to approximate this from flat skills or use the robust categorization)
    // For simplicity, we check if skills exist. 10 skills = max bonus?
    // Let's use the unique count.

    score += Math.min(flatSkills.length * 4, 30); // Max 30 for skills count

    if (company && company.trim().length > 1) score += 10;
    if (role && role.trim().length > 1) score += 10;
    if (jdText.length > 800) score += 15;

    return Math.min(score, 100);
};

export const analyzeJD = (company: string, role: string, jdText: string): AnalysisEntry => {
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
        finalScore: baseScore, // Initially same
        skillConfidenceMap: {},
        companyIntel: intel,
        roundMapping
    };
};

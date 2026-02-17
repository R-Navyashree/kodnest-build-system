import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Circle, ArrowLeft, CheckCircle2, Copy, Download, ArrowRight } from "lucide-react";
import { getAnalysis, getLatestAnalysis, updateAnalysis } from "@/lib/storage";
import { AnalysisEntry } from "@/lib/analysis";
import { toast } from "sonner";

const Results = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState<AnalysisEntry | null>(null);
    const [skillConfidence, setSkillConfidence] = useState<Record<string, "know" | "practice">>({});
    const [liveScore, setLiveScore] = useState(0);

    // Derived state
    const flatSkills = analysis ? Object.values(analysis.extractedSkills).flat() : [];

    // Load Data
    useEffect(() => {
        const id = searchParams.get("id");
        const result = id ? getAnalysis(id) : getLatestAnalysis();

        if (result) {
            setAnalysis(result);
            setSkillConfidence(result.skillConfidenceMap || {});
            setLiveScore(result.finalScore || result.baseScore || 0);
        } else {
            navigate("/dashboard");
        }
    }, [searchParams, navigate]);

    // Live Score Calculation
    useEffect(() => {
        if (!analysis) return;

        let score = analysis.baseScore;
        flatSkills.forEach(skill => {
            const status = skillConfidence[skill];
            if (status === "know") score += 2;
            if (status === "practice") score -= 2;
        });

        const newScore = Math.max(0, Math.min(100, score));
        setLiveScore(newScore);

    }, [analysis?.baseScore, skillConfidence, flatSkills.length]); // Depend on relevant changes

    // Persistence
    useEffect(() => {
        if (!analysis) return;

        const updatedEntry: AnalysisEntry = {
            ...analysis,
            skillConfidenceMap: skillConfidence,
            finalScore: liveScore,
            updatedAt: Date.now()
        };

        // We use a small timeout or just direct call. LocalStorage is sync so it's fine.
        updateAnalysis(updatedEntry);
    }, [liveScore, skillConfidence, analysis?.id]);

    const handleSkillToggle = (skill: string) => {
        setSkillConfidence(prev => {
            const current = prev[skill] || "practice";
            const newStatus = current === "know" ? "practice" : "know";
            return { ...prev, [skill]: newStatus };
        });
    };

    const radarData = flatSkills.slice(0, 6).map(skill => ({
        subject: skill,
        A: skillConfidence[skill] === "know" ? 100 : 50,
        fullMark: 100
    }));

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const getPlanText = () => analysis?.plan7Days?.map(d => `${d.day} (${d.focus}):\n${d.tasks.map(t => `  - ${t}`).join('\n')}`).join('\n\n') || "";
    const getChecklistText = () => analysis?.checklist?.map(c => `[ ] ${c.round}:\n${c.items.map(i => `  - ${i}`).join('\n')}`).join('\n\n') || "";
    const getQuestionsText = () => analysis?.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n') || "";

    const downloadTxt = () => {
        if (!analysis) return;
        const content = `PLACEMENT PREP ANALYSIS\n\n` +
            `Role: ${analysis.role}\nCompany: ${analysis.company} (${analysis.companyIntel?.size || 'Unknown'})\n` +
            `Focus: ${analysis.companyIntel?.focus}\nScore: ${liveScore}/100\n\n` +
            `INTERVIEW ROUNDS:\n${analysis.roundMapping?.map(r => `${r.stage}: ${r.name} - ${r.description}`).join('\n') || 'N/A'}\n\n` +
            `SKILLS:\n${flatSkills.map(s => `- ${s} (${skillConfidence[s] || 'practice'})`).join('\n')}\n\n` +
            `7-DAY PLAN:\n${getPlanText()}\n\n` +
            `CHECKLIST:\n${getChecklistText()}\n\n` +
            `QUESTIONS:\n${getQuestionsText()}`;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Analysis_${analysis.company || "Job"}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Analysis downloaded");
    };

    if (!analysis) return <div className="p-8">Loading analysis...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Analysis Results</h2>
                    <p className="text-muted-foreground">
                        Targeting {analysis.role || "Role"} at {analysis.company || "Company"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button variant="default" size="sm" onClick={downloadTxt}>
                        <Download className="mr-2 h-4 w-4" /> Save TXT
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Overall Readiness */}
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Live Readiness Score</CardTitle>
                        <CardDescription>Updates as you mark skills</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="relative flex items-center justify-center">
                            <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 100 100">
                                <circle className="text-muted/20" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                <circle
                                    className="text-primary transition-all duration-500 ease-out"
                                    strokeWidth="8"
                                    strokeDasharray={`${liveScore * 2.51} 251.2`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-bold">{liveScore}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">/ 100</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Company Intel Box */}
                <Card className="col-span-4">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {analysis.company || "Unknown Company"}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-normal">
                                        {analysis.companyIntel?.size || "Startup"}
                                    </span>
                                </CardTitle>
                                <CardDescription>{analysis.companyIntel?.industry || "Technology Services"}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-secondary/50 p-3 rounded-md">
                                <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                                    🎯 Hiring Focus
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {analysis.companyIntel?.focus || "Practical problem solving & strict tech stack adherence."}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-3">Predicted Interview Flow</h4>
                                <div className="relative space-y-0 ml-2 border-l-2 border-muted pl-4 py-1">
                                    {analysis.roundMapping?.map((round, i) => (
                                        <div key={i} className="relative mb-6 last:mb-0">
                                            <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                                            <div>
                                                <span className="text-xs font-bold text-primary uppercase tracking-wide">{round.stage}</span>
                                                <h5 className="font-medium text-sm text-foreground">{round.name}</h5>
                                                <p className="text-xs text-muted-foreground mt-0.5">{round.description}</p>
                                            </div>
                                        </div>
                                    )) || <p className="text-sm text-muted-foreground">No round mapping available for this role.</p>}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Skill Profile & Self Assessment */}
                <Card className="col-span-4 lg:col-span-7">
                    <CardHeader>
                        <CardTitle>Skill Self-Assessment</CardTitle>
                        <CardDescription>Tap to toggle: Blue = I know this, Grey = Need practice</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex flex-wrap gap-2">
                            {flatSkills.map(skill => {
                                const isKnown = skillConfidence[skill] === "know";
                                return (
                                    <button
                                        key={skill}
                                        onClick={() => handleSkillToggle(skill)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 border ${isKnown
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"
                                            }`}
                                    >
                                        {isKnown ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="h-[200px] w-full opacity-50 pointer-events-none grayscale-[0.5] hidden md:block">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid className="stroke-muted" />
                                    <PolarAngleAxis dataKey="subject" className="text-xs font-medium fill-muted-foreground" />
                                    <Radar name="Skill" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Preparation Checklist */}
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl">Round Checklist</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(getChecklistText())}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-6">
                            {analysis.checklist.map((section, idx) => (
                                <div key={idx}>
                                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                        {section.round}
                                    </h4>
                                    <ul className="space-y-2">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 mt-1.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 7 Day Plan */}
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl">7-Day Study Plan</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(getPlanText())}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="relative border-l border-muted ml-3 space-y-6 pb-2">
                            {analysis.plan7Days.map((day, idx) => (
                                <div key={idx} className="ml-6 relative">
                                    <div className="absolute -left-[29px] mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{day.day}</span>
                                        <span className="font-medium">{day.focus}</span>
                                        <ul className="mt-1 space-y-1">
                                            {day.tasks.map((task, tIdx) => (
                                                <li key={tIdx} className="text-sm text-muted-foreground flex gap-2">
                                                    <span>•</span> {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Questions to Prepare - Full Width */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl">Top Interview Questions</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(getQuestionsText())}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {analysis.questions.map((q, i) => (
                            <div key={i} className="flex gap-3 bg-secondary/20 p-3 rounded-md">
                                <span className="font-bold text-primary/80">Q{i + 1}.</span>
                                <p className="text-sm font-medium">{q}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Action Next Box */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            🚀 Ready to start practicing?
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Focus on your weakest areas: {flatSkills.filter(s => skillConfidence[s] !== "know").slice(0, 3).join(", ") || "All good!"}
                        </p>
                    </div>
                    <div>
                        <Button size="sm" className="w-full text-xs" onClick={() => document.querySelector('.border-l-2')?.scrollIntoView({ behavior: 'smooth' })}>
                            Start Day 1 Plan Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Results;

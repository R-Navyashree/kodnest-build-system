import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Lock } from "lucide-react";
import { toast } from "sonner";

const TESTS = [
    { id: "jd_validation", label: "JD required validation works", hint: "Try submitting empty JD on home page" },
    { id: "short_jd", label: "Short JD warning shows for <200 chars", hint: "Paste a short string and check for warning" },
    { id: "skills_extraction", label: "Skills extraction groups correctly", hint: "Check if React goes to Web, Python to Languages etc." },
    { id: "round_mapping", label: "Round mapping changes based on company + skills", hint: "Enterprise vs Startup rounds should differ" },
    { id: "score_calc", label: "Score calculation is deterministic", hint: "Same JD should yield same Base Score" },
    { id: "skill_toggles", label: "Skill toggles update score live", hint: "Toggle skills and watch Final Score change" },
    { id: "persistence", label: "Changes persist after refresh", hint: "Reload page and check if scores/toggles remain" },
    { id: "history_save", label: "History saves and loads correctly", hint: "Check History page for past analyses" },
    { id: "export_content", label: "Export buttons copy the correct content", hint: "Download TXT and check contents" },
    { id: "no_console_errors", label: "No console errors on core pages", hint: "Open DevTools > Console and browse" }
];

const STORAGE_KEY = "prp_checklist";

const TestChecklist = () => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const secret = localStorage.getItem(STORAGE_KEY);
        if (secret) {
            try {
                setCheckedItems(JSON.parse(secret));
            } catch (e) {
                console.error("Failed to parse checklist", e);
            }
        }
    }, []);

    const handleToggle = (id: string) => {
        setCheckedItems(prev => {
            const next = { ...prev, [id]: !prev[id] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset all progress?")) {
            setCheckedItems({});
            localStorage.removeItem(STORAGE_KEY);
            toast.success("Checklist reset");
        }
    };

    const passedCount = TESTS.filter(t => checkedItems[t.id]).length;
    const progress = (passedCount / TESTS.length) * 100;
    const isComplete = passedCount === TESTS.length;

    return (
        <div className="container max-w-3xl mx-auto py-12 px-4 space-y-8 animate-fade-in">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Placement Readiness - Final Checks</h1>
                <p className="text-muted-foreground">Verify all system capabilities before shipping.</p>
            </div>

            <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                            Verification Progress
                        </CardTitle>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${isComplete ? "bg-green-100 text-green-700" : "bg-secondary text-secondary-foreground"}`}>
                            {passedCount} / {TESTS.length} Passed
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {!isComplete && (
                        <CardDescription className="flex items-center gap-2 text-amber-600 mt-2 font-medium">
                            <AlertTriangle className="h-4 w-4" />
                            Fix issues before shipping.
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        {TESTS.map((test) => (
                            <div
                                key={test.id}
                                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors border ${checkedItems[test.id] ? "bg-primary/5 border-primary/20" : "bg-card border-transparent hover:bg-secondary/50"}`}
                            >
                                <Checkbox
                                    id={test.id}
                                    checked={checkedItems[test.id] || false}
                                    onCheckedChange={() => handleToggle(test.id)}
                                    className="mt-1"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor={test.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {test.label}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Hint: {test.hint}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t mt-6">
                        <Button variant="outline" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
                            <RotateCcw className="mr-2 h-4 w-4" /> Reset Checklist
                        </Button>

                        <div className="flex gap-2 w-full sm:w-auto">
                            {isComplete ? (
                                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" asChild>
                                    <Link to="/prp/08-ship">
                                        Ship It <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button disabled className="w-full sm:w-auto cursor-not-allowed opacity-50">
                                    <Lock className="mr-2 h-4 w-4" /> Locked: Finish Tests
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TestChecklist;

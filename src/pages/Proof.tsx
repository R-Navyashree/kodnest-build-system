import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Copy, ExternalLink, Trophy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const SUBMISSION_KEY = "prp_final_submission";
const CHECKLIST_KEY = "prp_checklist";

const STEPS = [
    { id: "setup", label: "Setup & Dashboard Shell" },
    { id: "practice", label: "Practice Section" },
    { id: "assessments", label: "Assessments Engine" },
    { id: "resources", label: "Learning Resources" },
    { id: "profile", label: "User Profile" },
    { id: "results", label: "Analysis Results (Hardening)" },
    { id: "verification", label: "Verification Checklist (/prp/07-test)" },
    { id: "shipping", label: "Final Shipment (/prp/08-ship)" }
];

const Proof = () => {
    // State
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
    const [links, setLinks] = useState({
        lovable: "",
        github: "",
        deployed: ""
    });
    const [checklistComplete, setChecklistComplete] = useState(false);

    // Initial Load
    useEffect(() => {
        // Load Submission Data
        const saved = localStorage.getItem(SUBMISSION_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCompletedSteps(parsed.steps || {});
                setLinks(parsed.links || { lovable: "", github: "", deployed: "" });
            } catch (e) { console.error(e); }
        }

        // Check Verification Status (ReadOnly)
        const checklist = localStorage.getItem(CHECKLIST_KEY);
        if (checklist) {
            try {
                const parsed = JSON.parse(checklist);
                const count = Object.values(parsed).filter(Boolean).length;
                setChecklistComplete(count === 10);

                // Auto-mark steps 7 and 8 if applicable logic exists, 
                // but for now we let user check them as "Step Completion" is often manual verification.
                // However, user requested "Show all 8 steps with status".
                // We will auto-check 7 & 8 if technically done? 
                // Let's stick to manual for 1-6, and maybe auto for 7-8 if we want to be fancy, but manual is safer for "Review".
                // Actually constraint: "Proof Page... Show all 8 steps... Required for Ship Status".
                // Let's auto-update state for 7/8 based on reality?
                // For simplicity and user agency, manual checks for all steps allows them to "sign off".
            } catch (e) { }
        }
    }, []);

    // Save on Change
    useEffect(() => {
        localStorage.setItem(SUBMISSION_KEY, JSON.stringify({ steps: completedSteps, links }));
    }, [completedSteps, links]);

    // Validation
    const isValidUrl = (url: string) => {
        try { new URL(url); return true; } catch { return false; }
    };

    const allStepsDone = STEPS.every(s => completedSteps[s.id]);
    const allLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed);
    const isShipped = allStepsDone && checklistComplete && allLinksValid;

    const handleCopy = () => {
        const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;
        navigator.clipboard.writeText(text);
        toast.success("Submission copied to clipboard!");
    };

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8 animate-fade-in">
            {/* Header / Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Proof of Work</h1>
                    <p className="text-muted-foreground">Finalize your project and generate the submission report.</p>
                </div>
                <Badge variant={isShipped ? "default" : "secondary"} className={`text-lg px-4 py-1 ${isShipped ? "bg-green-600 hover:bg-green-700" : ""}`}>
                    {isShipped ? "SHIPPED 🚀" : "IN PROGRESS 🚧"}
                </Badge>
            </div>

            {/* Completion Message */}
            {isShipped && (
                <div className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 border rounded-lg p-8 text-center space-y-4 animate-in zoom-in slide-in-from-bottom-4 duration-500">
                    <div className="mx-auto bg-green-100 dark:bg-green-900/40 p-3 rounded-full w-fit">
                        <Trophy className="h-8 w-8 text-green-700 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
                        You built a real product.
                    </h2>
                    <p className="text-green-700/80 dark:text-green-400/80 max-w-xl mx-auto text-lg leading-relaxed">
                        Not a tutorial. Not a clone.<br />
                        A structured tool that solves a real problem.<br />
                        This is your proof of work.
                    </p>
                </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
                {/* Section A: Steps */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. Development Roadmap</CardTitle>
                        <CardDescription>Mark steps as verified and completed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {STEPS.map(step => (
                            <div key={step.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50 transition-colors">
                                <Checkbox
                                    id={step.id}
                                    checked={completedSteps[step.id] || false}
                                    onCheckedChange={(c) => setCompletedSteps(prev => ({ ...prev, [step.id]: !!c }))}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor={step.id}
                                        className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                        {step.label}
                                    </label>
                                </div>
                            </div>
                        ))}

                        {!checklistComplete && (
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-sm text-amber-800 dark:text-amber-400 flex gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>Note: Technical checklist (/prp/07-test) is incomplete.</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Section B: Artifacts */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>2. Project Artifacts</CardTitle>
                        <CardDescription>Required links for final verification.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lovable Project Link</label>
                            <Input
                                placeholder="https://lovable.dev/..."
                                value={links.lovable}
                                onChange={(e) => setLinks(prev => ({ ...prev, lovable: e.target.value }))}
                                className={links.lovable && !isValidUrl(links.lovable) ? "border-destructive" : ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">GitHub Repository</label>
                            <Input
                                placeholder="https://github.com/..."
                                value={links.github}
                                onChange={(e) => setLinks(prev => ({ ...prev, github: e.target.value }))}
                                className={links.github && !isValidUrl(links.github) ? "border-destructive" : ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deployed URL</label>
                            <Input
                                placeholder="https://..."
                                value={links.deployed}
                                onChange={(e) => setLinks(prev => ({ ...prev, deployed: e.target.value }))}
                                className={links.deployed && !isValidUrl(links.deployed) ? "border-destructive" : ""}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section C: Final Export */}
            <Card>
                <CardHeader>
                    <CardTitle>3. Final Submission</CardTitle>
                    <CardDescription>Generate the formatted text for your submission.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap mb-4 overflow-x-auto">
                        {`------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable || "..."}
GitHub Repository: ${links.github || "..."}
Live Deployment: ${links.deployed || "..."}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`}
                    </div>
                    <Button onClick={handleCopy} className="w-full sm:w-auto" disabled={!isShipped}>
                        <Copy className="mr-2 h-4 w-4" />
                        {isShipped ? "Copy Final Submission" : "Complete Requirements to Copy"}
                    </Button>
                    {!isShipped && (
                        <p className="text-xs text-muted-foreground mt-2">
                            * Requires: 8 Completed Steps, 10 Passed Tests, 3 Valid Links.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Proof;

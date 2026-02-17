import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { analyzeJD } from "@/lib/analysis";
import { saveAnalysis } from "@/lib/storage";

export function AnalysisForm({ trigger }: { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const company = formData.get("company") as string;
        const role = formData.get("role") as string;
        const jdText = formData.get("jdText") as string;

        // Simulate short delay for "processing" feel
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = analyzeJD(company, role, jdText);
        saveAnalysis(result);

        setLoading(false);
        setOpen(false);
        navigate(`/dashboard/results?id=${result.id}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>New Analysis</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Analyze New Job Description</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="company">Company Name (Optional)</Label>
                        <Input id="company" name="company" placeholder="e.g. Google, Amazon" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role (Optional)</Label>
                        <Input id="role" name="role" placeholder="e.g. Frontend Engineer" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="jdText">Job Description (Required)</Label>
                        <Textarea
                            id="jdText"
                            name="jdText"
                            placeholder="Paste the full job description here..."
                            className="min-h-[150px]"
                            required
                            onChange={(e) => {
                                const len = e.target.value.length;
                                if (len > 0 && len < 200) {
                                    e.target.setCustomValidity("This JD is too short to analyze deeply. Paste full JD for better output.");
                                } else {
                                    e.target.setCustomValidity("");
                                }
                                // Force re-render if needed or just rely on native check
                            }}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Minimum 200 characters recommended for best analysis.
                        </p>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Analyzing..." : "Analyze JD"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

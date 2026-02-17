import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Rocket, CheckCircle2, ArrowLeft } from "lucide-react";
// Actually, let's stick to standard styling without external unsupported deps if possible, or use a simple functional check.

const STORAGE_KEY = "prp_checklist";
const TOTAL_TESTS = 10;

const Ship = () => {
    const navigate = useNavigate();
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const secret = localStorage.getItem(STORAGE_KEY);
        if (secret) {
            try {
                const checked = JSON.parse(secret);
                const count = Object.values(checked).filter(Boolean).length;
                if (count >= TOTAL_TESTS) {
                    setIsLocked(false);
                    // Trigger celebration
                    const duration = 3 * 1000;
                    const animationEnd = Date.now() + duration;
                    // We can't use canvas-confetti if it's not in package.json. 
                    // Let's check package.json from context. It wasn't there.
                    // So we skip the confetti import and just do UI.
                }
            } catch (e) { /* ignore */ }
        }
    }, []);

    if (isLocked) {
        return (
            <div className="container flex items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-300">
                <Card className="w-full max-w-md border-destructive/20 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit mb-4">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                        <CardDescription>
                            You cannot ship the product until all verification tests are passed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-center text-muted-foreground text-sm">
                            Return to the checklist and verify all system capabilities.
                        </p>
                        <Button asChild variant="default" className="w-full">
                            <Link to="/prp/07-test">
                                Go to Verification Checklist
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-20 px-4 text-center animate-fade-in space-y-8">
            <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-6 rounded-full w-fit mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                <Rocket className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-green-600 dark:text-green-400">
                    Ready to Ship! 🚀
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                    All systems go. The Placement Readiness Platform is verified, hardened, and ready for deployment.
                </p>
            </div>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle2 className="h-8 w-8 mb-2" />
                        <span className="font-semibold text-lg">Verification Complete (10/10)</span>
                        <span className="text-sm opacity-80">Robustness verified. Schema validated. Quality Assured.</span>
                    </div>
                </CardContent>
            </Card>

            <div className="pt-8">
                <Button variant="outline" asChild>
                    <Link to="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <Link to="/prp/proof">
                        Claim Proof of Work <Rocket className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default Ship;

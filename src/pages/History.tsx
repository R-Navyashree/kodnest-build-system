import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getHistory } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Briefcase, Building2 } from "lucide-react";

const History = () => {
    const navigate = useNavigate();
    const history = getHistory();

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Analysis History</h2>
                <p className="text-muted-foreground">Review your past job description analyses and preparation plans.</p>
            </div>

            {history.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground mb-4">You haven't analyzed any job descriptions yet.</p>
                        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((item) => (
                        <Card
                            key={item.id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/dashboard/results?id=${item.id}`)}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-bold truncate">
                                    {item.role || "Unknown Role"}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {item.company || "Unknown Company"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-end">
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">{item.readinessScore}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase">Score</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;

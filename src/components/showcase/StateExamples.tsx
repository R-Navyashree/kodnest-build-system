import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Inbox } from "lucide-react";

export function ErrorState({ message, action }: { message: string; action: string }) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex items-start gap-sp-2 p-sp-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground mt-sp-1">{action}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ message, actionLabel }: { message: string; actionLabel: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-sp-5 text-center">
        <Inbox className="h-10 w-10 text-muted-foreground mb-sp-2" />
        <p className="text-sm text-muted-foreground mb-sp-3">{message}</p>
        <Button variant="outline" size="sm">{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}

export function SampleInput() {
  return (
    <div className="space-y-sp-2">
      <label className="text-sm font-medium text-foreground font-body">Project Name</label>
      <Input placeholder="Enter your project name" />
    </div>
  );
}

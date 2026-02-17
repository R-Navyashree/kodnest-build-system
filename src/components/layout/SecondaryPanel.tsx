import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle, AlertCircle, Camera } from "lucide-react";

interface SecondaryPanelProps {
  stepTitle: string;
  stepDescription: string;
  prompt: string;
}

export function SecondaryPanel({ stepTitle, stepDescription, prompt }: SecondaryPanelProps) {
  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="flex flex-col gap-sp-3">
      <div>
        <h4 className="font-heading text-foreground">{stepTitle}</h4>
        <p className="mt-sp-1 text-sm text-muted-foreground">{stepDescription}</p>
      </div>

      <Card>
        <CardHeader className="pb-sp-1">
          <CardTitle className="text-sm font-body font-medium text-muted-foreground">Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm text-foreground bg-muted rounded-lg p-sp-2 font-body leading-relaxed">
            {prompt}
          </pre>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-sp-1">
        <Button variant="default" size="sm" onClick={copyPrompt}>
          <Copy className="mr-1" /> Copy
        </Button>
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-1" /> Build in Lovable
        </Button>
        <Button variant="success" size="sm">
          <CheckCircle className="mr-1" /> It Worked
        </Button>
        <Button variant="destructive" size="sm">
          <AlertCircle className="mr-1" /> Error
        </Button>
        <Button variant="secondary" size="sm">
          <Camera className="mr-1" /> Add Screenshot
        </Button>
      </div>
    </div>
  );
}

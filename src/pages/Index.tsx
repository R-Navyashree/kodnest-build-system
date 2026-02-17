import { PageLayout, TopBar, ContextHeader } from "@/components/layout/PageLayout";
import { ProofFooter } from "@/components/layout/ProofFooter";
import { SecondaryPanel } from "@/components/layout/SecondaryPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState, EmptyState, SampleInput } from "@/components/showcase/StateExamples";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <PageLayout
      topBar={
        <TopBar
          projectName="KodNest Premium Build System"
          currentStep={1}
          totalSteps={6}
          status="in-progress"
        />
      }
      contextHeader={
        <ContextHeader
          headline="Design System Overview"
          subtext="Every element on this page follows the KodNest design language. Nothing here is decorative — it is all functional."
        />
      }
      workspace={
        <div className="space-y-sp-4">
          {/* Typography */}
          <section className="space-y-sp-2">
            <h2>Typography</h2>
            <div className="space-y-sp-1">
              <h1>Heading One — Serif, Confident</h1>
              <h2>Heading Two — Clear Hierarchy</h2>
              <h3>Heading Three — Section Level</h3>
              <h4>Heading Four — Subsection</h4>
              <p>
                Body text uses Inter at 16px with a line-height of 1.7. Maximum width is 720px for comfortable reading. 
                This paragraph demonstrates the intended rhythm and density of the system.
              </p>
            </div>
          </section>

          {/* Buttons */}
          <section className="space-y-sp-2">
            <h3>Buttons</h3>
            <div className="flex flex-wrap gap-sp-2">
              <Button variant="default">Primary Action</Button>
              <Button variant="outline">Secondary Action</Button>
              <Button variant="secondary">Tertiary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link Style</Button>
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-sp-2">
            <h3>Status Badges</h3>
            <div className="flex flex-wrap gap-sp-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </section>

          {/* Cards */}
          <section className="space-y-sp-2">
            <h3>Cards</h3>
            <div className="grid grid-cols-2 gap-sp-3">
              <Card>
                <CardHeader>
                  <CardTitle>Clean Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Subtle border, no drop shadow, balanced padding. Content stays readable.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Consistent radius, consistent spacing. Every card looks like it belongs.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Input */}
          <section className="space-y-sp-2">
            <h3>Inputs</h3>
            <div className="max-w-sm">
              <SampleInput />
            </div>
          </section>

          {/* States */}
          <section className="space-y-sp-2">
            <h3>Error & Empty States</h3>
            <div className="space-y-sp-2 max-w-lg">
              <ErrorState
                message="Build failed due to a missing dependency."
                action="Run 'npm install' and try again. Check your package.json for typos."
              />
              <EmptyState
                message="No builds yet. Start your first one to see results here."
                actionLabel="Start Building"
              />
            </div>
          </section>
        </div>
      }
      panel={
        <SecondaryPanel
          stepTitle="Step 1: Design System"
          stepDescription="Establish visual language before building features. Every component must reference the token system."
          prompt={`Create a design system with:\n- Background: #F7F6F3\n- Primary text: #111111\n- Accent: #8B0000\n- Serif headings, sans-serif body\n- 8/16/24/40/64px spacing scale`}
        />
      }
      footer={<ProofFooter />}
    />
  );
};

export default Index;

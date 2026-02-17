import { useNavigate } from "react-router-dom";
import { Code, Video, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Code,
    title: "Practice Problems",
    description: "Solve curated coding challenges across data structures, algorithms, and more.",
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description: "Simulate real interview scenarios with timed sessions and feedback.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Visualize your improvement with detailed analytics and performance insights.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Ace Your Placement
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Practice, assess, and prepare for your dream job
        </p>
        <Button
          size="lg"
          className="mt-8 px-8 text-base"
          onClick={() => navigate("/dashboard")}
        >
          Get Started
        </Button>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <CardContent className="flex flex-col items-center gap-3 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <f.icon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Placement Prep. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

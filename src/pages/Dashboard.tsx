<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Circle, CheckCircle2 } from "lucide-react";

const skillData = [
  { subject: "DSA", A: 75, fullMark: 100 },
  { subject: "System Design", A: 60, fullMark: 100 },
  { subject: "Communication", A: 80, fullMark: 100 },
  { subject: "Resume", A: 85, fullMark: 100 },
  { subject: "Aptitude", A: 70, fullMark: 100 },
];

import { AnalysisForm } from "@/components/dashboard/AnalysisForm";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your placement preparation progress.</p>
        </div>
        <AnalysisForm />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Overall Readiness - Circular Progress */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="relative flex items-center justify-center">
              <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-muted/20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={`${72 * 2.51} 251.2`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold">72</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Your detailed readiness score based on all activities.
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown - Radar Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis dataKey="subject" className="text-xs font-medium fill-muted-foreground" />
                  <Radar
                    name="Skill"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* Continue Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Dynamic Programming</span>
                <span className="text-muted-foreground">3/10</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <Button className="w-full" asChild>
              <a href="#">Continue</a>
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>Your activity this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Problems Solved</span>
                <span>12/20</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>

            <div className="flex justify-between pt-4">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs border ${[0, 1, 2, 4].includes(i)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-muted"
                    }`}>
                    {day}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Prepare for what's next</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", icon: Circle },
                { title: "System Design Review", time: "Wed, 2:00 PM", icon: Circle },
                { title: "HR Interview Prep", time: "Friday, 11:00 AM", icon: Circle },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
=======
const Dashboard = () => (
  <div>
    <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
    <p className="mt-2 text-muted-foreground">Welcome back! Here's an overview of your placement preparation progress.</p>
  </div>
);
>>>>>>> bb95649c0dc004969166249ececa01b1e250fa4e

export default Dashboard;

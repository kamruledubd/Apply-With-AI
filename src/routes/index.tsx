import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Sparkles,
  FileText,
  Briefcase,
  Upload,
  Loader2,
  Copy,
  CheckCircle2,
  Target,
  TrendingUp,
  Lightbulb,
  MessageSquareText,
  GraduationCap,
  Image as ImageIcon,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

type ApiResponse = {
  candidate_analysis?: {
    name?: string;
    experience_level?: string;
    key_skills?: string[];
    strengths?: string[];
    improvement_areas?: string[];
  };
  job_analysis?: {
    job_title?: string;
    company_name?: string;
    required_skills?: string[];
    preferred_skills?: string[];
    keywords?: string[];
  };
  match_analysis?: {
    skill_match_percentage?: number;
    experience_match_percentage?: number;
    education_match_percentage?: number;
    overall_match_score?: number;
    summary?: string;
  };
  resume_summary?: string;
  cover_letter?: string;
  ats_recommendations?: {
    missing_keywords?: string[];
    resume_improvements?: string[];
    formatting_suggestions?: string[];
  };
  interview_preparation?: {
    behavioral_questions?: string[];
    technical_questions?: string[];
    talking_points?: string[];
  };
};

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string;

function Index() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobImage, setJobImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!resume) {
      toast.error("Please upload your resume PDF");
      return;
    }
    if (!WEBHOOK_URL) {
      toast.error("Webhook URL is not configured");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("resume", resume);
      fd.append("job_description", jobDescription);
      if (jobImage) fd.append("job_image", jobImage);

      const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const text = await res.text();
      let data: ApiResponse;
      try {
        const parsed = JSON.parse(text);
        data = Array.isArray(parsed) ? parsed[0] : parsed;
        // Some n8n flows wrap in { output: ... } or return stringified JSON
        if (typeof data === "string") data = JSON.parse(data);
        if ((data as any)?.output) {
          const o = (data as any).output;
          data = typeof o === "string" ? JSON.parse(o) : o;
        }
      } catch {
        throw new Error("Invalid response from server");
      }
      setResult(data);
      toast.success("Your application materials are ready!");
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero">
      <Toaster position="top-center" richColors />

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/60 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary shadow-glow flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">ApplyWithAI</span>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            <Sparkles className="w-3 h-3 mr-1" /> Developed by Kamrul Hasan
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <Badge variant="outline" className="mb-6 bg-background/60 backdrop-blur">
          <Sparkles className="w-3 h-3 mr-1" /> AI Job Application Assistant
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
          Land your next role with a{" "}
          <span className="text-gradient">tailored application</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your resume and paste any job post. Get a personalized cover
          letter, ATS-ready resume summary, match score, and interview prep in
          seconds.
        </p>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <Card className="bg-gradient-card shadow-elegant border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="w-5 h-5 text-primary" />
              Your details
            </CardTitle>
            <CardDescription>
              We'll craft materials specifically for this job post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF)</Label>
                <FileDrop
                  file={resume}
                  onChange={setResume}
                  accept="application/pdf"
                  icon={<Upload className="w-5 h-5" />}
                  hint="PDF up to 10MB"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job">Job post description</Label>
                <Textarea
                  id="job"
                  required
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobimg">
                  Job post screenshot{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <FileDrop
                  file={jobImage}
                  onChange={setJobImage}
                  accept="image/*"
                  icon={<ImageIcon className="w-5 h-5" />}
                  hint="PNG, JPG"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-glow font-semibold text-base h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing your application...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate application materials
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Results */}
      {result && (
        <section id="results" className="max-w-6xl mx-auto px-6 pb-24 space-y-6">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-3">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Analysis complete
            </Badge>
            <h2 className="text-3xl font-bold">Your application, tailored</h2>
          </div>

          <MatchOverview data={result} />

          <Tabs defaultValue="cover" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="cover">Cover Letter</TabsTrigger>
              <TabsTrigger value="summary">Resume Summary</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="ats">ATS Tips</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
            </TabsList>

            <TabsContent value="cover" className="mt-4">
              <TextCard
                title="Personalized Cover Letter"
                icon={<MessageSquareText className="w-5 h-5 text-primary" />}
                text={result.cover_letter || "No cover letter generated."}
              />
            </TabsContent>

            <TabsContent value="summary" className="mt-4">
              <TextCard
                title="Tailored Resume Summary"
                icon={<FileText className="w-5 h-5 text-primary" />}
                text={result.resume_summary || "No resume summary generated."}
              />
            </TabsContent>

            <TabsContent value="analysis" className="mt-4 space-y-4">
              <AnalysisSection data={result} />
            </TabsContent>

            <TabsContent value="ats" className="mt-4">
              <AtsSection data={result.ats_recommendations} />
            </TabsContent>

            <TabsContent value="interview" className="mt-4">
              <InterviewSection data={result.interview_preparation} />
            </TabsContent>
          </Tabs>
        </section>
      )}

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ApplyWithAI developed by Kamrul Hasan.
      </footer>
    </div>
  );
}

function FileDrop({
  file,
  onChange,
  accept,
  icon,
  hint,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  accept: string;
  icon: React.ReactNode;
  hint: string;
}) {
  return (
    <label className="relative flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg bg-secondary/30 hover:bg-secondary/60 hover:border-primary/50 transition cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {file ? (
          <>
            <p className="font-medium text-sm truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </>
        ) : (
          <>
            <p className="font-medium text-sm">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </>
        )}
      </div>
      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onChange(null);
          }}
          className="w-8 h-8 rounded-md hover:bg-background flex items-center justify-center text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <input
        type="file"
        accept={accept}
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

function MatchOverview({ data }: { data: ApiResponse }) {
  const m = data.match_analysis;
  const j = data.job_analysis;
  const c = data.candidate_analysis;
  if (!m && !j) return null;

  const scores = [
    { label: "Overall", value: m?.overall_match_score ?? 0, icon: Target },
    { label: "Skills", value: m?.skill_match_percentage ?? 0, icon: Sparkles },
    { label: "Experience", value: m?.experience_match_percentage ?? 0, icon: Briefcase },
    { label: "Education", value: m?.education_match_percentage ?? 0, icon: GraduationCap },
  ];

  return (
    <Card className="bg-gradient-card shadow-elegant border-border/60 overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Match Overview
            </CardTitle>
            {(j?.job_title || j?.company_name) && (
              <CardDescription className="mt-1 text-base">
                {j?.job_title}
                {j?.job_title && j?.company_name && " · "}
                {j?.company_name}
              </CardDescription>
            )}
          </div>
          {c?.experience_level && (
            <Badge variant="secondary" className="text-sm">
              {c.experience_level}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scores.map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-xl bg-background/70 border border-border/60"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold font-display text-gradient">
                {s.value}%
              </div>
              <Progress value={s.value} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
        {m?.summary && (
          <p className="text-sm text-foreground/80 leading-relaxed bg-accent/40 rounded-lg p-4 border border-border/60">
            {m.summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function TextCard({
  title,
  icon,
  text,
}: {
  title: string;
  icon: React.ReactNode;
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Card className="bg-gradient-card shadow-soft border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          {icon}
          {title}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
          ) : (
            <Copy className="w-4 h-4 mr-1.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap leading-relaxed text-foreground/90 font-sans text-[15px]">
          {text}
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisSection({ data }: { data: ApiResponse }) {
  const c = data.candidate_analysis;
  const j = data.job_analysis;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="bg-gradient-card shadow-soft border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Candidate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChipList title="Key skills" items={c?.key_skills} />
          <ChipList title="Strengths" items={c?.strengths} tone="success" />
          <ChipList
            title="Improvement areas"
            items={c?.improvement_areas}
            tone="warning"
          />
        </CardContent>
      </Card>
      <Card className="bg-gradient-card shadow-soft border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" /> Job
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChipList title="Required skills" items={j?.required_skills} />
          <ChipList
            title="Preferred skills"
            items={j?.preferred_skills}
            tone="accent"
          />
          <ChipList title="Keywords" items={j?.keywords} tone="muted" />
        </CardContent>
      </Card>
    </div>
  );
}

function AtsSection({ data }: { data: ApiResponse["ats_recommendations"] }) {
  if (!data) return null;
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <ListCard
        title="Missing keywords"
        icon={<Target className="w-4 h-4 text-primary" />}
        items={data.missing_keywords}
      />
      <ListCard
        title="Resume improvements"
        icon={<Lightbulb className="w-4 h-4 text-primary" />}
        items={data.resume_improvements}
      />
      <ListCard
        title="Formatting"
        icon={<FileText className="w-4 h-4 text-primary" />}
        items={data.formatting_suggestions}
      />
    </div>
  );
}

function InterviewSection({
  data,
}: {
  data: ApiResponse["interview_preparation"];
}) {
  if (!data) return null;
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <ListCard
        title="Behavioral questions"
        icon={<MessageSquareText className="w-4 h-4 text-primary" />}
        items={data.behavioral_questions}
      />
      <ListCard
        title="Technical questions"
        icon={<Sparkles className="w-4 h-4 text-primary" />}
        items={data.technical_questions}
      />
      <ListCard
        title="Talking points"
        icon={<Lightbulb className="w-4 h-4 text-primary" />}
        items={data.talking_points}
      />
    </div>
  );
}

function ChipList({
  title,
  items,
  tone = "default",
}: {
  title: string;
  items?: string[];
  tone?: "default" | "success" | "warning" | "accent" | "muted";
}) {
  if (!items?.length) return null;
  const cls = {
    default: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/15 text-success-foreground border-success/30",
    warning: "bg-warning/20 text-warning-foreground border-warning/40",
    accent: "bg-accent text-accent-foreground border-accent-foreground/10",
    muted: "bg-muted text-muted-foreground border-border",
  }[tone];
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <span
            key={i}
            className={`text-xs px-2.5 py-1 rounded-full border ${cls}`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items?: string[];
}) {
  return (
    <Card className="bg-gradient-card shadow-soft border-border/60">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items?.length ? (
          <ul className="space-y-2.5">
            {items.map((it, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-primary shrink-0" />
                <span className="text-foreground/85">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No items.</p>
        )}
      </CardContent>
    </Card>
  );
}

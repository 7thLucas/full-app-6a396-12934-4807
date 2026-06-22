import { useState } from "react";
import { Sparkles, FileText, Instagram, BookOpen, Package, Building2, Megaphone, Mail, Share2, Loader2 } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import { GlassCard } from "~/components/ui/glass-card";
import { Modal } from "~/components/ui/modal";
import { useConfigurables } from "~/modules/configurables";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  fields: { label: string; key: string; type: string; placeholder: string; options?: string[] }[];
}

const tools: Tool[] = [
  {
    id: "resume",
    name: "AI Resume Builder",
    description: "Create professional resumes with ATS-friendly templates",
    icon: FileText,
    color: "from-purple-500 to-purple-700",
    fields: [
      { label: "Your Name", key: "name", type: "text", placeholder: "Rahul Sharma" },
      { label: "Job Title", key: "title", type: "text", placeholder: "Software Engineer" },
      { label: "Skills (comma-separated)", key: "skills", type: "text", placeholder: "React, Node.js, TypeScript" },
      { label: "Template", key: "template", type: "select", placeholder: "Modern", options: ["Modern", "Classic", "ATS"] },
    ],
  },
  {
    id: "instagram",
    name: "AI Instagram Caption",
    description: "Generate engaging captions and hashtags for posts",
    icon: Instagram,
    color: "from-pink-500 to-pink-700",
    fields: [
      { label: "Product / Topic", key: "topic", type: "text", placeholder: "New watch collection launch" },
      { label: "Tone", key: "tone", type: "select", placeholder: "Professional", options: ["Professional", "Casual", "Excited", "Luxury"] },
    ],
  },
  {
    id: "homework",
    name: "AI Homework Planner",
    description: "Create personalized study schedules and plans",
    icon: BookOpen,
    color: "from-cyan-500 to-cyan-700",
    fields: [
      { label: "Subject", key: "subject", type: "text", placeholder: "Mathematics, Physics" },
      { label: "Exam Date", key: "examDate", type: "text", placeholder: "2024-04-15" },
      { label: "Schedule Type", key: "scheduleType", type: "select", placeholder: "Daily", options: ["Daily", "Weekly"] },
    ],
  },
  {
    id: "product-desc",
    name: "AI Product Description",
    description: "Write compelling SEO-optimized product descriptions",
    icon: Package,
    color: "from-amber-500 to-amber-700",
    fields: [
      { label: "Product Name", key: "product", type: "text", placeholder: "Wireless Ergonomic Mouse" },
      { label: "Key Features", key: "features", type: "text", placeholder: "Silent click, 6 buttons, 2400 DPI" },
      { label: "Platform", key: "platform", type: "select", placeholder: "Amazon", options: ["Amazon", "Flipkart", "General Ecommerce", "Website"] },
    ],
  },
  {
    id: "business-name",
    name: "AI Business Name Generator",
    description: "Get 10 creative name suggestions for your business",
    icon: Building2,
    color: "from-emerald-500 to-emerald-700",
    fields: [
      { label: "Industry / Keywords", key: "keywords", type: "text", placeholder: "tech, watches, luxury, India" },
      { label: "Style", key: "style", type: "select", placeholder: "Modern", options: ["Modern", "Traditional", "Playful", "Premium", "Tech"] },
    ],
  },
  {
    id: "marketing",
    name: "AI Marketing Content",
    description: "Create ads, promos and marketing copy instantly",
    icon: Megaphone,
    color: "from-orange-500 to-orange-700",
    fields: [
      { label: "Product / Service", key: "product", type: "text", placeholder: "BizVault AI subscription" },
      { label: "Target Audience", key: "audience", type: "text", placeholder: "Small business owners in India" },
      { label: "Content Type", key: "contentType", type: "select", placeholder: "Ad Copy", options: ["Ad Copy", "Promotional Email", "SMS Promo", "Landing Page"] },
    ],
  },
  {
    id: "email",
    name: "AI Email Writer",
    description: "Draft professional emails for any situation",
    icon: Mail,
    color: "from-blue-500 to-blue-700",
    fields: [
      { label: "Email Purpose", key: "purpose", type: "text", placeholder: "Follow up after a meeting" },
      { label: "Recipient", key: "recipient", type: "text", placeholder: "Client, Boss, Partner" },
      { label: "Tone", key: "tone", type: "select", placeholder: "Professional", options: ["Professional", "Friendly", "Formal", "Persuasive"] },
    ],
  },
  {
    id: "social",
    name: "AI Social Media Post",
    description: "Create platform-specific posts for all channels",
    icon: Share2,
    color: "from-violet-500 to-violet-700",
    fields: [
      { label: "Topic", key: "topic", type: "text", placeholder: "Launching new product" },
      { label: "Platform", key: "platform", type: "select", placeholder: "LinkedIn", options: ["LinkedIn", "Twitter/X", "Facebook", "Instagram", "WhatsApp"] },
      { label: "Goal", key: "goal", type: "text", placeholder: "Drive sales, build awareness" },
    ],
  },
];

function generateMockOutput(tool: Tool, inputs: Record<string, string>): string {
  const name = inputs.name || inputs.topic || inputs.product || inputs.keywords || "your topic";

  const outputs: Record<string, string> = {
    resume: `PROFESSIONAL RESUME

${inputs.name || "Rahul Sharma"}
${inputs.title || "Software Engineer"}
rahul@example.com | +91 9876543210 | Mumbai, India

PROFESSIONAL SUMMARY
Dynamic and results-driven ${inputs.title || "professional"} with expertise in ${inputs.skills || "modern technologies"}. Proven track record of delivering high-quality solutions.

SKILLS
${(inputs.skills || "React, Node.js, TypeScript").split(",").map(s => `• ${s.trim()}`).join("\n")}

WORK EXPERIENCE
Senior Developer | TechCorp India | 2022 - Present
• Led development of 3 enterprise-scale applications
• Reduced load times by 40% through optimization
• Mentored team of 5 junior developers

EDUCATION
B.Tech Computer Science | IIT Mumbai | 2020

Template: ${inputs.template || "Modern"} | Ready for ATS scanning`,

    instagram: `📸 INSTAGRAM CAPTION

✨ ${inputs.topic || "Amazing new product"} ✨

Transform your experience with our latest offering that's taking the market by storm! 🚀

💡 Why you'll love it:
→ Premium quality you can feel
→ Designed for the modern lifestyle
→ Limited availability — grab yours now!

🛒 Link in bio | DM for orders

#NewLaunch #MustHave #India #SmallBusiness #ProductLaunch #Trending #Quality #ShopNow #IndianBusiness #Viral

[Caption crafted for ${inputs.tone || "Professional"} tone]`,

    homework: `📚 STUDY SCHEDULE

Subject: ${inputs.subject || "Mathematics"}
Goal: Complete syllabus before ${inputs.examDate || "exam date"}

WEEK 1 PLAN:
Mon: Chapter 1-2 | 2 hrs
Tue: Chapter 3-4 | 2 hrs
Wed: Practice problems | 1.5 hrs
Thu: Chapter 5-6 | 2 hrs
Fri: Revision + Mock test | 2 hrs
Sat: Full revision | 3 hrs
Sun: Rest & light review | 1 hr

DAILY ROUTINE:
• 7:00 AM - Morning review (30 min)
• 4:00 PM - Main study session (2 hrs)
• 9:00 PM - Problem solving (1 hr)

PRO TIPS:
✓ Pomodoro technique: 25 min study + 5 min break
✓ Solve previous year papers
✓ Create mind maps for complex topics`,

    "product-desc": `🛍️ PRODUCT DESCRIPTION

${inputs.product || "Premium Product"}

Elevate your everyday experience with the ${inputs.product || "Premium Product"} — designed for those who demand the best.

KEY HIGHLIGHTS:
${(inputs.features || "Premium quality, Ergonomic design, Long-lasting").split(",").map(f => `✅ ${f.trim()}`).join("\n")}

WHY CHOOSE US:
Experience the perfect blend of functionality and style. Built with premium materials and engineered for performance.

TECHNICAL SPECS:
• Material: High-grade ABS + Aluminum
• Warranty: 1 Year manufacturer warranty
• Compatibility: Universal fit

PERFECT FOR:
Home office, Professional setup, Daily use

🚚 Free shipping above ₹499 | COD Available
Platform optimized for: ${inputs.platform || "Amazon"}`,

    "business-name": `✨ 10 BUSINESS NAME IDEAS

Based on keywords: ${inputs.keywords || "tech, business, India"}

1. ${name.split(",")[0]?.trim() || "Tech"}Vault Pro
2. ${name.split(",")[0]?.trim() || "Biz"}Nexus India
3. Smart${name.split(",")[0]?.trim() || "Trade"}Hub
4. ${name.split(",")[0]?.trim() || "Prime"}Sphere Co.
5. Elevate${name.split(",")[0]?.trim() || "X"}
6. ${name.split(",")[0]?.trim() || "Apex"}Craft Studios
7. Quantum${name.split(",")[0]?.trim() || "Biz"}
8. ${name.split(",")[0]?.trim() || "Rise"}Forward India
9. Zenith${name.split(",")[0]?.trim() || "Works"}
10. ${name.split(",")[0]?.trim() || "Nova"}Minds Co.

Style: ${inputs.style || "Modern"}
All names are short, memorable, and brandable.
✓ Domain availability check recommended
✓ Register trademark on IP India`,

    marketing: `📢 MARKETING CONTENT

Campaign for: ${inputs.product || "Your Product"}
Target: ${inputs.audience || "Business owners"}

HEADLINE OPTIONS:
1. "Transform Your Business with ${inputs.product || "Our Solution"} Today"
2. "Join 10,000+ Businesses Already Winning with Us"
3. "Stop Struggling. Start Growing. ${inputs.product || "Our Solution"} Changes Everything."

BODY COPY:
Are you tired of [pain point]? Introducing ${inputs.product || "our revolutionary product"} — the all-in-one solution designed specifically for ${inputs.audience || "businesses like yours"}.

✅ Save 10+ hours per week
✅ Increase revenue by 30%
✅ Used by 10,000+ businesses in India

CTA: "Start Your Free Trial Today — No Credit Card Required"

Type: ${inputs.contentType || "Ad Copy"}`,

    email: `📧 PROFESSIONAL EMAIL

Subject: ${inputs.purpose || "Follow-up from our conversation"}

Dear ${inputs.recipient || "Team"},

I hope this email finds you well. I'm reaching out regarding ${inputs.purpose || "our recent discussion"}.

I wanted to follow up and ensure we're aligned on the next steps. Based on our conversation, I believe we have an excellent opportunity to collaborate and create mutual value.

Key points to discuss:
• Scope and timeline alignment
• Resource requirements
• Success metrics

I would love to schedule a 30-minute call at your convenience to finalize the details. Please feel free to suggest a time that works best for you.

Looking forward to hearing from you.

Best regards,
[Your Name]
[Your Title]
[Company Name]
[Phone] | [Email]

Tone: ${inputs.tone || "Professional"}`,

    social: `📱 SOCIAL MEDIA POST

Platform: ${inputs.platform || "LinkedIn"}

---

${inputs.topic || "Exciting announcement coming soon"}! 🚀

We're incredibly excited to share something that's been in the works for months.

Here's what you need to know:
→ This changes everything for ${inputs.goal?.includes("sales") ? "buyers" : "our industry"}
→ Available to everyone, starting today
→ The results speak for themselves

What does this mean for you? It means ${inputs.goal || "better results, faster growth"}.

Drop a "👍" if you're excited!
Share with someone who needs to see this.

[Call-to-action based on ${inputs.platform || "platform"}]

#Business #Innovation #India #Growth #Entrepreneur`,
  };

  return outputs[tool.id] || `Generated content for: ${name}\n\nThis is AI-generated content for ${tool.name}.\nCustomize this output as needed for your specific use case.`;
}

export default function AIToolsPage() {
  const { config, loading } = useConfigurables();
  const aiEnabled = loading ? true : (config?.aiToolsEnabled ?? true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTool) return;
    setGenerating(true);
    setOutput("");
    await new Promise(r => setTimeout(r, 1200));
    setOutput(generateMockOutput(selectedTool, inputs));
    setGenerating(false);
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setInputs({});
    setOutput("");
  };

  if (!aiEnabled) {
    return (
      <div className="animate-fade-in-up">
        <PageHeader title="AI Tools" subtitle="Upgrade your plan to access AI tools" />
        <GlassCard className="text-center py-16">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-foreground font-semibold text-lg mb-2">AI Tools are a Pro feature</p>
          <p className="text-muted-foreground mb-6">Upgrade to Pro or Business plan to access all 8 AI tools</p>
          <a href="/subscriptions" className="neon-button px-6 py-2.5 rounded-lg text-sm font-semibold inline-block">Upgrade Now</a>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="AI Tools"
        subtitle="8 powerful AI tools to supercharge your business"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tools List */}
        <div className="xl:col-span-1 space-y-3">
          {tools.map(tool => {
            const Icon = tool.icon;
            const isSelected = selectedTool?.id === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border glass-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tool Workspace */}
        <div className="xl:col-span-2">
          {!selectedTool ? (
            <GlassCard className="flex flex-col items-center justify-center h-full min-h-96 text-center">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <p className="text-lg font-semibold text-foreground">Select an AI Tool</p>
              <p className="text-sm text-muted-foreground mt-2">Choose from 8 powerful AI tools on the left</p>
            </GlassCard>
          ) : (
            <GlassCard className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedTool.color} flex items-center justify-center`}>
                  <selectedTool.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedTool.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedTool.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedTool.fields.map(field => (
                  <div key={field.key}>
                    <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        value={inputs[field.key] ?? ""}
                        onChange={e => setInputs(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={inputs[field.key] ?? ""}
                        onChange={e => setInputs(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full neon-button py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate with AI</>
                )}
              </button>

              {output && (
                <div className="p-4 bg-muted/20 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-primary">AI Output</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(output)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono">
                    {output}
                  </pre>
                </div>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

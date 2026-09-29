// Content comes from Nimrah's CV, her EvaScan / GreenNest decks, the EvaScan poster and her Ideathon script.
// Keep it in sync with the CV and the GitHub profile README.

export const profile = {
  name: "Nimrah Naeem",
  role: "AI & Machine Learning Engineer",
  current: "Jr. AI Engineer at Trajan.ai",
  location: "Islamabad, Pakistan",
  email: "nimrahnaeem01@gmail.com",
  linkedin: "https://linkedin.com/in/nimrah-naeem",
  github: "https://github.com/NimrahNaeem",
  // Her own closing line from the EvaScan Ideathon pitch.
  motto: "Tech with purpose. AI with impact.",
  bio: "Gold Medalist Computer Science graduate from IST. I build multi-modal AI for medical imaging, NLP systems and production data pipelines, and I'm happiest when a model is accurate, explainable and in someone's hands.",
};

export type Metric = { value: number; decimals?: number; suffix?: string; label: string };

export const metrics: Metric[] = [
  { value: 3.96, decimals: 2, label: "CGPA out of 4.00" },
  { value: 97, suffix: "%", label: "Mammography detection sensitivity" },
  { value: 5000, suffix: "+", label: "Medical images across EvaScan" },
  { value: 150, suffix: "+", label: "Studies analysed as a Research Assistant" },
];

export type Medal = { id: string; face: string; title: string; detail: string };

export const medals: Medal[] = [
  { id: "cgpa", face: "3.96", title: "Highest CGPA", detail: "BS Computer Science, IST · 3.96 / 4.00" },
  { id: "fyp", face: "FYP", title: "Best Final Year Project", detail: "EvaScan · Institute of Space Technology" },
];

/* ---------- EvaScan ---------- */

export type Flow = {
  id: string;
  side: "Patient" | "Doctor";
  label: string;
  title: string;
  body: string;
  stat?: { value: string; label: string };
};

export const evascanFlows: Flow[] = [
  {
    id: "home",
    side: "Patient",
    label: "Home",
    title: "Her health at a glance",
    body: "One dashboard for uploading reports, risk assessment, a guided self-exam and scan history. An empathic voice agent reads results aloud.",
  },
  {
    id: "mammogram",
    side: "Patient",
    label: "Mammogram",
    title: "Mammogram detection",
    body: "Upload a mammogram and YOLOv8 localises suspicious masses, then reports stage, size, estimated survival and next-step recommendations.",
    stat: { value: "97%", label: "sensitivity · YOLOv8" },
  },
  {
    id: "xai",
    side: "Patient",
    label: "Grad-CAM",
    title: "It shows its reasoning",
    body: "For ultrasound, an ensemble classifier makes the call and Grad-CAM and saliency maps highlight exactly which pixels drove it, so doctors and patients can see why something was flagged.",
    stat: { value: "80.46%", label: "accuracy · ensemble ultrasound" },
  },
  {
    id: "risk",
    side: "Patient",
    label: "Risk",
    title: "Personal risk prediction",
    body: "Lifestyle and medical-history questions feed a deep neural network that returns a personal breast cancer risk score.",
    stat: { value: "93.4%", label: "accuracy · DNN risk model" },
  },
  {
    id: "selfexam",
    side: "Patient",
    label: "Self-exam",
    title: "Guided clinical self-exam",
    body: "A step-by-step breast self-exam. Findings that need attention are flagged as high priority, with a warm, plain-language report and one tap to book a doctor.",
  },
  {
    id: "history",
    side: "Patient",
    label: "History",
    title: "Every scan, in one place",
    body: "Mammograms and ultrasounds are saved to a private scan history she can share with her doctor.",
  },
  {
    id: "doctor",
    side: "Doctor",
    label: "Doctor",
    title: "The doctor's side",
    body: "Clinicians see shared scans and risk reports, manage appointments by day, week or month, and accept, reschedule or decline requests. AI supports the oncologist; it doesn't replace them.",
  },
];

export const evascanModels = [
  { task: "Mammography detection", model: "YOLOv8", metric: "Sensitivity", value: 97 },
  { task: "Risk prediction", model: "DNN", metric: "Accuracy", value: 93.4 },
  { task: "Ultrasound classification", model: "Ensemble", metric: "Accuracy", value: 80.46 },
];

/* ---------- The motion (debate framing, lines from her Ideathon script) ---------- */

export const motion = {
  text: "This House believes that where you live shouldn't decide if you live.",
  points: [
    {
      heading: "The problem",
      line: "Not because we can't treat it. But because we find it too late.",
      detail:
        "Localised breast cancer has over 99% five-year survival. Found late, survival falls to 30–50%. In rural Pakistan, by the time a woman is screened it is often already Stage III.",
    },
    {
      heading: "The answer",
      line: "No hospitals. No queues. No shame.",
      detail:
        "EvaScan puts early detection on the device she already carries every day: her smartphone. Just a tap to check, to understand, to act early.",
    },
    {
      heading: "The proof",
      line: "This is AI built for trust.",
      detail:
        "No black-box answers: Grad-CAM shows why something was flagged. A hospital screening costs around 8,000 rupees; EvaScan aims for the cost of a mobile recharge.",
    },
  ],
  verdict: "Motion carried: Best FYP, Gold Medal.",
};

/* ---------- Experience ---------- */

export type Role = { id: string; title: string; org: string; place: string; period: string; points: string[] };

export const experience: Role[] = [
  {
    id: "trajan",
    title: "Jr. AI Engineer",
    org: "Trajan.ai",
    place: "California, USA · Remote",
    period: "Mar 2026 – Present",
    points: [
      "Building scalable scraping and data pipelines for large-scale automation.",
      "Designing AI-driven workflows for data mapping, validation and integration.",
      "Delivering production-ready solutions with a global team.",
    ],
  },
  {
    id: "aiotac",
    title: "AI Intern",
    org: "Aiotac, NSTP, NUST",
    place: "Islamabad",
    period: "Jul 2025 – Sep 2025",
    points: [
      "Built Text2Visuals, an R&D project that turns research papers into auto-generated posters (Flask, TensorFlow, React).",
      "NLP-based summarisation and visual layout design.",
      "Faster inference with caching and async APIs; full deployment and user documentation.",
    ],
  },
  {
    id: "ist",
    title: "Research Assistant",
    org: "Institute of Space Technology",
    place: "Islamabad",
    period: "Aug 2024 – Jun 2025",
    points: [
      "Co-authored two review papers on AI in breast cancer and Alzheimer's diagnosis (under peer review).",
      "Analysed 150+ studies into structured, publication-ready reports.",
      "Worked with faculty on structure and methodological accuracy.",
    ],
  },
];

/* ---------- Research (PRISMA numbers from the EvaScan proposal deck) ---------- */

export const prisma = [
  { n: 570, label: "Articles identified", note: "450 from databases, 120 via snowballing" },
  { n: 420, label: "Screened", note: "After de-duplication, by title and abstract" },
  { n: 270, label: "Full texts assessed", note: "Checked against eligibility criteria" },
  { n: 160, label: "Included", note: "In the final systematic review" },
];

export const papers = [
  { title: "AI in breast cancer diagnosis", status: "Under review, Elsevier ScienceDirect", kind: "Systematic review · co-author" },
  { title: "AI in Alzheimer's diagnosis", status: "Under peer review", kind: "Review paper · co-author" },
];

/* ---------- Other projects ---------- */

export const projects = [
  {
    id: "greennest",
    name: "GreenNest",
    tagline: "Your green companion",
    summary:
      "An AI-powered social community for plant lovers. Snap a photo and on-device TensorFlow Lite identifies the plant and checks it for pests or disease.",
    points: [
      "Plant identification and health diagnosis across 20+ species",
      "Nursery locator by GPS or city, plus weather-based recommendations",
      "Personal plant catalogue with watering and care reminders",
      "Real-time community feed: posts, likes and comments",
    ],
    stack: ["Java", "Android", "TensorFlow Lite", "Firebase", "Google Maps API", "SQLite"],
    deck: "greennest",
    cover: "/decks/greennest/01.jpg",
  },
  {
    id: "text2visuals",
    name: "Text2Visuals",
    tagline: "Research papers to posters",
    summary:
      "An R&D project at Aiotac that reads a research paper, summarises it with NLP and lays the result out as an academic poster.",
    points: [
      "NLP summarisation feeding automatic visual layout",
      "Caching and async APIs for faster inference",
      "Shipped with deployment and user documentation",
    ],
    stack: ["Python", "Flask", "TensorFlow", "React"],
  },
];

/* ---------- Presentations ---------- */

export type Deck = { id: string; title: string; subtitle: string; slides: number; cover: string };

export const decks: Deck[] = [
  { id: "evascan-pitch", title: "EvaScan start-up pitch", subtitle: "AI start-up competition · KICSIT 2025", slides: 10, cover: "/decks/evascan-pitch/01.jpg" },
  { id: "evascan-proposal", title: "EvaScan title defence", subtitle: "FYP proposal, literature review & roadmap", slides: 19, cover: "/decks/evascan-proposal/01.jpg" },
  { id: "evascan-design", title: "EvaScan design defence", subtitle: "Architecture, datasets, federated learning & UML", slides: 58, cover: "/decks/evascan-design/01.jpg" },
  { id: "greennest", title: "GreenNest", subtitle: "AI plant care app walkthrough", slides: 12, cover: "/decks/greennest/01.jpg" },
];

/* ---------- Recognition & skills ---------- */

export const awards = [
  { title: "Best English Debater", where: "NUST EME Olympiad", year: "2023" },
  { title: "Winner, Code Jail", where: "NaSCon, FAST", year: "2024" },
  { title: "Recognised at NIC AI Fest", where: "Innovative AI-driven research", year: "" },
];

export const skills = [
  { group: "Machine learning", items: ["Python", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "YOLOv8", "OpenCV", "TensorFlow Lite", "Hugging Face"] },
  { group: "Focus areas", items: ["Computer vision", "NLP", "Transformers", "Explainable AI", "Grad-CAM", "Medical imaging"] },
  { group: "Build & ship", items: ["Flask", "REST APIs", "React", "React Native", "Android (Java)", "Firebase", "AWS", "Git"] },
];

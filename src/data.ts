// All content is taken from Nimrah's CV. Keep it in sync with the CV and the GitHub profile README.

export const profile = {
  name: "Nimrah Naeem",
  role: "AI & Machine Learning Engineer",
  current: "Jr. AI Engineer at Trajan.ai",
  location: "Islamabad, Pakistan",
  email: "nimrahnaeem01@gmail.com",
  linkedin: "https://linkedin.com/in/nimrah-naeem",
  github: "https://github.com/NimrahNaeem",
  summary:
    "Gold Medalist Computer Science graduate specialising in AI, machine learning and NLP-driven systems. I build multi-modal AI systems, explainable medical-imaging models and production data pipelines, and I turn complex technical ideas into structured, deployable solutions.",
};

export type Metric = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export const metrics: Metric[] = [
  { value: 3.96, decimals: 2, suffix: " / 4.00", label: "CGPA, BS Computer Science, IST" },
  { value: 97, suffix: "%", label: "Sensitivity of EvaScan's YOLOv8 mammography detector" },
  { value: 5000, suffix: "+", label: "Medical images across EvaScan's models" },
  { value: 2, suffix: "×", label: "Gold medals: Highest CGPA and Best FYP" },
];

export type Role = {
  id: string;
  title: string;
  org: string;
  place: string;
  period: string;
  points: string[];
  stack?: string[];
};

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
      "Collaborating with a global team to deliver efficient, production-ready solutions.",
    ],
  },
  {
    id: "aiotac",
    title: "AI Intern",
    org: "Aiotac, NSTP, NUST",
    place: "Islamabad",
    period: "Jul 2025 – Sep 2025",
    points: [
      "Developed Text2Visuals, an R&D project that turns research papers into auto-generated posters.",
      "Conducted NLP-based content summarisation and visual layout design.",
      "Optimised inference with caching and async APIs, and prepared full deployment and user documentation.",
    ],
    stack: ["Flask", "TensorFlow", "React.js"],
  },
  {
    id: "ist",
    title: "Research Assistant",
    org: "Institute of Space Technology (IST)",
    place: "Islamabad",
    period: "Aug 2024 – Jun 2025",
    points: [
      "Co-authored two review papers on AI in breast cancer and Alzheimer's diagnosis (under peer review).",
      "Analysed 150+ studies and produced structured, publication-ready academic reports.",
      "Worked with faculty researchers to improve document structure and methodological accuracy.",
    ],
  },
];

export type Domain = "Medical imaging" | "Computer vision" | "NLP" | "Mobile" | "Web";

export type ModelResult = {
  task: string;
  model: string;
  metric: string;
  value: number;
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  award?: string;
  context?: string;
  domains: Domain[];
  summary: string;
  points: string[];
  models?: ModelResult[];
  stack: string[];
  /** Extra skills this project demonstrates, used by the skill filter. */
  also?: string[];
};

export const projects: Project[] = [
  {
    id: "evascan",
    name: "EvaScan",
    tagline: "AI-powered breast cancer detection",
    award: "Best FYP · Gold Medal, IST",
    domains: ["Medical imaging", "Computer vision", "Mobile"],
    summary:
      "A multi-modal mobile platform that combines mammography detection, ultrasound classification and risk prediction, trained across 5,000+ medical images.",
    points: [
      "YOLOv8 mammography detection, ensemble ultrasound classification and DNN risk prediction in one platform.",
      "Grad-CAM and saliency maps explain each prediction, with high radiologist-agreement scores.",
      "Deployed for real-time inference on mobile.",
    ],
    models: [
      { task: "Mammography detection", model: "YOLOv8", metric: "Sensitivity", value: 97 },
      { task: "Risk prediction", model: "DNN", metric: "Accuracy", value: 93.4 },
      { task: "Ultrasound classification", model: "Ensemble", metric: "Accuracy", value: 80.46 },
    ],
    stack: ["Python", "TensorFlow", "PyTorch", "YOLOv8", "Scikit-learn", "OpenCV", "React Native", "Firebase"],
    also: ["Explainable AI", "Grad-CAM", "Saliency maps"],
  },
  {
    id: "text2visuals",
    name: "Text2Visuals",
    tagline: "Research papers to auto-generated posters",
    context: "R&D project · AI internship at Aiotac",
    domains: ["NLP", "Web"],
    summary:
      "Reads a research paper, summarises it with NLP and lays the result out as a ready-to-use academic poster.",
    points: [
      "NLP-based content summarisation feeds an automatic visual layout step.",
      "Caching and async APIs cut inference wait times.",
      "Shipped with full deployment and user documentation.",
    ],
    stack: ["Python", "Flask", "TensorFlow", "React.js", "REST APIs"],
  },
  {
    id: "greennest",
    name: "GreenNest",
    tagline: "AI smart plant care app",
    domains: ["Mobile", "Computer vision"],
    summary:
      "A full-stack Android app that detects plant disease on-device and connects gardeners through a community forum.",
    points: [
      "On-device plant disease detection with TensorFlow Lite.",
      "Real-time plant health monitoring across 20+ plant species.",
      "GPS-based garden tracking, weather integration and a community forum.",
    ],
    stack: ["Java", "Android", "TensorFlow Lite", "Firebase", "Google Maps API", "Weather API", "SQLite"],
  },
];

export const research = [
  {
    title: "AI in breast cancer diagnosis",
    kind: "Review paper · co-author",
    status: "Under peer review",
  },
  {
    title: "AI in Alzheimer's diagnosis",
    kind: "Review paper · co-author",
    status: "Under peer review",
  },
];

export const skillGroups: { name: string; items: string[] }[] = [
  {
    name: "Machine learning",
    items: ["Python", "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "YOLOv8", "OpenCV", "TensorFlow Lite", "Hugging Face", "Kaggle"],
  },
  {
    name: "Specialisations",
    items: ["Computer vision", "NLP", "Transformers", "Explainable AI", "Grad-CAM", "Saliency maps"],
  },
  {
    name: "Web, mobile & deployment",
    items: ["Flask", "REST APIs", "React.js", "React Native", "Java", "Android", "Firebase", "SQLite", "AWS", "Git"],
  },
];

export const achievements = [
  { title: "2× Gold Medalist", detail: "Highest CGPA and Best Final Year Project, IST" },
  { title: "Winner, Code Jail", detail: "NaSCon, FAST, 2024" },
  { title: "Winner, Best English Debater", detail: "NUST EME Olympiad, 2023" },
  { title: "Recognised at NIC AI Fest", detail: "For innovative AI-driven research" },
];

export const education = {
  degree: "BS Computer Science",
  school: "Institute of Space Technology (IST)",
  period: "Feb 2022 – Feb 2026",
  result: "CGPA 3.96 / 4.00 · Gold Medalist",
};

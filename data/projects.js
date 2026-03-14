// ============================================================
//  PROJECTS DATA — To add a new project, just copy the block
//  below and paste it at the end of the array. That's it!
// ============================================================
//
//  {
//    title: "New Project",
//    description: "What does this project do?",
//    long_description: "More detailed explanation shown on hover or expansion.",
//    technologies: ["React", "Django", "PostgreSQL"],
//    github: "https://github.com/you/repo",
//    demo: "https://your-live-demo.com",
//    featured: false,   // set true to show in featured row
//    color: "#hexcode", // accent color for the card
//  },
//
// ============================================================

const projects = [
  {
    title: "Managora",
    description: "Full-scale company management platform with HR, accounting, financial tracking, real-time alerts, and administrative dashboards.",
    long_description: "Managora is an end-to-end enterprise management solution. It handles employee onboarding and HR workflows, double-entry accounting, payroll processing, configurable alerts, financial forecasting reports, and granular role-based admin panels — all in one unified platform.",
    technologies: ["Python", "Django", "React", "PostgreSQL", "Docker"],
    github: "#",  // ← replace with real link
    demo: "#",    // ← replace with real link
    featured: true,
    color: "#00d4ff",
  },
  {
    title: "Nibar Cloud",
    description: "Cloud management system for restaurants, cafés, and hotels — covering orders, employees, inventory, and financial operations.",
    long_description: "Nibar Cloud brings restaurant and hospitality management into the cloud. Features include table-based order management, staff scheduling, live inventory tracking with low-stock alerts, supplier management, and detailed financial dashboards for managers and owners.",
    technologies: ["Django", "React", "MySQL", "Docker", "REST API"],
    github: "#",
    demo: "#",
    featured: true,
    color: "#ff6b35",
  },
  {
    title: "Eduvia",
    description: "Educational platform for digital learning, course management, and student progress tracking.",
    long_description: "Eduvia is a modern e-learning platform that supports rich course creation with video, quizzes, and documents. Instructors get analytics dashboards while students track progress, earn certificates, and engage through discussion forums.",
    technologies: ["Python", "Django", "React", "PostgreSQL", "AWS S3"],
    github: "#",
    demo: "#",
    featured: true,
    color: "#7c3aed",
  },
  {
    title: "Trafico",
    description: "Marketing platform and e-commerce store for product promotion, campaign management, and online sales.",
    long_description: "Trafico combines a powerful marketing engine with a full-featured e-commerce store. Businesses can manage product catalogs, run targeted promotional campaigns, process orders, track analytics, and grow their digital sales — all from one dashboard.",
    technologies: ["JavaScript", "React", "Django", "PostgreSQL", "Stripe"],
    github: "#",
    demo: "#",
    featured: false,
    color: "#10b981",
  },
];

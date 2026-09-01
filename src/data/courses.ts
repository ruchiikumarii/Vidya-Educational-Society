export interface Course {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: "Certificate" | "Diploma" | "Skill Development" | "Accounting" | "Programming & DTP";
  duration: string;
  eligibility: string;
  fees: string;
  mode: string;
  affiliation: string;
  batchTiming: string;
  image: string;
  summary: string;
  modules: string[];
  careerOpportunities: string;
  certification: string;
}

export const courseCategories = [
  "All",
  "Certificate",
  "Diploma",
  "Skill Development",
  "Accounting",
  "Programming & DTP"
];

const COMMON_TIMING = "Morning / Evening (7:00 AM – 7:00 PM, batch-wise)";

export const courses: Course[] = [
  {
    id: "c1",
    slug: "cdeo",
    title: "Certificate in Data Entry Operator (CDEO)",
    shortTitle: "CDEO",
    category: "Certificate",
    duration: "6 Months",
    eligibility: "10th Pass",
    fees: "₹3,000",
    mode: "Offline",
    affiliation: "Authorized Study Centre – NIOS, New Delhi",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80&w=800",
    summary:
      "A NIOS certificate course that trains students in data entry and everyday office computing - ideal for anyone starting out on the computer after 10th.",
    modules: ["MS Word", "MS Excel", "MS PowerPoint", "Internet", "Digital Skill"],
    careerOpportunities:
      "Data Entry Operator, Computer Operator, Office Assistant, Back Office Executive.",
    certification: "Certificate issued by NIOS, New Delhi"
  },
  {
    id: "c2",
    slug: "cic",
    title: "Certificate in Computer Application (CIC)",
    shortTitle: "CIC",
    category: "Certificate",
    duration: "1 Year",
    eligibility: "10th Pass",
    fees: "₹6,000",
    mode: "Offline",
    affiliation: "Authorized Study Centre – NIOS, New Delhi",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    summary:
      "A one-year NIOS certificate covering office applications along with an introduction to Python programming - a strong, well-rounded first computer course.",
    modules: ["MS Word", "MS Excel", "MS PowerPoint", "Internet", "Python Programming"],
    careerOpportunities:
      "Computer Operator, Office Executive, Data Entry Operator, foundation for further programming courses.",
    certification: "Certificate issued by NIOS, New Delhi"
  },
  {
    id: "c3",
    slug: "os-cit",
    title: "OS-CIT (Odisha State Certificate in Information Technology)",
    shortTitle: "OS-CIT",
    category: "Skill Development",
    duration: "3 Months",
    eligibility: "10th Standard",
    fees: "₹4,000",
    mode: "Online / Offline",
    affiliation: "OKCL, Bhubaneswar (Govt. of Odisha) · Certified by OSOU, Sambalpur",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    summary:
      "OKCL's foundation information-proficiency course under the Department of E & IT, Govt. of Odisha - now updated to include modern AI tools.",
    modules: ["MS Office", "Internet", "Digital Skill", "AI Tools"],
    careerOpportunities:
      "Computer Operator, Data Entry Operator, and eligibility for the advanced OS-CIT (A) programme.",
    certification: "Certified by Odisha State Open University (OSOU), Sambalpur"
  },
  {
    id: "c4",
    slug: "os-cit-a",
    title: "OS-CIT (A) - Advanced Skill Module",
    shortTitle: "OS-CIT (A)",
    category: "Skill Development",
    duration: "3 Months",
    eligibility: "OS-CIT",
    fees: "₹9,000",
    mode: "Online / Offline",
    affiliation: "OKCL, Bhubaneswar (Govt. of Odisha)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
    summary:
      "The advanced OKCL module where the student specialises by choosing one OCOC skill course such as Advanced Excel, Python, Tally, Web Designing or Retail Management.",
    modules: [
      "Choose any one OCOC course:",
      "Advanced Excel / DEDM / MMA",
      "Python / AI",
      "Retail Management",
      "Video Recording / Web Designing",
      "Tally, and more"
    ],
    careerOpportunities:
      "Specialised skill certification in your chosen stream, plus eligibility for the two-course OS-CIT (A+) programme.",
    certification: "OKCL / OSOU Skill Certificate"
  },
  {
    id: "c5",
    slug: "os-cit-a-plus",
    title: "OS-CIT (A+) - Dual Skill Programme (2 of 37)",
    shortTitle: "OS-CIT (A+)",
    category: "Skill Development",
    duration: "6 Months",
    eligibility: "OS-CIT (A)",
    fees: "₹18,000",
    mode: "Online / Offline",
    affiliation: "OKCL, Bhubaneswar (Govt. of Odisha)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    summary:
      "A six-month advanced programme in which the student selects any two OCOC skill courses out of the 37 available - building two job-ready specialisations together.",
    modules: [
      "Choose any 2 OCOC courses out of 37",
      "Example combinations:",
      "Advanced Excel + Tally",
      "Web Designing + Python",
      "Retail Management + DEDM",
      "AI + MMA"
    ],
    careerOpportunities:
      "Two specialised skill certifications, making the student employable across multiple roles.",
    certification: "OKCL / OSOU Advanced Skill Certificate"
  },
  {
    id: "c6",
    slug: "ococ",
    title: "OCOC - OKCL Online Certificate Course",
    shortTitle: "OCOC",
    category: "Skill Development",
    duration: "3 Months",
    eligibility: "10th Pass",
    fees: "₹5,000",
    mode: "Online / Offline",
    affiliation: "OKCL, Bhubaneswar (Govt. of Odisha)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    summary:
      "A short, focused OKCL certificate in a single skill of your choice - pick any one course from the 37 OCOC options and finish job-ready in three months.",
    modules: [
      "Choose any one course out of 37 OCOC courses",
      "Advanced Excel, Tally, Python",
      "Web Designing, AI, DEDM",
      "Retail Management, Video Recording, and more"
    ],
    careerOpportunities:
      "Focused, employable skill in your chosen area within a short duration.",
    certification: "OKCL / OSOU Certificate"
  },
  {
    id: "c7",
    slug: "pgdca",
    title: "Post Graduate Diploma in Computer Application (PGDCA)",
    shortTitle: "PGDCA",
    category: "Diploma",
    duration: "12 Months",
    eligibility: "Degree from a Recognized University",
    fees: "₹11,500",
    mode: "Offline",
    affiliation: "Approved by ITCT (Ministry of Corporate Affairs, Govt. of India)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    summary:
      "Our most complete diploma for graduates - office applications, accounting, programming and desktop publishing together, with AI tools added to the syllabus.",
    modules: [
      "MS Office",
      "Tally Accounting",
      "C & C++",
      "DTP (PageMaker, CorelDRAW, Photoshop)",
      "Internet & Digital Skill",
      "AI Tools"
    ],
    careerOpportunities:
      "Computer Operator, Accountant, DTP Designer, Programmer Trainee, Office Executive in government and private sectors.",
    certification: "PGDCA Diploma approved by ITCT"
  },
  {
    id: "c8",
    slug: "dca",
    title: "Diploma in Computer Application (DCA)",
    shortTitle: "DCA",
    category: "Diploma",
    duration: "6 Months",
    eligibility: "10th Pass",
    fees: "₹6,500",
    mode: "Offline",
    affiliation: "Approved by ITCT (Ministry of Corporate Affairs, Govt. of India)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    summary:
      "A six-month diploma covering office work, accounting, C programming and desktop publishing - the most popular all-round course for students after 10th.",
    modules: [
      "MS Office",
      "Tally Accounting",
      "C Programming",
      "DTP",
      "Internet & Digital Skill",
      "AI Tools"
    ],
    careerOpportunities:
      "Computer Operator, Accounts Assistant, DTP Operator, Office Assistant.",
    certification: "DCA Diploma approved by ITCT"
  },
  {
    id: "c9",
    slug: "certificate-in-computing",
    title: "Certificate in Computing",
    shortTitle: "Certificate in Computing",
    category: "Certificate",
    duration: "3 Months",
    eligibility: "10th Pass",
    fees: "₹3,500",
    mode: "Offline",
    affiliation: "Vidya Educational Society (NEURON)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80&w=800",
    summary:
      "A short basic-computing certificate for students who need essential office and internet skills quickly.",
    modules: ["MS Office", "Internet"],
    careerOpportunities:
      "Basic Computer Operator, Office Assistant, or a foundation before joining a longer course.",
    certification: "Certificate of Completion from the institute"
  },
  {
    id: "c10",
    slug: "tally-prime-gst",
    title: "Tally Prime with GST",
    shortTitle: "Tally Prime with GST",
    category: "Accounting",
    duration: "3 Months",
    eligibility: "10th Pass",
    fees: "₹4,000",
    mode: "Offline",
    affiliation: "Vidya Educational Society (NEURON)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    summary:
      "Practical accounting on Tally Prime with GST - taught with real vouchers so students are ready for accounts and billing jobs.",
    modules: ["Accounting Fundamentals", "Tally Prime with GST"],
    careerOpportunities:
      "Accountant, Billing Executive, Accounts Assistant, GST data operator.",
    certification: "Certificate of Completion from the institute"
  },
  {
    id: "c11",
    slug: "programming-dtp",
    title: "Programming & DTP (C, C++, Photoshop, CorelDRAW, Web Designing)",
    shortTitle: "Programming & DTP",
    category: "Programming & DTP",
    duration: "3 Months",
    eligibility: "10th Pass",
    fees: "₹4,000",
    mode: "Offline",
    affiliation: "Vidya Educational Society (NEURON)",
    batchTiming: COMMON_TIMING,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800",
    summary:
      "A flexible short course where students learn programming and design tools - pick from C, C++, Photoshop, PageMaker, CorelDRAW, Web Designing and more.",
    modules: ["C", "C++", "Photoshop", "PageMaker", "CorelDRAW", "Web Designing", "and many more"],
    careerOpportunities:
      "Junior Programmer, DTP Designer, Web Designer, Graphic Designer.",
    certification: "Certificate of Completion from the institute"
  }
];

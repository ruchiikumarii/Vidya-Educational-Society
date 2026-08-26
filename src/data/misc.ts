export const achievements = [
  { id: "a1", title: "Established", value: "1997", description: "Serving students in Keonjhar since 1997" },
  { id: "a2", title: "Years of Service", value: "28+", description: "Nearly three decades of computer training" },
  { id: "a3", title: "Govt. Affiliations", value: "3", description: "Authorized centre of NIOS, OKCL and ITCT" },
  { id: "a4", title: "Courses Offered", value: "11+", description: "Certificate, diploma, skill and accounting courses" },
  { id: "a5", title: "OCOC Skill Courses", value: "37", description: "OKCL skill courses to choose from" },
  { id: "a6", title: "Learning Modes", value: "2", description: "Available in both online and offline mode" }
];

export const heroSlides = [
  {
    id: "h1",
    image: "/images/institute-building.jpg",
    badge: "Admission Open",
    title: "Computer Education in Keonjhar Since 1997",
    subtitle:
      "Vidya Educational Society (NEURON) - an authorized study & learning centre of NIOS, OKCL and ITCT.",
    primaryCta: { label: "View Courses", to: "/courses" },
    secondaryCta: { label: "Apply for Admission", to: "/admissions" }
  },
  {
    id: "h2",
    image: "/images/mission-shakti-training.jpg",
    badge: "NIOS Authorized Study Centre",
    title: "Govt. Recognised Computer Certificates",
    subtitle:
      "CDEO, CIC, OC-CIP, OCOC, PGDCA, DCA, Tally Prime with GST and Programming & DTP courses under one roof.",
    primaryCta: { label: "Explore Courses", to: "/courses" },
    secondaryCta: { label: "Talk to Us", to: "/contact" }
  },
  {
    id: "h3",
    image: "/images/classroom.jpg",
    badge: "OKCL · Govt. of Odisha",
    title: "Skill Courses in Online & Offline Mode",
    subtitle:
      "OKCL's OC-CIP and OCOC skill programmes - choose from 37 job-oriented skill courses including Tally, Python and Web Designing.",
    primaryCta: { label: "Skill Courses", to: "/courses?category=Skill+Development" },
    secondaryCta: { label: "Our Affiliations", to: "/affiliations" }
  },
  {
    id: "h4",
    image: "/images/group-students.jpg",
    badge: "Our Students",
    title: "Learn From Experienced Trainers",
    subtitle:
      "Our senior faculty bring decades of teaching experience across MCA, PGDCA, DCA and NIOS courses.",
    primaryCta: { label: "Meet Our Faculty", to: "/faculty" },
    secondaryCta: { label: "About Us", to: "/about" }
  }
];

export const whyUsPoints = [
  {
    id: "w1",
    icon: "ShieldCheck",
    title: "Govt. Recognised Affiliations",
    description:
      "Authorized study centre of NIOS (New Delhi), authorized learning centre of OKCL (Govt. of Odisha, certified by OSOU) and an approved centre of ITCT - so your certificate carries real recognition."
  },
  {
    id: "w2",
    icon: "Award",
    title: "28 Years of Experience",
    description:
      "Running since 1997, we are one of the most established and trusted computer training institutes in the Keonjhar region."
  },
  {
    id: "w3",
    icon: "Monitor",
    title: "Online & Offline Mode",
    description:
      "Many of our OKCL courses are available in both online and offline mode, so you can learn at the centre or from home as it suits you."
  },
  {
    id: "w4",
    icon: "Briefcase",
    title: "Job-Oriented Courses",
    description:
      "From data entry and Tally accounting to programming, DTP and 37 OCOC skill courses - every programme is chosen to lead to real work."
  },
  {
    id: "w5",
    icon: "Wallet",
    title: "Affordable Fees",
    description:
      "Transparent, low fees ranging from ₹3,000 to ₹11,500 depending on the course, with no hidden charges."
  },
  {
    id: "w6",
    icon: "Users",
    title: "Flexible Batches",
    description:
      "Morning and evening batches between 7:00 AM and 7:00 PM, so students, working people and homemakers can all find a convenient time."
  }
];

export const directorMessage = {
  name: "Bidhyadhar Chaudhury",
  designation: "Director & Sr. Faculty, Vidya Educational Society (NEURON)",
  image: "/images/director.jpg",
  greeting: "Dear Students, Parents, and Well-Wishers,",
  paragraphs: [
    "It gives me immense pleasure to welcome you to Vidya Educational Society (NEURON) - an institution built on a strong vision to empower young minds through quality education, practical skills, and meaningful career opportunities.",
    "Since our establishment in 1997, our mission has remained clear: to ensure that the students of Keonjhar and surrounding areas are never left behind in an increasingly digital and competitive world. What began as a vision has grown into a trusted centre of learning, helping students build knowledge, confidence, skills, and a brighter future.",
    "At our institute, we believe that education is not merely about earning a certificate - it is about gaining the knowledge, confidence, and skills needed to create opportunities and achieve success. Our focus is therefore on combining recognised education with practical, career-oriented learning.",
    "Whether you are taking your first step after the 10th standard, pursuing higher qualifications such as PGDCA, or looking to upgrade your professional skills through short-term courses, we are committed to supporting you at every stage of your learning journey.",
    "Our success is measured not only by the growth of our institution but also by the achievements of every student who walks through our doors with a dream and leaves with greater knowledge, confidence, and purpose.",
    "I warmly invite you to become a part of our family. Together, let us learn, grow, innovate, and build a brighter future.",
    "Your journey towards success can begin here."
  ],
  closing: "With warm wishes,",
  tagline: "Empowering Minds. Enhancing Skills. Shaping Futures."
};

export interface GalleryImage {
  id: string;
  url: string;
  category: "Campus" | "Classroom" | "Students" | "Events";
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    url: "/images/institute-building.jpg",
    category: "Campus",
    alt: "Vidya Educational Society building, Keonjhar"
  },
  {
    id: "g2",
    url: "/images/reception.jpg",
    category: "Campus",
    alt: "Front office and reception of the institute"
  },
  {
    id: "g3",
    url: "/images/classroom.jpg",
    category: "Classroom",
    alt: "Classroom with projector at the institute"
  },
  {
    id: "g4",
    url: "/images/mission-shakti-training.jpg",
    category: "Classroom",
    alt: "Mission Shakti computer training programme in progress"
  },
  {
    id: "g5",
    url: "/images/group-students.jpg",
    category: "Students",
    alt: "Group photo of students with faculty"
  },
  {
    id: "g6",
    url: "/images/ganesh-puja.jpg",
    category: "Events",
    alt: "Ganesh Puja celebration at the institute"
  }
];

export const instituteVideo = {
  src: "/videos/institute-video.mp4",
  poster: "/images/video-poster.jpg"
};


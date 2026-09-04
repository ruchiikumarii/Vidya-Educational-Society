export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experience: string;
  subjects: string[];
  image?: string;
}

// Display order by position (senior first).
const ROLE_ORDER = [
  'Director & Sr. Faculty',
  'Sr. Faculty',
  'Visiting Faculty',
  'Jr. Lab Faculty',
  'Office Assistant'
];

const facultyList: FacultyMember[] = [
  {
    id: "f1",
    name: "Sudipta Kumar Mahanty",
    role: "Sr. Faculty",
    qualification: "B.Sc., MCA",
    experience: "29 years of teaching experience to MCA, PGDCA, B.Tech & NIOS students.",
    image: "/images/faculty/sudipta-mahanty.jpg",
    subjects: [
      "Computer Education",
      "Computer Basics",
      "MS Office",
      "Tally",
      "C",
      "C++",
      "Java",
      "Python",
      "DTP",
      "Web Designing",
      "Advanced Excel"
    ]
  },
  {
    id: "f2",
    name: "Bidyadhar Chaudhury",
    role: "Director & Sr. Faculty",
    qualification: "M.Sc., PGDCA",
    experience: "20 years of teaching experience to PGDCA, DCA & OS-CIT students.",
    image: "/images/faculty/bidhyadhar-chaudhury.jpg",
    subjects: ["Computer Basics", "MS Office", "C", "C++", "Java", "Python"]
  },
  {
    id: "f3",
    name: "Er. Pawan Kumar Barik",
    role: "Visiting Faculty",
    qualification: "M.Tech (CSE), B.Tech (CSE)",
    experience:
      "15 years of teaching experience to PGDCA, DCA & NIOS students. Also experienced in teaching B.Sc. Computer Science students. Ex-Faculty at DD College.",
    image: "/images/faculty/pawan-barik.jpg",
    subjects: [
      "Computer Basics",
      "MS Office",
      "Java",
      "Python",
      "C",
      "C++",
      "Web Designing",
      "Tally",
      "Adobe Photoshop",
      "Adobe PageMaker",
      "CorelDRAW",
      "Adobe Illustrator",
      "Adobe InDesign",
      "Adobe Lightroom",
      "Adobe Premiere Pro"
    ]
  },
  {
    id: "f4",
    name: "Sibasish Nayak",
    role: "Jr. Lab Faculty",
    qualification: "B.A., PGDCA",
    experience: "2 years of lab experience, demonstrating students in the computer lab.",
    image: "/images/faculty/sibasish-nayak.jpg",
    subjects: ["MS Office", "Accounting", "Tally", "Language & DTP"]
  },
  {
    id: "f5",
    name: "Sanchita Mahanta",
    role: "Jr. Lab Faculty",
    qualification: "B.A., CDEO",
    experience: "1 year of lab experience, demonstrating students in the computer lab.",
    image: "/images/faculty/sanchita-mahata.jpg",
    subjects: ["MS Office", "Internet", "E-mail Technology"]
  },
  {
    id: "f6",
    name: "Ramesh Ch. Naik",
    role: "Office Assistant",
    qualification: "B.A., OS-CIT",
    experience: "10 years of experience in office administration at the institute.",
    image: "/images/faculty/ramesh-naik.jpg",
    subjects: ["Office Administration"]
  }
];

export const faculty: FacultyMember[] = [...facultyList].sort(
  (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
);

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "faq1",
    category: "Admissions",
    question: "What is the procedure for taking admission?",
    answer:
      "Visit any of our centres with your 10th/12th mark sheet, Aadhaar card and two passport size photographs. Fill the admission form, pay the registration fee and your batch is allotted the same day. There is no entrance test for any course."
  },
  {
    id: "faq2",
    category: "Admissions",
    question: "When do new batches start?",
    answer:
      "New batches start on the 1st and 15th of every month. Morning, afternoon and evening batches are available so working students can choose a convenient slot."
  },
  {
    id: "faq3",
    category: "Admissions",
    question: "What is the minimum qualification required?",
    answer:
      "It depends on the course. Vocational and short term courses require 8th pass, diploma courses require 10th pass, and programming and university courses require 12th pass. The exact eligibility is listed on each course page."
  },
  {
    id: "faq4",
    category: "Fees",
    question: "Can the fees be paid in installments?",
    answer:
      "Yes. Every course above three months can be paid in monthly or quarterly installments. The installment schedule is printed on your admission receipt and there are no hidden or extra charges."
  },
  {
    id: "faq5",
    category: "Fees",
    question: "Is any fee concession available?",
    answer:
      "We offer concessions for SC/ST students, BPL card holders, single girl child and wards of defence personnel. Please carry the relevant document at the time of admission to claim it."
  },
  {
    id: "faq6",
    category: "Certificate",
    question: "Is the certificate valid for government jobs?",
    answer:
      "We are an authorized centre of NIOS (New Delhi), OKCL (Govt. of Odisha, certified by OSOU) and ITCT. Certificates for these courses are issued by the respective recognised body and are widely accepted for employment and further study. For a specific government post, always check that recruitment notification's stated requirement."
  },
  {
    id: "faq7",
    category: "Certificate",
    question: "Who issues the certificate for each course?",
    answer:
      "NIOS courses (CDEO, CIC) are certified by NIOS. OKCL courses (OC-CIP, OCOC) are certified by Odisha State Open University (OSOU). PGDCA and DCA are issued under ITCT. Short courses like Tally and DTP get a certificate of completion from our institute."
  },
  {
    id: "faq8",
    category: "Certificate",
    question: "What if I lose my certificate or mark sheet?",
    answer:
      "Apply for a duplicate at our centre with a written application and an ID proof. We will help you obtain a duplicate from the respective board wherever applicable."
  },
  {
    id: "faq9",
    category: "General",
    question: "Do you help after the course is over?",
    answer:
      "Yes. We guide students with basic resume preparation, interview tips and information about local job openings. We assist genuinely but we do not sell a job guarantee."
  },
  {
    id: "faq10",
    category: "Courses",
    question: "What is the difference between OC-CIP, OC-CIP (A) and OCOC?",
    answer:
      "OC-CIP is the foundation OKCL course. OC-CIP (A) is the advanced module where you specialise in one skill course. OCOC lets you take a single skill course out of the 37 available. OKCL courses can be done in online or offline mode."
  },
  {
    id: "faq11",
    category: "Courses",
    question: "Are the courses available online?",
    answer:
      "Our OKCL courses (OC-CIP and OCOC) are available in both online and offline mode. NIOS, ITCT and our short courses like Tally and DTP are conducted offline at the centre."
  },
  {
    id: "faq12",
    category: "General",
    question: "Are the classes practical or theory based?",
    answer:
      "Every course has a minimum of 60% lab time. Each student gets an individual computer during practical hours and works on real assignments rather than only writing notes."
  }
];

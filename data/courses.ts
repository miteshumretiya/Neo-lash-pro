import { photos } from "./media";
import type { Course, Review } from "./types";

const certification = [
  "Online theory lessons before class",
  "Full professional kit (€300 value)",
  "In-class theory and live demonstrations",
  "Hands-on training on live models",
  "Neo Lash® certificate",
  "Unlimited after-course assistance",
  "10% lifetime discount on Neo Lash® products",
];

export const courses: Course[] = [
  {
    slug: "basic-course",
    name: "Basic Course",
    level: "Beginner",
    duration: "2 days on site",
    format: "Small group · live models",
    priceLabel: "Price on request",
    summary: "Build a solid foundation in safe, beautiful classic lash extensions.",
    intro: [
      "Full of practical tips from our master lash educators, this course is made for newcomers to lashing and for artists who want a thorough refresh.",
      "You will learn the foundations of safe classic eyelash extension application, the theory behind every step, and the rules of design and styling. Classes are kept small so there is plenty of one-to-one supervision: you'll watch live demonstrations of the whole process, then work on live models under your trainer's eye.",
      "After certification you keep access to complimentary refreshers, student discounts and continued support from our educators.",
    ],
    audience: "New lash artists and anyone looking for a structured refresh.",
    curriculum: [
      "History of eyelash extensions and what they are",
      "Advantages of eyelash extension treatment",
      "Eyelash anatomy and growth",
      "Anatomy of the eye and of the hair",
      "The life cycle of natural lashes",
      "Problems that affect how long a set lasts",
      "Allergies, eye conditions, demodex and blepharitis prevention",
      "Allergic reactions to products and chemical burns",
      "Lash-maker rules and tips",
      "Extension adhesive: choosing and handling glue",
      "Curls, thickness and length",
      "Technique and step-by-step treatment",
      "Application on the lower lash line",
      "Infills and removal",
      "Creating a perfect line with layering",
    ],
    included: certification,
    image: photos.applicationClient,
    gallery: [photos.applicationClose, photos.workNatural, photos.lashStrip],
  },
  {
    slug: "volume-course",
    name: "Volume Course",
    level: "Intermediate",
    duration: "2 days on site",
    format: "Small group · live models",
    priceLabel: "Price on request",
    summary: "Master handmade fans and the fullness clients ask for.",
    intro: [
      "This course builds on what you already know about classic extensions and takes your career up a level with the volume technique.",
      "Unlike classic lashes, applied one-to-one on a natural lash, volume lashes use 2–6D fans of the finest extensions attached to a single natural lash. Done correctly, the technique creates sets with superior fullness and density.",
      "You will learn to make perfect fans, speed up your work, use adhesive correctly and style advanced looks — plus the best techniques for retention and for managing client expectations.",
    ],
    audience: "Certified classic lash artists ready to add volume.",
    curriculum: [
      "Eyelash anatomy and growth",
      "Preparation before appointments",
      "Allergies, eye conditions, demodex and blepharitis prevention",
      "Extension adhesive for volume work",
      "Creating the perfect fan",
      "Curls, thickness and length",
      "Application on the lower lash line",
      "Advanced lash styles",
      "How to take perfect pictures (Instagram secrets)",
      "Tips to grow your lash business from day one",
    ],
    included: certification,
    image: photos.applicationClose,
    gallery: [photos.workDense, photos.tweezersHand, photos.workVolume],
  },
  {
    slug: "combo-course",
    name: "Combo Course",
    level: "Beginner → Advanced",
    duration: "4 days across one month",
    format: "Full immersion · live models",
    priceLabel: "Price on request",
    summary: "Basic and Volume together — the longest, most complete path.",
    intro: [
      "The Basic and Volume courses combined into four days of full immersion, spread across one month, to scale up both your technique and your lash business.",
      "Because it is the longest course we offer, we can show you multiple application techniques, the best client-retention practices and the industry secrets we've developed in our own salon alongside many lash artists and masters.",
    ],
    audience: "Anyone who wants to go from first set to volume in one programme.",
    curriculum: [
      "The life cycle of natural lashes",
      "Advanced application techniques (1:1, 2D, 3D, volume)",
      "Advanced reactions and sensitivities",
      "Allergic reactions to products and chemical burns",
      "Infills and removal",
      "Creating a perfect line with layering",
      "Customer retention strategies",
      "How to take perfect pictures (Instagram secrets)",
      "Tips to grow your lash business from day one",
    ],
    included: certification,
    image: photos.lashStrip,
    gallery: [photos.applicationClient, photos.workHybrid, photos.toolsGlove],
  },
  {
    slug: "masterclass-course",
    name: "Masterclass",
    level: "Advanced",
    duration: "1 day on site",
    format: "Full immersion · 1+ year experience",
    priceLabel: "Price on request",
    summary: "Refine your technique and correct the habits holding you back.",
    intro: [
      "Advanced training that takes your skills to the next level: one day of full immersion to refine your technique and correct the small mistakes in your application process.",
      "Designed for lash artists with at least one year of experience in the industry.",
    ],
    audience: "Working lash artists with a minimum of one year's experience.",
    curriculum: [
      "New techniques (Kim K, inverse wet effect and more)",
      "Volume lash application methods",
      "Product and tool expertise",
      "Advanced tweezer practice",
      "Advanced application techniques",
      "Advanced adhesive polymerisation",
      "Creating the perfect fan and Neo Lash® fanning methods",
      "Proper hygiene and safety — and when not to lash",
      "Advanced lash styles",
      "Maintaining healthy volume lashes and aftercare",
      "Tips to grow your lash business",
    ],
    included: certification,
    image: photos.tweezersHand,
    gallery: [photos.workWispy, photos.applicationClose, photos.eyeAmber],
  },
];

export const certificationSteps = [
  { title: "Enrolment", text: "Reserve your place, receive your kit and book your in-person class." },
  { title: "Theory study", text: "Learn the fundamentals online so you arrive ready for class." },
  { title: "On-site class", text: "Hands-on training with a Neo Lash® certified educator." },
  { title: "Model practice", text: "Build real-world experience lashing live models." },
  { title: "Certification", text: "Receive your Neo Lash® certification." },
  { title: "Keep learning", text: "Unlimited after-course assistance and 10% off Neo Lash® products for life." },
];

export const academyPerks = [
  { title: "Increased income", text: "Well-marketed, skilled lash artists can build a strong, independent income." },
  { title: "Be your own boss", text: "Once certified, you decide when and where you see your clients." },
  { title: "Help clients feel beautiful", text: "Enhance natural beauty and help every client feel their absolute best." },
];

export const academyFaq = [
  {
    q: "Do I need any experience to join?",
    a: "Not for the Basic or Combo courses — they start from the fundamentals. The Volume course expects classic experience, and the Masterclass is for artists with at least one year in the industry.",
  },
  {
    q: "Where do the courses take place?",
    a: "In person at the Neo Lash® studio in St. Julian's, Malta, after you complete the online theory lessons.",
  },
  {
    q: "Is a kit included?",
    a: "Yes. Every course includes a full professional kit worth €300 with the lashes, tweezers and adhesives we use in the salon.",
  },
  {
    q: "What happens after the course?",
    a: "You receive your Neo Lash® certificate, unlimited after-course assistance and a 10% lifetime discount on Neo Lash® products.",
  },
  {
    q: "How do I book my place?",
    a: "Message us on WhatsApp with the course you're interested in. We'll share the next dates, the price and everything you need to enrol.",
  },
];

/** Student reviews from the Neo Lash Academy page. */
export const studentReviews: Review[] = [
  {
    name: "Laura Dal Ben",
    context: "Flew in from Italy",
    quote:
      "I learned about Neo Lash and Daniela on YouTube. I took a flight from Italy because I really wanted to join one of her courses, and I'm really happy. I'm now buying her lash products — the lashes and glue are simply amazing!",
  },
  {
    name: "Claudia Sammut",
    context: "Volume Course",
    quote:
      "I joined the volume course with Daniela four months ago. I did similar courses in the past, but this was very different: very professional, with a lot of practice and precious post-course support. Highly recommended!",
  },
  {
    name: "Johanna Alvarez",
    context: "Combo Course",
    quote:
      "I did the four-day Combo Course with Daniela. I know I still have a lot to learn, but her course really helped me do my job straight away.",
  },
  {
    name: "Rose Borg",
    context: "Basic Course",
    quote: "I took part in the basic course. You can absolutely trust Daniela. She is so kind, patient and so professional too!",
  },
  {
    name: "Klaudia Cuschieri",
    context: "Masterclass",
    quote:
      "I've been doing my job for two years and wanted to join the Masterclass with Daniela to improve my technique. Truly recommended!",
  },
];

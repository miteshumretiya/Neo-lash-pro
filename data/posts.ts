import { photos } from "./media";
import type { Post } from "./types";

/** Journal articles, edited from the original Neo Lash blog. */
export const posts: Post[] = [
  {
    slug: "eyelash-extension-treatment-before-and-after",
    title: "Before, during and after your lash extension appointment",
    excerpt:
      "A few simple habits before and after treatment protect your set, keep your eyes comfortable and make your lashes last longer.",
    date: "2022-12-14",
    readingTime: "4 min read",
    category: "Aftercare",
    cover: photos.workSoft,
    body: [
      {
        type: "p",
        text: "Great lashes start before you sit down in the chair. Following a few steps before and — especially — after your treatment prevents early fallout and keeps your natural lashes healthy. Here's exactly what we recommend.",
      },
      { type: "h2", text: "Before your appointment" },
      {
        type: "ol",
        items: [
          "Arrive at the salon five minutes before your treatment starts.",
          "If you have allergies or have never had extensions, ask for a patch test 24–48 hours before your appointment.",
          "If you can't make it, let us know at least 24–48 hours in advance.",
          "If you use castor oil or another lash treatment, stop two days before your appointment.",
          "Come with your eye make-up removed so we can begin straight away.",
        ],
      },
      { type: "h2", text: "During the treatment" },
      {
        type: "ol",
        items: [
          "Try not to talk: your eyes may open, and adhesive fumes can redden them for a few days.",
          "If you feel any discomfort, tell your lash artist immediately.",
          "Put your phone on silent and enjoy the time to rest — it's time you give to yourself.",
          "If you like, bring headphones for your favourite music or an audiobook.",
        ],
      },
      { type: "h2", text: "After the treatment" },
      {
        type: "ol",
        items: [
          "Avoid water, sauna, pools, steam and heat for at least 12 hours.",
          "After 12 hours, carry on with your routine as normal.",
          "Contact lenses are completely fine.",
          "You can use your usual eye cream — just keep it off the lashes.",
          "Rinse with fresh water after swimming in the sea or a pool.",
          "Skip the lash curler and lash lamination.",
          "Don't rub your extensions, and try not to sleep face-down on the pillow.",
          "Avoid products containing acids or oils around the eyes.",
        ],
      },
      {
        type: "quote",
        text: "Cleanse your lashes daily with a dedicated lash shampoo — clean lashes hold extensions for longer.",
      },
    ],
  },
  {
    slug: "ten-good-reasons-to-have-lash-extensions",
    title: "Ten good reasons to try lash extensions",
    excerpt:
      "From faster mornings to waterproof confidence, here's why lash extensions have become one of the most valued beauty treatments.",
    readingTime: "3 min read",
    category: "Lashes",
    cover: photos.workHybrid,
    body: [
      {
        type: "p",
        text: "If you're reading this, you're probably curious. By the end, we hope you'll see why extensions have become one of the most valued beauty treatments today.",
      },
      {
        type: "ol",
        items: [
          "They save you time in the morning — wake up with lashes that are already long and curled.",
          "They save you time at night — no mascara or strip lashes to remove.",
          "They save you money on mascara, strip lashes, waterline liner and make-up remover.",
          "You'll wear less make-up overall.",
          "No more wrestling with strip lashes and their trial-and-error results.",
          "You look naturally beautiful and refreshed with fewer layers and less effort.",
          "Everyone needs to rest — think of your appointment as a reward for your hard work.",
          "They're resilient and water resistant: feel confident at the gym and fresh after a long day.",
          "Cry, sweat or get caught in the rain without mascara running down your face.",
          "They're comfortable — after a few days you'll forget they're there.",
        ],
      },
    ],
  },
  {
    slug: "why-do-eyelash-extensions-fall",
    title: "Why do lash extensions fall — and how to care for them",
    excerpt:
      "Natural shedding, skin type, environment and technique all play a part. Here's what affects retention and how to cleanse your set properly.",
    readingTime: "4 min read",
    category: "Aftercare",
    cover: photos.workDense,
    body: [
      {
        type: "p",
        text: "Lash extensions are one of the most requested luxury treatments, and many clients make them a regular part of caring for themselves. So why do some sets shed sooner than others? There are two groups of factors.",
      },
      { type: "h2", text: "Factors that come from you" },
      {
        type: "ul",
        items: [
          "Oily lashes",
          "Hormonal changes",
          "Some medicines, as well as alcohol and the menstrual cycle",
          "Heavy use of make-up",
          "Not cleansing your lashes every day",
        ],
      },
      { type: "h2", text: "Factors from the environment or the lash artist" },
      {
        type: "ul",
        items: [
          "Too much — or too little — humidity in the room",
          "Temperatures that are too high or too low",
          "An adhesive that doesn't suit the artist's working speed",
          "Incorrect cleansing at the start of the treatment",
        ],
      },
      { type: "h2", text: "How to cleanse your extensions" },
      {
        type: "ol",
        items: [
          "Wash your hands thoroughly and remove contact lenses.",
          "Shake the Neo Lash® lash shampoo and take one or two pumps.",
          "Morning and evening, apply with your fingertips or a cleansing brush using light movements, eyes closed.",
          "Rinse with plenty of water, pat dry with a paper towel, then comb through with a clean wand.",
        ],
      },
    ],
  },
];

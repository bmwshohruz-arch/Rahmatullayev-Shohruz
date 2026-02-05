
import { Project, Skill, UserInfo } from './types';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Maktab Jadvali Pro",
    description: "O'qituvchilar va o'quvchilar uchun dars jadvalini onlayn kuzatish va boshqarish tizimi.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da096a0b?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "Next.js", "Vercel"],
    link: "https://maktab-jadvali.vercel.app/"
  },
  {
    id: 2,
    title: "AI Chat Ilovasi",
    description: "Gemini API yordamida yaratilgan aqlli chat yordamchisi.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    tags: ["TypeScript", "Gemini API", "Tailwind"],
    link: "#"
  },
  {
    id: 3,
    title: "Portfolio Dizayn",
    description: "Ijodkorlar uchun minimalist va tezkor portfolio sayt.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "Framer Motion"],
    link: "#"
  }
];

export const SKILLS: Skill[] = [
  { name: "React / Next.js", level: 92, icon: "⚛️" },
  { name: "TypeScript", level: 88, icon: "📘" },
  { name: "Tailwind CSS", level: 95, icon: "🎨" },
  { name: "JavaScript (ES6+)", level: 94, icon: "💛" },
  { name: "Git / GitHub", level: 85, icon: "🐙" },
];

export const USER_INFO: UserInfo = {
  name: "RAHMATULLAYEV SHOHRUZ",
  title: "Frontend Dasturchi",
  bio: "Men 3 yillik tajribaga ega frontend dasturchiman. Sirdaryo viloyatidanman. Zamonaviy, tezkor va foydalanuvchilar uchun qulay interfeyslar yaratishga ixtisoslashganman. Har bir loyihada eng so'nggi texnologiyalardan foydalanishga intilaman.",
  location: "Sirdaryo viloyati, O'zbekiston",
  email: "shohruz@example.com",
  image: "https://picsum.photos/400/400?random=10",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    telegram: "https://t.me"
  }
};

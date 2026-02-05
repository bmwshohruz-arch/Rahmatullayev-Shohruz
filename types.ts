
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  image: string;
  socials: {
    github: string;
    linkedin: string;
    telegram: string;
  };
}

export interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  userInfo: UserInfo;
}

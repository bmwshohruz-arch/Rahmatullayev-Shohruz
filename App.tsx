
import React, { useState, useEffect } from 'react';
import AIChat from './components/AIChat.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { PROJECTS, SKILLS, USER_INFO } from './constants.tsx';
import { PortfolioData, Project, Skill, UserInfo } from './types.ts';
import { supabase } from './services/supabase.ts';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioData>({
    projects: PROJECTS,
    skills: SKILLS,
    userInfo: USER_INFO
  });

  const PROFILE_ID = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);

        // Supabase mavjudligini tekshirish
        if (!supabase) {
          console.warn("Supabase ulanishi mavjud emas.");
          if (isMounted) setLoading(false);
          return;
        }

        const [profileRes, projectsRes, skillsRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', PROFILE_ID).maybeSingle(),
          supabase.from('projects').select('*').order('id', { ascending: true }),
          supabase.from('skills').select('*').order('id', { ascending: true })
        ]);

        if (!isMounted) return;

        // Agar ma'lumotlar bo'lsa, ularni map qilish
        const profileData = profileRes?.data;
        const projectsData = projectsRes?.data;
        const skillsData = skillsRes?.data;

        if (profileData || (projectsData && projectsData.length > 0) || (skillsData && skillsData.length > 0)) {
          setData({
            userInfo: profileData ? {
              name: profileData.name,
              title: profileData.title,
              bio: profileData.bio,
              location: profileData.location,
              email: profileData.email,
              image: profileData.image_url || USER_INFO.image,
              socials: {
                github: profileData.github_url || '',
                linkedin: profileData.linkedin_url || '',
                telegram: profileData.telegram_url || ''
              }
            } : USER_INFO,
            projects: projectsData && projectsData.length > 0 
              ? projectsData.map((p: any) => ({
                  id: p.id,
                  title: p.title,
                  description: p.description,
                  image: p.image_url,
                  tags: p.tags || [],
                  link: p.link
                }))
              : PROJECTS,
            skills: skillsData && skillsData.length > 0
              ? skillsData.map((s: any) => ({
                  name: s.name,
                  level: s.level,
                  icon: s.icon
                }))
              : SKILLS
          });
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Ma'lumotlarni yuklashda xato:", error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const handleSaveData = async (newData: PortfolioData) => {
    try {
      if (!supabase) throw new Error("Supabase ulanmagan");
      
      const profileToSave = {
        id: PROFILE_ID,
        name: newData.userInfo.name,
        title: newData.userInfo.title,
        bio: newData.userInfo.bio,
        location: newData.userInfo.location,
        email: newData.userInfo.email,
        image_url: newData.userInfo.image,
        github_url: newData.userInfo.socials.github,
        linkedin_url: newData.userInfo.socials.linkedin,
        telegram_url: newData.userInfo.socials.telegram,
      };

      await supabase.from('profiles').upsert([profileToSave]);
      setData(newData);
      alert("Ma'lumotlar saqlandi!");
    } catch (error: any) {
      alert("Xatolik: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 animate-pulse text-sm">Portfolio yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <AdminPanel data={data} onSave={handleSaveData} />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 glass border-b border-white/5 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="text-xl font-bold text-gradient tracking-tighter">PORTFOLIO.</div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#home" className="hover:text-blue-400 transition-colors">Asosiy</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">Men haqimda</a>
            <a href="#skills" className="hover:text-blue-400 transition-colors">Ko'nikmalar</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">Loyihalar</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-blue-500 font-bold tracking-widest uppercase text-xs">WEB DEVELOPER</h2>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1]">{data.userInfo.name}</h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
              {data.userInfo.title}. Men <span className="text-white">zamonaviy va interaktiv</span> veb-ilovalarni yaratishga ixtisoslashganman.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#projects" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition-all text-white shadow-lg shadow-blue-500/20">Loyihalar</a>
              <a href="#contact" className="glass px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-all">Bog'lanish</a>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <img 
              src={data.userInfo.image} 
              alt="Profile" 
              className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-cover rounded-3xl border border-white/10 shadow-2xl"
              onError={(e) => { (e.target as any).src = 'https://picsum.photos/400/400'; }}
            />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Texnik Mahorat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.skills.map((skill, i) => (
              <div key={i} className="glass p-6 rounded-2xl group hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="text-blue-400 font-bold text-sm">{skill.level}%</span>
                </div>
                <h3 className="font-bold mb-3">{skill.name}</h3>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Tanlangan Loyihalar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.projects.map((project, i) => (
              <div key={i} className="glass rounded-3xl overflow-hidden group">
                <div className="aspect-video bg-slate-900 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold text-sm hover:underline">Loyihani ko'rish →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} {data.userInfo.name}. Barcha huquqlar himoyalangan.</p>
      </footer>

      <AIChat portfolioData={data} />
    </div>
  );
};

export default App;

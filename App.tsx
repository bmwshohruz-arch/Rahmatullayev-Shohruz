
import React, { useState, useEffect } from 'react';
import AIChat from './components/AIChat';
import AdminPanel from './components/AdminPanel';
import { PROJECTS, SKILLS, USER_INFO } from './constants';
import { PortfolioData, Project, Skill, UserInfo } from './types';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PortfolioData>({
    projects: PROJECTS,
    skills: SKILLS,
    userInfo: USER_INFO
  });

  const PROFILE_ID = '00000000-0000-0000-0000-000000000001';

  // Fetch data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Profile
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', PROFILE_ID).maybeSingle();
        
        // Fetch Projects
        const { data: projectsData } = await supabase.from('projects').select('*').order('id', { ascending: true });
        
        // Fetch Skills
        const { data: skillsData } = await supabase.from('skills').select('*').order('id', { ascending: true });

        const mappedUserInfo: UserInfo = profileData ? {
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
        } : USER_INFO;

        const mappedProjects: Project[] = projectsData && projectsData.length > 0 
          ? projectsData.map(p => ({
              id: p.id,
              title: p.title,
              description: p.description,
              image: p.image_url,
              tags: p.tags || [],
              link: p.link
            }))
          : PROJECTS;

        const mappedSkills: Skill[] = skillsData && skillsData.length > 0
          ? skillsData.map(s => ({
              name: s.name,
              level: s.level,
              icon: s.icon
            }))
          : SKILLS;

        setData({
          userInfo: mappedUserInfo,
          projects: mappedProjects,
          skills: mappedSkills
        });
      } catch (error) {
        console.error("Supabase yuklashda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveData = async (newData: PortfolioData) => {
    try {
      // 1. Update Profile
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

      const { error: profileError } = await supabase.from('profiles').upsert([profileToSave]);
      if (profileError) throw profileError;

      // 2. Update Skills
      await supabase.from('skills').delete().neq('name', '___NON_EXISTENT___');
      const skillsToSave = newData.skills.map(s => ({
        name: s.name,
        level: s.level,
        icon: s.icon
      }));
      await supabase.from('skills').insert(skillsToSave);

      // 3. Update Projects
      await supabase.from('projects').delete().neq('title', '___NON_EXISTENT___');
      const projectsToSave = newData.projects.map(p => ({
        title: p.title,
        description: p.description,
        image_url: p.image,
        tags: p.tags,
        link: p.link
      }));
      await supabase.from('projects').insert(projectsToSave);

      setData(newData);
      alert("Ma'lumotlar muvaffaqiyatli saqlandi!");
    } catch (error: any) {
      console.error("Saqlashda xato:", error);
      alert("Xatolik: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      <AdminPanel data={data} onSave={handleSaveData} />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-gradient">PORTFOLIO</div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#home" className="hover:text-blue-400 transition-colors">Asosiy</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">Men haqimda</a>
            <a href="#skills" className="hover:text-blue-400 transition-colors">Ko'nikmalar</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">Loyihalar</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Aloqa</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-blue-500 font-medium tracking-wider uppercase">SALOM, MENING ISMIM</h2>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {data.userInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl">
              {data.userInfo.title}. Men <span className="text-white font-medium">mukammal raqamli tajribalar</span> yarataman.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#projects" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-all text-white">
                Loyihalarni ko'rish
              </a>
              <a href="#contact" className="border border-white/20 hover:bg-white/5 px-8 py-3 rounded-full font-semibold transition-all">
                Bog'lanish
              </a>
            </div>
          </div>
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
            <img 
              src={data.userInfo.image} 
              alt="Profile" 
              className="relative z-10 w-full h-full object-cover rounded-3xl border-2 border-white/10 shadow-2xl bg-slate-900"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-4">
                Men haqimda <span className="h-px bg-blue-500 flex-1"></span>
              </h2>
            </div>
            <div className="md:w-2/3 space-y-6 text-slate-300 leading-relaxed text-lg">
              <p>{data.userInfo.bio}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex flex-col">
                  <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">Manzil</span>
                  <span className="text-white">{data.userInfo.location}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-blue-500 text-sm font-semibold uppercase tracking-widest">Email</span>
                  <span className="text-white">{data.userInfo.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Texnik Ko'nikmalar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.skills.map((skill, i) => (
              <div key={i} className="glass p-6 rounded-2xl hover:border-blue-500/50 transition-all group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <h3 className="font-semibold text-lg">{skill.name}</h3>
                  </div>
                  <span className="text-blue-400 font-bold">{skill.level}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-hover:w-[var(--progress)] transition-all duration-1000 ease-out"
                    style={{ '--progress': `${skill.level}%` } as React.CSSProperties}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-900/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">So'nggi Loyihalar</h2>
              <p className="text-slate-400">Amalga oshirilgan eng yaxshi ishlarim</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.projects.map((project) => (
              <div key={project.id || project.title} className="group relative glass rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                <div className="aspect-video overflow-hidden bg-slate-900">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-400">
                    Batafsil ko'rish
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Loyihangiz bormi?</h2>
          <p className="text-xl text-slate-400 mb-10">
            Keling, birgalikda ajoyib mahsulot yaratamiz. Men doim yangi imkoniyatlar uchun ochiqman.
          </p>
          <div className="glass p-8 rounded-3xl border-blue-500/20">
            <h3 className="text-2xl font-semibold mb-6">Menga xabar yuboring</h3>
            <div className="space-y-4 text-left">
              <input type="text" placeholder="Ismingiz" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white" />
              <input type="email" placeholder="Email manzilingiz" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white" />
              <textarea placeholder="Xabaringiz..." rows={4} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white"></textarea>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-all transform active:scale-95 text-white shadow-lg shadow-blue-500/20">
                Yuborish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-gradient font-bold text-2xl uppercase tracking-tighter">PORTFOLIO.</div>
          <div className="flex gap-6">
            <a href={data.userInfo.socials.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">GitHub</a>
            <a href={data.userInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
            <a href={data.userInfo.socials.telegram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Telegram</a>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>

      {/* AI Assistant Component */}
      <AIChat portfolioData={data} />
    </div>
  );
};

export default App;

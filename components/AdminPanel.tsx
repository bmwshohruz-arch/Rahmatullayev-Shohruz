
import React, { useState, useEffect } from 'react';
import { PortfolioData, Project, Skill, UserInfo } from '../types';

interface AdminPanelProps {
  data: PortfolioData;
  onSave: (newData: PortfolioData) => Promise<void>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onSave }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Local editing state
  const [editData, setEditData] = useState<PortfolioData>(data);
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'projects' | 'socials'>('profile');

  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === 'shohruz' && password === 'shohruz') {
      setIsAuth(true);
      setShowLogin(false);
      setShowPanel(true);
      setError('');
    } else {
      setError('Login yoki parol noto\'g\'ri!');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editData);
      setShowPanel(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (showLogin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="glass w-full max-w-md p-8 rounded-3xl border border-blue-500/30">
          <h2 className="text-2xl font-bold mb-6 text-center text-gradient">Admin Kirish</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Login</label>
              <input 
                type="text" 
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Parol</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white" 
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowLogin(false)}
                className="flex-1 border border-white/10 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300"
              >
                Bekor qilish
              </button>
              <button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all text-white"
              >
                Kirish
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showPanel && isAuth) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 min-h-screen flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-bold text-gradient">Boshqaruv Paneli</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowPanel(false)}
                disabled={isSaving}
                className="border border-white/10 px-6 py-2 rounded-lg hover:bg-white/5 text-slate-300 disabled:opacity-50"
              >
                Yopish
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saqlanmoqda...
                  </>
                ) : 'Saqlash'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {(['profile', 'skills', 'projects', 'socials'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full capitalize transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'glass text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'profile' ? 'Profil' : 
                 tab === 'skills' ? 'Ko\'nikmalar' : 
                 tab === 'projects' ? 'Loyihalar' : 
                 'Ijtimoiy Tarmoqlar'}
              </button>
            ))}
          </div>

          <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'profile' && (
              <div className="glass p-8 rounded-3xl space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative group">
                    <img src={editData.userInfo.image} alt="Profile preview" className="w-32 h-32 rounded-2xl object-cover border border-white/10" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer text-xs font-bold text-white text-center p-2">
                      Rasm almashtirish
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFile(e, (base64) => setEditData({...editData, userInfo: {...editData.userInfo, image: base64}}))} />
                    </label>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">F.I.SH</label>
                      <input 
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none"
                        value={editData.userInfo.name}
                        onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, name: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Mutaxassislik</label>
                      <input 
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none"
                        value={editData.userInfo.title}
                        onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, title: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Biografiya</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none"
                      value={editData.userInfo.bio}
                      onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, bio: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Manzil</label>
                    <input 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none"
                      value={editData.userInfo.location}
                      onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, location: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Email</label>
                    <input 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none"
                      value={editData.userInfo.email}
                      onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, email: e.target.value}})}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                {editData.skills.map((skill, idx) => (
                  <div key={idx} className="glass p-6 rounded-2xl flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs text-slate-500 mb-1">Nomi</label>
                      <input 
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
                        value={skill.name}
                        onChange={(e) => {
                          const newSkills = [...editData.skills];
                          newSkills[idx].name = e.target.value;
                          setEditData({...editData, skills: newSkills});
                        }}
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-slate-500 mb-1">Icon</label>
                      <input 
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
                        value={skill.icon}
                        onChange={(e) => {
                          const newSkills = [...editData.skills];
                          newSkills[idx].icon = e.target.value;
                          setEditData({...editData, skills: newSkills});
                        }}
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-slate-500 mb-1">Daraja (%)</label>
                      <input 
                        type="number"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
                        value={skill.level}
                        onChange={(e) => {
                          const newSkills = [...editData.skills];
                          newSkills[idx].level = parseInt(e.target.value);
                          setEditData({...editData, skills: newSkills});
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newSkills = editData.skills.filter((_, i) => i !== idx);
                        setEditData({...editData, skills: newSkills});
                      }}
                      className="bg-red-500/20 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setEditData({...editData, skills: [...editData.skills, { name: 'Yangi ko\'nikma', level: 50, icon: '🚀' }]})}
                  className="w-full border-2 border-dashed border-white/10 py-4 rounded-2xl text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                >
                  + Ko'nikma qo'shish
                </button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                {editData.projects.map((project, idx) => (
                  <div key={idx} className="glass p-8 rounded-3xl space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-blue-400">Loyiha #{idx + 1}</h4>
                      <button 
                        onClick={() => {
                          const newProjects = editData.projects.filter((_, i) => i !== idx);
                          setEditData({...editData, projects: newProjects});
                        }}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Loyihani o'chirish
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative group aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                        <img src={project.image} alt="Project preview" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold text-white text-center p-2">
                          Rasmni o'zgartirish
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFile(e, (base64) => {
                            const newP = [...editData.projects];
                            newP[idx].image = base64;
                            setEditData({...editData, projects: newP});
                          })} />
                        </label>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Nomi</label>
                            <input 
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                              value={project.title}
                              onChange={(e) => {
                                const newP = [...editData.projects];
                                newP[idx].title = e.target.value;
                                setEditData({...editData, projects: newP});
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">Havola (Link)</label>
                            <input 
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                              value={project.link}
                              onChange={(e) => {
                                const newP = [...editData.projects];
                                newP[idx].link = e.target.value;
                                setEditData({...editData, projects: newP});
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Tavsif</label>
                          <textarea 
                            rows={2}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            value={project.description}
                            onChange={(e) => {
                              const newP = [...editData.projects];
                              newP[idx].description = e.target.value;
                              setEditData({...editData, projects: newP});
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Texnologiyalar (vergul bilan ajrating)</label>
                          <input 
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            value={project.tags.join(', ')}
                            onChange={(e) => {
                              const newP = [...editData.projects];
                              newP[idx].tags = e.target.value.split(',').map(t => t.trim());
                              setEditData({...editData, projects: newP});
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setEditData({
                    ...editData, 
                    projects: [...editData.projects, { 
                      id: Date.now(), 
                      title: 'Yangi Loyiha', 
                      description: 'Tavsif...', 
                      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', 
                      tags: ['React'], 
                      link: '#' 
                    }]
                  })}
                  className="w-full border-2 border-dashed border-white/10 py-4 rounded-3xl text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                >
                  + Yangi loyiha qo'shish
                </button>
              </div>
            )}

            {activeTab === 'socials' && (
              <div className="glass p-8 rounded-3xl space-y-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Ijtimoiy Tarmoq Havolalari</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">GitHub</label>
                    <input 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                      value={editData.userInfo.socials.github}
                      onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, socials: {...editData.userInfo.socials, github: e.target.value}}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">LinkedIn</label>
                    <input 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                      value={editData.userInfo.socials.linkedin}
                      onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, socials: {...editData.userInfo.socials, linkedin: e.target.value}}})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Telegram</label>
                    <input 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                      value={editData.userInfo.socials.telegram}
                      onChange={(e) => setEditData({...editData, userInfo: {...editData.userInfo, socials: {...editData.userInfo.socials, telegram: e.target.value}}})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={() => setShowLogin(true)}
        className="glass p-2 px-6 rounded-full text-sm font-medium text-slate-400 hover:text-white border-white/10 hover:border-blue-500/50 transition-all flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Sozlamalar
      </button>
    </div>
  );
};

export default AdminPanel;

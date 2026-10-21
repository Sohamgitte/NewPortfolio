import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  ProfileSettings,
  Project,
  Experience,
  Education,
  Skill,
  Certificate,
  Achievement,
  ContactMessage,
  ContactMessageInput,
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  initialProfileSettings,
  initialProjects,
  initialExperiences,
  initialEducations,
  initialSkills,
  initialCertificates,
  initialAchievements,
} from '../data/initialData';
import { useAuth } from './AuthContext';

interface PortfolioContextType {
  profile: ProfileSettings;
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certificates: Certificate[];
  achievements: Achievement[];
  messages: ContactMessage[];
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // CMS CRUD actions
  updateProfile: (updates: Partial<ProfileSettings>) => Promise<void>;
  saveProject: (project: Partial<Project> & { title: string; slug: string; summary: string }) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  saveExperience: (experience: Partial<Experience> & { company: string; position: string; start_date: string }) => Promise<Experience>;
  deleteExperience: (id: string) => Promise<void>;
  saveEducation: (education: Partial<Education> & { institution: string; degree: string; field_of_study: string; start_year: string }) => Promise<Education>;
  deleteEducation: (id: string) => Promise<void>;
  saveSkill: (skill: Partial<Skill> & { name: string; category: Skill['category'] }) => Promise<Skill>;
  deleteSkill: (id: string) => Promise<void>;
  saveCertificate: (cert: Partial<Certificate> & { title: string; issuer: string }) => Promise<Certificate>;
  deleteCertificate: (id: string) => Promise<void>;
  saveAchievement: (ach: Partial<Achievement> & { title: string; description: string }) => Promise<Achievement>;
  deleteAchievement: (id: string) => Promise<void>;

  // Contact form & Inbox
  submitContactMessage: (input: ContactMessageInput) => Promise<{ success: boolean; message: string }>;
  fetchMessages: () => Promise<void>;
  markMessageRead: (id: string, isRead: boolean) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();

  const [profile, setProfile] = useState<ProfileSettings>(initialProfileSettings);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [educations, setEducations] = useState<Education[]>(initialEducations);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from Supabase
  const loadData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Check localStorage for any demo alterations so user sees immediate persistence in demo mode
      const savedProjects = localStorage.getItem('demo_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedProfile = localStorage.getItem('demo_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedExp = localStorage.getItem('demo_experiences');
      if (savedExp) setExperiences(JSON.parse(savedExp));

      const savedEdu = localStorage.getItem('demo_educations');
      if (savedEdu) setEducations(JSON.parse(savedEdu));

      const savedSkills = localStorage.getItem('demo_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));

      const savedCerts = localStorage.getItem('demo_certificates');
      if (savedCerts) setCertificates(JSON.parse(savedCerts));

      const savedAch = localStorage.getItem('demo_achievements');
      if (savedAch) setAchievements(JSON.parse(savedAch));

      const savedMessages = localStorage.getItem('demo_messages');
      if (savedMessages) setMessages(JSON.parse(savedMessages));

      setIsLoading(false);
      return;
    }

    try {
      // 1. Profile settings
      const { data: profData } = await supabase.from('profile_settings').select('*').limit(1).maybeSingle();
      if (profData) setProfile(profData as ProfileSettings);

      // 2. Projects (Admin sees all, public query handled by RLS if unauthenticated)
      const { data: projData } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (projData) setProjects(projData as Project[]);

      // 3. Experiences
      const { data: expData } = await supabase.from('experiences').select('*').order('display_order', { ascending: true });
      if (expData) setExperiences(expData as Experience[]);

      // 4. Educations
      const { data: eduData } = await supabase.from('educations').select('*').order('display_order', { ascending: true });
      if (eduData) setEducations(eduData as Education[]);

      // 5. Skills
      const { data: skillData } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
      if (skillData) setSkills(skillData as Skill[]);

      // 6. Certificates
      const { data: certData } = await supabase.from('certificates').select('*').order('display_order', { ascending: true });
      if (certData) setCertificates(certData as Certificate[]);

      // 7. Achievements
      const { data: achData } = await supabase.from('achievements').select('*').order('display_order', { ascending: true });
      if (achData) setAchievements(achData as Achievement[]);
    } catch (err) {
      console.error('Error loading Supabase portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch private messages if admin
  const fetchMessages = useCallback(async () => {
    if (!isAdmin) return;

    if (!isSupabaseConfigured) {
      const local = localStorage.getItem('demo_messages');
      if (local) setMessages(JSON.parse(local));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMessages(data as ContactMessage[]);
      }
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    }
  }, [isAdmin]);

  // Initial load
  useEffect(() => {
    loadData();
    if (isAdmin) {
      fetchMessages();
    }
  }, [loadData, fetchMessages, isAdmin]);

  // Setup Supabase Realtime subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('portfolio-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile_settings' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'educations' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'achievements' }, () => {
        loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        if (isAdmin) fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData, fetchMessages, isAdmin]);

  // CRUD Implementations

  const updateProfile = async (updates: Partial<ProfileSettings>): Promise<void> => {
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);

    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_profile', JSON.stringify(updated));
      return;
    }

    const { error } = await supabase
      .from('profile_settings')
      .update(updates)
      .eq('id', profile.id);

    if (error) {
      setProfile(profile); // rollback
      throw new Error(error.message);
    }
  };

  const saveProject = async (
    projectInput: Partial<Project> & { title: string; slug: string; summary: string }
  ): Promise<Project> => {
    const isNew = !projectInput.id;
    const projectToSave: Project = {
      id: projectInput.id || crypto.randomUUID(),
      title: projectInput.title,
      slug: projectInput.slug,
      summary: projectInput.summary,
      description: projectInput.description || '',
      image_url: projectInput.image_url || '/soham-photo.jpg',
      technologies: projectInput.technologies || [],
      demo_url: projectInput.demo_url || '',
      github_url: projectInput.github_url || '',
      is_featured: projectInput.is_featured ?? false,
      status: projectInput.status || 'published',
      display_order: projectInput.display_order ?? projects.length + 1,
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updatedList = isNew
        ? [...projects, projectToSave]
        : projects.map((p) => (p.id === projectToSave.id ? projectToSave : p));
      setProjects(updatedList);
      localStorage.setItem('demo_projects', JSON.stringify(updatedList));
      return projectToSave;
    }

    if (isNew) {
      const { data, error } = await supabase.from('projects').insert([projectToSave]).select().single();
      if (error) throw new Error(error.message);
      setProjects((prev) => [...prev, data as Project]);
      return data as Project;
    } else {
      const { data, error } = await supabase
        .from('projects')
        .update(projectToSave)
        .eq('id', projectToSave.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      setProjects((prev) => prev.map((p) => (p.id === projectToSave.id ? (data as Project) : p)));
      return data as Project;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    const previous = projects;
    setProjects((prev) => prev.filter((p) => p.id !== id));

    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_projects', JSON.stringify(previous.filter((p) => p.id !== id)));
      return;
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      setProjects(previous); // rollback
      throw new Error(error.message);
    }
  };

  const saveExperience = async (
    expInput: Partial<Experience> & { company: string; position: string; start_date: string }
  ): Promise<Experience> => {
    const isNew = !expInput.id;
    const expToSave: Experience = {
      id: expInput.id || crypto.randomUUID(),
      company: expInput.company,
      position: expInput.position,
      employment_type: expInput.employment_type || 'Internship',
      location: expInput.location || '',
      start_date: expInput.start_date,
      end_date: expInput.end_date || null,
      is_current: expInput.is_current ?? false,
      description: expInput.description || '',
      highlights: expInput.highlights || [],
      technologies: expInput.technologies || [],
      status: expInput.status || 'published',
      display_order: expInput.display_order ?? experiences.length + 1,
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updatedList = isNew
        ? [...experiences, expToSave]
        : experiences.map((e) => (e.id === expToSave.id ? expToSave : e));
      setExperiences(updatedList);
      localStorage.setItem('demo_experiences', JSON.stringify(updatedList));
      return expToSave;
    }

    if (isNew) {
      const { data, error } = await supabase.from('experiences').insert([expToSave]).select().single();
      if (error) throw new Error(error.message);
      setExperiences((prev) => [...prev, data as Experience]);
      return data as Experience;
    } else {
      const { data, error } = await supabase
        .from('experiences')
        .update(expToSave)
        .eq('id', expToSave.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      setExperiences((prev) => prev.map((e) => (e.id === expToSave.id ? (data as Experience) : e)));
      return data as Experience;
    }
  };

  const deleteExperience = async (id: string): Promise<void> => {
    const previous = experiences;
    setExperiences((prev) => prev.filter((e) => e.id !== id));

    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_experiences', JSON.stringify(previous.filter((e) => e.id !== id)));
      return;
    }

    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) {
      setExperiences(previous);
      throw new Error(error.message);
    }
  };

  const saveEducation = async (
    eduInput: Partial<Education> & { institution: string; degree: string; field_of_study: string; start_year: string }
  ): Promise<Education> => {
    const isNew = !eduInput.id;
    const eduToSave: Education = {
      id: eduInput.id || crypto.randomUUID(),
      institution: eduInput.institution,
      degree: eduInput.degree,
      field_of_study: eduInput.field_of_study,
      location: eduInput.location || '',
      start_year: eduInput.start_year,
      end_year: eduInput.end_year || '',
      grade: eduInput.grade || '',
      description: eduInput.description || '',
      status: eduInput.status || 'published',
      display_order: eduInput.display_order ?? educations.length + 1,
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updatedList = isNew
        ? [...educations, eduToSave]
        : educations.map((e) => (e.id === eduToSave.id ? eduToSave : e));
      setEducations(updatedList);
      localStorage.setItem('demo_educations', JSON.stringify(updatedList));
      return eduToSave;
    }

    if (isNew) {
      const { data, error } = await supabase.from('educations').insert([eduToSave]).select().single();
      if (error) throw new Error(error.message);
      setEducations((prev) => [...prev, data as Education]);
      return data as Education;
    } else {
      const { data, error } = await supabase
        .from('educations')
        .update(eduToSave)
        .eq('id', eduToSave.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      setEducations((prev) => prev.map((e) => (e.id === eduToSave.id ? (data as Education) : e)));
      return data as Education;
    }
  };

  const deleteEducation = async (id: string): Promise<void> => {
    const previous = educations;
    setEducations((prev) => prev.filter((e) => e.id !== id));

    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_educations', JSON.stringify(previous.filter((e) => e.id !== id)));
      return;
    }

    const { error } = await supabase.from('educations').delete().eq('id', id);
    if (error) {
      setEducations(previous);
      throw new Error(error.message);
    }
  };

  const saveSkill = async (
    skillInput: Partial<Skill> & { name: string; category: Skill['category'] }
  ): Promise<Skill> => {
    const isNew = !skillInput.id;
    const skillToSave: Skill = {
      id: skillInput.id || crypto.randomUUID(),
      name: skillInput.name,
      category: skillInput.category,
      level: skillInput.level || 'Intermediate',
      icon: skillInput.icon || 'Code',
      status: skillInput.status || 'published',
      display_order: skillInput.display_order ?? skills.length + 1,
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updatedList = isNew
        ? [...skills, skillToSave]
        : skills.map((s) => (s.id === skillToSave.id ? skillToSave : s));
      setSkills(updatedList);
      localStorage.setItem('demo_skills', JSON.stringify(updatedList));
      return skillToSave;
    }

    if (isNew) {
      const { data, error } = await supabase.from('skills').insert([skillToSave]).select().single();
      if (error) throw new Error(error.message);
      setSkills((prev) => [...prev, data as Skill]);
      return data as Skill;
    } else {
      const { data, error } = await supabase
        .from('skills')
        .update(skillToSave)
        .eq('id', skillToSave.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      setSkills((prev) => prev.map((s) => (s.id === skillToSave.id ? (data as Skill) : s)));
      return data as Skill;
    }
  };

  const deleteSkill = async (id: string): Promise<void> => {
    const previous = skills;
    setSkills((prev) => prev.filter((s) => s.id !== id));

    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_skills', JSON.stringify(previous.filter((s) => s.id !== id)));
      return;
    }

    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) {
      setSkills(previous);
      throw new Error(error.message);
    }
  };

  const saveCertificate = async (
    certInput: Partial<Certificate> & { title: string; issuer: string }
  ): Promise<Certificate> => {
    const isNew = !certInput.id;
    const certToSave: Certificate = {
      id: certInput.id || crypto.randomUUID(),
      title: certInput.title,
      issuer: certInput.issuer,
      issue_date: certInput.issue_date || '',
      credential_id: certInput.credential_id || '',
      credential_url: certInput.credential_url || '',
      file_url: certInput.file_url || '',
      status: certInput.status || 'published',
      display_order: certInput.display_order ?? certificates.length + 1,
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updatedList = isNew
        ? [...certificates, certToSave]
        : certificates.map((c) => (c.id === certToSave.id ? certToSave : c));
      setCertificates(updatedList);
      localStorage.setItem('demo_certificates', JSON.stringify(updatedList));
      return certToSave;
    }

    if (isNew) {
      const { data, error } = await supabase.from('certificates').insert([certToSave]).select().single();
      if (error) throw new Error(error.message);
      setCertificates((prev) => [...prev, data as Certificate]);
      return data as Certificate;
    } else {
      const { data, error } = await supabase
        .from('certificates')
        .update(certToSave)
        .eq('id', certToSave.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      setCertificates((prev) => prev.map((c) => (c.id === certToSave.id ? (data as Certificate) : c)));
      return data as Certificate;
    }
  };

  const deleteCertificate = async (id: string): Promise<void> => {
    const previous = certificates;
    setCertificates((prev) => prev.filter((c) => c.id !== id));

    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_certificates', JSON.stringify(previous.filter((c) => c.id !== id)));
      return;
    }

    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) {
      setCertificates(previous);
      throw new Error(error.message);
    }
  };

  const saveAchievement = async (
    achInput: Partial<Achievement> & { title: string; description: string }
  ): Promise<Achievement> => {
    const isNew = !achInput.id;
    const achToSave: Achievement = {
      id: achInput.id || crypto.randomUUID(),
      title: achInput.title,
      category: achInput.category || 'Milestone',
      organization: achInput.organization || '',
      date: achInput.date || '',
      description: achInput.description,
      link_url: achInput.link_url || '',
      status: achInput.status || 'published',
      display_order: achInput.display_order ?? achievements.length + 1,
      updated_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const updatedList = isNew
        ? [...achievements, achToSave]
        : achievements.map((a) => (a.id === achToSave.id ? achToSave : a));
      setAchievements(updatedList);
      localStorage.setItem('demo_achievements', JSON.stringify(updatedList));
      return achToSave;
    }

    if (isNew) {
      const { data, error } = await supabase.from('achievements').insert([achToSave]).select().single();
      if (error) throw new Error(error.message);
      setAchievements((prev) => [...prev, data as Achievement]);
      return data as Achievement;
    } else {
      const { data, error } = await supabase
        .from('achievements')
        .update(achToSave)
        .eq('id', achToSave.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      setAchievements((prev) => prev.map((a) => (a.id === achToSave.id ? (data as Achievement) : a)));
      return data as Achievement;
    }
  };

  const deleteAchievement = async (id: string): Promise<void> => {
    const previous = achievements;
    setAchievements((prev) => prev.filter((a) => a.id !== id));

    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_achievements', JSON.stringify(previous.filter((a) => a.id !== id)));
      return;
    }

    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) {
      setAchievements(previous);
      throw new Error(error.message);
    }
  };

  // Submit contact message (with anti-spam honeypot and length checking)
  const submitContactMessage = async (
    input: ContactMessageInput
  ): Promise<{ success: boolean; message: string }> => {
    // 1. Honeypot check: If website is filled out by automated bots, silently reject
    if (input.website && input.website.length > 0) {
      return { success: false, message: 'Spam detected. Submission rejected.' };
    }

    // 2. Client rate-limit check (prevent rapid button spamming)
    const lastSent = sessionStorage.getItem('last_msg_sent');
    if (lastSent && Date.now() - parseInt(lastSent, 10) < 15000) {
      return {
        success: false,
        message: 'Please wait a few seconds before sending another message.',
      };
    }

    const newMsg: ContactMessage = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      email: input.email.trim(),
      subject: input.subject?.trim() || 'Portfolio Inquiry',
      message: input.message.trim(),
      is_read: false,
      user_agent: navigator.userAgent.slice(0, 150),
      created_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured) {
      const currentList: ContactMessage[] = JSON.parse(localStorage.getItem('demo_messages') || '[]');
      const updated = [newMsg, ...currentList];
      localStorage.setItem('demo_messages', JSON.stringify(updated));
      sessionStorage.setItem('last_msg_sent', Date.now().toString());
      if (isAdmin) setMessages(updated);
      return { success: true, message: 'Thank you! Your message has been received.' };
    }

    const { error } = await supabase.from('contact_messages').insert([
      {
        name: newMsg.name,
        email: newMsg.email,
        subject: newMsg.subject,
        message: newMsg.message,
        user_agent: newMsg.user_agent,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    sessionStorage.setItem('last_msg_sent', Date.now().toString());
    return { success: true, message: 'Thank you! Your message has been sent successfully.' };
  };

  const markMessageRead = async (id: string, isRead: boolean): Promise<void> => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: isRead } : m)));

    if (!isSupabaseConfigured) {
      const currentList: ContactMessage[] = JSON.parse(localStorage.getItem('demo_messages') || '[]');
      const updated = currentList.map((m) => (m.id === id ? { ...m, is_read: isRead } : m));
      localStorage.setItem('demo_messages', JSON.stringify(updated));
      return;
    }

    const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
    if (error) {
      fetchMessages(); // rollback
      throw new Error(error.message);
    }
  };

  const deleteMessage = async (id: string): Promise<void> => {
    setMessages((prev) => prev.filter((m) => m.id !== id));

    if (!isSupabaseConfigured) {
      const currentList: ContactMessage[] = JSON.parse(localStorage.getItem('demo_messages') || '[]');
      const updated = currentList.filter((m) => m.id !== id);
      localStorage.setItem('demo_messages', JSON.stringify(updated));
      return;
    }

    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      fetchMessages();
      throw new Error(error.message);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        experiences,
        educations,
        skills,
        certificates,
        achievements,
        messages,
        isLoading,
        refreshData: loadData,
        updateProfile,
        saveProject,
        deleteProject,
        saveExperience,
        deleteExperience,
        saveEducation,
        deleteEducation,
        saveSkill,
        deleteSkill,
        saveCertificate,
        deleteCertificate,
        saveAchievement,
        deleteAchievement,
        submitContactMessage,
        fetchMessages,
        markMessageRead,
        deleteMessage,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

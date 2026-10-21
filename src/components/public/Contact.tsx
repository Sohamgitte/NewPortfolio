import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Linkedin, Github } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ContactMessageSchema, ContactMessageInput } from '../../types';

export const Contact: React.FC = () => {
  const { profile, submitContactMessage } = usePortfolio();

  const [formData, setFormData] = useState<ContactMessageInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot field
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setFormErrors({});

    // Zod validation
    const result = ContactMessageSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString() || 'general';
        fieldErrors[fieldName] = issue.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitContactMessage(result.data);
      if (res.success) {
        setSubmitStatus({ type: 'success', message: res.message });
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      } else {
        setSubmitStatus({ type: 'error', message: res.message });
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: (err as Error).message || 'Failed to send message. Please try again or reach out directly via email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-28 relative bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">09 / Get In Touch</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Let's Build Something <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Great</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Have an internship opening, startup idea, or technical project? Reach out directly or send a message below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <a
              href={`mailto:${profile.email}`}
              className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 hover:border-neutral-300 hover:bg-white hover:shadow-md transition-all flex items-start gap-4 group block shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-wider mb-1">Direct Email</p>
                <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors truncate font-sans">
                  {profile.email}
                </p>
                <p className="text-xs text-neutral-500 mt-1">Usually responds within 24 hours</p>
              </div>
            </a>

            {/* Mobile / Phone Card */}
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 hover:border-neutral-300 hover:bg-white hover:shadow-md transition-all flex items-start gap-4 group block shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-wider mb-1">Mobile / WhatsApp</p>
                  <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors font-sans">
                    {profile.phone}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Available for calls & messages</p>
                </div>
              </a>
            )}

            {/* Location Card */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 flex items-start gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex items-center justify-center flex-shrink-0 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-wider mb-1">Base Location</p>
                <p className="text-sm font-bold text-neutral-900">{profile.location}</p>
                <p className="text-xs text-neutral-500 mt-1">Open to remote & on-site positions</p>
              </div>
            </div>

            {/* Social Network Bar */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 flex items-center justify-between">
              <span className="text-xs font-semibold font-mono text-neutral-500">Professional Networks:</span>
              <div className="flex items-center gap-2">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 transition-colors shadow-xs"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-400 transition-colors shadow-xs"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Secure Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-lg relative">
              <h3 className="text-xl font-bold text-neutral-900 mb-2 font-heading">Send an Inbound Message</h3>
              <p className="text-xs text-neutral-500 mb-6 font-sans">
                Your message is stored securely and routed directly to my private admin dashboard inbox.
              </p>

              {/* Status Alert */}
              {submitStatus && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-xs leading-relaxed ${
                    submitStatus.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                  role="alert"
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot field - invisible to human users, traps bots */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Leave this field blank</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                {/* Name & Email inputs in 2 columns on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-neutral-50/80 border text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                        formErrors.name ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-red-500 mt-1 font-mono">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-neutral-50/80 border text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all ${
                        formErrors.email ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-500 mt-1 font-mono">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">
                    Subject / Project Context
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="e.g. Internship Opportunity / Web Project Collaboration"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50/80 border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Share details about your project, timeline, or interview process..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-neutral-50/80 border text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all resize-none ${
                      formErrors.message ? 'border-red-500' : 'border-neutral-300 focus:border-neutral-900'
                    }`}
                  />
                  {formErrors.message && (
                    <p className="text-[11px] text-red-500 mt-1 font-mono">{formErrors.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 font-sans disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inbound Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

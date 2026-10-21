import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, FileText, Camera, X, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certificate, CertificateSchema } from '../../types';
import { uploadAsset } from '../../lib/storage';

export const AdminCertificates: React.FC = () => {
  const { certificates, saveCertificate, deleteCertificate } = usePortfolio();
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingCert({
      title: '',
      issuer: '',
      issue_date: '2026',
      credential_id: '',
      credential_url: '',
      file_url: '',
      status: 'published',
      display_order: certificates.length + 1,
    });
    setFormError(null);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert({ ...cert });
    setFormError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;

    try {
      setUploadProgress(10);
      const res = await uploadAsset(file, {
        folder: 'certificates',
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        maxSizeBytes: 10 * 1024 * 1024,
        onProgress: (p) => setUploadProgress(p),
      });

      setEditingCert((prev) => (prev ? { ...prev, file_url: res.url } : null));
    } catch (err) {
      setFormError((err as Error).message || 'Certificate upload failed');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    setFormError(null);

    const validation = CertificateSchema.safeParse(editingCert);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || 'Please check form fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveCertificate(editingCert as any);
      setEditingCert(null);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to save certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certificate permanently?')) {
      await deleteCertificate(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-heading">Certificates & Credentials</h1>
          <p className="text-xs text-neutral-500 font-sans mt-0.5">
            Manage industry certifications, credential IDs, and verified PDF/image assets.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-md transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    cert.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {cert.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:text-neutral-900 shadow-xs"
                    title="Edit Certificate"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-red-600 shadow-xs"
                    title="Delete Certificate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-900 mb-1 leading-snug font-heading">{cert.title}</h3>
              <p className="text-xs text-neutral-600 font-sans mb-2">Issuer: <span className="text-neutral-900 font-bold">{cert.issuer}</span></p>
              
              {cert.credential_id && (
                <p className="text-[11px] font-mono text-neutral-500 mb-3">ID: {cert.credential_id}</p>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>{cert.issue_date || 'Verified'}</span>
              <div className="flex items-center gap-2">
                {cert.file_url && (
                  <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-sans font-semibold">
                    <FileText className="w-3.5 h-3.5" />
                    <span>File</span>
                  </a>
                )}
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-neutral-900 font-semibold hover:underline flex items-center gap-1 font-sans">
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="text-lg font-bold text-neutral-900 font-heading">
                {editingCert.id ? 'Edit Certificate' : 'New Certificate'}
              </h3>
              <button onClick={() => setEditingCert(null)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Certificate Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Claude Code in Action"
                  value={editingCert.title || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Issuer / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anthropic / Google Cloud"
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Issue Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026"
                    value={editingCert.issue_date || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Credential ID</label>
                  <input
                    type="text"
                    placeholder="e.g. GCP-12345"
                    value={editingCert.credential_id || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, credential_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Verification URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingCert.credential_url || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, credential_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              {/* Upload Certificate File */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Certificate File / Image</label>
                <label className="cursor-pointer py-2.5 px-4 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 shadow-xs">
                  <Camera className="w-4 h-4 text-neutral-700" />
                  <span>Upload Document or Photo (Mobile camera supported)</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {uploadProgress !== null && (
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-neutral-900 h-full" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Status</label>
                  <select
                    value={editingCert.status || 'published'}
                    onChange={(e) => setEditingCert({ ...editingCert, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-sans"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 font-sans">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingCert.display_order ?? 1}
                    onChange={(e) => setEditingCert({ ...editingCert, display_order: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 shadow-sm font-sans"
                >
                  {isSubmitting ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

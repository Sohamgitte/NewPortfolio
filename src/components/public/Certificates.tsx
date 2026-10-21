import React from 'react';
import { Award, ExternalLink, Calendar, CheckCircle, FileText } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Certificates: React.FC = () => {
  const { certificates } = usePortfolio();

  const publishedCertificates = certificates
    .filter((c) => c.status === 'published')
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-20 md:py-28 relative bg-neutral-50/60" id="certificates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-neutral-500 tracking-widest uppercase font-mono">06 / Qualifications</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Certifications & <span className="underline decoration-neutral-300 underline-offset-8 decoration-2">Credentials</span>
            </h2>
            <p className="text-neutral-600 text-sm mt-2 max-w-xl">
              Industry assessments, cloud certifications, and emerging AI engineering simulations.
            </p>
          </div>
          <div className="text-xs text-neutral-500 font-semibold font-mono bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-xs">
            {publishedCertificates.length} Verified Certifications
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCertificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 hover:shadow-lg transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>

                  {cert.issue_date && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200 font-mono">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>{cert.issue_date}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors mb-2 leading-snug font-heading">
                  {cert.title}
                </h3>

                <p className="text-xs text-neutral-600 mb-4 font-sans">
                  Issuer: <span className="text-neutral-900 font-bold">{cert.issuer}</span>
                </p>

                {cert.credential_id && (
                  <div className="mb-4 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 text-[11px] font-mono text-neutral-600 flex items-center justify-between">
                    <span>ID: {cert.credential_id}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                {cert.file_url ? (
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 transition-colors font-mono"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-neutral-400">Digital Certificate</span>
                )}

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 transition-colors font-mono"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

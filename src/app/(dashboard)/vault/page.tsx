export default function VaultPage() {
  const documents = [
    {
      id: "NX-4491-QA",
      title: "NAFDAC Quality Export Permit",
      type: "Export",
      issued: "Oct 12, 2023",
      icon: "verified_user",
      colorClass: "bg-secondary-container text-on-secondary-container"
    },
    {
      id: "ORG-GLOBAL-23",
      title: "Organic Certification 2023",
      type: "Global Std",
      issued: "Aug 05, 2023",
      expiry: "Expires in 14 days",
      icon: "potted_plant",
      colorClass: "bg-primary-fixed text-primary",
      warning: true
    },
    {
      id: "LAB-2293",
      title: "Laboratory Moisture Analysis - Batch #2293",
      type: "Batch Ref",
      issued: "Nov 20, 2023",
      result: "Result: 12.4% CMC",
      icon: "science",
      colorClass: "bg-surface-container-highest text-on-surface-variant"
    }
  ];

  return (
    <div className="px-6 max-w-5xl mx-auto py-8">
      {/* Page Hero / Identity */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase block mb-1">Global Compliance</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Certificate Vault</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary-container transition-colors shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Upload New CoA
            </button>
          </div>
        </div>
        <p className="text-on-surface-variant max-w-xl body-md leading-relaxed">
          Immutable verification for international trade. Your Certificate of Analysis (CoA) records are cryptographically secured and ready for shipment verification.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px] fill-current">verified</span>
          </div>
          <p className="text-xs text-on-surface-variant font-medium mb-1 uppercase tracking-widest">Active Certs</p>
          <h3 className="text-4xl font-bold text-primary">24</h3>
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] px-2 py-0.5 rounded-full font-bold">ALL VERIFIED</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
          <p className="text-xs text-on-surface-variant font-medium mb-1 uppercase tracking-widest">Expiring Soon</p>
          <h3 className="text-4xl font-bold text-tertiary-container">02</h3>
          <p className="text-[11px] text-on-surface-variant mt-4 font-medium">Next: Organic Renewal (14 days)</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
          <p className="text-xs text-on-surface-variant font-medium mb-1 uppercase tracking-widest">Vault Storage</p>
          <h3 className="text-4xl font-bold text-secondary">82%</h3>
          <div className="w-full bg-outline-variant/20 h-1.5 rounded-full mt-5 overflow-hidden">
            <div className="bg-primary h-full w-[82%]"></div>
          </div>
        </div>
      </div>

      {/* Certificate List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-4 px-2">Document Registry</h4>
        {documents.map((doc, idx) => (
          <div key={idx} className="group bg-surface-container-lowest hover:bg-white transition-all duration-300 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-6 shadow-sm hover:shadow-md border border-outline-variant/5">
            <div className={`w-14 h-14 ${doc.colorClass} rounded-xl flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-3xl">{doc.icon}</span>
            </div>
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-on-surface text-lg">{doc.title}</h3>
                <span className={`${doc.colorClass} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
                  {doc.type}
                </span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant text-sm font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span> 
                  Issued {doc.issued}
                </span>
                <span className={`flex items-center gap-1 ${doc.warning ? "text-tertiary font-bold" : ""}`}>
                  <span className="material-symbols-outlined text-sm">{doc.warning ? "warning" : "database"}</span>
                  {doc.expiry || `Ref: ${doc.id}`}
                </span>
                {doc.result && (
                   <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">opacity</span>
                    {doc.result}
                   </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 md:flex-none border border-outline-variant/30 hover:bg-surface-container-low text-on-surface px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">visibility</span> View PDF
              </button>
              <button className="flex-1 md:flex-none bg-surface-container-highest text-on-surface px-4 py-2 rounded-xl text-sm font-semibold hover:bg-surface-dim transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">share</span> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Test CTA Card */}
      <div className="mt-12 bg-primary-container p-8 rounded-[2rem] text-on-primary-container flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <span className="material-symbols-outlined text-[200px] fill-current">shield_with_heart</span>
        </div>
        <div className="relative z-10 flex-grow text-center md:text-left">
          <h4 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Need specific batch testing?</h4>
          <p className="text-primary-fixed-dim max-w-sm mb-6">Order high-precision moisture, purity, or chemical analysis for any active shipment batch.</p>
          <button className="bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 mx-auto md:mx-0 active:scale-95 transition-transform">
            Request Lab Test
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shadow-2xl relative z-10 shrink-0 border border-white/10">
          <img 
            alt="Laboratory" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJEIWdIPVf7mPetSvmdhnmV8PVoa2FfL43TMYBE8X0Vmj2tcdjo79b7RdYQb21Z0UvdZNp3_SbwQ_Xc8Fo_GwWbx7efstS4nQ7Y2KD-UwO8zhGJUvr3QMyohAGOWs73epLFLmQaeEbXXOmpSIqFE559y29rYCu6eJXASmCa71zF-oQLe_NHbKKHoXdKJqbhTKTTWKqIdBsKjLEMJHBm6Dm0IMShrhpPxOPDALQmWD1eIyxlcJ4yl-VYFWXa2_YCXcVfu7zzrBNWkPb"
          />
        </div>
      </div>
    </div>
  );
}

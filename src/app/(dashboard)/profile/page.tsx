export default function ProfilePage() {
  const profile = {
    name: "Lomstel CEO",
    role: "Operational Commander",
    hub: "Central Hub (Ogun State)",
    joined: "Member since Oct 2022",
    stats: [
      { label: "Total Traded", value: "2.4k MT" },
      { label: "Success Rate", value: "98.2%" },
      { label: "Active Hubs", value: "04" }
    ]
  };

  return (
    <div className="px-6 max-w-4xl mx-auto py-12">
      <div className="bg-surface-container-low rounded-[2.5rem] overflow-hidden shadow-xl border border-outline-variant/10">
        <div className="relative h-48 bg-primary">
          <div className="absolute -bottom-16 left-12 w-32 h-32 rounded-full border-8 border-surface-container-low overflow-hidden shadow-lg bg-surface-container-highest">
            <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuABCy03c_L4U_gYMjLktQ8dsSexzRMF0cJ4wrg2r-U6I18-_X2qsfQkwiOypVx2G7V81r8FE2q_XWhNhr8t4m9u6fnUG_WIwvvykYnqDOnxOIe7bxFFcyW7KQCLDCitVOtIiLrh0psplOqBer2liPgi0NKVZDel-F0TTxPtuenMuSBGlGavMEG8YVuScSqOqYA7TqZKkscD_RmKNEXFWj91Pqb0Bx-6_NO3-Pwuv0PF9f2Cl6nqiZ2TZaiBA039ywmu1UPgXpDJs_Sd"
               alt="Profile"
               className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="pt-20 px-12 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-on-surface">{profile.name}</h2>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{profile.role}</p>
              <div className="flex items-center gap-4 mt-4 text-on-surface-variant text-sm font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {profile.hub}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  {profile.joined}
                </span>
              </div>
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform shadow-lg shadow-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-outline-variant/10">
            {profile.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-black text-on-surface leading-none">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-2">Account Settings</h3>
            <div className="space-y-2">
              {[
                { icon: "security", label: "Security & MFA", desc: "Protect your ledger access" },
                { icon: "notifications", label: "Notification Prefs", desc: "Manage harvest and trade alerts" },
                { icon: "payments", label: "Payment Gateways", desc: "Paystack & Flutterwave integration" },
                { icon: "help_outline", label: "Support Center", desc: "Contact Lomstel logistics" }
              ].map((item, idx) => (
                <button key={idx} className="w-full text-left bg-surface-container-lowest hover:bg-white p-4 rounded-2xl flex items-center gap-4 border border-outline-variant/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-on-surface font-bold text-sm">{item.label}</p>
                    <p className="text-on-surface-variant text-xs">{item.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </button>
              ))}
            </div>
          </div>

          <button className="mt-12 w-full py-4 text-error font-black uppercase tracking-widest text-center hover:bg-error-container/10 rounded-2xl transition-colors">
            Logout of Command Center
          </button>
        </div>
      </div>
    </div>
  );
}

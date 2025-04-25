
import { Calendar, Clock, FileText, BarChart4, Search, Settings } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-warm-section to-white"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <p className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider">For Pro Users</p>
          <h2 className="text-3xl md:text-4xl font-bold text-warm-text mb-6 leading-tight">
            Track Your Resume Journey <span className="text-gradient">All in One Place</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Manage all your resume versions, track improvements, and measure your progress over time with our intuitive dashboard.
          </p>
        </div>
        
        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto relative">
          {/* Dashboard UI Mockup */}
          <div className="bg-white rounded-xl shadow-premium overflow-hidden border border-slate-200/80">
            <div className="w-full flex flex-col">
              {/* Dashboard Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-warm-accent/20"></div>
                  <div className="font-semibold text-slate-800">Resume Dashboard</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-56 bg-white border-r border-slate-100 py-6 px-4 hidden md:block">
                  <div className="space-y-6">
                    {[
                      { icon: <FileText className="w-5 h-5 text-slate-600" />, label: "My Resumes" },
                      { icon: <BarChart4 className="w-5 h-5 text-slate-400" />, label: "Analytics" },
                      { icon: <Calendar className="w-5 h-5 text-slate-400" />, label: "History" },
                      { icon: <Search className="w-5 h-5 text-slate-400" />, label: "Job Search" },
                      { icon: <Settings className="w-5 h-5 text-slate-400" />, label: "Settings" },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-warm-section' : ''}`}>
                        {item.icon}
                        <span className={`${i === 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 p-6 bg-slate-50">
                  {/* Dashboard Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      { label: "Resume Versions", value: "4", color: "bg-blue-50 text-blue-600" },
                      { label: "Avg. Match Score", value: "72%", color: "bg-emerald-50 text-emerald-600" },
                      { label: "Interview Ready", value: "2/4", color: "bg-amber-50 text-amber-600" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                      <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500">View All</div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { action: "Resume Analyzed", time: "2 hours ago", file: "product_manager_v2.pdf" },
                        { action: "Bullet Points Improved", time: "Yesterday", file: "product_manager_v1.pdf" },
                        { action: "New Version Created", time: "3 days ago", file: "product_manager_v2.pdf" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100">
                              <Clock className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-800">{item.action}</div>
                              <div className="text-xs text-slate-500">{item.file}</div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400">{item.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Improvement Chart Placeholder */}
                  <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Resume Improvement Score</h3>
                    <div className="h-40 flex items-end gap-1">
                      {[30, 45, 62, 78].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-warm-accent/80 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-slate-500 mt-2">V{i+1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-warm-accent/5 rounded-full z-[-1]"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full z-[-1]"></div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;

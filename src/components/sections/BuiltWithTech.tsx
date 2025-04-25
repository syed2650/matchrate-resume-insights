
import { Icon } from "@/components/ui/icon";

const techStack = [
  { name: "GPT-4", icon: "brain" },
  { name: "Supabase", icon: "database" },
  { name: "React", icon: "code" },
  { name: "Tailwind", icon: "palette" },
  { name: "UploadThing", icon: "upload" },
  { name: "Lovable", icon: "sparkles" },
];

const BuiltWithTech = () => {
  return (
    <div className="py-8 overflow-hidden bg-gradient-to-r from-slate-50 to-white">
      <div className="container-content">
        <p className="text-center text-lg font-medium text-slate-600 mb-8">
          Built with Industry-Leading Tech
        </p>
        <div className="marquee relative">
          <div className="tech-stack-wrapper">
            {[...techStack, ...techStack].map((tech, index) => (
              <div
                key={index}
                className="tech-stack-item"
                style={{ opacity: 1 }}
              >
                <Icon name={tech.icon} className="w-6 h-6 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuiltWithTech;

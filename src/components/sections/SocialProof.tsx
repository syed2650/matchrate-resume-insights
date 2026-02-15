import { motion } from "framer-motion";
import { Star, Shield, Users, Clock } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Marketing Manager",
    quote: "I went from zero callbacks to 4 interviews in two weeks after using MatchRate. The ATS fixes were a game-changer.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "James T.",
    role: "Software Engineer",
    quote: "Finally understood why my resume kept getting rejected. MatchRate showed me exactly what to fix — landed my dream job.",
    rating: 5,
    avatar: "JT",
  },
  {
    name: "Priya K.",
    role: "Data Analyst",
    quote: "The JD Match feature helped me tailor my resume for every application. Got 3 offers in one month.",
    rating: 5,
    avatar: "PK",
  },
  {
    name: "David R.",
    role: "Product Manager",
    quote: "Worth every penny. The detailed ATS breakdown saved me hours of guesswork. Highly recommend for serious job seekers.",
    rating: 5,
    avatar: "DR",
  },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Resumes Optimized" },
  { icon: Shield, value: "95%", label: "ATS Pass Rate" },
  { icon: Clock, value: "2 Min", label: "Average Scan Time" },
];

const SocialProof = () => {
  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-16 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-100"
            >
              <stat.icon className="w-5 h-5 text-warm-accent mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-warm-text">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center text-warm-text mb-10"
        >
          Trusted by Job Seekers Worldwide
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-warm-accent/20 to-warm-accent/40 flex items-center justify-center text-xs font-bold text-warm-accent">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-warm-text">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* As Featured In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-6">As featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
            {["LinkedIn", "Indeed", "Glassdoor", "The Muse", "CareerBuilder"].map((name) => (
              <span key={name} className="text-lg md:text-xl font-bold text-slate-400">{name}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;

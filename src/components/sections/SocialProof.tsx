import { motion } from "framer-motion";
import { Star, Shield, Users, Clock, TrendingUp } from "lucide-react";

const testimonials = [
  { name: "Sarah M.", role: "Marketing Manager", quote: "I went from zero callbacks to 4 interviews in two weeks after using MatchRate. The ATS fixes were a game-changer.", rating: 5, avatar: "SM" },
  { name: "James T.", role: "Software Engineer", quote: "Finally understood why my resume kept getting rejected. MatchRate showed me exactly what to fix — landed my dream job.", rating: 5, avatar: "JT" },
  { name: "Priya K.", role: "Data Analyst", quote: "The JD Match feature helped me tailor my resume for every application. Got 3 offers in one month.", rating: 5, avatar: "PK" },
  { name: "David R.", role: "Product Manager", quote: "Worth every penny. The detailed ATS breakdown saved me hours of guesswork. Highly recommend for serious job seekers.", rating: 5, avatar: "DR" },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Resumes Optimized", color: "from-brand-violet to-brand-indigo" },
  { icon: Shield, value: "95%", label: "ATS Pass Rate", color: "from-emerald-500 to-brand-cyan" },
  { icon: Clock, value: "2 Min", label: "Average Scan Time", color: "from-brand-coral to-amber-500" },
];

const SocialProof = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-20 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-5 md:p-8 rounded-3xl bg-secondary border border-border hover:shadow-premium transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real Results</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Trusted by Job Seekers Worldwide
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-premium transition-all"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-6">As featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-30">
            {["LinkedIn", "Indeed", "Glassdoor", "The Muse", "CareerBuilder"].map((name) => (
              <span key={name} className="text-lg md:text-xl font-bold text-foreground">{name}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;

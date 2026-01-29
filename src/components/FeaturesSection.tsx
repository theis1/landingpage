import { motion } from "framer-motion";
import { TrendingUp, LineChart, Trophy } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Battle-Tested Strategies",
    description: "Learn from years of market experience. Real tactics refined through volatility, not theoretical models.",
  },
  {
    icon: LineChart,
    title: "Institutional Reports",
    description: "Deep-dive analysis, not just noise. Access the same caliber of research used by professional desks.",
  },
  {
    icon: Trophy,
    title: "The Competition",
    description: "Rank up in our global trading leagues. Compete against the best and prove your edge.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            The Edge
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to outperform, in one place.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glass-card p-8 h-full hover:shadow-medium transition-shadow duration-300">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

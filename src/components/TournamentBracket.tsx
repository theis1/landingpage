import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const TournamentBracket = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main bracket container */}
      <div className="relative aspect-square">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-accent/10"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glass container */}
        <div className="absolute inset-4 glass-card p-8">
          {/* Tournament grid */}
          <div className="relative h-full flex items-center justify-center">
            {/* Left bracket - Round 1 */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={`left-${i}`}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-14 h-7 rounded-md bg-secondary border border-border flex items-center justify-center">
                    <TrendingUp className={`w-3 h-3 ${i % 2 === 0 ? 'text-accent' : 'text-destructive'}`} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Left Semi-finals */}
            <div className="absolute left-20 top-1/2 -translate-y-1/2 space-y-20">
              {[1, 2].map((i) => (
                <motion.div
                  key={`left-semi-${i}`}
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {/* Connector lines */}
                  <svg className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-16" viewBox="0 0 24 64">
                    <path
                      d="M 0 8 L 12 8 L 12 56 L 0 56"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="1.5"
                    />
                    <path d="M 12 32 L 24 32" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  </svg>
                  <div className="w-16 h-8 rounded-md bg-secondary/80 border border-border flex items-center justify-center">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((bar) => (
                        <motion.div
                          key={bar}
                          className="w-1 bg-accent rounded-sm"
                          style={{ height: `${8 + bar * 4}px` }}
                          animate={{ scaleY: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, delay: bar * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center - Trophy/Winner */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              {/* Connector to center */}
              <svg className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-24" viewBox="0 0 32 96">
                <path
                  d="M 0 16 L 16 16 L 16 80 L 0 80"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="1.5"
                />
                <path d="M 16 48 L 32 48" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />
              </svg>
              <svg className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-24" viewBox="0 0 32 96">
                <path
                  d="M 32 16 L 16 16 L 16 80 L 32 80"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="1.5"
                />
                <path d="M 16 48 L 0 48" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />
              </svg>

              <div className="w-20 h-20 rounded-2xl bg-accent-gradient shadow-medium flex items-center justify-center">
                <motion.div
                  className="text-3xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🏆
                </motion.div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-accent/30 blur-xl -z-10" />
            </motion.div>

            {/* Right Semi-finals */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 space-y-20">
              {[1, 2].map((i) => (
                <motion.div
                  key={`right-semi-${i}`}
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {/* Connector lines */}
                  <svg className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-16" viewBox="0 0 24 64">
                    <path
                      d="M 24 8 L 12 8 L 12 56 L 24 56"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="1.5"
                    />
                    <path d="M 12 32 L 0 32" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  </svg>
                  <div className="w-16 h-8 rounded-md bg-secondary/80 border border-border flex items-center justify-center">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((bar) => (
                        <motion.div
                          key={bar}
                          className="w-1 bg-accent rounded-sm"
                          style={{ height: `${8 + bar * 4}px` }}
                          animate={{ scaleY: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, delay: 0.5 + bar * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right bracket - Round 1 */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={`right-${i}`}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-14 h-7 rounded-md bg-secondary border border-border flex items-center justify-center">
                    <TrendingUp className={`w-3 h-3 ${i % 2 === 1 ? 'text-accent' : 'text-destructive'}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Floating accent orbs */}
        <motion.div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-accent/10 blur-2xl"
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-primary/5 blur-2xl"
          animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default TournamentBracket;

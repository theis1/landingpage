import { motion } from "framer-motion";
import { Users, Clock } from "lucide-react";

const ScarcityBanner = () => {
  return (
    <section className="py-16 px-6">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-12"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm uppercase tracking-wider">
                  Current Status
                </p>
                <p className="text-primary-foreground text-xl font-display font-bold">
                  High Demand
                </p>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-primary-foreground/20" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground/70 text-sm uppercase tracking-wider">
                  Next Intake
                </p>
                <p className="text-primary-foreground text-xl font-display font-bold">
                  Closes Soon
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScarcityBanner;

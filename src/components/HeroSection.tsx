import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TournamentBracket from "./TournamentBracket";

interface LeadData {
  email: string;
  referral_code: string;
  referral_count: number;
}

interface HeroSectionProps {
  referralCode?: string | null;
}

const HeroSection = ({ referralCode }: HeroSectionProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [copied, setCopied] = useState(false);

  // Referral code is now generated server-side for security

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use the secure register_lead function which handles everything server-side
      const { data: newReferralCode, error: registerError } = await supabase
        .rpc("register_lead", {
          user_email: email,
          ref_code: referralCode || null,
        });

      if (registerError) {
        if (registerError.code === "23505") {
          // Email already exists - store in local state with the email
          // We can't fetch from DB due to RLS, so we show a generic message
          toast({
            title: "Welcome back!",
            description: "You're already on the waitlist. Check your email for your referral link.",
          });
          return;
        }
        throw registerError;
      }

      // Set the lead data with the returned referral code
      setLeadData({
        email: email,
        referral_code: newReferralCode,
        referral_count: 0, // New users start at 0
      });

      toast({
        title: "You're in!",
        description: "Welcome to the Global Gains League waitlist.",
      });
    } catch (error: unknown) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const referralLink = leadData
    ? `${window.location.origin}?ref=${leadData.referral_code}`
    : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with fellow traders.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const referralProgress = leadData ? Math.min((leadData.referral_count / 5) * 100, 100) : 0;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {!leadData ? (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      Season 1 Opening Soon
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary leading-tight">
                      Global Gains League:
                      <span className="block text-accent">Prove Your Edge.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg">
                      The exclusive trading community. Compete in leagues, access pro strategies, and grow. Limited spots for the next Season.
                    </p>
                  </div>

                  {/* Email form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 px-6 text-lg bg-secondary/50 border-border focus:border-accent focus:ring-accent"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium hover:shadow-lg transition-all duration-300"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            />
                            Processing
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Request Access
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No spam. We respect your inbox.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="referral"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Success badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                      <Check className="w-4 h-4" />
                      You're on the list
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary leading-tight">
                      You're In.
                      <span className="block text-accent">Now Move Up.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg">
                      Invite 5 fellow traders to skip the waitlist and unlock Priority Access.
                    </p>
                  </div>

                  {/* Progress section */}
                  <div className="space-y-4 glass-card p-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Referral Progress</span>
                      <span className="font-semibold text-primary">
                        {leadData.referral_count}/5 Referrals
                      </span>
                    </div>
                    <Progress value={referralProgress} className="h-3" />
                    {leadData.referral_count >= 5 ? (
                      <p className="text-accent font-semibold flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Priority Access Unlocked!
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {5 - leadData.referral_count} more referral{5 - leadData.referral_count !== 1 ? "s" : ""} to unlock Priority Access
                      </p>
                    )}
                  </div>

                  {/* Referral link */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Your unique referral link
                    </label>
                    <div className="flex gap-3">
                      <Input
                        value={referralLink}
                        readOnly
                        className="h-14 px-6 text-base bg-secondary/50 border-border font-mono"
                      />
                      <Button
                        onClick={copyToClipboard}
                        size="lg"
                        className="h-14 px-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-medium accent-glow transition-all duration-300"
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side - Tournament Bracket */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:block"
          >
            <TournamentBracket />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Trophy, Crown, BookOpen, Lock, Unlock, Gift, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface LeadData {
  email: string;
  referral_code: string;
  referral_count: number;
}

interface ReferralDashboardProps {
  leadData: LeadData;
}

const TIER_1_GOAL = 5;
const TIER_2_GOAL = 10;

const ReferralDashboard = ({ leadData }: ReferralDashboardProps) => {
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}?ref=${leadData.referral_code}`;

  const tier1Unlocked = leadData.referral_count >= TIER_1_GOAL;
  const tier2Unlocked = leadData.referral_count >= TIER_2_GOAL;

  // Calculate progress for the 2-tier system
  const tier1Progress = Math.min((leadData.referral_count / TIER_1_GOAL) * 100, 100);
  const tier2Progress = tier1Unlocked
    ? Math.min(((leadData.referral_count - TIER_1_GOAL) / (TIER_2_GOAL - TIER_1_GOAL)) * 100, 100)
    : 0;
  const overallProgress = Math.min((leadData.referral_count / TIER_2_GOAL) * 100, 100);

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

  return (
    <motion.div
      key="referral"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
      style={{ pointerEvents: "auto" }}
      id="referral-container"
    >
      {/* Glassmorphism glow effect - pointer-events-none to not block clicks */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none" />

      <div className="relative space-y-6">
        {/* Success badge with VIP status if unlocked */}
        <div className="flex justify-center gap-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium">
            <Check className="w-4 h-4" />
            You're on the list
          </span>
          {tier1Unlocked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-400 text-sm font-medium border border-amber-500/30"
            >
              <Crown className="w-4 h-4" />
              VIP Status
            </motion.span>
          )}
        </div>

        {/* Headline */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-white">
            Your Referral Dashboard
          </h2>
          <p className="text-white/70">
            Share your link and unlock exclusive rewards!
          </p>
        </div>

        {/* Referral Counter */}
        <motion.div
          className="text-center py-4 bg-white/5 rounded-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <motion.span
            key={leadData.referral_count}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            {leadData.referral_count}
          </motion.span>
          <p className="text-white/60 mt-1">
            {leadData.referral_count === 1 ? "Friend Referred" : "Friends Referred"}
          </p>
        </motion.div>

        {/* 2-Tier Progress System */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Unlock Progress</span>
            <span className="font-semibold text-white">
              {leadData.referral_count}/{TIER_2_GOAL} Referrals
            </span>
          </div>

          {/* Combined Progress Bar */}
          <div className="relative">
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Tier Markers */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 ${tier1Unlocked ? 'bg-amber-500 border-amber-400' : 'bg-white/20 border-white/40'} -mt-0`} />
            </div>
            <div className="absolute top-0 right-0 h-full flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 ${tier2Unlocked ? 'bg-purple-500 border-purple-400' : 'bg-white/20 border-white/40'} -mt-0`} />
            </div>
          </div>

          {/* Tier Labels */}
          <div className="flex justify-between text-xs">
            <span className="text-white/40">0</span>
            <span className={`${tier1Unlocked ? 'text-amber-400' : 'text-white/60'}`}>5 - VIP</span>
            <span className={`${tier2Unlocked ? 'text-purple-400' : 'text-white/60'}`}>10 - eBook</span>
          </div>
        </div>

        {/* Reward Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tier 1 - VIP Status */}
          <motion.div
            className={`relative p-4 rounded-xl border ${tier1Unlocked
              ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/40'
              : 'bg-white/5 border-white/10'
              }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tier1Unlocked
                ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                : 'bg-white/10'
                }`}>
                {tier1Unlocked ? (
                  <Crown className="w-5 h-5 text-white" />
                ) : (
                  <Lock className="w-5 h-5 text-white/50" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${tier1Unlocked ? 'text-amber-400' : 'text-white/60'}`}>
                  VIP Priority
                </p>
                <p className="text-xs text-white/40">5 Referrals</p>
              </div>
            </div>
            {tier1Unlocked ? (
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Unlock className="w-3 h-3" />
                <span>Unlocked!</span>
              </div>
            ) : (
              <p className="text-xs text-white/40">
                {TIER_1_GOAL - leadData.referral_count} more to unlock
              </p>
            )}
          </motion.div>

          {/* Tier 2 - eBook */}
          <motion.div
            className={`relative p-4 rounded-xl border ${tier2Unlocked
              ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/10 border-purple-500/40'
              : 'bg-white/5 border-white/10'
              }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tier2Unlocked
                ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                : 'bg-white/10'
                }`}>
                {tier2Unlocked ? (
                  <BookOpen className="w-5 h-5 text-white" />
                ) : (
                  <Lock className="w-5 h-5 text-white/50" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${tier2Unlocked ? 'text-purple-400' : 'text-white/60'}`}>
                  Trading eBook
                </p>
                <p className="text-xs text-white/40">10 Referrals</p>
              </div>
            </div>
            {tier2Unlocked ? (
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <Unlock className="w-3 h-3" />
                <span>Unlocked!</span>
              </div>
            ) : (
              <p className="text-xs text-white/40">
                {TIER_2_GOAL - leadData.referral_count} more to unlock
              </p>
            )}
          </motion.div>
        </div>

        {/* eBook Download Button - Only shown when Tier 2 is unlocked */}
        <AnimatePresence>
          {tier2Unlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Button
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
                onClick={() => {
                  toast({
                    title: "Download Starting",
                    description: "Your exclusive trading eBook is being prepared.",
                  });
                  // In a real implementation, this would trigger an actual download
                }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Download Your Exclusive eBook
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Referral link - FRONT AND CENTER */}
        <div className="space-y-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-cyan-400" />
              Your Referral Link
            </label>
            <span className="text-xs text-cyan-400/70">Share to earn rewards</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={referralLink}
              readOnly
              id="referral-display"
              className="h-12 px-4 text-sm bg-white/10 border-white/20 text-white font-mono w-full"
            />
            <Button
              onClick={copyToClipboard}
              className="h-12 w-full sm:w-auto sm:px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Motivational message */}
        {!tier2Unlocked && (
          <p className="text-center text-sm text-white/50">
            {tier1Unlocked
              ? "🎉 You're a VIP! Keep sharing to unlock the exclusive eBook."
              : "💡 Share your link on social media to refer more friends!"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ReferralDashboard;

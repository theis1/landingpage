import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { ChevronDown, ArrowRight, ChevronsDown, Trophy, Users, LineChart, Plus, Minus, Clock, Check } from "lucide-react";
import ReferralDashboard from "@/components/ReferralDashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { z } from "zod";

const emailSchema = z.string()
  .trim()
  .email("Please enter a valid email address")
  .max(255, "Email is too long");

// Zapier webhook URL for lead capture
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/26123020/ulyuu8n/';

// localStorage keys for persistent user state
const STORAGE_KEYS = {
  EMAIL: 'user_email',
  REF_CODE: 'user_ref_code',
  REF_LINK: 'user_ref_link'
};

// Generate referral code client-side for immediate Zapier integration
const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'REF';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

interface LeadData {
  email: string;
  referral_code: string;
  referral_count: number;
}

interface VideoScrubbingHeroProps {
  referralCode?: string | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const useCountdown = (targetDate: Date): TimeLeft => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

const CountdownTimer = () => {
  const targetDate = new Date('2026-03-01T00:00:00');
  const timeLeft = useCountdown(targetDate);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              key={unit.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 min-w-[60px]"
            >
              <span className="text-2xl md:text-3xl font-bold text-white font-mono">
                {String(unit.value).padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-xs text-white/60 mt-1 uppercase tracking-wider">
              {unit.label}
            </span>
          </motion.div>
          {index < timeUnits.length - 1 && (
            <span className="text-2xl font-bold text-cyan-400 mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

const VideoScrubbingHero = ({ referralCode }: VideoScrubbingHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  // Welcome Back state
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [storedUserEmail, setStoredUserEmail] = useState<string | null>(null);

  // Form visibility tracking via IntersectionObserver
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform scroll progress to video progress (0-1)
  const videoProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  // Use spring for smooth momentum-based animation
  const smoothVideoProgress = useSpring(videoProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  // Opacity transforms for different sections - swapped order: features first, then form
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const infoOpacity = useTransform(scrollYProgress, [0.1, 0.18, 0.35, 0.42], [0, 1, 1, 0]);
  const formOpacity = useTransform(scrollYProgress, [0.35, 0.42, 0.75, 0.82], [0, 1, 1, 0]);
  const faqOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 0.85]);

  // Pointer events transforms - enable clicks as soon as section appears, disable only when nearly invisible
  const infoPointerEvents = useTransform(infoOpacity, (opacity) => opacity > 0.05 ? "auto" : "none");
  const faqPointerEvents = useTransform(faqOpacity, (opacity) => opacity > 0.05 ? "auto" : "none");

  // Blur transforms - ONLY blur sections when they're fading OUT (not when fading in)
  // Info section fades out at scroll [0.35, 0.42]
  const infoBlur = useTransform(scrollYProgress, [0.35, 0.42], ["blur(0px)", "blur(20px)"]);
  // Form section fades out at scroll [0.75, 0.82]
  const formBlur = useTransform(scrollYProgress, [0.75, 0.82], ["blur(0px)", "blur(20px)"]);

  // 3D rotation for FAQ title based on scroll - slower and more dramatic
  const faqRotateX = useTransform(scrollYProgress, [0.55, 0.80], [120, 0]);
  const faqRotateY = useTransform(scrollYProgress, [0.55, 0.80], [-60, 0]);
  const faqScale = useTransform(scrollYProgress, [0.55, 0.80], [0.3, 1]);

  // Smooth video time update using spring values
  useEffect(() => {
    const unsubscribe = smoothVideoProgress.on("change", (latest) => {
      if (videoRef.current && isVideoReady && videoDuration > 0) {
        const targetTime = Math.min(latest, 1) * videoDuration;
        videoRef.current.currentTime = targetTime;
      }
    });

    return () => unsubscribe();
  }, [smoothVideoProgress, isVideoReady, videoDuration]);

  // Handle video metadata loaded
  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setIsVideoReady(true);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Check localStorage for returning user on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
    if (storedEmail) {
      setStoredUserEmail(storedEmail);
      setShowWelcomeBack(true);
    }
  }, []);

  // IntersectionObserver for form visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      { threshold: 0.5 }
    );

    if (formSectionRef.current) {
      observer.observe(formSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Event delegation handler for email input changes
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    // Check for Welcome Back match
    const storedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
    if (storedEmail && value.toLowerCase() === storedEmail.toLowerCase()) {
      setShowWelcomeBack(true);
      setStoredUserEmail(storedEmail);
    } else if (showWelcomeBack && storedEmail && value.toLowerCase() !== storedEmail.toLowerCase()) {
      // User is typing a different email, hide welcome back
      setShowWelcomeBack(false);
    }
  }, [showWelcomeBack]);

  // Event delegation setup on stable parent container
  useEffect(() => {
    const formContainer = document.querySelector('[data-form-container="hero-form"]');
    if (!formContainer) return;

    const handleDelegatedInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.matches('[data-testid="hero-email-input"]')) {
        handleEmailChange(target.value);
      }
    };

    formContainer.addEventListener('input', handleDelegatedInput);

    return () => {
      formContainer.removeEventListener('input', handleDelegatedInput);
    };
  }, [handleEmailChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: "Invalid email",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    const validatedEmail = validation.data.toLowerCase();

    // Check if this is a returning user trying to re-submit
    const storedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
    if (storedEmail && validatedEmail === storedEmail.toLowerCase()) {
      setShowWelcomeBack(true);
      setStoredUserEmail(storedEmail);
      return;
    }

    // 1. Freeze UI
    setIsLoading(true);

    // 2. Generate Data
    const generatedRefCode = generateReferralCode();
    const referralLink = `${window.location.origin}?ref=${generatedRefCode}`;

    // 3. Capture Context (referred_by)
    // referralCode prop already holds the value from ?ref=...

    try {
      // 4. Network Request (Zapier)
      try {
        await fetch(ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: validatedEmail,
            referred_by: referralCode || null,
            generated_ref_code: generatedRefCode,
            referral_link: referralLink,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (zapierError) {
        // CORS fallback - fire and forget with no-cors mode
        console.error('Zapier fetch failed, trying no-cors:', zapierError);
        try {
          await fetch(ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: validatedEmail,
              referred_by: referralCode || null,
              generated_ref_code: generatedRefCode,
              referral_link: referralLink,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (noCorsError) {
          console.error('Zapier no-cors also failed:', noCorsError);
        }
      }

      // 5. Persist Data
      localStorage.setItem(STORAGE_KEYS.EMAIL, validatedEmail);
      localStorage.setItem(STORAGE_KEYS.REF_CODE, generatedRefCode);
      localStorage.setItem(STORAGE_KEYS.REF_LINK, referralLink);

      // Register with Supabase (server-side backup/accounting)
      const { data: serverReferralCode, error: registerError } = await supabase.rpc(
        "register_lead",
        {
          user_email: validatedEmail,
          ref_code: referralCode || null,
        }
      );

      if (registerError) {
        if (registerError.code === "23505") {
          // Email already exists
          localStorage.setItem(STORAGE_KEYS.EMAIL, validatedEmail);
          setIsLoading(false);
          // Transition to Dashboard Page
          navigate(`/dashboard?email=${encodeURIComponent(validatedEmail)}`);
          return;
        }
        throw registerError;
      }

      // 6. Transition: Hide Form, Show Dashboard State (Inline)
      const finalReferralCode = serverReferralCode || generatedRefCode;

      // Update local storage with approved code if server returned one
      if (serverReferralCode) {
        localStorage.setItem(STORAGE_KEYS.REF_CODE, serverReferralCode);
        localStorage.setItem(STORAGE_KEYS.REF_LINK, `${window.location.origin}?ref=${serverReferralCode}`);
      }

      setLeadData({
        email: validatedEmail,
        referral_code: finalReferralCode,
        referral_count: 0,
      });

      // Send welcome email via Supabase function (backup to Zapier)
      try {
        await supabase.functions.invoke("send-welcome-email", {
          body: { email: validatedEmail, referralCode: finalReferralCode },
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the registration if email fails - Zapier should handle it
      }

      toast({
        title: "You're in!",
        description: "Welcome to the Global Gains League.",
      });
    } catch (error) {
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


  const handleMoreInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const currentSection = button.closest('section');
    const nextSection = currentSection?.nextElementSibling;

    if (nextSection && nextSection.tagName === 'SECTION' && nextSection instanceof HTMLElement) {
      // Check for fixed header to handle offset
      const headers = Array.from(document.querySelectorAll('header, nav'));
      const fixedHeader = headers.find(h => {
        const style = window.getComputedStyle(h);
        return style.position === 'fixed' || style.position === 'sticky';
      });

      const offset = fixedHeader ? fixedHeader.clientHeight : 0;

      nextSection.style.scrollMarginTop = `${offset}px`;
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: scroll one viewport down if no next section found
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Trophy,
      title: "100% Demo, Real Thrill",
      description: "Start with a virtual account. No deposit required, zero risk. Compete against thousands of traders purely on skill and strategy.",
    },
    {
      icon: LineChart,
      title: "Unlock Top Strategies",
      description: "Don't just watch the leaderboard—see how they do it. View the open positions, asset allocation, and trade history of the top-ranked traders in real-time.",
    },
    {
      icon: Users,
      title: "Connect & Grow",
      description: "Join a rapidly growing network of ambitious traders. Discuss market moves, share insights, and learn from the collective intelligence of the league.",
    },
  ];

  return (
    <div ref={containerRef} className="relative h-[600vh]">
      {/* Fixed Video Background */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleVideoLoaded}
        >
          <source
            src="https://res.cloudinary.com/ddgwrwrie/video/upload/Bildschirmaufnahme_2026-01-13_um_21.38.17_qfpnkq.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay that intensifies */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Section 1: Hero with Scroll Arrow */}
      <section className="sticky top-0 h-screen flex items-end justify-center pb-12 z-10">
        <motion.div
          className="flex flex-col items-center gap-2 text-white/80"
          style={{ opacity: arrowOpacity }}
        >
          <span className="text-sm font-medium tracking-wider uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Trade Smarter + Info Boxes (now first) */}
      <section className="sticky top-0 h-screen flex items-center justify-center z-20 px-4">
        <motion.div
          className="w-full max-w-5xl space-y-12"
          style={{ opacity: infoOpacity, pointerEvents: infoPointerEvents, filter: infoBlur }}
        >
          {/* Headline */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Season 1 Opening Soon
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
              The Biggest Demo Trading
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Competition is Coming!
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Sign up now and be the first to know when the competition goes live. Secure your spot in Season 1!
            </p>
          </div>

          {/* Feature Boxes */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* More Information Button */}
          <div className="text-center">
            <Button
              id="hero-scroll-btn"
              onClick={handleMoreInfoClick}
              size="lg"
              variant="outline"
              className="h-14 px-10 text-lg font-semibold bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 cursor-pointer"
            >
              <ChevronsDown className="w-5 h-5 mr-2" />
              More Information
              <ChevronsDown className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Section 3: Conversion Form / Referral (now second) */}
      <section
        ref={formSectionRef}
        className="sticky top-0 h-screen flex items-center justify-center z-30 px-4"
        data-form-container="hero-form"
      >
        <motion.div
          className="w-full max-w-md"
          style={{ opacity: formOpacity, filter: formBlur }}
        >
          <AnimatePresence mode="wait">
            {/* Welcome Back Sub-View for returning users */}
            {showWelcomeBack ? (
              <motion.div
                key="welcome-back"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
                style={{ pointerEvents: "auto" }}
                id="referral-container"
              >
                {/* Glassmorphism glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none" />

                <div className="relative space-y-6 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold text-white">
                      Welcome back!
                    </h2>
                    <p className="text-white/70" id="referral-display">
                      You are already on the list for Season 1.
                    </p>
                    {storedUserEmail && (
                      <p className="text-sm text-cyan-400">
                        {storedUserEmail}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => storedUserEmail && navigate(`/dashboard?email=${encodeURIComponent(storedUserEmail)}`)}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 shadow-lg shadow-emerald-500/25 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Continue to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>

                  <button
                    onClick={() => {
                      localStorage.removeItem(STORAGE_KEYS.EMAIL);
                      localStorage.removeItem(STORAGE_KEYS.REF_CODE);
                      localStorage.removeItem(STORAGE_KEYS.REF_LINK);
                      setShowWelcomeBack(false);
                      setStoredUserEmail(null);
                      setEmail("");
                    }}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors"
                  >
                    Not you? Sign up with a different email
                  </button>
                </div>
              </motion.div>
            ) : !leadData ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
                style={{ pointerEvents: "auto" }}
                id="dein-form"
              >
                {/* Glassmorphism glow effect - pointer-events-none to not block clicks */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 pointer-events-none" />

                <div className="relative space-y-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      <span>Season 1 starts March 1st</span>
                    </div>
                    <CountdownTimer />
                    <h2 className="text-3xl font-display font-bold text-white">
                      Get Access Now
                    </h2>
                    <p className="text-white/70">
                      Be the first to compete when we launch
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      disabled={isLoading || !isFormVisible}
                      data-testid="hero-email-input"
                      id="email-input"
                      className="h-14 px-6 text-lg bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/30"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !isFormVisible}
                      data-testid="hero-submit-button"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full inline-block"
                          />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Request Access
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-white/50">
                    Limited spots available. No spam, ever.
                  </p>
                </div>
              </motion.div>
            ) : (
              <ReferralDashboard leadData={leadData} />
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Section 4: FAQ Section */}
      <section className="sticky top-0 min-h-screen flex items-center justify-center z-40 px-4">
        <motion.div
          className="w-full min-h-screen bg-black flex items-center justify-center"
          style={{ opacity: faqOpacity, pointerEvents: faqPointerEvents }}
        >
          <div className="w-full max-w-4xl py-24">
            {/* 3D Animated Title */}
            <div className="perspective-1000 mb-16">
              <motion.h2
                style={{
                  rotateX: faqRotateX,
                  rotateY: faqRotateY,
                  scale: faqScale,
                  transformStyle: "preserve-3d",
                }}
                className="text-4xl md:text-6xl font-display font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              >
                Frequently Asked Questions
              </motion.h2>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm px-6 data-[state=open]:bg-white/10 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-6" hideDefaultIcon>
                  <span className="text-white text-left text-lg font-semibold flex-1">
                    What is the Global Gains League?
                  </span>
                  <Plus className="h-5 w-5 text-emerald-500 shrink-0 [[data-state=open]_&]:hidden" />
                  <Minus className="h-5 w-5 text-emerald-500 shrink-0 hidden [[data-state=open]_&]:block" />
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base pb-6">
                  It's a performance-driven ecosystem for traders. We combine professional strategies with a competitive league structure to prove your edge and climb the global ranks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm px-6 data-[state=open]:bg-white/10 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-6" hideDefaultIcon>
                  <span className="text-white text-left text-lg font-semibold flex-1">
                    Do I need to use a specific broker?
                  </span>
                  <Plus className="h-5 w-5 text-emerald-500 shrink-0 [[data-state=open]_&]:hidden" />
                  <Minus className="h-5 w-5 text-emerald-500 shrink-0 hidden [[data-state=open]_&]:block" />
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base pb-6">
                  Yes. To ensure fair execution and transparency, we operate exclusively on our own custom-developed trading infrastructure. You will get access to create your account once accepted.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm px-6 data-[state=open]:bg-white/10 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-6" hideDefaultIcon>
                  <span className="text-white text-left text-lg font-semibold flex-1">
                    When does the season start?
                  </span>
                  <Plus className="h-5 w-5 text-emerald-500 shrink-0 [[data-state=open]_&]:hidden" />
                  <Minus className="h-5 w-5 text-emerald-500 shrink-0 hidden [[data-state=open]_&]:block" />
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base pb-6">
                  The official Season 1 competition kicks off on March 1st. Secure your spot on the waitlist now.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm px-6 data-[state=open]:bg-white/10 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-6" hideDefaultIcon>
                  <span className="text-white text-left text-lg font-semibold flex-1">
                    How is the competition ranked?
                  </span>
                  <Plus className="h-5 w-5 text-emerald-500 shrink-0 [[data-state=open]_&]:hidden" />
                  <Minus className="h-5 w-5 text-emerald-500 shrink-0 hidden [[data-state=open]_&]:block" />
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base pb-6">
                  We rank based on ROI % (Return on Investment), not total profit. This ensures a level playing field regardless of account size.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Terms & Privacy Links */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-6 text-sm text-white/50">
                <Link to="/legal?tab=terms" className="hover:text-cyan-400 transition-colors">
                  nunnjm  Terms of Participation
                </Link>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <Link to="/legal?tab=privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <Link to="/legal?tab=legal-notice" className="hover:text-cyan-400 transition-colors">
                  Contact & Legal Notice
                </Link>
              </div>
              <p className="mt-4 text-xs text-white/30 flex items-center justify-center gap-4">
                <span>© {new Date().getFullYear()} Global Gains League. All rights reserved.</span>
                <Link to="/admin" className="hover:text-cyan-400 transition-colors">
                  Admin Login
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default VideoScrubbingHero;

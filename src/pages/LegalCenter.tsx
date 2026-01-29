import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileText,
  Lock,
  CheckCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Mail,
  Globe,
  MousePointer,
  Fingerprint,
  Clock,
  Download,
  ChevronDown,
  Scale,
  Users,
  Ban,
  Trophy,
  Coins,
  AlertCircle,
  Database,
  Server,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LegalCenter = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("legal-notice");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["legal-notice", "terms", "privacy"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="container max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">
                  Legal & Compliance Center
                </h1>
                <p className="text-sm text-slate-400">
                  Global Gains League — Official Documentation
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
              DMCC Verified
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tab Navigation */}
          <TabsList className="w-full h-auto p-1.5 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm grid grid-cols-1 sm:grid-cols-3 gap-2">
            <TabsTrigger
              value="legal-notice"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/10",
                "data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/30",
                "data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200"
              )}
            >
              <Building2 className="w-4 h-4" />
              Legal Notice
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/10",
                "data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/30",
                "data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200"
              )}
            >
              <FileText className="w-4 h-4" />
              Terms of Participation
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/10",
                "data-[state=active]:text-cyan-400 data-[state=active]:border data-[state=active]:border-cyan-500/30",
                "data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200"
              )}
            >
              <Lock className="w-4 h-4" />
              Privacy Policy
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Legal Notice Tab */}
            <TabsContent value="legal-notice" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Operator & Registered Office Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Operator Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Operator</h2>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xl font-display font-bold text-cyan-400">
                          Global Gains League International Ltd.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-sm text-slate-400">
                            Represented by: <strong className="text-white">Feja Bonz</strong> (Director of Operations)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registered Office Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-3xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Registered Office</h2>
                      </div>
                      <div className="space-y-2 text-slate-300">
                        <p>Almas Tower, Level 42, Unit 42-C</p>
                        <p>Jumeirah Lakes Towers (JLT)</p>
                        <p>Dubai, United Arab Emirates</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-slate-300">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span>legal@globalgainsleague.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>www.globalgainsleague.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 sm:col-span-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span>+971 58 592 7410</span>
                    </div>
                  </div>
                </div>

                {/* Regulatory Information */}
                <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Commercial Registration</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                      <span>
                        <strong className="text-white">Trade License Number:</strong> DMCC-829415
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                      <span>
                        <strong className="text-white">Registration Authority:</strong> Dubai Multi Commodities Centre (DMCC)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                      <span>
                        <strong className="text-white">License Type:</strong> Software Development & Financial Technology Services
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </TabsContent>

            {/* Terms of Participation Tab */}
            <TabsContent value="terms" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Intro */}
                <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white mb-2">OFFICIAL COMPETITION RULES AND TRADING PARAMETERS</h2>
                  <p className="text-slate-400 text-sm mb-4">Last Updated: January 19, 2026</p>
                  <p className="text-slate-300 leading-relaxed">
                    These Terms of Participation ("Terms") govern your participation in the Demo Trading Competition ("the Competition") organized by TradeQuest International Ltd. ("the Organizer"). By registering for the Competition, the Participant ("You") unconditionally agrees to these Rules, the General Terms of Service, and the decisions of the Organizer, which shall be final and binding in all respects. The Competition is a game of skill based on simulated financial market data. <strong className="text-white">IT DOES NOT INVOLVE REAL MONEY TRADING.</strong>
                  </p>
                </div>

                {/* Critical Warning Box (Anti Abuse) */}
                <div className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-900/20 p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-400 mb-2">
                        3. PROHIBITED TRADING PRACTICES (ANTI-ABUSE POLICY)
                      </h3>
                      <p className="text-slate-300 text-sm mb-4">
                        The Organizer employs sophisticated fraud detection systems. The following practices are strictly prohibited and will result in immediate disqualification without prior notice:
                      </p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <Ban className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span>
                            <strong>Latency Arbitrage:</strong> Exploiting delays in the update of simulated prices compared to real-world market data.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Ban className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span>
                            <strong>Grid Trading & High-Frequency Trading (HFT):</strong> The use of automated bots, scripts, or macros to execute trades at a frequency impossible for a human manual trader.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Ban className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span>
                            <strong>Account Hedging:</strong> Opening opposite positions on the same asset across multiple accounts (e.g., one account Long, one account Short) to guarantee a profit.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Ban className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span>
                            <strong>Group Collusion:</strong> Multiple users coordinating trades to manipulate the leaderboard rankings.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Terms Accordion */}
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem
                    value="eligibility"
                    className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 px-6 backdrop-blur-sm overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-5" hideDefaultIcon>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="font-semibold text-white">2. ELIGIBILITY AND RESTRICTIONS</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-slate-300">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                          <span>2.1. Participation is open only to individuals who are at least eighteen (18) years of age or the age of majority in their jurisdiction of residence, whichever is greater.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                          <span>2.2. Residents of jurisdictions where such competitions are prohibited by law (including but not limited to OFAC sanctioned countries) are ineligible to participate. The Organizer reserves the right to request proof of residence at any time.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Ban className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                          <span>2.3. Employees, officers, and immediate family members of the Organizer are strictly prohibited from participating.</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="prizes"
                    className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 px-6 backdrop-blur-sm overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-5" hideDefaultIcon>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Coins className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="font-semibold text-white">4. PRIZE DISTRIBUTION AND TAXATION</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-slate-300">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono text-sm">4.1</span>
                          <span><strong>Verification (KYC):</strong> Potential winners must successfully complete a Know-Your-Customer (KYC) verification process (providing ID and Proof of Address) before any prize is released. Failure to provide valid documentation within seven (7) days of notification results in forfeiture of the prize.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono text-sm">4.2</span>
                          <span><strong>No Legal Claim:</strong> Prizes are awarded at the sole discretion of the Organizer. In the event of a dispute regarding the identity of a winner or the validity of trades, the Organizer’s decision is absolute and not subject to legal recourse.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono text-sm">4.3</span>
                          <span><strong>Taxes:</strong> All federal, state, and local taxes associated with the receipt or use of any prize are the sole responsibility of the winner. The Organizer will not withhold taxes but may report prize values to tax authorities if required by law.</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="platform"
                    className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 px-6 backdrop-blur-sm overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-5" hideDefaultIcon>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Server className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="font-semibold text-white">5. PLATFORM STABILITY AND MALFUNCTIONS</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-slate-300">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono text-sm">5.1</span>
                          <span>The Participant acknowledges that the simulation software may be subject to technical glitches, server latency, or data feed errors.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono text-sm">5.2</span>
                          <span><strong>Force Majeure:</strong> The Organizer shall not be liable for any delay or failure in performance caused by events beyond its reasonable control, including but not limited to internet service provider failures, denial-of-service attacks (DDoS), or market data outages.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-mono text-sm">5.3</span>
                          <span>In the event of a technical error that creates unrealistic profits (e.g., "bad prints" on charts), the Organizer reserves the right to retroactively adjust account balances or reset the Competition entirely.</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="termination"
                    className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 px-6 backdrop-blur-sm overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-5" hideDefaultIcon>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <Ban className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="font-semibold text-white">6. TERMINATION AND DISQUALIFICATION</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-slate-300">
                      <p className="mb-3">
                        The Organizer reserves the right, in its sole and absolute discretion, to disqualify any individual it finds to be tampering with the entry process, the operation of the Competition, or to be acting in violation of these Rules.
                      </p>
                      <p className="font-bold text-red-400">
                        ANY ATTEMPT BY A PARTICIPANT TO DELIBERATELY DAMAGE THE WEBSITE OR UNDERMINE THE LEGITIMATE OPERATION OF THE COMPETITION MAY BE A VIOLATION OF CRIMINAL AND CIVIL LAWS.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </TabsContent>

            {/* Privacy Policy Tab */}
            <TabsContent value="privacy" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Intro */}
                <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white mb-2">PRIVACY AND DATA PROTECTION POLICY</h2>
                  <p className="text-slate-400 text-sm mb-4">Effective Date: January 19, 2026</p>
                  <p className="text-slate-300 leading-relaxed">
                    Global Gains League International Ltd. ("We", "Us", or "Our") is committed to protecting the privacy rights of its users. This Privacy Policy describes in detail how we collect, store, use, and cross-border transfer your personal data in connection with the Trading Competition.
                  </p>
                </div>

                {/* Data We Collect */}
                <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    2. DATA WE COLLECT (AUTOMATED AND VOLUNTARY)
                  </h3>
                  <div className="mb-4 text-slate-300">
                    <p className="mb-2"><strong>2.1 Personal Information:</strong> Name, email address, physical address (for prize delivery), and government-issued identification (for KYC/AML compliance).</p>
                    <p className="mb-2"><strong>2.2 Technical Data & Fingerprinting:</strong> To ensure the integrity of the competition, we automatically collect:</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                      <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">IP & ISP Info</p>
                        <p className="text-xs text-slate-400 mt-1">Internet Protocol (IP) addresses and ISP information.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                      <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                        <MousePointer className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">Behavioral Data</p>
                        <p className="text-xs text-slate-400 mt-1">Mouse movements and click patterns (to detect bots).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                      <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                        <Fingerprint className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">Unique Identifiers</p>
                        <p className="text-xs text-slate-400 mt-1">MAC addresses, UDID, browser type, OS, resolution.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-slate-300">
                    <h4 className="text-white font-semibold mb-2">3. LEGAL BASIS FOR PROCESSING</h4>
                    <ul className="space-y-1 text-sm">
                      <li><strong>3.1 Contractual Necessity:</strong> To perform the service of the Competition and track your ranking.</li>
                      <li><strong>3.2 Legitimate Interest:</strong> To detect and prevent fraud, multi-accounting, and cheating, which safeguards the fairness of the platform for all users.</li>
                      <li><strong>3.3 Consent:</strong> Where applicable, for marketing communications.</li>
                    </ul>
                  </div>
                </div>

                {/* International Data Transfers Warning */}
                <div className="rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-blue-900/10 p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                      <Server className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-cyan-400 mb-2">
                        4. INTERNATIONAL DATA TRANSFERS
                      </h3>
                      <p className="text-slate-300 text-sm mb-3">
                        <strong>4.1 Transfer to Non-EEA Jurisdictions:</strong> BY USING OUR SERVICES, YOU EXPLICITLY ACKNOWLEDGE AND CONSENT THAT YOUR PERSONAL DATA WILL BE TRANSFERRED TO, STORED, AND PROCESSED IN THE UNITED ARAB EMIRATES (UAE) AND OTHER JURISDICTIONS OUTSIDE THE EUROPEAN ECONOMIC AREA (EEA).
                      </p>
                      <p className="text-slate-300 text-sm mb-3">
                        <strong>4.2 Jurisdictional Risks:</strong> You acknowledge that these jurisdictions may not provide the same level of data protection as your home country (e.g., GDPR). However, the Organizer implements standard contractual clauses and internal security measures to protect your data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Privacy Sections */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-3">5. DATA RETENTION</h4>
                    <p className="text-slate-300 text-sm">
                      We retain your personal data for as long as your account is active or as needed to provide you services. We may retain your data for an extended period thereafter to comply with legal obligations, resolve disputes, and enforce our agreements. <strong>Data related to banned accounts or fraud attempts may be kept indefinitely for security blacklist purposes.</strong>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-3">6. DISCLOSURE TO THIRD PARTIES</h4>
                    <p className="text-slate-300 text-sm mb-2">
                      We do not sell your personal data. However, we may disclose your information to:
                    </p>
                    <ul className="list-disc pl-4 text-slate-300 text-sm">
                      <li><strong>Service Providers:</strong> Hosting, analytics, and email delivery services.</li>
                      <li><strong>Legal Authorities:</strong> If required by law, court order, or governmental regulation in the UAE or the user's jurisdiction.</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-3">7. USER RIGHTS AND LIMITATIONS</h4>
                    <p className="text-slate-300 text-sm">
                      Depending on your jurisdiction, you may have rights to access, correct, or delete your data. However, <strong>requests for deletion may be denied if the data is necessary for the detection of ongoing fraud or if the account has been flagged for violation of Competition Rules.</strong>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-3">8. CHANGES TO THIS POLICY</h4>
                    <p className="text-slate-300 text-sm">
                      We reserve the right to modify this Privacy Policy at any time. Material changes will be notified via email or a prominent notice on the site. Your continued use of the Service constitutes acceptance of those changes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-[#0a0a0a]">
        <div className="container max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Last Updated: January 19, 2026</span>
            </div>
            <Button
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800/30 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Global Gains League. A TradeQuest Technologies DMCC Company. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalCenter;

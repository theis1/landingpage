import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ReferralDashboard from "@/components/ReferralDashboard";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface LeadData {
    email: string;
    referral_code: string;
    referral_count: number;
}

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [leadData, setLeadData] = useState<LeadData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const email = searchParams.get("email");

        if (!email) {
            toast({
                title: "No email provided",
                description: "Redirecting to homepage...",
                variant: "destructive",
            });
            setTimeout(() => navigate("/"), 2000);
            return;
        }

        const fetchLeadData = async () => {
            try {
                const { data, error } = await supabase
                    .from("leads")
                    .select("email, referral_code, referral_count")
                    .eq("email", email.toLowerCase())
                    .maybeSingle();

                if (error || !data) {
                    toast({
                        title: "Email not found",
                        description: "Please register on the homepage first.",
                        variant: "destructive",
                    });
                    setTimeout(() => navigate("/"), 2000);
                    return;
                }

                setLeadData(data);
                toast({
                    title: "Welcome back!",
                    description: `You have ${data.referral_count} referral${data.referral_count !== 1 ? 's' : ''}.`,
                });
            } catch (error) {
                console.error("Error fetching lead data:", error);
                toast({
                    title: "Something went wrong",
                    description: "Please try again later.",
                    variant: "destructive",
                });
                setTimeout(() => navigate("/"), 2000);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeadData();
    }, [searchParams, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
                />
            </div>
        );
    }

    if (!leadData) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <p className="text-white">Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <ReferralDashboard leadData={leadData} />

                {/* Back to home button */}
                <motion.button
                    onClick={() => navigate("/")}
                    className="mt-6 w-full text-center text-sm text-white/50 hover:text-cyan-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                >
                    ← Back to homepage
                </motion.button>
            </div>
        </div>
    );
};

export default Dashboard;

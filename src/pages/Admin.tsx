import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { LogOut, Users, TrendingUp, Download } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface Lead {
  id: string;
  email: string;
  referral_code: string;
  referral_count: number;
  referred_by: string | null;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setLeads([]);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (data) {
      setIsAdmin(true);
      fetchLeads();
    } else {
      setIsAdmin(false);
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setLeads(data);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: "Invalid input",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setLeads([]);
  };

  const exportCSV = () => {
    const headers = ["Email", "Referral Code", "Referrals", "Referred By", "Joined"];
    const rows = leads.map((lead) => [
      lead.email,
      lead.referral_code,
      lead.referral_count.toString(),
      lead.referred_by || "",
      new Date(lead.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 text-white relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                <span className="text-white font-display font-bold text-2xl">G</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-slate-400 text-sm mt-2">
                Global Gains League Dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-6">
              <a href="/" className="hover:text-cyan-400 transition-colors">
                ← Back to home
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">You don't have admin privileges.</p>
          <Button onClick={handleLogout} variant="outline" className="border-white/10 text-white hover:bg-white/10">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white font-display font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="font-display font-semibold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10 hover:text-cyan-400">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Leads</p>
                <p className="text-3xl font-display font-bold text-white">{leads.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Referrals</p>
                <p className="text-3xl font-display font-bold text-white">
                  {leads.reduce((acc, lead) => acc + lead.referral_count, 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <Button onClick={exportCSV} className="w-full h-full bg-white/5 hover:bg-white/10 border border-white/10 text-white" variant="outline">
              <Download className="w-5 h-5 mr-2 text-cyan-400" />
              Export CSV
            </Button>
          </motion.div>
        </div>

        {/* Leads table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="font-display font-semibold text-lg text-white">All Leads</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Referral Code</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Referrals</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Referred By</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{lead.email}</td>
                    <td className="px-6 py-4 text-sm font-mono text-cyan-400">{lead.referral_code}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${lead.referral_count >= 5
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400"
                        }`}>
                        {lead.referral_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-400">
                      {lead.referred_by || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No leads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;

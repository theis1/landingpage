import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoScrubbingHero from "@/components/VideoScrubbingHero";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <VideoScrubbingHero referralCode={referralCode} />
    </div>
  );
};

export default Index;

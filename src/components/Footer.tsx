const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">G</span>
            </div>
            <span className="font-display font-semibold text-primary text-lg">
              Global Gains League
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="/legal" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="/legal" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground/70 max-w-3xl">
            <strong>Risk Disclaimer:</strong> Trading involves significant risk and is not suitable for all investors. Past performance in the league is not indicative of future results. The value of investments can go down as well as up, and you may lose all of your invested capital. We do not provide financial advice. Please consult with a qualified financial advisor before making any investment decisions. Global Gains League is an educational and competitive platform only.
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} Global Gains League. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

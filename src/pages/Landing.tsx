import { useNavigate } from 'react-router-dom';
import { Shield, ClipboardList, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { cn } from '../lib/utils';

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-brand-teal/[0.08]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -100,
        rotate: rotate - 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96] as any,
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10 + Math.random() * 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[3px] border border-black/[0.04]",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2 + i * 0.15,
        ease: [0.25, 0.4, 0.25, 1] as any,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col justify-between selection:bg-brand-tealLight/50 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={500}
          height={130}
          rotate={12}
          gradient="from-brand-teal/[0.08]"
          className="left-[-15%] md:left-[-5%] top-[12%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.4}
          width={450}
          height={110}
          rotate={-15}
          gradient="from-brand-yellow/[0.08]"
          className="right-[-8%] md:right-[2%] top-[65%] md:top-[70%]"
        />

        <ElegantShape
          delay={0.3}
          width={280}
          height={75}
          rotate={-8}
          gradient="from-indigo-500/[0.07]"
          className="left-[2%] md:left-[8%] bottom-[8%] md:bottom-[12%]"
        />

        <ElegantShape
          delay={0.5}
          width={200}
          height={55}
          rotate={20}
          gradient="from-green-500/[0.05]"
          className="right-[12%] md:right-[18%] top-[8%] md:top-[12%]"
        />

        <ElegantShape
          delay={0.6}
          width={130}
          height={35}
          rotate={-22}
          gradient="from-brand-yellow/[0.08]"
          className="left-[18%] md:left-[22%] top-[6%] md:top-[10%]"
        />
      </div>

      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-b border-gray-200/50 py-4 px-6 sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="w-9 h-9" />
            <div>
              <h1 className="text-lg font-bold leading-none">AssetPadi</h1>
              <span className="text-[9px] text-brand-muted tracking-wider uppercase font-semibold">Formalise · Register · Capital</span>
            </div>
          </div>
          
          <span className="text-xs text-brand-teal font-bold px-3 py-1.5 bg-brand-tealLight rounded-xl border border-brand-teal/10 hidden sm:inline-block">
            Economic & Financial Access
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center py-16 px-6 max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mb-14">

          {/* Animated Main Title */}
          <motion.h2
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5.5xl font-bold leading-tight mb-6 tracking-tight text-brand-dark"
          >
            Turn your tools into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-cyan-600">capital</span>.
          </motion.h2>

          {/* Animated Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-brand-muted leading-relaxed mb-8 max-w-xl mx-auto"
          >
            AssetPadi helps informal business owners in Nigeria formalise their business, register their assets with the National Collateral Registry (NCR), and unlock credit, step-by-step, in simple language or Pidgin.
          </motion.p>

          {/* Animated CTA Button */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center w-full"
          >
            <Button
              onClick={() => navigate('/onboard')}
              variant="primary"
              className="w-full sm:w-auto px-10 py-4 text-base sm:text-lg shadow-lg shadow-brand-teal/15 rounded-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        {/* Value Props with Staggered Fade-in */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          
          {/* Card 1 */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="glass-panel rounded-3xl p-6 text-center shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/onboard')}
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-tealLight text-brand-teal flex items-center justify-center mx-auto mb-5 border border-brand-teal/10">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Understand Your Rights</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Correct tax myths. Registering with CAC does not trigger FIRS tax audits for small businesses under ₦25M.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            custom={5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="glass-panel rounded-3xl p-6 text-center shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/onboard')}
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-yellowLight text-brand-yellow flex items-center justify-center mx-auto mb-5 border border-brand-yellow/10">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Register Your Assets</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Use your machinery, sewing machines, generators, or tools as collateral legally using the National Collateral Registry.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            custom={6}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="glass-panel rounded-3xl p-6 text-center shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/onboard')}
          >
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-brand-success flex items-center justify-center mx-auto mb-5 border border-brand-success/10">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Access Real Credit</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              Unlock loans from microfinance and commercial banks once your assets are recognized as official collateral.
            </p>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-md border-t border-gray-200/50 py-6 px-6 text-center relative z-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} AssetPadi. We are not affiliated with CAC, NCR, or FIRS.
          </p>
          <div className="flex gap-5">
            <a href="https://cac.gov.ng" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-teal hover:underline">cac.gov.ng</a>
            <a href="https://ncr.gov.ng" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-teal hover:underline">ncr.gov.ng</a>
            <a href="https://firs.gov.ng" target="_blank" rel="noopener noreferrer" className="text-xs text-brand-teal hover:underline">firs.gov.ng</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import CountUpRaw from "react-countup";
import { ChevronLeft, ChevronRight, Building2, ShieldCheck, Landmark, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useExperience } from "@/lib/experience-store";

// Safely handle CJS/ESM default export differences for CountUp
const CountUp =
  typeof CountUpRaw === "function"
    ? CountUpRaw
    : (CountUpRaw as { default: React.ComponentType<Record<string, unknown>> })?.default ||
      CountUpRaw;

/** Hook: respects user's motion preferences */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** Utility: parse a metric like "98%", "3.8x", "$1,200+", "1.5M", "$3.2M", "12 min" */
function parseMetricValue(raw: string) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(/^([^\d-+]*?)\s*([-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/);
  if (!m) {
    return { prefix: "", end: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = normalized.split(".")[1]?.length ?? 0;
  return {
    prefix: prefix ?? "",
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? "",
    decimals,
  };
}

/** Small component: one animated metric */
function MetricStat({
  value,
  label,
  sub,
  duration = 1.6,
}: {
  value: string;
  label: string;
  sub?: string;
  duration?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-1.5 text-left p-5 lg:p-6 glass-card border-white/60 bg-white/70">
      <p
        className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl font-display tracking-tight"
        aria-label={`${label} ${value}`}
      >
        {prefix}
        {reduceMotion ? (
          <span>
            {end.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
        ) : (
          <CountUp
            end={end}
            decimals={decimals}
            duration={duration}
            separator=","
            enableScrollSpy
            scrollSpyOnce
          />
        )}
        {suffix}
      </p>
      <p className="font-semibold text-foreground text-sm lg:text-base text-left font-display">
        {label}
      </p>
      {sub ? <p className="text-xs text-muted-foreground text-left leading-normal">{sub}</p> : null}
    </div>
  );
}

export const CASE_STUDIES = [
  {
    id: "global-manufacturer",
    industry: "Manufacturing",
    company: "Global Industrial Group",
    quote:
      "20,000 SAP users across 14 plants suffered 4-6 day manual provisioning delays. With SecOps HR-driven joiner/mover/leaver and self-service catalog, provisioning takes under 12 minutes with a 62% drop in helpdesk tickets.",
    name: "Marcus Vance",
    role: "Director of Enterprise SAP Systems",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    icon: Building2,
    metrics: [
      { value: "62%", label: "Ticket Reduction", sub: "L1 helpdesk volume dropped in 6 months" },
      { value: "12 min", label: "Provisioning Speed", sub: "Down from 4-6 days per user request" },
    ],
  },
  {
    id: "pharma-compliance",
    industry: "Pharma",
    company: "Top-10 Pharmaceutical",
    quote:
      "Facing intense FDA and SOX scrutiny with legacy SAP GRC that couldn't resolve SoD conflicts fast enough. SecOps integrated real-time SoD simulation and mitigating controls into every request, achieving zero material audit findings two years running.",
    name: "Dr. Elena Rostova",
    role: "Head of IT Compliance & GRC",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    icon: ShieldCheck,
    metrics: [
      {
        value: "100%",
        label: "Audit Readiness",
        sub: "Zero material findings for 2 consecutive years",
      },
      {
        value: "40%",
        label: "Faster Approvals",
        sub: "Accelerated compliant access request fulfillment",
      },
    ],
  },
  {
    id: "bank-license",
    industry: "Banking",
    company: "European Retail Bank",
    quote:
      "We were overspending on expensive SAP Professional licenses across 8,000 users without clear usage metrics. SecOps' license optimization module automatically classified actual user activity, saving $3.2M annually ahead of our SAP true-up.",
    name: "Jean-Luc Dubois",
    role: "VP of Enterprise IT Infrastructure",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    icon: Landmark,
    metrics: [
      {
        value: "$3.2M",
        label: "Annual License Savings",
        sub: "Reallocated over-provisioned SAP licenses",
      },
      {
        value: "8,000",
        label: "Users Classified",
        sub: "Complete visibility into actual SAP usage",
      },
    ],
  },
  {
    id: "utility-audit",
    industry: "Utilities",
    company: "National Utility",
    quote:
      "Emergency SAP access approvals used to take 2-3 days, dangerously stalling incident response. SecOps Firefighter workflow grants policy-based emergency access in under 3 minutes while automatically capturing full video and log session recordings for audit.",
    name: "Sarah Jenkins",
    role: "Cybersecurity & Incident Response Lead",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    icon: Zap,
    metrics: [
      { value: "3 min", label: "Emergency Access", sub: "Granted in under 3 mins vs 2-3 days" },
      {
        value: "100%",
        label: "Audit Traceability",
        sub: "Automated session recordings & log evidence",
      },
    ],
  },
];

export default function Casestudies({ activeCategory = null }: { activeCategory?: string | null }) {
  const markStory = useExperience((s) => s.markStory);
  const addAchievement = useExperience((s) => s.addAchievement);
  const complete = useExperience((s) => s.complete);

  const filteredStudies = activeCategory
    ? CASE_STUDIES.filter((s) => s.industry === activeCategory)
    : CASE_STUDIES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Keep currentIndex in bounds if filter changes
  useEffect(() => {
    if (currentIndex >= filteredStudies.length) {
      setCurrentIndex(0);
    }
  }, [activeCategory, filteredStudies.length, currentIndex]);

  const currentStudy = filteredStudies[currentIndex] || CASE_STUDIES[0];

  const handleSelectSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    if (currentStudy) {
      markStory(currentStudy.id);
      addAchievement("firstStory");
      complete("stories");
    }
  };

  const handlePrev = () => {
    const newIdx = currentIndex === 0 ? filteredStudies.length - 1 : currentIndex - 1;
    handleSelectSlide(newIdx);
  };

  const handleNext = () => {
    const newIdx = currentIndex === filteredStudies.length - 1 ? 0 : currentIndex + 1;
    handleSelectSlide(newIdx);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.99,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.99,
    }),
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {/* Main Slide Card Container with Smooth Transition */}
      <div className="relative min-h-[300px] lg:min-h-[270px] w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStudy.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full glass-card p-6 lg:p-8 grid gap-8 lg:grid-cols-3 xl:gap-12 items-center relative overflow-hidden"
          >
            {/* Left Col: Image + Quote & Details */}
            <div className="flex flex-col sm:flex-row gap-6 lg:col-span-2 lg:border-r lg:border-border/60 lg:pr-8 xl:pr-10 text-left">
              <img
                src={currentStudy.image}
                alt={`${currentStudy.name} portrait`}
                className="aspect-[29/35] h-auto w-full max-w-[160px] sm:max-w-[180px] lg:max-w-[190px] rounded-2xl object-cover ring-1 ring-black/5 shadow-md shrink-0"
                loading="lazy"
              />
              <figure className="flex flex-col justify-between gap-4 text-left flex-1">
                <blockquote className="text-left space-y-2">
                  <p className="text-base sm:text-lg text-foreground font-normal leading-relaxed">
                    "{currentStudy.quote}"
                  </p>
                </blockquote>

                <figcaption className="flex items-center gap-3 pt-3 border-t border-border/40 text-left">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground font-display">
                      {currentStudy.name}
                    </span>
                    <span className="text-xs text-primary font-semibold">
                      {currentStudy.company} — {currentStudy.role}
                    </span>
                  </div>
                </figcaption>
              </figure>
            </div>

            {/* Right Col: Animated Metric Cards */}
            <div className="grid grid-cols-1 gap-4 self-center text-left">
              {currentStudy.metrics.map((metric, i) => (
                <MetricStat
                  key={`${currentStudy.id}-${i}`}
                  value={metric.value}
                  label={metric.label}
                  sub={metric.sub}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Center Carousel Nav Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={handlePrev}
          aria-label="Previous story"
          className="p-2 rounded-full border border-border bg-white/80 hover:bg-white text-foreground shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Navigation Dots */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-border/60 shadow-xs">
          {filteredStudies.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSelectSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${s.company}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-7 bg-primary shadow-xs"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next story"
          className="p-2 rounded-full border border-border bg-white/80 hover:bg-white text-foreground shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

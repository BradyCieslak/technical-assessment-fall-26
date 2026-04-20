import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Driver = {
    name: string;
    role: string;
    era: string;
    number: string;
    imageSrc: string;
};

const drivers: Driver[] = [
    {
        name: "George Russell",
        role: "Race Driver",
        era: "2022 — Present",
        number: "63",
        imageSrc: "/drivers/russell.png",
    },
    {
        name: "Kimi Antonelli",
        role: "Race Driver",
        era: "2025 — Present",
        number: "12",
        imageSrc: "/drivers/antonelli.png",
    },
    {
        name: "Frederik Vesti",
        role: "Reserve Driver",
        era: "2024 — Present",
        number: "—",
        imageSrc: "/drivers/vesti.png",
    },
];

function DriverCard({
    driver,
    index,
    scrollYProgress,
    }: {
    driver: Driver;
    index: number;
    scrollYProgress: MotionValue<number>;
    }) {
    const start = 0.2 + index * 0.15;
    const end = start + 0.2;

    const y = useTransform(scrollYProgress, [start, end], ["-80%", "0%"]);
    const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

    return (
        <motion.div
            style={{ y, opacity }}
            className="w-full md:w-64 h-[480px] flex flex-col justify-end relative"
        >
            {/* Driver Image */}
            <img
                src={driver.imageSrc}
                alt={driver.name}
                className="absolute left-1/2 -translate-x-1/2 bottom-30 h-[360px] max-h-[360px] min-h-[320px] w-auto max-w-[220px] min-w-[200px] object-contain object-bottom z-10 pointer-events-none"
            />

            {/* Background/Description */}
            <div className="relative h-40 bg-merc-teal rounded-sm flex flex-col justify-end p-5 z-0">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <div className="text-merc-black text-xs tracking-[0.3em] uppercase mb-1 opacity-70">
                            {driver.role}
                        </div>
                        <div className="font-display font-black text-xl text-merc-black leading-tight">
                            {driver.name}
                        </div>
                    </div>
                    <div className="font-display font-black text-3xl text-merc-black leading-none">
                        {driver.number}
                    </div>
                </div>
                <div className="font-mono text-xs text-merc-black/60 tracking-wider pt-2 border-t border-merc-black/20">
                    {driver.era}
                </div>
            </div>
        </motion.div>
    );
}

export default function Drivers() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <section ref={sectionRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
            <div className="absolute inset-0 bg-merc-black">
            <svg
                className="absolute inset-0 w-full h-full opacity-40"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                <pattern id="carbon" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect width="8" height="8" fill="#0a0e1a" />
                    <path d="M0 0 L4 4 L0 8 Z" fill="#141824" />
                    <path d="M8 0 L4 4 L8 8 Z" fill="#141824" />
                    <path d="M0 0 L4 4 L8 0 Z" fill="#1a1f2e" />
                    <path d="M0 8 L4 4 L8 8 Z" fill="#05070d" />
                </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#carbon)" />
            </svg>
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-12">
            <motion.div style={{ opacity: titleOpacity }} className="text-center mb-10">
                <div className="text-merc-teal text-xs tracking-[0.4em] uppercase mb-3">
                The Drivers
                </div>
                <h2 className="font-display font-black text-4xl md:text-6xl text-merc-silver">
                2026 Lineup
                </h2>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center w-full max-w-5xl">
                {drivers.map((d, i) => (
                <DriverCard
                    key={d.name}
                    driver={d}
                    index={i}
                    scrollYProgress={scrollYProgress}
                />
                ))}
            </div>
            </div>
        </div>
        </section>
    );
}
import { motion } from "motion/react";
import { useMercedesData } from "../hooks/useMercedesData";

export default function Hero() {
    const { data } = useMercedesData();

    const seasonPoints = data.reduce<Record<string, number>>((acc, r) => {
        acc[r.season] = (acc[r.season] ?? 0) + parseFloat(r.points || "0");
        return acc;
    }, {});
    const topSeasons = Object.entries(seasonPoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    const maxPoints = Math.max(...topSeasons.map(([, p]) => p), 1);

    return (
        <section className="relative min-h-screen flex items-center px-6 bg-merc-black overflow-hidden">

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-merc-teal text-xs tracking-[0.4em] uppercase mb-8"
            >
                Mercedes-AMG Petronas F1 Team
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="font-display font-black text-6xl md:text-8xl leading-[0.9] tracking-tight mb-8 text-merc-silver"
            >
                The Stats<br />Archive
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="text-merc-silver-dim text-lg max-w-md leading-relaxed"
            >
                Every race. Every point. Every podium. A complete record of the
                works Mercedes effort since their 2010 return to Formula One.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-16 text-xs tracking-[0.3em] uppercase text-merc-silver-dim flex items-center gap-3"
            >
                <span>Scroll</span>
                <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-8 bg-merc-teal"
                />
            </motion.div>
            </div>

            <div className="space-y-3">
            <div className="text-xs tracking-[0.3em] uppercase text-merc-silver-dim mb-4">
                Top Seasons · Points
            </div>
            {topSeasons.map(([season, points], i) => (
                <motion.div
                key={season}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-4"
                >
                <span className="font-display font-bold text-merc-silver w-14">
                    {season}
                </span>
                <div className="flex-1 h-8 bg-merc-carbon rounded-sm overflow-hidden">
                    <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(points / maxPoints) * 100}%` }}
                    transition={{ duration: 1, delay: 0.7 + i * 0.08, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-merc-teal-dim to-merc-teal"
                    />
                </div>
                <span className="font-mono text-sm text-merc-silver-dim w-16 text-right">
                    {points.toFixed(0)}
                </span>
                </motion.div>
            ))}
            </div>
        </div>
        </section>
    );
}
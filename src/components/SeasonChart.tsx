import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";
import { useMercedesData } from "../hooks/useMercedesData";

const BAR_BASE = "#00d2be";
const BAR_HOVER = "#c8cdd4";

export default function SeasonChart() {
    const { data } = useMercedesData();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-20%" });
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const bySeason = data.reduce<Record<string, number>>((acc, r) => {
        acc[r.season] = (acc[r.season] ?? 0) + parseFloat(r.points || "0");
        return acc;
    }, {});
    const chartData = Object.entries(bySeason)
        .map(([season, points]) => ({ season, points: Math.round(points) }))
        .sort((a, b) => parseInt(a.season) - parseInt(b.season));

    return (
        <section
        ref={ref}
        className="relative min-h-screen flex items-center py-32 px-6 bg-merc-black overflow-hidden"
        >
        <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-12"
            >
            <div className="text-merc-teal text-xs tracking-[0.4em] uppercase mb-3">
                Season Performance
            </div>
            <h2 className="font-display font-black text-4xl md:text-6xl text-merc-silver">
                Points Per Season
            </h2>
            <p className="text-merc-silver-dim mt-4 max-w-2xl">
                From midfield in 2010 to eight consecutive constructors' titles.
                The complete points record, season by season.
            </p>
            </motion.div>

            <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-[500px] w-full"
            >
            <ResponsiveContainer>
                <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1f2e" />
                <XAxis dataKey="season" stroke="#6b7280" tick={{ fill: "#c8cdd4", fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: "#c8cdd4", fontSize: 12 }} />
                <Tooltip
                    cursor={false}
                    animationDuration={100}
                    contentStyle={{
                    background: "#0a0e1a",
                    border: "1px solid #00d2be",
                    borderRadius: "4px",
                    }}
                    labelStyle={{ color: "#00d2be", fontWeight: 600 }}
                    itemStyle={{ color: "#c8cdd4" }}
                />
                <Bar
                    dataKey="points"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1400}
                    onMouseEnter={(_, idx) => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    {chartData.map((_, i) => (
                    <Cell key={i} fill={hoverIndex === i ? BAR_HOVER : BAR_BASE} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </motion.div>
        </div>
        </section>
    );
}
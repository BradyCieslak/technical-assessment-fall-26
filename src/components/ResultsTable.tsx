import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useMercedesData } from "../hooks/useMercedesData";

const PAGE_SIZE = 10;

type SortKey = "season-desc" | "season-asc" | "points-desc" | "position-asc";

export default function ResultsTable() {
    const { data, loading } = useMercedesData();
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<SortKey>("season-desc");
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, margin: "-20%" });

    const processed = useMemo(() => {
        const q = query.toLowerCase().trim();
        const filtered = q
        ? data.filter(
            (r) =>
                r.driver.toLowerCase().includes(q) ||
                r.raceName.toLowerCase().includes(q) ||
                r.circuit.toLowerCase().includes(q) ||
                r.season.includes(q) ||
                r.country.toLowerCase().includes(q)
            )
        : data;

        const sorted = [...filtered].sort((a, b) => {
        switch (sort) {
            case "season-asc":
            return (
                parseInt(a.season) - parseInt(b.season) ||
                parseInt(a.round) - parseInt(b.round)
            );
            case "season-desc":
            return (
                parseInt(b.season) - parseInt(a.season) ||
                parseInt(b.round) - parseInt(a.round)
            );
            case "points-desc":
            return parseFloat(b.points || "0") - parseFloat(a.points || "0");
            case "position-asc": {
            const ap = parseInt(a.position) || 99;
            const bp = parseInt(b.position) || 99;
            return ap - bp;
            }
        }
        });

        return sorted;
    }, [data, query, sort]);

    const pageCount = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount - 1);
    const rows = processed.slice(
        currentPage * PAGE_SIZE,
        currentPage * PAGE_SIZE + PAGE_SIZE
    );

    // Pad rows to always render PAGE_SIZE slots so height is constant
    const paddedRows = [...rows];
    while (paddedRows.length < PAGE_SIZE) paddedRows.push(null as never);

    return (
        <section ref={sectionRef} className="relative py-32 px-6 bg-merc-black">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-7xl mx-auto w-full px-6"
            >
            <div className="mb-8">
                <div className="text-merc-teal text-xs tracking-[0.4em] uppercase mb-3">
                Race Archive
                </div>
                <h2 className="font-display font-black text-4xl md:text-6xl text-merc-silver">
                Every Race, Every Driver
                </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-5">
                <input
                type="text"
                placeholder="Search driver, circuit, season, country..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                }}
                className="flex-1 md:max-w-96 px-4 py-3 bg-merc-carbon border border-merc-carbon focus:border-merc-teal focus:outline-none text-merc-silver placeholder:text-merc-silver-dim rounded-sm transition-colors"
                />
                <select
                value={sort}
                onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(0);
                }}
                className="px-4 py-3 bg-merc-carbon border border-merc-carbon focus:border-merc-teal focus:outline-none text-merc-silver rounded-sm transition-colors"
                >
                <option value="season-desc">Newest first</option>
                <option value="season-asc">Oldest first</option>
                <option value="points-desc">Most points</option>
                <option value="position-asc">Best finish</option>
                </select>
            </div>

            <div className="border border-merc-carbon rounded-sm">
                <table className="w-full text-sm table-fixed">
                <thead className="bg-merc-carbon text-merc-silver-dim text-xs tracking-wider uppercase">
                    <tr>
                    <th className="text-left px-4 py-3 w-20">Season</th>
                    <th className="text-left px-4 py-3">Race</th>
                    <th className="text-left px-4 py-3 w-48">Driver</th>
                    <th className="text-left px-4 py-3 w-16">Grid</th>
                    <th className="text-left px-4 py-3 w-16">Pos</th>
                    <th className="text-left px-4 py-3 w-20">Points</th>
                    <th className="text-left px-4 py-3 w-40">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading &&
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <tr key={`loading-${i}`} className="border-t border-merc-carbon">
                        <td colSpan={7} className="px-4 py-3">&nbsp;</td>
                        </tr>
                    ))}
                    {!loading &&
                    paddedRows.map((r, i) =>
                        r ? (
                        <tr
                            key={`${r.season}-${r.round}-${r.driver}-${i}`}
                            className="border-t border-merc-carbon hover:bg-merc-carbon/50 transition-colors"
                        >
                            <td className="px-4 py-3 font-mono text-merc-teal">{r.season}</td>
                            <td className="px-4 py-3 text-merc-silver truncate">{r.raceName}</td>
                            <td className="px-4 py-3 text-merc-silver truncate">{r.driver}</td>
                            <td className="px-4 py-3 font-mono">{r.grid}</td>
                            <td className="px-4 py-3 font-mono font-bold">{r.positionText}</td>
                            <td className="px-4 py-3 font-mono">{r.points}</td>
                            <td className="px-4 py-3 text-merc-silver-dim truncate">{r.status}</td>
                        </tr>
                        ) : (
                        <tr key={`empty-${i}`} className="border-t border-merc-carbon">
                            <td colSpan={7} className="px-4 py-3">&nbsp;</td>
                        </tr>
                        )
                    )}
                </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-5 text-sm text-merc-silver-dim">
                <div>
                {processed.length > 0
                    ? `${currentPage * PAGE_SIZE + 1}–${Math.min(
                        (currentPage + 1) * PAGE_SIZE,
                        processed.length
                    )} of ${processed.length}`
                    : "No results"}
                </div>
                <div className="flex gap-2">
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-merc-carbon hover:border-merc-teal hover:text-merc-teal disabled:opacity-30 disabled:hover:border-merc-carbon disabled:hover:text-merc-silver-dim transition-colors"
                >
                    ← Prev
                </button>
                <span className="px-4 py-2 text-merc-silver">
                    {currentPage + 1} / {pageCount}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    disabled={currentPage >= pageCount - 1}
                    className="px-4 py-2 border border-merc-carbon hover:border-merc-teal hover:text-merc-teal disabled:opacity-30 disabled:hover:border-merc-carbon disabled:hover:text-merc-silver-dim transition-colors"
                >
                    Next →
                </button>
                </div>
            </div>
            </motion.div>
        </section>
    );
}
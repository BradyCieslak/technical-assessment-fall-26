import { useEffect, useState } from "react";
import { fetchAllMercedesResults, type RaceResult } from "../api/jolpica";

export function useMercedesData() {
    const [data, setData] = useState<RaceResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchAllMercedesResults()
        .then((results) => {
            if (!cancelled) setData(results);
        })
        .catch((e) => {
            if (!cancelled) setError(e.message);
        })
        .finally(() => {
            if (!cancelled) setLoading(false);
        });
        return () => {
        cancelled = true;
        };
    }, []);

    return { data, loading, error };
}
const BASE = "https://api.jolpi.ca/ergast/f1";

export type RaceResult = {
    season: string;
    round: string;
    raceName: string;
    date: string;
    circuit: string;
    country: string;
    driver: string;
    driverCode: string;
    position: string;
    positionText: string;
    points: string;
    grid: string;
    status: string;
    fastestLap: string | null;
    time: string | null;
};

type JolpicaResponse = {
    MRData: {
        total: string;
        RaceTable: {
            Races: Array<{
                    season: string;
                    round: string;
                    raceName: string;
                    date: string;
                    Circuit: { circuitName: string; Location: { country: string } };
                    Results: Array<{
                        position: string;
                        positionText: string;
                        points: string;
                        grid: string;
                        status: string;
                        Driver: { givenName: string; familyName: string; code?: string };
                        Time?: { time: string };
                        FastestLap?: { Time: { time: string } };
                    }>;
            }>;
        };
    };
};

export async function fetchAllMercedesResults(): Promise<RaceResult[]> {
    const all: RaceResult[] = [];
    let offset = 0;
    const limit = 100;

    while (true) {
    const res = await fetch(
        `${BASE}/constructors/mercedes/results/?limit=${limit}&offset=${offset}`
    );
    if (!res.ok) throw new Error(`Jolpica ${res.status}`);
    const data: JolpicaResponse = await res.json();
    const races = data.MRData.RaceTable.Races;

    for (const race of races) {
        for (const r of race.Results) {
            all.push({
                season: race.season,
                round: race.round,
                raceName: race.raceName,
                date: race.date,
                circuit: race.Circuit.circuitName,
                country: race.Circuit.Location.country,
                driver: `${r.Driver.givenName} ${r.Driver.familyName}`,
                driverCode: r.Driver.code ?? "",
                position: r.position,
                positionText: r.positionText,
                points: r.points,
                grid: r.grid,
                status: r.status,
                fastestLap: r.FastestLap?.Time.time ?? null,
                time: r.Time?.time ?? null,
            });
        }
    }

    const total = parseInt(data.MRData.total, 10);
    offset += limit;
    if (offset >= total) break;
    if (offset > 2000) break; // safety
    }

    return all;
}
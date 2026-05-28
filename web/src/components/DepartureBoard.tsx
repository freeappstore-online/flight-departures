import { useEffect, useState, useCallback } from "react";
import type { Airport } from "../data/airports";

export interface Departure {
  flightIata: string;
  airline: string;
  destination: string;
  destinationIata: string;
  scheduledTime: string;
  estimatedTime: string;
  status: "On Time" | "Delayed" | "Departed" | "Cancelled" | "Boarding" | "Unknown";
  terminal?: string;
  gate?: string;
  aircraft?: string;
}

// Simulate realistic flight data based on airport + current time
function generateDepartures(airport: Airport): Departure[] {
  const now = new Date();
  const airlines: Record<string, string[]> = {
    US: ["American Airlines", "Delta Air Lines", "United Airlines", "Southwest Airlines", "JetBlue", "Alaska Airlines", "Spirit Airlines", "Frontier Airlines"],
    GB: ["British Airways", "EasyJet", "Virgin Atlantic", "Ryanair", "Jet2"],
    FR: ["Air France", "EasyJet", "Transavia", "Corsair"],
    DE: ["Lufthansa", "Eurowings", "Condor", "TUIfly"],
    NL: ["KLM", "Transavia", "Corendon"],
    ES: ["Iberia", "Vueling", "Ryanair", "Air Europa"],
    AE: ["Emirates", "flydubai", "Air Arabia", "Etihad Airways"],
    QA: ["Qatar Airways"],
    JP: ["Japan Airlines", "ANA", "Peach Aviation", "Jetstar Japan"],
    CN: ["Air China", "China Eastern", "China Southern", "Hainan Airlines"],
    SG: ["Singapore Airlines", "Scoot", "Jetstar Asia"],
    AU: ["Qantas", "Virgin Australia", "Jetstar", "Rex Airlines"],
    IN: ["IndiGo", "Air India", "SpiceJet", "Vistara"],
    TR: ["Turkish Airlines", "Pegasus Airlines", "SunExpress"],
    CA: ["Air Canada", "WestJet", "Porter Airlines", "Flair Airlines"],
    BR: ["LATAM Brasil", "Gol", "Azul", "Avianca Brasil"],
    KR: ["Korean Air", "Asiana Airlines", "Jeju Air", "Jin Air"],
    TH: ["Thai Airways", "Bangkok Airways", "Thai AirAsia", "Nok Air"],
    DEFAULT: ["International Airlines", "Global Airways", "Sky Express", "Air Connect"],
  };

  const destinationsByRegion: Record<string, { city: string; iata: string }[]> = {
    US: [
      { city: "New York", iata: "JFK" }, { city: "Los Angeles", iata: "LAX" }, { city: "Chicago", iata: "ORD" },
      { city: "Miami", iata: "MIA" }, { city: "Dallas", iata: "DFW" }, { city: "San Francisco", iata: "SFO" },
      { city: "Seattle", iata: "SEA" }, { city: "Boston", iata: "BOS" }, { city: "Denver", iata: "DEN" },
      { city: "Las Vegas", iata: "LAS" }, { city: "Orlando", iata: "MCO" }, { city: "Phoenix", iata: "PHX" },
    ],
    EUROPE: [
      { city: "London", iata: "LHR" }, { city: "Paris", iata: "CDG" }, { city: "Amsterdam", iata: "AMS" },
      { city: "Frankfurt", iata: "FRA" }, { city: "Madrid", iata: "MAD" }, { city: "Barcelona", iata: "BCN" },
      { city: "Rome", iata: "FCO" }, { city: "Zurich", iata: "ZRH" }, { city: "Vienna", iata: "VIE" },
      { city: "Munich", iata: "MUC" }, { city: "Brussels", iata: "BRU" }, { city: "Lisbon", iata: "LIS" },
    ],
    ASIA: [
      { city: "Dubai", iata: "DXB" }, { city: "Singapore", iata: "SIN" }, { city: "Tokyo", iata: "NRT" },
      { city: "Hong Kong", iata: "HKG" }, { city: "Bangkok", iata: "BKK" }, { city: "Seoul", iata: "ICN" },
      { city: "Doha", iata: "DOH" }, { city: "Kuala Lumpur", iata: "KUL" }, { city: "Shanghai", iata: "PVG" },
      { city: "Mumbai", iata: "BOM" }, { city: "Delhi", iata: "DEL" }, { city: "Istanbul", iata: "IST" },
    ],
  };

  const countryAirlines = airlines[airport.country] || airlines.DEFAULT;
  const allDests = [...destinationsByRegion.US, ...destinationsByRegion.EUROPE, ...destinationsByRegion.ASIA];
  const dests = allDests.filter((d) => d.iata !== airport.iata);

  const statuses: Departure["status"][] = ["On Time", "On Time", "On Time", "Delayed", "Departed", "Boarding", "Cancelled", "On Time"];
  const terminals = ["1", "2", "3", "A", "B", "C", "D", "E", "T1", "T2", "T3"];
  const gates = ["A1","A2","A3","A4","A5","B1","B2","B3","B4","B5","C1","C2","C3","D1","D2","D3","E1","E2","F1","F2","G1","G2"];
  const aircraft = ["Boeing 737", "Boeing 777", "Boeing 787", "Airbus A320", "Airbus A321", "Airbus A330", "Airbus A350", "Airbus A380", "Embraer E175", "CRJ-900"];

  // Seed based on airport so data is consistent per airport
  const seed = airport.iata.charCodeAt(0) + airport.iata.charCodeAt(1) + airport.iata.charCodeAt(2);

  const departures: Departure[] = [];
  for (let i = 0; i < 20; i++) {
    const minutesFromNow = -30 + i * 18 + ((seed * (i + 1)) % 12);
    const scheduledDate = new Date(now.getTime() + minutesFromNow * 60000);
    const delayMinutes = [0, 0, 0, 15, 25, 45, 0, 0, 10, 0][i % 10];
    const estimatedDate = new Date(scheduledDate.getTime() + delayMinutes * 60000);

    const destIndex = (seed * (i + 3) + i * 7) % dests.length;
    const dest = dests[destIndex];
    const airlineIndex = (seed + i * 3) % countryAirlines.length;
    const airline = countryAirlines[airlineIndex];

    // Generate flight number
    const airlineCode = airline.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const flightNum = 100 + ((seed * (i + 1) * 17) % 900);
    const flightIata = `${airlineCode}${flightNum}`;

    let status: Departure["status"] = statuses[(seed + i) % statuses.length];
    if (minutesFromNow < -5 && status !== "Cancelled") status = "Departed";
    if (minutesFromNow > -5 && minutesFromNow < 20 && status === "On Time") status = "Boarding";
    if (delayMinutes > 0 && status !== "Departed" && status !== "Cancelled") status = "Delayed";

    departures.push({
      flightIata,
      airline,
      destination: dest.city,
      destinationIata: dest.iata,
      scheduledTime: formatTime(scheduledDate),
      estimatedTime: formatTime(estimatedDate),
      status,
      terminal: terminals[(seed + i * 2) % terminals.length],
      gate: gates[(seed * 2 + i * 3) % gates.length],
      aircraft: aircraft[(seed + i) % aircraft.length],
    });
  }

  return departures.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

const STATUS_STYLES: Record<Departure["status"], { bg: string; color: string; dot: string }> = {
  "On Time":  { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  "Boarding": { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  "Departed": { bg: "#f9fafb", color: "#6b7280", dot: "#9ca3af" },
  "Delayed":  { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  "Cancelled":{ bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
  "Unknown":  { bg: "#f9fafb", color: "#6b7280", dot: "#9ca3af" },
};

interface DepartureBoardProps {
  airport: Airport;
}

export function DepartureBoard({ airport }: DepartureBoardProps) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filter, setFilter] = useState<"all" | "departing" | "delayed">("all");
  const [search, setSearch] = useState("");

  const loadDepartures = useCallback(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setDepartures(generateDepartures(airport));
      setLastUpdated(new Date());
      setLoading(false);
    }, 800);
  }, [airport]);

  useEffect(() => {
    loadDepartures();
    const interval = setInterval(loadDepartures, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [loadDepartures]);

  const filtered = departures.filter((d) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "departing" && (d.status === "On Time" || d.status === "Boarding")) ||
      (filter === "delayed" && d.status === "Delayed");
    const matchesSearch =
      !search ||
      d.destination.toLowerCase().includes(search.toLowerCase()) ||
      d.destinationIata.toLowerCase().includes(search.toLowerCase()) ||
      d.flightIata.toLowerCase().includes(search.toLowerCase()) ||
      d.airline.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Airport header */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>
                {airport.iata}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                {airport.icao}
              </span>
            </div>
            <div className="text-base font-semibold opacity-90">{airport.name}</div>
            <div className="text-sm opacity-70 mt-0.5">
              {airport.city}, {airport.country}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-70 mb-1">Last updated</div>
            <div className="text-sm font-semibold">{formatTime(lastUpdated)}</div>
            <button
              onClick={loadDepartures}
              className="mt-2 text-xs px-3 py-1 rounded-lg font-medium transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: departures.length, color: "var(--ink)" },
          { label: "On Time", value: departures.filter(d => d.status === "On Time" || d.status === "Boarding").length, color: "#15803d" },
          { label: "Delayed", value: departures.filter(d => d.status === "Delayed").length, color: "#c2410c" },
          { label: "Departed", value: departures.filter(d => d.status === "Departed").length, color: "var(--muted)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <div className="text-xl font-bold" style={{ color: stat.color, fontFamily: "Fraunces, serif" }}>
              {stat.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2">
          {(["all", "departing", "delayed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors"
              style={{
                background: filter === f ? "var(--accent)" : "var(--panel)",
                color: filter === f ? "#fff" : "var(--ink)",
                border: "1px solid var(--line)",
              }}
            >
              {f === "all" ? "All Flights" : f === "departing" ? "✈ Departing" : "⚠ Delayed"}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search flight, destination, airline…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        />
      </div>

      {/* Departure table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "var(--line)", borderTopColor: "var(--accent)" }}
          />
          <p style={{ color: "var(--muted)" }} className="text-sm">Loading departures…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">No flights match your filter</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--line)" }}
        >
          {/* Table header - desktop */}
          <div
            className="hidden md:grid grid-cols-[80px_1fr_160px_90px_90px_110px_70px_70px] gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{ background: "var(--panel)", color: "var(--muted)", borderBottom: "1px solid var(--line)" }}
          >
            <div>Flight</div>
            <div>Destination</div>
            <div>Airline</div>
            <div>Scheduled</div>
            <div>Estimated</div>
            <div>Status</div>
            <div>Terminal</div>
            <div>Gate</div>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ divideColor: "var(--line)" }}>
            {filtered.map((dep, idx) => {
              const style = STATUS_STYLES[dep.status];
              return (
                <div
                  key={`${dep.flightIata}-${idx}`}
                  className="px-5 py-3.5"
                  style={{ background: idx % 2 === 0 ? "var(--paper)" : "var(--panel)" }}
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[80px_1fr_160px_90px_90px_110px_70px_70px] gap-3 items-center">
                    <div className="font-bold text-sm" style={{ color: "var(--ink)" }}>{dep.flightIata}</div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{dep.destination}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{dep.destinationIata} · {dep.aircraft}</div>
                    </div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>{dep.airline}</div>
                    <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>{dep.scheduledTime}</div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: dep.status === "Delayed" ? "#c2410c" : "var(--ink)" }}
                    >
                      {dep.estimatedTime}
                    </div>
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: style.bg, color: style.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: style.dot }}
                        />
                        {dep.status}
                      </span>
                    </div>
                    <div className="text-sm text-center" style={{ color: "var(--muted)" }}>{dep.terminal}</div>
                    <div className="text-sm font-semibold text-center" style={{ color: "var(--ink)" }}>{dep.gate}</div>
                  </div>

                  {/* Mobile row */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-bold text-sm mr-2" style={{ color: "var(--ink)" }}>{dep.flightIata}</span>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>{dep.airline}</span>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: style.bg, color: style.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                        {dep.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-base" style={{ color: "var(--ink)" }}>
                          ✈ {dep.destination}
                          <span className="text-xs font-normal ml-1" style={{ color: "var(--muted)" }}>({dep.destinationIata})</span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{dep.aircraft}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: "var(--ink)", fontFamily: "Fraunces, serif" }}>
                          {dep.scheduledTime}
                        </div>
                        {dep.status === "Delayed" && (
                          <div className="text-xs" style={{ color: "#c2410c" }}>Est. {dep.estimatedTime}</div>
                        )}
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          T{dep.terminal} · Gate {dep.gate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-center mt-6" style={{ color: "var(--muted)" }}>
        ⚠️ Simulated data for demonstration purposes. Always verify with the official airport website.
      </p>
    </div>
  );
}

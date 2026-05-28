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

const STATUS_STYLES: Record<Departure["status"], { bg: string; color: string; dot: string }> = {
  "On Time":  { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  "Boarding": { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  "Departed": { bg: "#f9fafb", color: "#6b7280", dot: "#9ca3af" },
  "Delayed":  { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  "Cancelled":{ bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
  "Unknown":  { bg: "#f9fafb", color: "#6b7280", dot: "#9ca3af" },
};

function formatTime(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "—";
  }
}

function mapStatus(flight: AviationStackFlight): Departure["status"] {
  const s = (flight.flight_status || "").toLowerCase();
  if (s === "active") return "Boarding";
  if (s === "landed") return "Departed";
  if (s === "cancelled") return "Cancelled";
  if (s === "scheduled") {
    const dep = flight.departure?.estimated || flight.departure?.scheduled;
    if (dep) {
      const diff = (new Date(dep).getTime() - Date.now()) / 60000;
      if (diff < 30 && diff > 0) return "Boarding";
    }
    const delay = flight.departure?.delay ?? 0;
    return delay > 0 ? "Delayed" : "On Time";
  }
  if (s === "diverted") return "Delayed";
  return "Unknown";
}

interface AviationStackFlight {
  flight_status: string;
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
    estimated: string;
    actual: string | null;
    delay: number | null;
    terminal: string | null;
    gate: string | null;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
    estimated: string;
    terminal: string | null;
  };
  airline: {
    name: string;
    iata: string;
  };
  flight: {
    iata: string;
    icao: string;
  };
  aircraft?: {
    registration: string;
    iata: string;
  } | null;
}

interface AviationStackResponse {
  data: AviationStackFlight[];
  error?: { message: string };
  pagination?: { total: number };
}

async function fetchDepartures(airport: Airport, apiKey: string): Promise<Departure[]> {
  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${airport.iata}&flight_status=scheduled,active,landed&limit=50`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json: AviationStackResponse = await res.json();
  if (json.error) throw new Error(json.error.message);

  return (json.data || [])
    .filter((f) => f.departure?.iata === airport.iata)
    .map((f): Departure => ({
      flightIata: f.flight?.iata || "—",
      airline: f.airline?.name || "Unknown",
      destination: f.arrival?.airport || "Unknown",
      destinationIata: f.arrival?.iata || "—",
      scheduledTime: formatTime(f.departure?.scheduled),
      estimatedTime: formatTime(f.departure?.estimated || f.departure?.scheduled),
      status: mapStatus(f),
      terminal: f.departure?.terminal ?? undefined,
      gate: f.departure?.gate ?? undefined,
      aircraft: f.aircraft?.iata ?? undefined,
    }))
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
}

interface DepartureBoardProps {
  airport: Airport;
  apiKey: string;
}

export function DepartureBoard({ airport, apiKey }: DepartureBoardProps) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"all" | "departing" | "delayed">("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDepartures(airport, apiKey);
      setDepartures(data);
      setLastUpdated(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load departures");
    } finally {
      setLoading(false);
    }
  }, [airport, apiKey]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 120000);
    return () => clearInterval(interval);
  }, [load]);

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
      <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--accent)", color: "#fff" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>
                {airport.iata}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
                {airport.icao}
              </span>
            </div>
            <div className="text-base font-semibold opacity-90">{airport.name}</div>
            <div className="text-sm opacity-70 mt-0.5">{airport.city}, {airport.country}</div>
          </div>
          <div className="text-right">
            {lastUpdated && (
              <>
                <div className="text-xs opacity-70 mb-1">Last updated</div>
                <div className="text-sm font-semibold">
                  {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                </div>
              </>
            )}
            <button
              onClick={load}
              disabled={loading}
              className="mt-2 text-xs px-3 py-1 rounded-lg font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {loading ? "Loading…" : "↻ Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
          <span className="text-xl shrink-0">⚠️</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: "#b91c1c" }}>Failed to load departures</div>
            <div className="text-xs mt-0.5" style={{ color: "#b91c1c" }}>{error}</div>
            <button onClick={load} className="text-xs mt-2 underline" style={{ color: "#b91c1c" }}>Try again</button>
          </div>
        </div>
      )}

      {/* Stats row */}
      {!loading && !error && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: departures.length, color: "var(--ink)" },
            { label: "On Time", value: departures.filter(d => d.status === "On Time" || d.status === "Boarding").length, color: "#15803d" },
            { label: "Delayed", value: departures.filter(d => d.status === "Delayed").length, color: "#c2410c" },
            { label: "Departed", value: departures.filter(d => d.status === "Departed").length, color: "var(--muted)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              <div className="text-xl font-bold" style={{ color: stat.color, fontFamily: "Fraunces, serif" }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

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
          style={{ background: "var(--panel)", border: "1px solid var(--line)", color: "var(--ink)" }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "var(--line)", borderTopColor: "var(--accent)" }} />
          <p style={{ color: "var(--muted)" }} className="text-sm">Loading live departures…</p>
        </div>
      ) : !error && filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">No flights match your filter</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : !error && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
          {/* Desktop header */}
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

          <div className="divide-y" style={{ borderColor: "var(--line)" }}>
            {filtered.map((dep, idx) => {
              const style = STATUS_STYLES[dep.status];
              return (
                <div
                  key={`${dep.flightIata}-${idx}`}
                  className="px-5 py-3.5"
                  style={{ background: idx % 2 === 0 ? "var(--paper)" : "var(--panel)" }}
                >
                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-[80px_1fr_160px_90px_90px_110px_70px_70px] gap-3 items-center">
                    <div className="font-bold text-sm" style={{ color: "var(--ink)" }}>{dep.flightIata}</div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{dep.destination}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{dep.destinationIata}{dep.aircraft ? ` · ${dep.aircraft}` : ""}</div>
                    </div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>{dep.airline}</div>
                    <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>{dep.scheduledTime}</div>
                    <div className="text-sm font-medium" style={{ color: dep.status === "Delayed" ? "#c2410c" : "var(--ink)" }}>
                      {dep.estimatedTime}
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: style.bg, color: style.color }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: style.dot }} />
                        {dep.status}
                      </span>
                    </div>
                    <div className="text-sm text-center" style={{ color: "var(--muted)" }}>{dep.terminal ?? "—"}</div>
                    <div className="text-sm font-semibold text-center" style={{ color: "var(--ink)" }}>{dep.gate ?? "—"}</div>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-bold text-sm mr-2" style={{ color: "var(--ink)" }}>{dep.flightIata}</span>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>{dep.airline}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: style.bg, color: style.color }}>
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
                        {dep.aircraft && <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{dep.aircraft}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: "var(--ink)", fontFamily: "Fraunces, serif" }}>
                          {dep.scheduledTime}
                        </div>
                        {dep.status === "Delayed" && (
                          <div className="text-xs" style={{ color: "#c2410c" }}>Est. {dep.estimatedTime}</div>
                        )}
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {dep.terminal ? `T${dep.terminal}` : ""}{dep.gate ? ` · Gate ${dep.gate}` : ""}
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
        Live data via AviationStack · Refreshes every 2 minutes
      </p>
    </div>
  );
}

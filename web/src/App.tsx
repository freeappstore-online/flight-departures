import { useState, useEffect, useRef } from "react";
import { Shell } from "./components/Shell";
import { DepartureBoard } from "./components/DepartureBoard";
import { searchAirports, AIRPORTS } from "./data/airports";
import type { Airport } from "./data/airports";

const STORAGE_KEY = "flightdep_favorites";
const LAST_AIRPORT_KEY = "flightdep_last_airport";
const API_KEY_STORAGE = "flightdep_apikey";

type View = "board" | "favorites" | "settings";

function FlagEmoji({ country }: { country: string }) {
  const code = country.toUpperCase();
  const flag = code
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e0 - 65 + c.charCodeAt(0)))
    .join("");
  return <span>{flag}</span>;
}

export default function App() {
  const [view, setView] = useState<View>("board");
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [favorites, setFavorites] = useState<Airport[]>([]);
  const [apiKey, setApiKey] = useState<string>("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved state
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem(STORAGE_KEY);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      const lastIata = localStorage.getItem(LAST_AIRPORT_KEY);
      if (lastIata) {
        const airport = AIRPORTS.find((a) => a.iata === lastIata);
        if (airport) setSelectedAirport(airport);
      }
      const savedKey = localStorage.getItem(API_KEY_STORAGE);
      if (savedKey) setApiKey(savedKey);
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { if (selectedAirport) localStorage.setItem(LAST_AIRPORT_KEY, selectedAirport.iata); }, [selectedAirport]);

  // Search
  useEffect(() => {
    if (query.length >= 2) { setResults(searchAirports(query)); setShowDropdown(true); }
    else { setResults([]); setShowDropdown(false); }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectAirport(airport: Airport) {
    setSelectedAirport(airport);
    setQuery("");
    setShowDropdown(false);
    setView("board");
  }

  function toggleFavorite(airport: Airport) {
    setFavorites((prev) => {
      const exists = prev.find((a) => a.iata === airport.iata);
      return exists ? prev.filter((a) => a.iata !== airport.iata) : [...prev, airport];
    });
  }

  function saveApiKey(key: string) {
    const trimmed = key.trim();
    setApiKey(trimmed);
    localStorage.setItem(API_KEY_STORAGE, trimmed);
  }

  const isFavorite = (airport: Airport) => favorites.some((a) => a.iata === airport.iata);

  const navItems = [
    { icon: "✈️", label: "Departures", active: view === "board", onClick: () => setView("board") },
    { icon: "⭐", label: "Favorites", active: view === "favorites", onClick: () => setView("favorites") },
    { icon: "⚙️", label: "Settings", active: view === "settings", onClick: () => setView("settings") },
  ];

  // No API key → show setup screen
  if (!apiKey) {
    return (
      <Shell navItems={[]} title="Flight Departures">
        <ApiKeySetup onSave={saveApiKey} />
      </Shell>
    );
  }

  return (
    <Shell navItems={navItems} title="Flight Departures">
      {/* Airport Search Bar */}
      <div
        className="sticky top-0 z-10 px-4 md:px-8 py-3 border-b"
        style={{ background: "var(--paper)", borderColor: "var(--line)" }}
      >
        <div className="max-w-5xl mx-auto relative">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search airport by name, city or IATA code…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none font-medium"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
            />
            {selectedAirport && !query && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--accent)" }}>
                <FlagEmoji country={selectedAirport.country} />
                {selectedAirport.iata} — {selectedAirport.city}
              </div>
            )}
          </div>

          {showDropdown && results.length > 0 && (
            <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-lg z-50"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              {results.map((airport) => (
                <button key={airport.iata} onClick={() => selectAirport(airport)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-opacity border-b last:border-0"
                  style={{ borderColor: "var(--line)" }}>
                  <span className="text-2xl font-bold w-12 shrink-0" style={{ color: "var(--accent)", fontFamily: "Fraunces, serif" }}>
                    {airport.iata}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>{airport.name}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{airport.city}, {airport.country} · {airport.icao}</div>
                  </div>
                  <FlagEmoji country={airport.country} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Views */}
      {view === "board" ? (
        selectedAirport ? (
          <div>
            <div className="flex justify-end px-4 md:px-8 pt-4 max-w-5xl mx-auto">
              <button
                onClick={() => toggleFavorite(selectedAirport)}
                className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: isFavorite(selectedAirport) ? "#fef9c3" : "var(--panel)",
                  color: isFavorite(selectedAirport) ? "#a16207" : "var(--muted)",
                  border: "1px solid var(--line)",
                }}
              >
                {isFavorite(selectedAirport) ? "⭐ Saved" : "☆ Save Airport"}
              </button>
            </div>
            <DepartureBoard airport={selectedAirport} apiKey={apiKey} />
          </div>
        ) : (
          <WelcomeScreen onSelect={selectAirport} favorites={favorites} />
        )
      ) : view === "favorites" ? (
        <FavoritesView favorites={favorites} onSelect={selectAirport} onRemove={toggleFavorite} />
      ) : (
        <SettingsView apiKey={apiKey} onSave={saveApiKey} />
      )}
    </Shell>
  );
}

// ─── API Key Setup ────────────────────────────────────────────────────────────

function ApiKeySetup({ onSave }: { onSave: (key: string) => void }) {
  const [key, setKey] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✈️</div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
            Flight Departures
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Real-time departure data powered by AviationStack
          </p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <h2 className="font-bold text-lg mb-1" style={{ color: "var(--ink)" }}>Enter your API key</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            A free key gives you 500 requests/month — enough for personal use.
          </p>

          <ol className="text-sm space-y-2 mb-5" style={{ color: "var(--muted)" }}>
            <li className="flex gap-2">
              <span className="font-bold shrink-0" style={{ color: "var(--accent)" }}>1.</span>
              Go to{" "}
              <a href="https://aviationstack.com/signup/free" target="_blank" rel="noopener noreferrer"
                className="underline font-medium" style={{ color: "var(--accent)" }}>
                aviationstack.com/signup/free
              </a>
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0" style={{ color: "var(--accent)" }}>2.</span>
              Create a free account (no credit card needed)
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0" style={{ color: "var(--accent)" }}>3.</span>
              Copy your API key from the dashboard and paste it below
            </li>
          </ol>

          <input
            type="text"
            placeholder="Paste your API key here…"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3 font-mono"
            style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
          />

          <button
            onClick={() => key.trim() && onSave(key)}
            disabled={!key.trim()}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Save & Continue →
          </button>

          <p className="text-xs text-center mt-3" style={{ color: "var(--muted)" }}>
            🔒 Your key is stored only in this browser — never sent anywhere else.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────

function SettingsView({ apiKey, onSave }: { apiKey: string; onSave: (key: string) => void }) {
  const [key, setKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
        Settings
      </h2>

      <div className="rounded-2xl p-5" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>AviationStack API Key</h3>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          Stored locally in your browser only.{" "}
          <a href="https://aviationstack.com" target="_blank" rel="noopener noreferrer"
            className="underline" style={{ color: "var(--accent)" }}>
            Get a free key →
          </a>
        </p>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-3 font-mono"
          style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
        />
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: saved ? "#16a34a" : "var(--accent)", color: "#fff" }}
        >
          {saved ? "✓ Saved!" : "Save Key"}
        </button>
      </div>

      <div className="rounded-2xl p-5 mt-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>About</h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Flight Departures shows real-time departure boards for airports worldwide. Data is fetched
          directly from AviationStack's API and refreshed every 2 minutes.
        </p>
      </div>
    </div>
  );
}

// ─── Welcome ─────────────────────────────────────────────────────────────────

function WelcomeScreen({ onSelect, favorites }: { onSelect: (a: Airport) => void; favorites: Airport[] }) {
  const popular = AIRPORTS.filter((a) =>
    ["LHR", "JFK", "DXB", "CDG", "SIN", "LAX", "NRT", "FRA", "AMS", "DFW"].includes(a.iata)
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="text-center py-10">
        <div className="text-6xl mb-4">✈️</div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
          Flight Departures
        </h1>
        <p className="text-base max-w-md mx-auto" style={{ color: "var(--muted)" }}>
          Search for any airport above to see live departure information, flight statuses, gates and more.
        </p>
      </div>

      {favorites.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            ⭐ Saved Airports
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {favorites.map((a) => <AirportCard key={a.iata} airport={a} onClick={() => onSelect(a)} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          🌍 Popular Airports
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popular.map((a) => <AirportCard key={a.iata} airport={a} onClick={() => onSelect(a)} />)}
        </div>
      </div>
    </div>
  );
}

function AirportCard({ airport, onClick }: { airport: Airport; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="rounded-xl p-4 text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
      <div className="text-2xl font-bold mb-1" style={{ color: "var(--accent)", fontFamily: "Fraunces, serif" }}>{airport.iata}</div>
      <div className="text-xs font-semibold truncate" style={{ color: "var(--ink)" }}>{airport.city}</div>
      <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{airport.country}</div>
    </button>
  );
}

// ─── Favorites ────────────────────────────────────────────────────────────────

function FavoritesView({ favorites, onSelect, onRemove }: {
  favorites: Airport[];
  onSelect: (a: Airport) => void;
  onRemove: (a: Airport) => void;
}) {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
        Saved Airports
      </h2>
      {favorites.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>
          <div className="text-5xl mb-3">⭐</div>
          <p className="font-medium">No saved airports yet</p>
          <p className="text-sm mt-1">Search for an airport and tap "Save Airport" to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {favorites.map((airport) => (
            <div key={airport.iata} className="rounded-xl p-4 flex items-center gap-4"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "Fraunces, serif" }}>{airport.iata}</span>
                  <FlagEmoji country={airport.country} />
                </div>
                <div className="text-sm font-semibold truncate mt-0.5" style={{ color: "var(--ink)" }}>{airport.name}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{airport.city}, {airport.country}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => onSelect(airport)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--accent)", color: "#fff" }}>
                  View
                </button>
                <button onClick={() => onRemove(airport)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--paper)", color: "var(--muted)", border: "1px solid var(--line)" }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Shell } from "./components/Shell";
import { DepartureBoard } from "./components/DepartureBoard";
import { searchAirports, AIRPORTS } from "./data/airports";
import type { Airport } from "./data/airports";

const STORAGE_KEY = "flightdep_favorites";
const LAST_AIRPORT_KEY = "flightdep_last_airport";

type View = "board" | "favorites";

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
    } catch {}
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save last airport
  useEffect(() => {
    if (selectedAirport) {
      localStorage.setItem(LAST_AIRPORT_KEY, selectedAirport.iata);
    }
  }, [selectedAirport]);

  // Search
  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchAirports(query));
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
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
      if (exists) return prev.filter((a) => a.iata !== airport.iata);
      return [...prev, airport];
    });
  }

  const isFavorite = (airport: Airport) => favorites.some((a) => a.iata === airport.iata);

  const navItems = [
    {
      icon: "✈️",
      label: "Departures",
      active: view === "board",
      onClick: () => setView("board"),
    },
    {
      icon: "⭐",
      label: "Favorites",
      active: view === "favorites",
      onClick: () => setView("favorites"),
    },
  ];

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
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none font-medium transition-shadow"
              style={{
                background: "var(--panel)",
                border: "1.5px solid var(--line)",
                color: "var(--ink)",
              }}
            />
            {selectedAirport && !query && (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--accent)" }}
              >
                <FlagEmoji country={selectedAirport.country} />
                {selectedAirport.iata} — {selectedAirport.city}
              </div>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && results.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-lg z-50"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              {results.map((airport) => (
                <button
                  key={airport.iata}
                  onClick={() => selectAirport(airport)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-opacity border-b last:border-0"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="text-2xl font-bold w-12 shrink-0" style={{ color: "var(--accent)", fontFamily: "Fraunces, serif" }}>
                    {airport.iata}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>
                      {airport.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {airport.city}, {airport.country} · {airport.icao}
                    </div>
                  </div>
                  <FlagEmoji country={airport.country} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      {view === "board" ? (
        selectedAirport ? (
          <div>
            {/* Favorite button */}
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
            <DepartureBoard airport={selectedAirport} />
          </div>
        ) : (
          <WelcomeScreen onSelect={selectAirport} favorites={favorites} />
        )
      ) : (
        <FavoritesView favorites={favorites} onSelect={selectAirport} onRemove={toggleFavorite} />
      )}
    </Shell>
  );
}

function WelcomeScreen({
  onSelect,
  favorites,
}: {
  onSelect: (a: Airport) => void;
  favorites: Airport[];
}) {
  const popular = AIRPORTS.filter((a) =>
    ["LHR", "JFK", "DXB", "CDG", "SIN", "LAX", "NRT", "FRA", "AMS", "DFW"].includes(a.iata)
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="text-center py-10">
        <div className="text-6xl mb-4">✈️</div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
        >
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
            {favorites.map((a) => (
              <AirportCard key={a.iata} airport={a} onClick={() => onSelect(a)} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          🌍 Popular Airports
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popular.map((a) => (
            <AirportCard key={a.iata} airport={a} onClick={() => onSelect(a)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AirportCard({ airport, onClick }: { airport: Airport; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl p-4 text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="text-2xl font-bold mb-1" style={{ color: "var(--accent)", fontFamily: "Fraunces, serif" }}>
        {airport.iata}
      </div>
      <div className="text-xs font-semibold truncate" style={{ color: "var(--ink)" }}>{airport.city}</div>
      <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{airport.country}</div>
    </button>
  );
}

function FavoritesView({
  favorites,
  onSelect,
  onRemove,
}: {
  favorites: Airport[];
  onSelect: (a: Airport) => void;
  onRemove: (a: Airport) => void;
}) {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
      >
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
            <div
              key={airport.iata}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "Fraunces, serif" }}>
                    {airport.iata}
                  </span>
                  <FlagEmoji country={airport.country} />
                </div>
                <div className="text-sm font-semibold truncate mt-0.5" style={{ color: "var(--ink)" }}>
                  {airport.name}
                </div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  {airport.city}, {airport.country}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => onSelect(airport)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  View
                </button>
                <button
                  onClick={() => onRemove(airport)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--paper)", color: "var(--muted)", border: "1px solid var(--line)" }}
                >
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

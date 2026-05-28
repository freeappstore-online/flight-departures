export interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

// Top 120 busiest airports worldwide
export const AIRPORTS: Airport[] = [
  { iata: "ATL", icao: "KATL", name: "Hartsfield–Jackson Atlanta International", city: "Atlanta", country: "US", lat: 33.6407, lon: -84.4277 },
  { iata: "DFW", icao: "KDFW", name: "Dallas/Fort Worth International", city: "Dallas", country: "US", lat: 32.8998, lon: -97.0403 },
  { iata: "DEN", icao: "KDEN", name: "Denver International", city: "Denver", country: "US", lat: 39.8561, lon: -104.6737 },
  { iata: "ORD", icao: "KORD", name: "O'Hare International", city: "Chicago", country: "US", lat: 41.9742, lon: -87.9073 },
  { iata: "LAX", icao: "KLAX", name: "Los Angeles International", city: "Los Angeles", country: "US", lat: 33.9425, lon: -118.4081 },
  { iata: "JFK", icao: "KJFK", name: "John F. Kennedy International", city: "New York", country: "US", lat: 40.6413, lon: -73.7781 },
  { iata: "LAS", icao: "KLAS", name: "Harry Reid International", city: "Las Vegas", country: "US", lat: 36.0840, lon: -115.1537 },
  { iata: "MCO", icao: "KMCO", name: "Orlando International", city: "Orlando", country: "US", lat: 28.4294, lon: -81.3089 },
  { iata: "MIA", icao: "KMIA", name: "Miami International", city: "Miami", country: "US", lat: 25.7959, lon: -80.2870 },
  { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas International", city: "Charlotte", country: "US", lat: 35.2140, lon: -80.9431 },
  { iata: "SEA", icao: "KSEA", name: "Seattle-Tacoma International", city: "Seattle", country: "US", lat: 47.4502, lon: -122.3088 },
  { iata: "PHX", icao: "KPHX", name: "Phoenix Sky Harbor International", city: "Phoenix", country: "US", lat: 33.4373, lon: -112.0078 },
  { iata: "EWR", icao: "KEWR", name: "Newark Liberty International", city: "Newark", country: "US", lat: 40.6895, lon: -74.1745 },
  { iata: "SFO", icao: "KSFO", name: "San Francisco International", city: "San Francisco", country: "US", lat: 37.6213, lon: -122.3790 },
  { iata: "IAH", icao: "KIAH", name: "George Bush Intercontinental", city: "Houston", country: "US", lat: 29.9902, lon: -95.3368 },
  { iata: "BOS", icao: "KBOS", name: "Boston Logan International", city: "Boston", country: "US", lat: 42.3656, lon: -71.0096 },
  { iata: "MSP", icao: "KMSP", name: "Minneapolis–Saint Paul International", city: "Minneapolis", country: "US", lat: 44.8848, lon: -93.2223 },
  { iata: "DTW", icao: "KDTW", name: "Detroit Metropolitan Wayne County", city: "Detroit", country: "US", lat: 42.2162, lon: -83.3554 },
  { iata: "FLL", icao: "KFLL", name: "Fort Lauderdale–Hollywood International", city: "Fort Lauderdale", country: "US", lat: 26.0726, lon: -80.1527 },
  { iata: "PHL", icao: "KPHL", name: "Philadelphia International", city: "Philadelphia", country: "US", lat: 39.8744, lon: -75.2424 },
  { iata: "LGA", icao: "KLGA", name: "LaGuardia Airport", city: "New York", country: "US", lat: 40.7769, lon: -73.8740 },
  { iata: "BWI", icao: "KBWI", name: "Baltimore/Washington International", city: "Baltimore", country: "US", lat: 39.1754, lon: -76.6683 },
  { iata: "DCA", icao: "KDCA", name: "Ronald Reagan Washington National", city: "Washington", country: "US", lat: 38.8512, lon: -77.0402 },
  { iata: "IAD", icao: "KIAD", name: "Washington Dulles International", city: "Washington", country: "US", lat: 38.9531, lon: -77.4565 },
  { iata: "MDW", icao: "KMDW", name: "Chicago Midway International", city: "Chicago", country: "US", lat: 41.7868, lon: -87.7522 },
  { iata: "SAN", icao: "KSAN", name: "San Diego International", city: "San Diego", country: "US", lat: 32.7338, lon: -117.1933 },
  { iata: "TPA", icao: "KTPA", name: "Tampa International", city: "Tampa", country: "US", lat: 27.9755, lon: -82.5332 },
  { iata: "AUS", icao: "KAUS", name: "Austin-Bergstrom International", city: "Austin", country: "US", lat: 30.1945, lon: -97.6699 },
  { iata: "BNA", icao: "KBNA", name: "Nashville International", city: "Nashville", country: "US", lat: 36.1245, lon: -86.6782 },
  { iata: "PDX", icao: "KPDX", name: "Portland International", city: "Portland", country: "US", lat: 45.5887, lon: -122.5975 },
  // Europe
  { iata: "LHR", icao: "EGLL", name: "London Heathrow", city: "London", country: "GB", lat: 51.4775, lon: -0.4614 },
  { iata: "CDG", icao: "LFPG", name: "Paris Charles de Gaulle", city: "Paris", country: "FR", lat: 49.0097, lon: 2.5479 },
  { iata: "AMS", icao: "EHAM", name: "Amsterdam Schiphol", city: "Amsterdam", country: "NL", lat: 52.3086, lon: 4.7639 },
  { iata: "FRA", icao: "EDDF", name: "Frankfurt Airport", city: "Frankfurt", country: "DE", lat: 50.0379, lon: 8.5622 },
  { iata: "MAD", icao: "LEMD", name: "Adolfo Suárez Madrid–Barajas", city: "Madrid", country: "ES", lat: 40.4936, lon: -3.5668 },
  { iata: "BCN", icao: "LEBL", name: "Barcelona–El Prat", city: "Barcelona", country: "ES", lat: 41.2974, lon: 2.0833 },
  { iata: "MUC", icao: "EDDM", name: "Munich Airport", city: "Munich", country: "DE", lat: 48.3538, lon: 11.7861 },
  { iata: "FCO", icao: "LIRF", name: "Leonardo da Vinci–Fiumicino", city: "Rome", country: "IT", lat: 41.8003, lon: 12.2389 },
  { iata: "LGW", icao: "EGKK", name: "London Gatwick", city: "London", country: "GB", lat: 51.1481, lon: -0.1903 },
  { iata: "ZRH", icao: "LSZH", name: "Zurich Airport", city: "Zurich", country: "CH", lat: 47.4647, lon: 8.5492 },
  { iata: "VIE", icao: "LOWW", name: "Vienna International", city: "Vienna", country: "AT", lat: 48.1103, lon: 16.5697 },
  { iata: "BRU", icao: "EBBR", name: "Brussels Airport", city: "Brussels", country: "BE", lat: 50.9014, lon: 4.4844 },
  { iata: "CPH", icao: "EKCH", name: "Copenhagen Airport", city: "Copenhagen", country: "DK", lat: 55.6180, lon: 12.6508 },
  { iata: "OSL", icao: "ENGM", name: "Oslo Gardermoen", city: "Oslo", country: "NO", lat: 60.1939, lon: 11.1004 },
  { iata: "ARN", icao: "ESSA", name: "Stockholm Arlanda", city: "Stockholm", country: "SE", lat: 59.6519, lon: 17.9186 },
  { iata: "HEL", icao: "EFHK", name: "Helsinki-Vantaa", city: "Helsinki", country: "FI", lat: 60.3172, lon: 24.9633 },
  { iata: "LIS", icao: "LPPT", name: "Lisbon Humberto Delgado", city: "Lisbon", country: "PT", lat: 38.7813, lon: -9.1359 },
  { iata: "ATH", icao: "LGAV", name: "Athens International", city: "Athens", country: "GR", lat: 37.9364, lon: 23.9445 },
  { iata: "DUB", icao: "EIDW", name: "Dublin Airport", city: "Dublin", country: "IE", lat: 53.4213, lon: -6.2700 },
  { iata: "MAN", icao: "EGCC", name: "Manchester Airport", city: "Manchester", country: "GB", lat: 53.3537, lon: -2.2750 },
  { iata: "WAW", icao: "EPWA", name: "Warsaw Chopin Airport", city: "Warsaw", country: "PL", lat: 52.1657, lon: 20.9671 },
  { iata: "PRG", icao: "LKPR", name: "Václav Havel Airport Prague", city: "Prague", country: "CZ", lat: 50.1008, lon: 14.2600 },
  { iata: "BUD", icao: "LHBP", name: "Budapest Ferenc Liszt International", city: "Budapest", country: "HU", lat: 47.4298, lon: 19.2611 },
  // Asia-Pacific
  { iata: "DXB", icao: "OMDB", name: "Dubai International", city: "Dubai", country: "AE", lat: 25.2532, lon: 55.3657 },
  { iata: "HND", icao: "RJTT", name: "Tokyo Haneda", city: "Tokyo", country: "JP", lat: 35.5494, lon: 139.7798 },
  { iata: "NRT", icao: "RJAA", name: "Tokyo Narita", city: "Tokyo", country: "JP", lat: 35.7720, lon: 140.3929 },
  { iata: "PEK", icao: "ZBAA", name: "Beijing Capital International", city: "Beijing", country: "CN", lat: 40.0799, lon: 116.6031 },
  { iata: "PKX", icao: "ZBAD", name: "Beijing Daxing International", city: "Beijing", country: "CN", lat: 39.5097, lon: 116.4105 },
  { iata: "PVG", icao: "ZSPD", name: "Shanghai Pudong International", city: "Shanghai", country: "CN", lat: 31.1443, lon: 121.8083 },
  { iata: "HKG", icao: "VHHH", name: "Hong Kong International", city: "Hong Kong", country: "HK", lat: 22.3080, lon: 113.9185 },
  { iata: "SIN", icao: "WSSS", name: "Singapore Changi", city: "Singapore", country: "SG", lat: 1.3644, lon: 103.9915 },
  { iata: "ICN", icao: "RKSI", name: "Incheon International", city: "Seoul", country: "KR", lat: 37.4691, lon: 126.4505 },
  { iata: "BKK", icao: "VTBS", name: "Suvarnabhumi Airport", city: "Bangkok", country: "TH", lat: 13.6811, lon: 100.7472 },
  { iata: "KUL", icao: "WMKK", name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "MY", lat: 2.7456, lon: 101.7099 },
  { iata: "SYD", icao: "YSSY", name: "Sydney Kingsford Smith", city: "Sydney", country: "AU", lat: -33.9399, lon: 151.1753 },
  { iata: "MEL", icao: "YMML", name: "Melbourne Airport", city: "Melbourne", country: "AU", lat: -37.6690, lon: 144.8410 },
  { iata: "MNL", icao: "RPLL", name: "Ninoy Aquino International", city: "Manila", country: "PH", lat: 14.5086, lon: 121.0197 },
  { iata: "CGK", icao: "WIII", name: "Soekarno-Hatta International", city: "Jakarta", country: "ID", lat: -6.1256, lon: 106.6559 },
  { iata: "DEL", icao: "VIDP", name: "Indira Gandhi International", city: "New Delhi", country: "IN", lat: 28.5665, lon: 77.1031 },
  { iata: "BOM", icao: "VABB", name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai", country: "IN", lat: 19.0896, lon: 72.8656 },
  { iata: "DOH", icao: "OTHH", name: "Hamad International", city: "Doha", country: "QA", lat: 25.2731, lon: 51.6081 },
  { iata: "AUH", icao: "OMAA", name: "Abu Dhabi International", city: "Abu Dhabi", country: "AE", lat: 24.4330, lon: 54.6511 },
  { iata: "IST", icao: "LTFM", name: "Istanbul Airport", city: "Istanbul", country: "TR", lat: 41.2753, lon: 28.7519 },
  { iata: "CAI", icao: "HECA", name: "Cairo International", city: "Cairo", country: "EG", lat: 30.1219, lon: 31.4056 },
  { iata: "JNB", icao: "FAOR", name: "O.R. Tambo International", city: "Johannesburg", country: "ZA", lat: -26.1367, lon: 28.2411 },
  // Americas
  { iata: "YYZ", icao: "CYYZ", name: "Toronto Pearson International", city: "Toronto", country: "CA", lat: 43.6777, lon: -79.6248 },
  { iata: "YVR", icao: "CYVR", name: "Vancouver International", city: "Vancouver", country: "CA", lat: 49.1967, lon: -123.1815 },
  { iata: "YUL", icao: "CYUL", name: "Montréal-Trudeau International", city: "Montreal", country: "CA", lat: 45.4706, lon: -73.7408 },
  { iata: "MEX", icao: "MMMX", name: "Mexico City International", city: "Mexico City", country: "MX", lat: 19.4363, lon: -99.0721 },
  { iata: "GRU", icao: "SBGR", name: "São Paulo/Guarulhos International", city: "São Paulo", country: "BR", lat: -23.4356, lon: -46.4731 },
  { iata: "BOG", icao: "SKBO", name: "El Dorado International", city: "Bogotá", country: "CO", lat: 4.7016, lon: -74.1469 },
  { iata: "SCL", icao: "SCEL", name: "Arturo Merino Benítez International", city: "Santiago", country: "CL", lat: -33.3930, lon: -70.7858 },
  { iata: "EZE", icao: "SAEZ", name: "Ministro Pistarini International", city: "Buenos Aires", country: "AR", lat: -34.8222, lon: -58.5358 },
  { iata: "LIM", icao: "SPJC", name: "Jorge Chávez International", city: "Lima", country: "PE", lat: -12.0219, lon: -77.1143 },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().includes(q) ||
      a.icao.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}

import csv
import json
import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
import os


class SyntheticDataGenerator:
    """Generate diverse synthetic data for flights and accommodations tables."""

    def __init__(self):
        self.airlines = [
            "American Airlines",
            "Delta Air Lines",
            "United Airlines",
            "Southwest Airlines",
            "Lufthansa",
            "British Airways",
            "Air France",
            "KLM Royal Dutch Airlines",
            "Emirates",
            "Qatar Airways",
            "Singapore Airlines",
            "Cathay Pacific",
            "Japan Airlines",
            "All Nippon Airways",
            "Korean Air",
            "Thai Airways",
            "Turkish Airlines",
            "Saudia",
            "Etihad Airways",
            "Qantas",
            "Air Canada",
            "WestJet",
            "Aeromexico",
            "LATAM Airlines",
            "Virgin Atlantic",
            "Iberia",
            "Alitalia",
            "Scandinavian Airlines",
        ]

        self.aircraft_types = [
            "Boeing 737",
            "Boeing 747",
            "Boeing 777",
            "Boeing 787",
            "Airbus A320",
            "Airbus A330",
            "Airbus A350",
            "Airbus A380",
            "Bombardier CRJ",
            "Embraer E-Jet",
            "ATR 72",
            "Boeing 757",
        ]

        self.countries_cities = {
            "United States": {
                "states": [
                    "California",
                    "New York",
                    "Texas",
                    "Florida",
                    "Illinois",
                    "Pennsylvania",
                    "Ohio",
                    "Georgia",
                ],
                "cities": {
                    "California": [
                        "Los Angeles",
                        "San Francisco",
                        "San Diego",
                        "Sacramento",
                        "Fresno",
                    ],
                    "New York": [
                        "New York City",
                        "Buffalo",
                        "Rochester",
                        "Syracuse",
                        "Albany",
                    ],
                    "Texas": [
                        "Houston",
                        "Dallas",
                        "Austin",
                        "San Antonio",
                        "Fort Worth",
                    ],
                    "Florida": [
                        "Miami",
                        "Orlando",
                        "Tampa",
                        "Jacksonville",
                        "Tallahassee",
                    ],
                    "Illinois": [
                        "Chicago",
                        "Aurora",
                        "Rockford",
                        "Joliet",
                        "Naperville",
                    ],
                    "Pennsylvania": [
                        "Philadelphia",
                        "Pittsburgh",
                        "Allentown",
                        "Erie",
                        "Reading",
                    ],
                    "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
                    "Georgia": ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
                },
            },
            "United Kingdom": {
                "states": ["England", "Scotland", "Wales", "Northern Ireland"],
                "cities": {
                    "England": [
                        "London",
                        "Birmingham",
                        "Manchester",
                        "Liverpool",
                        "Leeds",
                    ],
                    "Scotland": [
                        "Edinburgh",
                        "Glasgow",
                        "Aberdeen",
                        "Dundee",
                        "Stirling",
                    ],
                    "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
                    "Northern Ireland": [
                        "Belfast",
                        "Derry",
                        "Lisburn",
                        "Newtownabbey",
                        "Bangor",
                    ],
                },
            },
            "France": {
                "states": [
                    "Île-de-France",
                    "Provence-Alpes-Côte d'Azur",
                    "Auvergne-Rhône-Alpes",
                    "Occitanie",
                    "Nouvelle-Aquitaine",
                ],
                "cities": {
                    "Île-de-France": [
                        "Paris",
                        "Versailles",
                        "Boulogne-Billancourt",
                        "Saint-Denis",
                        "Argenteuil",
                    ],
                    "Provence-Alpes-Côte d'Azur": [
                        "Marseille",
                        "Nice",
                        "Toulon",
                        "Aix-en-Provence",
                        "Avignon",
                    ],
                    "Auvergne-Rhône-Alpes": [
                        "Lyon",
                        "Grenoble",
                        "Saint-Étienne",
                        "Villeurbanne",
                        "Valence",
                    ],
                    "Occitanie": [
                        "Toulouse",
                        "Montpellier",
                        "Nîmes",
                        "Perpignan",
                        "Béziers",
                    ],
                    "Nouvelle-Aquitaine": [
                        "Bordeaux",
                        "Limoges",
                        "Poitiers",
                        "La Rochelle",
                        "Angoulême",
                    ],
                },
            },
            "Germany": {
                "states": [
                    "Bavaria",
                    "Baden-Württemberg",
                    "North Rhine-Westphalia",
                    "Hesse",
                    "Saxony",
                ],
                "cities": {
                    "Bavaria": [
                        "Munich",
                        "Nuremberg",
                        "Augsburg",
                        "Regensburg",
                        "Würzburg",
                    ],
                    "Baden-Württemberg": [
                        "Stuttgart",
                        "Mannheim",
                        "Karlsruhe",
                        "Freiburg",
                        "Heidelberg",
                    ],
                    "North Rhine-Westphalia": [
                        "Cologne",
                        "Düsseldorf",
                        "Dortmund",
                        "Essen",
                        "Duisburg",
                    ],
                    "Hesse": [
                        "Frankfurt",
                        "Wiesbaden",
                        "Kassel",
                        "Darmstadt",
                        "Offenbach",
                    ],
                    "Saxony": ["Dresden", "Leipzig", "Chemnitz", "Zwickau", "Plauen"],
                },
            },
            "Japan": {
                "states": ["Tokyo", "Osaka", "Kyoto", "Hokkaido", "Fukuoka"],
                "cities": {
                    "Tokyo": ["Shibuya", "Shinjuku", "Ginza", "Harajuku", "Roppongi"],
                    "Osaka": ["Namba", "Umeda", "Shinsaibashi", "Dotonbori", "Tennoji"],
                    "Kyoto": [
                        "Gion",
                        "Arashiyama",
                        "Higashiyama",
                        "Fushimi",
                        "Nishiki",
                    ],
                    "Hokkaido": [
                        "Sapporo",
                        "Hakodate",
                        "Asahikawa",
                        "Kushiro",
                        "Obihiro",
                    ],
                    "Fukuoka": ["Hakata", "Tenjin", "Daimyo", "Nakasu", "Ohori"],
                },
            },
            "Australia": {
                "states": [
                    "New South Wales",
                    "Victoria",
                    "Queensland",
                    "Western Australia",
                    "South Australia",
                ],
                "cities": {
                    "New South Wales": [
                        "Sydney",
                        "Newcastle",
                        "Wollongong",
                        "Wagga Wagga",
                        "Albury",
                    ],
                    "Victoria": [
                        "Melbourne",
                        "Geelong",
                        "Ballarat",
                        "Bendigo",
                        "Shepparton",
                    ],
                    "Queensland": [
                        "Brisbane",
                        "Gold Coast",
                        "Cairns",
                        "Townsville",
                        "Toowoomba",
                    ],
                    "Western Australia": [
                        "Perth",
                        "Fremantle",
                        "Rockingham",
                        "Mandurah",
                        "Bunbury",
                    ],
                    "South Australia": [
                        "Adelaide",
                        "Mount Gambier",
                        "Whyalla",
                        "Murray Bridge",
                        "Port Augusta",
                    ],
                },
            },
            "Canada": {
                "states": [
                    "Ontario",
                    "Quebec",
                    "British Columbia",
                    "Alberta",
                    "Manitoba",
                ],
                "cities": {
                    "Ontario": ["Toronto", "Ottawa", "Hamilton", "London", "Kitchener"],
                    "Quebec": [
                        "Montreal",
                        "Quebec City",
                        "Laval",
                        "Gatineau",
                        "Longueuil",
                    ],
                    "British Columbia": [
                        "Vancouver",
                        "Victoria",
                        "Surrey",
                        "Burnaby",
                        "Richmond",
                    ],
                    "Alberta": [
                        "Calgary",
                        "Edmonton",
                        "Red Deer",
                        "Lethbridge",
                        "St. Albert",
                    ],
                    "Manitoba": [
                        "Winnipeg",
                        "Brandon",
                        "Steinbach",
                        "Thompson",
                        "Portage la Prairie",
                    ],
                },
            },
            "United Arab Emirates": {
                "states": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
                "cities": {
                    "Dubai": [
                        "Downtown Dubai",
                        "Jumeirah",
                        "Marina",
                        "Business Bay",
                        "Deira",
                    ],
                    "Abu Dhabi": [
                        "Al Reem Island",
                        "Yas Island",
                        "Saadiyat Island",
                        "Al Ain",
                        "Liwa",
                    ],
                    "Sharjah": [
                        "Al Qasba",
                        "Al Majaz",
                        "Al Khan",
                        "Al Rolla",
                        "Al Nahda",
                    ],
                    "Ajman": [
                        "Ajman City",
                        "Al Nuaimiya",
                        "Al Rawda",
                        "Al Rashidiya",
                        "Al Jerf",
                    ],
                    "Ras Al Khaimah": [
                        "Al Marjan Island",
                        "Al Hamra",
                        "Jebel Jais",
                        "Al Qawasim",
                        "Al Nakheel",
                    ],
                },
            },
        }

        self.airports = {
            "United States": {
                "Los Angeles": "LAX",
                "San Francisco": "SFO",
                "New York City": "JFK",
                "Chicago": "ORD",
                "Houston": "IAH",
                "Dallas": "DFW",
                "Miami": "MIA",
                "Atlanta": "ATL",
                "Denver": "DEN",
                "Las Vegas": "LAS",
                "Seattle": "SEA",
                "Boston": "BOS",
            },
            "United Kingdom": {
                "London": "LHR",
                "Manchester": "MAN",
                "Birmingham": "BHX",
                "Edinburgh": "EDI",
                "Glasgow": "GLA",
                "Belfast": "BFS",
                "Newcastle": "NCL",
                "Liverpool": "LPL",
            },
            "France": {
                "Paris": "CDG",
                "Marseille": "MRS",
                "Lyon": "LYS",
                "Nice": "NCE",
                "Toulouse": "TLS",
                "Bordeaux": "BOD",
                "Nantes": "NTE",
                "Strasbourg": "SXB",
            },
            "Germany": {
                "Munich": "MUC",
                "Frankfurt": "FRA",
                "Berlin": "BER",
                "Hamburg": "HAM",
                "Cologne": "CGN",
                "Stuttgart": "STR",
                "Düsseldorf": "DUS",
                "Hannover": "HAJ",
            },
            "Japan": {
                "Tokyo": "NRT",
                "Osaka": "KIX",
                "Kyoto": "UKB",
                "Sapporo": "CTS",
                "Fukuoka": "FUK",
                "Nagoya": "NGO",
                "Hiroshima": "HIJ",
                "Sendai": "SDJ",
            },
            "Australia": {
                "Sydney": "SYD",
                "Melbourne": "MEL",
                "Brisbane": "BNE",
                "Perth": "PER",
                "Adelaide": "ADL",
                "Gold Coast": "OOL",
                "Cairns": "CNS",
                "Darwin": "DRW",
            },
            "Canada": {
                "Toronto": "YYZ",
                "Vancouver": "YVR",
                "Montreal": "YUL",
                "Calgary": "YYC",
                "Ottawa": "YOW",
                "Edmonton": "YEG",
                "Winnipeg": "YWG",
                "Halifax": "YHZ",
            },
            "United Arab Emirates": {
                "Dubai": "DXB",
                "Abu Dhabi": "AUH",
                "Sharjah": "SHJ",
                "Ras Al Khaimah": "RKT",
            },
        }

        self.accommodation_types = [
            "Hotel",
            "Resort",
            "Boutique Hotel",
            "Hostel",
            "Bed & Breakfast",
            "Apartment",
            "Villa",
            "Condo",
            "Guesthouse",
            "Inn",
            "Motel",
            "Lodge",
            "Cabin",
            "Chalet",
            "Capsule Hotel",
        ]

        self.amenities = [
            "WiFi",
            "Pool",
            "Gym",
            "Spa",
            "Restaurant",
            "Bar",
            "Room Service",
            "Concierge",
            "Business Center",
            "Parking",
            "Pet Friendly",
            "Airport Shuttle",
            "Laundry Service",
            "Dry Cleaning",
            "24/7 Front Desk",
            "Elevator",
            "Fitness Center",
            "Tennis Court",
            "Golf Course",
            "Beach Access",
        ]

        self.room_types = [
            "Standard Room",
            "Deluxe Room",
            "Suite",
            "Presidential Suite",
            "Ocean View Room",
            "City View Room",
            "Garden View Room",
            "Pool View Room",
            "Family Room",
            "Twin Room",
            "Double Room",
            "Single Room",
            "Studio",
            "Penthouse",
            "Villa",
            "Cabin",
        ]

    def generate_flight_id(self) -> str:
        """Generate a unique flight ID."""
        return f"FL{random.randint(100000, 999999)}"

    def generate_flight_number(self, airline: str) -> str:
        """Generate a flight number based on airline."""
        airline_codes = {
            "American Airlines": "AA",
            "Delta Air Lines": "DL",
            "United Airlines": "UA",
            "Southwest Airlines": "WN",
            "Lufthansa": "LH",
            "British Airways": "BA",
            "Air France": "AF",
            "KLM Royal Dutch Airlines": "KL",
            "Emirates": "EK",
            "Qatar Airways": "QR",
            "Singapore Airlines": "SQ",
            "Cathay Pacific": "CX",
        }
        code = airline_codes.get(airline, "XX")
        return f"{code}{random.randint(1000, 9999)}"

    def generate_random_datetime(self, start_date: datetime, end_date: datetime) -> str:
        """Generate a random datetime between start and end dates."""
        time_between = end_date - start_date
        days_between = time_between.days
        random_days = random.randint(0, days_between)
        random_date = start_date + timedelta(days=random_days)
        random_hour = random.randint(0, 23)
        random_minute = random.choice([0, 15, 30, 45])
        return (
            random_date + timedelta(hours=random_hour, minutes=random_minute)
        ).strftime("%Y-%m-%d %H:%M:%S")

    def generate_flight_duration(self) -> int:
        """Generate flight duration in minutes."""
        return random.randint(60, 1440)  # 1 hour to 24 hours

    def generate_seat_configuration(self) -> str:
        """Generate seat configuration."""
        configurations = [
            "3-3",
            "2-4-2",
            "3-4-3",
            "2-2",
            "1-2-1",
            "2-3-2",
            "3-3-3",
            "2-2-2",
        ]
        return random.choice(configurations)

    def generate_layovers(self) -> str:
        """Generate layover information."""
        layovers = ["Direct", "1 Stop", "2 Stops", "3+ Stops"]
        return random.choice(layovers)

    def generate_flights_data(self, num_flights: int = 1000) -> List[Dict[str, Any]]:
        """Generate diverse flight data."""
        flights = []
        start_date = datetime.now()
        end_date = start_date + timedelta(days=365)

        for _ in range(num_flights):
            # Select random countries and cities
            country = random.choice(list(self.countries_cities.keys()))
            state = random.choice(self.countries_cities[country]["states"])
            city = random.choice(self.countries_cities[country]["cities"][state])

            # Select destination (different from origin)
            dest_country = random.choice(
                [c for c in self.countries_cities.keys() if c != country]
            )
            dest_state = random.choice(self.countries_cities[dest_country]["states"])
            dest_city = random.choice(
                self.countries_cities[dest_country]["cities"][dest_state]
            )

            # Get airports
            origin_airport = self.airports.get(country, {}).get(
                city, f"{city[:3].upper()}"
            )
            dest_airport = self.airports.get(dest_country, {}).get(
                dest_city, f"{dest_city[:3].upper()}"
            )

            # Generate flight details
            airline = random.choice(self.airlines)
            departure_time = self.generate_random_datetime(start_date, end_date)
            duration = self.generate_flight_duration()
            arrival_time = (
                datetime.strptime(departure_time, "%Y-%m-%d %H:%M:%S")
                + timedelta(minutes=duration)
            ).strftime("%Y-%m-%d %H:%M:%S")

            # Generate pricing (base price varies by distance and airline)
            base_price = random.randint(200, 2000)
            economy_price = base_price
            business_price = int(base_price * random.uniform(2.5, 4.0))
            first_price = int(base_price * random.uniform(5.0, 8.0))

            flight = {
                "flight_id": self.generate_flight_id(),
                "flight_number": self.generate_flight_number(airline),
                "airline": airline,
                "aircraft_type": random.choice(self.aircraft_types),
                "departure_airport": origin_airport,
                "arrival_airport": dest_airport,
                "departure_time": departure_time,
                "arrival_time": arrival_time,
                "duration_minutes": duration,
                "available_seats": random.randint(50, 400),
                "seat_configuration": self.generate_seat_configuration(),
                "price_economy": economy_price,
                "price_business": business_price,
                "price_first": first_price,
                "meal_service": random.choice(
                    ["Full Meal", "Snack", "No Meal", "Special Diet"]
                ),
                "baggage_allowance": random.choice(
                    ["23kg", "32kg", "No Baggage", "Extra Baggage"]
                ),
                "layovers": self.generate_layovers(),
                "status": random.choice(
                    ["Scheduled", "On Time", "Delayed", "Cancelled", "Boarding"]
                ),
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
            flights.append(flight)

        return flights

    def generate_accommodation_id(self) -> str:
        """Generate a unique accommodation ID."""
        return f"ACC{random.randint(100000, 999999)}"

    def generate_coordinates(self, country: str, city: str) -> tuple:
        """Generate realistic coordinates for a city."""
        # Approximate coordinates for major cities
        city_coords = {
            "United States": {
                "Los Angeles": (34.0522, -118.2437),
                "New York City": (40.7128, -74.0060),
                "Chicago": (41.8781, -87.6298),
                "Houston": (29.7604, -95.3698),
                "Miami": (25.7617, -80.1918),
                "Atlanta": (33.7490, -84.3880),
            },
            "United Kingdom": {
                "London": (51.5074, -0.1278),
                "Manchester": (53.4808, -2.2426),
                "Birmingham": (52.4862, -1.8904),
                "Edinburgh": (55.9533, -3.1883),
            },
            "France": {
                "Paris": (48.8566, 2.3522),
                "Marseille": (43.2965, 5.3698),
                "Lyon": (45.7640, 4.8357),
                "Nice": (43.7102, 7.2620),
            },
            "Germany": {
                "Munich": (48.1351, 11.5820),
                "Frankfurt": (50.1109, 8.6821),
                "Berlin": (52.5200, 13.4050),
                "Hamburg": (53.5511, 9.9937),
            },
            "Japan": {
                "Tokyo": (35.6762, 139.6503),
                "Osaka": (34.6937, 135.5023),
                "Kyoto": (35.0116, 135.7681),
                "Sapporo": (43.0642, 141.3469),
            },
        }

        if country in city_coords and city in city_coords[country]:
            lat, lon = city_coords[country][city]
            # Add some random variation
            lat += random.uniform(-0.1, 0.1)
            lon += random.uniform(-0.1, 0.1)
            return round(lat, 6), round(lon, 6)
        else:
            # Generate random coordinates within reasonable ranges
            lat = random.uniform(-60, 70)
            lon = random.uniform(-180, 180)
            return round(lat, 6), round(lon, 6)

    def generate_accommodations_data(
        self, num_accommodations: int = 500
    ) -> List[Dict[str, Any]]:
        """Generate diverse accommodation data."""
        accommodations = []

        for _ in range(num_accommodations):
            # Select random country and city
            country = random.choice(list(self.countries_cities.keys()))
            state = random.choice(self.countries_cities[country]["states"])
            city = random.choice(self.countries_cities[country]["cities"][state])

            # Generate accommodation details
            accommodation_type = random.choice(self.accommodation_types)
            name_prefixes = [
                "Grand",
                "Royal",
                "Plaza",
                "Palace",
                "Resort",
                "Inn",
                "Lodge",
                "Villa",
            ]
            name_suffixes = [
                "Hotel",
                "Resort",
                "Suites",
                "Inn",
                "Lodge",
                "Villa",
                "Palace",
            ]

            if accommodation_type in ["Hotel", "Resort", "Boutique Hotel"]:
                name = f"{random.choice(name_prefixes)} {city} {random.choice(name_suffixes)}"
            else:
                name = f"{random.choice(name_prefixes)} {accommodation_type} {city}"

            # Generate address
            street_numbers = [str(random.randint(1, 9999))]
            street_names = [
                "Main St",
                "Broadway",
                "First Ave",
                "Park Ave",
                "Oak St",
                "Pine St",
                "Elm St",
            ]
            address = (
                f"{random.choice(street_numbers)} {random.choice(street_names)}, {city}"
            )

            # Generate coordinates
            latitude, longitude = self.generate_coordinates(country, city)

            # Generate amenities (random selection)
            selected_amenities = random.sample(self.amenities, random.randint(5, 15))
            amenities_json = json.dumps(selected_amenities)

            # Generate room types
            selected_room_types = random.sample(self.room_types, random.randint(3, 8))
            room_types_json = json.dumps(selected_room_types)

            # Generate star rating
            star_rating = random.randint(1, 5)

            # Generate boolean amenities
            parking_available = random.choice([True, False])
            wifi_available = random.choice([True, False])
            breakfast_included = random.choice([True, False])
            gym_available = random.choice([True, False])
            pool_available = random.choice([True, False])
            spa_available = random.choice([True, False])
            business_center = random.choice([True, False])
            room_service = random.choice([True, False])
            concierge_service = random.choice([True, False])

            # Generate contact information
            contact_phone = f"+{random.randint(1, 99)}-{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
            contact_email = f"info@{name.lower().replace(' ', '')}.com"

            # Generate images (placeholder URLs)
            images = [
                f"https://example.com/images/{name.lower().replace(' ', '_')}_{i}.jpg"
                for i in range(1, random.randint(3, 8))
            ]
            images_json = json.dumps(images)

            # Generate description
            descriptions = [
                f"Experience luxury and comfort at {name}, located in the heart of {city}.",
                f"Discover the perfect blend of modern amenities and traditional hospitality at {name}.",
                f"Your gateway to {city}, {name} offers exceptional service and stunning views.",
                f"Relax and unwind at {name}, where every detail is designed for your comfort.",
                f"Immerse yourself in the culture of {city} while enjoying world-class facilities at {name}.",
            ]
            description = random.choice(descriptions)

            accommodation = {
                "accommodation_id": self.generate_accommodation_id(),
                "name": name,
                "type": accommodation_type,
                "address": address,
                "city": city,
                "country": country,
                "postal_code": f"{random.randint(10000, 99999)}",
                "latitude": latitude,
                "longitude": longitude,
                "star_rating": star_rating,
                "amenities": amenities_json,
                "room_types": room_types_json,
                "check_in_time": random.choice(["14:00", "15:00", "16:00"]),
                "check_out_time": random.choice(["11:00", "12:00", "13:00"]),
                "cancellation_policy": random.choice(
                    ["Free cancellation", "Non-refundable", "Partial refund"]
                ),
                "pet_policy": random.choice(
                    ["Pet friendly", "No pets allowed", "Pets on request"]
                ),
                "parking_available": parking_available,
                "wifi_available": wifi_available,
                "breakfast_included": breakfast_included,
                "gym_available": gym_available,
                "pool_available": pool_available,
                "spa_available": spa_available,
                "business_center": business_center,
                "room_service": room_service,
                "concierge_service": concierge_service,
                "contact_phone": contact_phone,
                "contact_email": contact_email,
                "images": images_json,
                "description": description,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
            accommodations.append(accommodation)

        return accommodations

    def save_to_csv(self, data: List[Dict[str, Any]], filename: str):
        """Save data to CSV file."""
        if not data:
            print(f"No data to save for {filename}")
            return

        # Create output directory if it doesn't exist
        os.makedirs("database/generated_data", exist_ok=True)

        filepath = f"database/generated_data/{filename}"

        with open(filepath, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = data[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for row in data:
                writer.writerow(row)

        print(f"✅ Generated {len(data)} records and saved to {filepath}")


def main():
    """Main function to generate synthetic data."""
    print(
        "🚀 Starting synthetic data generation for Aistronaut Travel Booking System..."
    )

    generator = SyntheticDataGenerator()

    # Generate flights data
    print("\n✈️  Generating flights data...")
    flights_data = generator.generate_flights_data(num_flights=1000)
    generator.save_to_csv(flights_data, "flights.csv")

    # Generate accommodations data
    print("\n🏨 Generating accommodations data...")
    accommodations_data = generator.generate_accommodations_data(num_accommodations=500)
    generator.save_to_csv(accommodations_data, "accommodations.csv")

    print("\n🎉 Data generation completed successfully!")
    print(
        f"📊 Generated {len(flights_data)} flights and {len(accommodations_data)} accommodations"
    )
    print("📁 Files saved in: database/generated_data/")

    # Display sample data
    print("\n📋 Sample Flight Data:")
    print(
        f"Flight: {flights_data[0]['flight_number']} from {flights_data[0]['departure_airport']} to {flights_data[0]['arrival_airport']}"
    )
    print(
        f"Airline: {flights_data[0]['airline']} | Price: ${flights_data[0]['price_economy']}"
    )

    print("\n📋 Sample Accommodation Data:")
    print(
        f"Hotel: {accommodations_data[0]['name']} in {accommodations_data[0]['city']}, {accommodations_data[0]['country']}"
    )
    print(
        f"Type: {accommodations_data[0]['type']} | Rating: {accommodations_data[0]['star_rating']} stars"
    )


if __name__ == "__main__":
    main()

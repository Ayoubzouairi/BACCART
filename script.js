
        // قاعدة بيانات موسعة لجميع أندية العالم
        const globalTeams = {
            "premier": [
                {name: "Arsenal", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Manchester City", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Liverpool", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Chelsea", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Manchester United", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Tottenham Hotspur", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Newcastle United", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Brighton & Hove Albion", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "West Ham United", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Aston Villa", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Crystal Palace", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Wolverhampton Wanderers", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Fulham", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Everton", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Brentford", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Nottingham Forest", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Luton Town", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Burnley", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Sheffield United", league: "الدوري الإنجليزي", country: "إنجلترا"},
                {name: "Bournemouth", league: "الدوري الإنجليزي", country: "إنجلترا"}
            ],
            "laliga": [
                {name: "Real Madrid", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Barcelona", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Atletico Madrid", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Sevilla", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Real Sociedad", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Real Betis", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Villarreal", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Athletic Bilbao", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Valencia", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Osasuna", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Getafe", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Celta Vigo", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Mallorca", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Girona", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Rayo Vallecano", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Alaves", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Cadiz", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Granada", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Almeria", league: "الدوري الإسباني", country: "إسبانيا"},
                {name: "Las Palmas", league: "الدوري الإسباني", country: "إسبانيا"}
            ],
            "seriea": [
                {name: "Juventus", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Inter Milan", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "AC Milan", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Napoli", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Roma", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Lazio", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Atalanta", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Fiorentina", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Bologna", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Torino", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Monza", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Genoa", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Lecce", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Sassuolo", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Frosinone", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Udinese", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Cagliari", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Verona", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Empoli", league: "الدوري الإيطالي", country: "إيطاليا"},
                {name: "Salernitana", league: "الدوري الإيطالي", country: "إيطاليا"}
            ],
            "bundesliga": [
                {name: "Bayern Munich", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Borussia Dortmund", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "RB Leipzig", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Bayer Leverkusen", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Eintracht Frankfurt", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Wolfsburg", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Borussia Monchengladbach", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Freiburg", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Hoffenheim", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Stuttgart", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Union Berlin", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Mainz", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Augsburg", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Werder Bremen", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Bochum", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Koln", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Darmstadt", league: "الدوري الألماني", country: "ألمانيا"},
                {name: "Heidenheim", league: "الدوري الألماني", country: "ألمانيا"}
            ],
            "ligue1": [
                {name: "Paris Saint-Germain", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Marseille", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Lyon", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Monaco", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Lille", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Rennes", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Nice", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Lens", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Reims", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Montpellier", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Toulouse", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Strasbourg", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Nantes", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Brest", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Le Havre", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Metz", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Lorient", league: "الدوري الفرنسي", country: "فرنسا"},
                {name: "Clermont Foot", league: "الدوري الفرنسي", country: "فرنسا"}
            ],
            "saudi": [
                {name: "Al Hilal", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Nassr", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Ittihad", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Ahli", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Shabab", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Fateh", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Taawoun", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Ettifaq", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Wehda", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Khaleej", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Raed", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Riyadh", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Okhdood", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Tai", league: "الدوري السعودي", country: "السعودية"},
                {name: "Abha", league: "الدوري السعودي", country: "السعودية"},
                {name: "Damac", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Faisaly", league: "الدوري السعودي", country: "السعودية"},
                {name: "Al Adalh", league: "الدوري السعودي", country: "السعودية"}
            ],
            "mls": [
                {name: "Los Angeles FC", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Seattle Sounders", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Atlanta United", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "New York City FC", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Inter Miami", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Toronto FC", league: "الدوري الأمريكي", country: "كندا"},
                {name: "LA Galaxy", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "DC United", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Chicago Fire", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Columbus Crew", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "FC Dallas", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Houston Dynamo", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Sporting Kansas City", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Minnesota United", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Nashville SC", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "New England Revolution", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "New York Red Bulls", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Orlando City", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Philadelphia Union", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Portland Timbers", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Real Salt Lake", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "San Jose Earthquakes", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "St. Louis City", league: "الدوري الأمريكي", country: "الولايات المتحدة"},
                {name: "Vancouver Whitecaps", league: "الدوري الأمريكي", country: "كندا"}
            ],
            "brazil": [
                {name: "Flamengo", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Palmeiras", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Sao Paulo", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Corinthians", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Santos", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Gremio", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Internacional", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Atletico Mineiro", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Botafogo", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Fluminense", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Vasco da Gama", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Cruzeiro", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Bahia", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Fortaleza", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Athletico Paranaense", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Bragantino", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Goias", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Coritiba", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "Cuiaba", league: "الدوري البرازيلي", country: "البرازيل"},
                {name: "America MG", league: "الدوري البرازيلي", country: "البرازيل"}
            ],
            "argentina": [
                {name: "Boca Juniors", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "River Plate", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Racing Club", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "San Lorenzo", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Independiente", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Velez Sarsfield", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Estudiantes", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Lanus", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Rosario Central", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Newell's Old Boys", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Godoy Cruz", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Talleres", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Defensa y Justicia", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Argentinos Juniors", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Banfield", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Gimnasia La Plata", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Huracan", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Union Santa Fe", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Colon Santa Fe", league: "الدوري الأرجنتيني", country: "الأرجنتين"},
                {name: "Arsenal Sarandi", league: "الدوري الأرجنتيني", country: "الأرجنتين"}
            ],
            "portugal": [
                {name: "Benfica", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Porto", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Sporting CP", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Braga", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Vitoria Guimaraes", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Boavista", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Famalicao", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Casa Pia", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Rio Ave", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Santa Clara", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Vizela", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Arouca", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Estoril", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Portimonense", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Gil Vicente", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Maritimo", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Pacos de Ferreira", league: "الدوري البرتغالي", country: "البرتغال"},
                {name: "Chaves", league: "الدوري البرتغالي", country: "البرتغال"}
            ],
            "netherlands": [
                {name: "Ajax", league: "الدوري الهولندي", country: "هولندا"},
                {name: "PSV Eindhoven", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Feyenoord", league: "الدوري الهولندي", country: "هولندا"},
                {name: "AZ Alkmaar", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Twente", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Utrecht", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Heerenveen", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Vitesse", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Groningen", league: "الدوري الهولندي", country: "هولندا"},
                {name: "NEC Nijmegen", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Sparta Rotterdam", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Heracles", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Excelsior", league: "الدوري الهولندي", country: "هولندا"},
                {name: "RKC Waalwijk", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Fortuna Sittard", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Go Ahead Eagles", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Volendam", league: "الدوري الهولندي", country: "هولندا"},
                {name: "Cambuur", league: "الدوري الهولندي", country: "هولندا"}
            ],
            "turkey": [
                {name: "Galatasaray", league: "الدوري التركي", country: "تركيا"},
                {name: "Fenerbahce", league: "الدوري التركي", country: "تركيا"},
                {name: "Besiktas", league: "الدوري التركي", country: "تركيا"},
                {name: "Trabzonspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Basaksehir", league: "الدوري التركي", country: "تركيا"},
                {name: "Sivasspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Alanyaspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Konyaspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Kayserispor", league: "الدوري التركي", country: "تركيا"},
                {name: "Gaziantep", league: "الدوري التركي", country: "تركيا"},
                {name: "Antalyaspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Giresunspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Hatayspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Kasimpasa", league: "الدوري التركي", country: "تركيا"},
                {name: "Adana Demirspor", league: "الدوري التركي", country: "تركيا"},
                {name: "Umraniyespor", league: "الدوري التركي", country: "تركيا"},
                {name: "Ankaragucu", league: "الدوري التركي", country: "تركيا"},
                {name: "Istanbulspor", league: "الدوري التركي", country: "تركيا"}
            ],
            "russia": [
                {name: "Zenit St Petersburg", league: "الدوري الروسي", country: "روسيا"},
                {name: "Spartak Moscow", league: "الدوري الروسي", country: "روسيا"},
                {name: "CSKA Moscow", league: "الدوري الروسي", country: "روسيا"},
                {name: "Lokomotiv Moscow", league: "الدوري الروسي", country: "روسيا"},
                {name: "Dynamo Moscow", league: "الدوري الروسي", country: "روسيا"},
                {name: "Krasnodar", league: "الدوري الروسي", country: "روسيا"},
                {name: "Rostov", league: "الدوري الروسي", country: "روسيا"},
                {name: "Akhmat Grozny", league: "الدوري الروسي", country: "روسيا"},
                {name: "Sochi", league: "الدوري الروسي", country: "روسيا"},
                {name: "Ural Yekaterinburg", league: "الدوري الروسي", country: "روسيا"},
                {name: "Krylia Sovetov", league: "الدوري الروسي", country: "روسيا"},
                {name: "Orenburg", league: "الدوري الروسي", country: "روسيا"},
                {name: "Fakel Voronezh", league: "الدوري الروسي", country: "روسيا"},
                {name: "Khimki", league: "الدوري الروسي", country: "روسيا"},
                {name: "Torpedo Moscow", league: "الدوري الروسي", country: "روسيا"},
                {name: "Ufa", league: "الدوري الروسي", country: "روسيا"}
            ],
            "belgium": [
                {name: "Club Brugge", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Anderlecht", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Standard Liege", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Genk", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Antwerp", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Gent", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Charleroi", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Mechelen", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Kortrijk", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Oostende", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Sint-Truiden", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "OH Leuven", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Eupen", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Cercle Brugge", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Union SG", league: "الدوري البلجيكي", country: "بلجيكا"},
                {name: "Westerlo", league: "الدوري البلجيكي", country: "بلجيكا"}
            ],
            "scotland": [
                {name: "Celtic", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Rangers", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Aberdeen", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Hearts", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Hibernian", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Motherwell", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "St Johnstone", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "St Mirren", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Livingston", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Ross County", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Kilmarnock", league: "الدوري الاسكتلندي", country: "اسكتلندا"},
                {name: "Dundee United", league: "الدوري الاسكتلندي", country: "اسكتلندا"}
            ],
            "mexico": [
                {name: "Club America", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Chivas Guadalajara", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Cruz Azul", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Monterrey", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Tigres UANL", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Pumas UNAM", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Toluca", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Santos Laguna", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Pachuca", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Leon", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Atlas", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Puebla", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Juarez", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Mazatlan", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Necaxa", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Queretaro", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "San Luis", league: "الدوري المكسيكي", country: "المكسيك"},
                {name: "Tijuana", league: "الدوري المكسيكي", country: "المكسيك"}
            ],
            "japan": [
                {name: "Kawasaki Frontale", league: "الدوري الياباني", country: "اليابان"},
                {name: "Urawa Red Diamonds", league: "الدوري الياباني", country: "اليابان"},
                {name: "Yokohama F. Marinos", league: "الدوري الياباني", country: "اليابان"},
                {name: "Gamba Osaka", league: "الدوري الياباني", country: "اليابان"},
                {name: "FC Tokyo", league: "الدوري الياباني", country: "اليابان"},
                {name: "Kashima Antlers", league: "الدوري الياباني", country: "اليابان"},
                {name: "Nagoya Grampus", league: "الدوري الياباني", country: "اليابان"},
                {name: "Cerezo Osaka", league: "الدوري الياباني", country: "اليابان"},
                {name: "Sanfrecce Hiroshima", league: "الدوري الياباني", country: "اليابان"},
                {name: "Sagan Tosu", league: "الدوري الياباني", country: "اليابان"},
                {name: "Consadole Sapporo", league: "الدوري الياباني", country: "اليابان"},
                {name: "Vissel Kobe", league: "الدوري الياباني", country: "اليابان"},
                {name: "Shimizu S-Pulse", league: "الدوري الياباني", country: "اليابان"},
                {name: "Oita Trinita", league: "الدوري الياباني", country: "اليابان"},
                {name: "Yokohama FC", league: "الدوري الياباني", country: "اليابان"},
                {name: "Shonan Bellmare", league: "الدوري الياباني", country: "اليابان"},
                {name: "Kashiwa Reysol", league: "الدوري الياباني", country: "اليابان"},
                {name: "Avispa Fukuoka", league: "الدوري الياباني", country: "اليابان"}
            ],
            "korea": [
                {name: "Jeonbuk Hyundai Motors", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Ulsan Hyundai", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "FC Seoul", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Suwon Samsung Bluewings", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Pohang Steelers", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Daegu FC", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Incheon United", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Gwangju FC", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Seongnam FC", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Gangwon FC", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Jeju United", league: "الدوري الكوري", country: "كوريا الجنوبية"},
                {name: "Suwon FC", league: "الدوري الكوري", country: "كوريا الجنوبية"}
            ],
            "china": [
                {name: "Guangzhou Evergrande", league: "الدوري الصيني", country: "الصين"},
                {name: "Beijing Guoan", league: "الدوري الصيني", country: "الصين"},
                {name: "Shanghai SIPG", league: "الدوري الصيني", country: "الصين"},
                {name: "Shandong Taishan", league: "الدوري الصيني", country: "الصين"},
                {name: "Jiangsu Suning", league: "الدوري الصيني", country: "الصين"},
                {name: "Shanghai Shenhua", league: "الدوري الصيني", country: "الصين"},
                {name: "Tianjin Jinmen Tiger", league: "الدوري الصيني", country: "الصين"},
                {name: "Hebei FC", league: "الدوري الصيني", country: "الصين"},
                {name: "Guangzhou City", league: "الدوري الصيني", country: "الصين"},
                {name: "Dalian Pro", league: "الدوري الصيني", country: "الصين"},
                {name: "Shenzhen FC", league: "الدوري الصيني", country: "الصين"},
                {name: "Wuhan Three Towns", league: "الدوري الصيني", country: "الصين"},
                {name: "Zhejiang Professional", league: "الدوري الصيني", country: "الصين"},
                {name: "Chengdu Rongcheng", league: "الدوري الصيني", country: "الصين"},
                {name: "Meizhou Hakka", league: "الدوري الصيني", country: "الصين"},
                {name: "Henan Songshan Longmen", league: "الدوري الصيني", country: "الصين"}
            ],
            "uae": [
                {name: "Al Ain", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Al Wasl", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Al Wahda", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Shabab Al Ahli", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Al Jazira", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Al Nasr", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Baniyas", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Al Ittihad Kalba", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Ajman", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Al Dhafra", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Emirates Club", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Fujairah", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Khor Fakkan", league: "الدوري الإماراتي", country: "الإمارات"},
                {name: "Al Bataeh", league: "الدوري الإماراتي", country: "الإمارات"}
            ],
            "qatar": [
                {name: "Al Sadd", league: "الدوري القطري", country: "قطر"},
                {name: "Al Duhail", league: "الدوري القطري", country: "قطر"},
                {name: "Al Rayyan", league: "الدوري القطري", country: "قطر"},
                {name: "Al Arabi", league: "الدوري القطري", country: "قطر"},
                {name: "Al Wakrah", league: "الدوري القطري", country: "قطر"},
                {name: "Al Gharafa", league: "الدوري القطري", country: "قطر"},
                {name: "Umm Salal", league: "الدوري القطري", country: "قطر"},
                {name: "Qatar SC", league: "الدوري القطري", country: "قطر"},
                {name: "Al Ahli Doha", league: "الدوري القطري", country: "قطر"},
                {name: "Al Markhiya", league: "الدوري القطري", country: "قطر"},
                {name: "Al Shamal", league: "الدوري القطري", country: "قطر"},
                {name: "Al Mesaimeer", league: "الدوري القطري", country: "قطر"}
            ],
            "egypt": [
                {name: "Al Ahly", league: "الدوري المصري", country: "مصر"},
                {name: "Zamalek", league: "الدوري المصري", country: "مصر"},
                {name: "Pyramids FC", league: "الدوري المصري", country: "مصر"},
                {name: "Al Masry", league: "الدوري المصري", country: "مصر"},
                {name: "Ismaily", league: "الدوري المصري", country: "مصر"},
                {name: "ENPPI", league: "الدوري المصري", country: "مصر"},
                {name: "Smouha", league: "الدوري المصري", country: "مصر"},
                {name: "Al Ittihad Alexandria", league: "الدوري المصري", country: "مصر"},
                {name: "Ceramica Cleopatra", league: "الدوري المصري", country: "مصر"},
                {name: "National Bank of Egypt", league: "الدوري المصري", country: "مصر"},
                {name: "El Gouna", league: "الدوري المصري", country: "مصر"},
                {name: "Ghazl El Mahalla", league: "الدوري المصري", country: "مصر"},
                {name: "Pharco FC", league: "الدوري المصري", country: "مصر"},
                {name: "Aswan SC", league: "الدوري المصري", country: "مصر"},
                {name: "Haras El Hodood", league: "الدوري المصري", country: "مصر"},
                {name: "El Daklyeh", league: "الدوري المصري", country: "مصر"},
                {name: "Future FC", league: "الدوري المصري", country: "مصر"},
                {name: "Baladeyet El Mahalla", league: "الدوري المصري", country: "مصر"}
            ],
            "morocco": [
                {name: "Wydad Casablanca", league: "الدوري المغربي", country: "المغرب"},
                {name: "Raja Casablanca", league: "الدوري المغربي", country: "المغرب"},
                {name: "FAR Rabat", league: "الدوري المغربي", country: "المغرب"},
                {name: "AS FAR", league: "الدوري المغربي", country: "المغرب"},
                {name: "Moghreb Tetouan", league: "الدوري المغربي", country: "المغرب"},
                {name: "Olympic Safi", league: "الدوري المغربي", country: "المغرب"},
                {name: "Hassania Agadir", league: "الدوري المغربي", country: "المغرب"},
                {name: "FUS Rabat", league: "الدوري المغربي", country: "المغرب"},
                {name: "Difaa El Jadida", league: "الدوري المغربي", country: "المغرب"},
                {name: "Youssoufia Berrechid", league: "الدوري المغربي", country: "المغرب"},
                {name: "Olympic Khouribga", league: "الدوري المغربي", country: "المغرب"},
                {name: "Mouloudia Oujda", league: "الدوري المغربي", country: "المغرب"},
                {name: "Renaissance Zemamra", league: "الدوري المغربي", country: "المغرب"},
                {name: "Chabab Mohammedia", league: "الدوري المغربي", country: "المغرب"},
                {name: "Itihad Tanger", league: "الدوري المغربي", country: "المغرب"},
                {name: "Racing de Casablanca", league: "الدوري المغربي", country: "المغرب"}
            ],
            "algeria": [
                {name: "CR Belouizdad", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "JS Kabylie", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "USM Alger", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "MC Alger", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "ES Setif", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "MC Oran", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "USM Bel Abbes", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "JS Saoura", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "Paradou AC", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "NC Magra", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "ASO Chlef", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "RC Arbaa", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "US Biskra", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "HB Chelghoum Laid", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "Olympique de Medea", league: "الدوري الجزائري", country: "الجزائر"},
                {name: "RC Kouba", league: "الدوري الجزائري", country: "الجزائر"}
            ],
            "tunisia": [
                {name: "Esperance Tunis", league: "الدوري التونسي", country: "تونس"},
                {name: "Club Africain", league: "الدوري التونسي", country: "تونس"},
                {name: "Etoile du Sahel", league: "الدوري التونسي", country: "تونس"},
                {name: "CS Sfaxien", league: "الدوري التونسي", country: "تونس"},
                {name: "US Monastir", league: "الدوري التونسي", country: "تونس"},
                {name: "Stade Tunisien", league: "الدوري التونسي", country: "تونس"},
                {name: "CA Bizertin", league: "الدوري التونسي", country: "تونس"},
                {name: "EOG Kram", league: "الدوري التونسي", country: "تونس"},
                {name: "AS Marsa", league: "الدوري التونسي", country: "تونس"},
                {name: "US Ben Guerdane", league: "الدوري التونسي", country: "تونس"},
                {name: "Olympique Beja", league: "الدوري التونسي", country: "تونس"},
                {name: "AS Gabes", league: "الدوري التونسي", country: "تونس"},
                {name: "Club Sfaxien", league: "الدوري التونسي", country: "تونس"},
                {name: "Stade Gabesien", league: "الدوري التونسي", country: "تونس"},
                {name: "Metlaoui", league: "الدوري التونسي", country: "تونس"},
                {name: "Chebba", league: "الدوري التونسي", country: "تونس"}
            ],
            // إضافة دوريات جديدة
            "greece": [
                {name: "Olympiacos", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Panathinaikos", league: "الدوري اليوناني", country: "اليونان"},
                {name: "PAOK", league: "الدوري اليوناني", country: "اليونان"},
                {name: "AEK Athens", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Aris Thessaloniki", league: "الدوري اليوناني", country: "اليونان"},
                {name: "OFI Crete", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Asteras Tripolis", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Atromitos", league: "الدوري اليوناني", country: "اليونان"},
                {name: "PAS Giannina", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Volos", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Lamia", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Ionikos", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Levadiakos", league: "الدوري اليوناني", country: "اليونان"},
                {name: "Panetolikos", league: "الدوري اليوناني", country: "اليونان"}
            ],
            "switzerland": [
                {name: "Young Boys", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Basel", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Zurich", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Lugano", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Servette", league: "الدوري السويسري", country: "سويسرا"},
                {name: "St. Gallen", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Luzern", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Grasshopper", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Sion", league: "الدوري السويسري", country: "سويسرا"},
                {name: "Winterthur", league: "الدوري السويسري", country: "سويسرا"}
            ],
            "austria": [
                {name: "Red Bull Salzburg", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Rapid Vienna", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Austria Vienna", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Sturm Graz", league: "الدوري النمساوي", country: "النمسا"},
                {name: "LASK", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Wolfsberger AC", league: "الدوري النمساوي", country: "النمسا"},
                {name: "TSV Hartberg", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Austria Klagenfurt", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Ried", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Altach", league: "الدوري النمساوي", country: "النمسا"},
                {name: "WSG Tirol", league: "الدوري النمساوي", country: "النمسا"},
                {name: "Austria Lustenau", league: "الدوري النمساوي", country: "النمسا"}
            ],
            "denmark": [
                {name: "FC Copenhagen", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Midtjylland", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Brondby", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Aarhus", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Nordsjaelland", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Silkeborg", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Viborg", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Odense", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Randers", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Lyngby", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Horsens", league: "الدوري الدنماركي", country: "الدنمارك"},
                {name: "Vejle", league: "الدوري الدنماركي", country: "الدنمارك"}
            ],
            "sweden": [
                {name: "Malmo FF", league: "الدوري السويدي", country: "السويد"},
                {name: "AIK", league: "الدوري السويدي", country: "السويد"},
                {name: "Hammarby", league: "الدوري السويدي", country: "السويد"},
                {name: "Djurgarden", league: "الدوري السويدي", country: "السويد"},
                {name: "IFK Goteborg", league: "الدوري السويدي", country: "السويد"},
                {name: "IFK Norrkoping", league: "الدوري السويدي", country: "السويد"},
                {name: "Helsingborg", league: "الدوري السويدي", country: "السويد"},
                {name: "Elfsborg", league: "الدوري السويدي", country: "السويد"},
                {name: "Kalmar FF", league: "الدوري السويدي", country: "السويد"},
                {name: "BK Hacken", league: "الدوري السويدي", country: "السويد"},
                {name: "Mjallby", league: "الدوري السويدي", country: "السويد"},
                {name: "Varbergs BoIS", league: "الدوري السويدي", country: "السويد"},
                {name: "Sirius", league: "الدوري السويدي", country: "السويد"},
                {name: "Degerfors", league: "الدوري السويدي", country: "السويد"},
                {name: "IFK Varnamo", league: "الدوري السويدي", country: "السويد"},
                {name: "Brommapojkarna", league: "الدوري السويدي", country: "السويد"}
            ],
            "norway": [
                {name: "Rosenborg", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Molde", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Bodo/Glimt", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Viking", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Brann", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Lillestrom", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Stromsgodset", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Valerenga", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Odd", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Sarpsborg 08", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Haugesund", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Tromso", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Aalesund", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Sandefjord", league: "الدوري النرويجي", country: "النرويج"},
                {name: "HamKam", league: "الدوري النرويجي", country: "النرويج"},
                {name: "Jerv", league: "الدوري النرويجي", country: "النرويج"}
            ],
            "poland": [
                {name: "Legia Warsaw", league: "الدوري البولندي", country: "بولندا"},
                {name: "Lech Poznan", league: "الدوري البولندي", country: "بولندا"},
                {name: "Wisla Krakow", league: "الدوري البولندي", country: "بولندا"},
                {name: "Gornik Zabrze", league: "الدوري البولندي", country: "بولندا"},
                {name: "Lechia Gdansk", league: "الدوري البولندي", country: "بولندا"},
                {name: "Pogon Szczecin", league: "الدوري البولندي", country: "بولندا"},
                {name: "Cracovia", league: "الدوري البولندي", country: "بولندا"},
                {name: "Zaglebie Lubin", league: "الدوري البولندي", country: "بولندا"},
                {name: "Jagiellonia Bialystok", league: "الدوري البولندي", country: "بولندا"},
                {name: "Slask Wroclaw", league: "الدوري البولندي", country: "بولندا"},
                {name: "Rakow Czestochowa", league: "الدوري البولندي", country: "بولندا"},
                {name: "Piast Gliwice", league: "الدوري البولندي", country: "بولندا"},
                {name: "Warta Poznan", league: "الدوري البولندي", country: "بولندا"},
                {name: "Radomiak Radom", league: "الدوري البولندي", country: "بولندا"},
                {name: "Stal Mielec", league: "الدوري البولندي", country: "بولندا"},
                {name: "Gornik Leczna", league: "الدوري البولندي", country: "بولندا"},
                {name: "Bruk-Bet Termalica", league: "الدوري البولندي", country: "بولندا"},
                {name: "Wisla Plock", league: "الدوري البولندي", country: "بولندا"}
            ],
            "czech": [
                {name: "Sparta Prague", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Slavia Prague", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Viktoria Plzen", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Banik Ostrava", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Bohemians 1905", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Slovan Liberec", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Jablonec", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Sigma Olomouc", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Teplice", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Ceske Budejovice", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Pardubice", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Zlin", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Hradec Kralove", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Karviná", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Opava", league: "الدوري التشيكي", country: "التشيك"},
                {name: "Dukla Prague", league: "الدوري التشيكي", country: "التشيك"}
            ],
            "ukraine": [
                {name: "Dynamo Kyiv", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Shakhtar Donetsk", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Dnipro-1", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Zorya Luhansk", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Vorskla Poltava", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Kolos Kovalivka", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Oleksandriya", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Metalist 1925 Kharkiv", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Rukh Lviv", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Chornomorets Odesa", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Veres Rivne", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Inhulets Petrove", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Metalist Kharkiv", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Desna Chernihiv", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Mariupol", league: "الدوري الأوكراني", country: "أوكرانيا"},
                {name: "Karpaty Lviv", league: "الدوري الأوكراني", country: "أوكرانيا"}
            ],
            "croatia": [
                {name: "Dinamo Zagreb", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Hajduk Split", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Rijeka", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Osijek", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Lokomotiva Zagreb", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Gorica", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Slaven Belupo", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Istra 1961", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Sibenik", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Varazdin", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Zadar", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Cibalia", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Inter Zapresic", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "NK Zagreb", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Hrvatski Dragovoljac", league: "الدوري الكرواتي", country: "كرواتيا"},
                {name: "Dubrava", league: "الدوري الكرواتي", country: "كرواتيا"}
            ],
            "serbia": [
                {name: "Red Star Belgrade", league: "الدوري الصربي", country: "صربيا"},
                {name: "Partizan Belgrade", league: "الدوري الصربي", country: "صربيا"},
                {name: "Vojvodina", league: "الدوري الصربي", country: "صربيا"},
                {name: "Cukaricki", league: "الدوري الصربي", country: "صربيا"},
                {name: "Radnicki Nis", league: "الدوري الصربي", country: "صربيا"},
                {name: "Spartak Subotica", league: "الدوري الصربي", country: "صربيا"},
                {name: "Mladost Lucani", league: "الدوري الصربي", country: "صربيا"},
                {name: "Napredak Krusevac", league: "الدوري الصربي", country: "صربيا"},
                {name: "Radnik Surdulica", league: "الدوري الصربي", country: "صربيا"},
                {name: "Javor Ivanjica", league: "الدوري الصربي", country: "صربيا"},
                {name: "Vozdovac", league: "الدوري الصربي", country: "صربيا"},
                {name: "Metalac Gornji Milanovac", league: "الدوري الصربي", country: "صربيا"},
                {name: "Proleter Novi Sad", league: "الدوري الصربي", country: "صربيا"},
                {name: "Backa Topola", league: "الدوري الصربي", country: "صربيا"},
                {name: "Rad Belgrade", league: "الدوري الصربي", country: "صربيا"},
                {name: "OFK Belgrade", league: "الدوري الصربي", country: "صربيا"}
            ],
            "romania": [
                {name: "FCSB", league: "الدوري الروماني", country: "رومانيا"},
                {name: "CFR Cluj", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Dinamo Bucuresti", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Rapid Bucuresti", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Universitatea Craiova", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Astra Giurgiu", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Sepsi OSK", league: "الدوري الروماني", country: "رومانيا"},
                {name: "FC Voluntari", league: "الدوري الروماني", country: "رومانيا"},
                {name: "UTA Arad", league: "الدوري الروماني", country: "رومانيا"},
                {name: "FC Arges", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Chindia Targoviste", league: "الدوري الروماني", country: "رومانيا"},
                {name: "FC Botosani", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Gaz Metan Medias", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Viitorul Constanta", league: "الدوري الروماني", country: "رومانيا"},
                {name: "FC Hermannstadt", league: "الدوري الروماني", country: "رومانيا"},
                {name: "Poli Iasi", league: "الدوري الروماني", country: "رومانيا"}
            ],
            "bulgaria": [
                {name: "Ludogorets Razgrad", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "CSKA Sofia", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Levski Sofia", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Botev Plovdiv", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Lokomotiv Plovdiv", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Cherno More Varna", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Beroe Stara Zagora", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Slavia Sofia", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Arda Kardzhali", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "CSKA 1948", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Lokomotiv Sofia", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Pirin Blagoevgrad", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Etar Veliko Tarnovo", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Septemvri Sofia", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Tsarsko Selo", league: "الدوري البلغاري", country: "بلغاريا"},
                {name: "Montana", league: "الدوري البلغاري", country: "بلغاريا"}
            ],
            "hungary": [
                {name: "Ferencvaros", league: "الدوري المجري", country: "المجر"},
                {name: "Debrecen", league: "الدوري المجري", country: "المجر"},
                {name: "MOL Fehervar", league: "الدوري المجري", country: "المجر"},
                {name: "Puskas Akademia", league: "الدوري المجري", country: "المجر"},
                {name: "Kisvarda", league: "الدوري المجري", country: "المجر"},
                {name: "Mezokovesd-Zsory", league: "الدوري المجري", country: "المجر"},
                {name: "MTK Budapest", league: "الدوري المجري", country: "المجر"},
                {name: "Ujpest", league: "الدوري المجري", country: "المجر"},
                {name: "Honved", league: "الدوري المجري", country: "المجر"},
                {name: "Paks", league: "الدوري المجري", country: "المجر"},
                {name: "Zalaegerszeg", league: "الدوري المجري", country: "المجر"},
                {name: "Diosgyor", league: "الدوري المجري", country: "المجر"},
                {name: "Vasas", league: "الدوري المجري", country: "المجر"},
                {name: "Gyori ETO", league: "الدوري المجري", country: "المجر"},
                {name: "Budafok", league: "الدوري المجري", country: "المجر"},
                {name: "Soroksar", league: "الدوري المجري", country: "المجر"}
            ],
            "slovakia": [
                {name: "Slovan Bratislava", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "MSK Zilina", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Spartak Trnava", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "DAC Dunajska Streda", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Ruzomberok", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Trencin", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Zlate Moravce", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Senica", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Nitra", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Zemplin Michalovce", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Sered", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Liptovsky Mikulas", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Pohronie", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Skalica", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Tatran Presov", league: "الدوري السلوفاكي", country: "سلوفاكيا"},
                {name: "Humenne", league: "الدوري السلوفاكي", country: "سلوفاكيا"}
            ],
            "slovenia": [
                {name: "Maribor", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Olimpija Ljubljana", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Domzale", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Celje", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Gorica", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Koper", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Mura", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Radomlje", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Tabor Sezana", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Aluminij", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Triglav Kranj", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Rudar Velenje", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Krka", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Ankaran Hrpelje", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Bilje", league: "الدوري السلوفيني", country: "سلوفينيا"},
                {name: "Dravinja", league: "الدوري السلوفيني", country: "سلوفينيا"}
            ],
            "israel": [
                {name: "Maccabi Tel Aviv", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Maccabi Haifa", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Hapoel Be'er Sheva", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Beitar Jerusalem", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Hapoel Tel Aviv", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Maccabi Netanya", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Bnei Sakhnin", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Hapoel Hadera", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Ashdod", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Hapoel Haifa", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Ironi Kiryat Shmona", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Hapoel Kfar Saba", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Sektzia Nes Tziona", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Hapoel Nof HaGalil", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Maccabi Bnei Reineh", league: "الدوري الإسرائيلي", country: "إسرائيل"},
                {name: "Hapoel Jerusalem", league: "الدوري الإسرائيلي", country: "إسرائيل"}
            ],
            "cyprus": [
                {name: "APOEL", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Omonia Nicosia", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Anorthosis Famagusta", league: "الدوري القبرصي", country: "قبرص"},
                {name: "AEK Larnaca", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Apollon Limassol", league: "الدوري القبرصي", country: "قبرص"},
                {name: "AEL Limassol", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Pafos FC", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Ethnikos Achna", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Nea Salamis Famagusta", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Olympiakos Nicosia", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Doxa Katokopia", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Enosis Neon Paralimni", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Karmiotissa", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Akritas Chlorakas", league: "الدوري القبرصي", country: "قبرص"},
                {name: "Othellos Athienou", league: "الدوري القبرصي", country: "قبرص"},
                {name: "PAEEK", league: "الدوري القبرصي", country: "قبرص"}
            ],
            "iceland": [
                {name: "KR Reykjavik", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Valur", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "FH Hafnarfjordur", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Breiðablik", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Stjarnan", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "IA Akranes", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "KA Akureyri", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Vikingur Reykjavik", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Fylkir", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "HK Kopavogur", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Grindavik", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Leiknir Reykjavik", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Fjolnir", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Selfoss", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Throttur Reykjavik", league: "الدوري الآيسلندي", country: "آيسلندا"},
                {name: "Afturelding", league: "الدوري الآيسلندي", country: "آيسلندا"}
            ],
            "finland": [
                {name: "HJK Helsinki", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "KuPS", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "Inter Turku", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "SJK", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "Ilves", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "Haka", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "Lahti", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "Honka", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "Mariehamn", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "VPS", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "TPS", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "KTP", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "AC Oulu", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "IFK Mariehamn", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "RoPS", league: "الدوري الفنلندي", country: "فنلندا"},
                {name: "Jaro", league: "الدوري الفنلندي", country: "فنلندا"}
            ],
            "ireland": [
                {name: "Shamrock Rovers", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Bohemians", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Dundalk", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "St Patrick's Athletic", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Sligo Rovers", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Derry City", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Shelbourne", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Cork City", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Waterford", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Finn Harps", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Drogheda United", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "UCD", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Longford Town", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Bray Wanderers", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Athlone Town", league: "الدوري الأيرلندي", country: "أيرلندا"},
                {name: "Wexford", league: "الدوري الأيرلندي", country: "أيرلندا"}
            ],
            "wales": [
                {name: "The New Saints", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Connah's Quay Nomads", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Barry Town United", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Bala Town", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Newtown", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Cardiff Metropolitan University", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Caernarfon Town", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Aberystwyth Town", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Cefn Druids", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Penybont", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Haverfordwest County", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Flint Town United", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Pontypridd Town", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Colwyn Bay", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Llanelli Town", league: "الدوري الويلزي", country: "ويلز"},
                {name: "Carmarthen Town", league: "الدوري الويلزي", country: "ويلز"}
            ],
            "northern_ireland": [
                {name: "Linfield", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Glentoran", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Cliftonville", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Crusaders", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Coleraine", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Larne", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Glenavon", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Ballymena United", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Carrick Rangers", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Dungannon Swifts", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Warrenpoint Town", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Portadown", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Institute", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Ballinamallard United", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Ards", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"},
                {name: "Knockbreda", league: "الدوري الأيرلندي الشمالي", country: "أيرلندا الشمالية"}
            ],
            "colombia": [
                {name: "Atletico Nacional", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Millonarios", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "America de Cali", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Deportivo Cali", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Independiente Medellin", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Junior", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Santa Fe", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Once Caldas", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Deportes Tolima", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Atletico Bucaramanga", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "La Equidad", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Alianza Petrolera", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Envigado", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Patriotas", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Cucuta Deportivo", league: "الدوري الكولومبي", country: "كولومبيا"},
                {name: "Atletico Huila", league: "الدوري الكولومبي", country: "كولومبيا"}
            ],
            "chile": [
                {name: "Colo-Colo", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Universidad de Chile", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Universidad Catolica", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Cobreloa", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Audax Italiano", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Palestino", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Union Espanola", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "O'Higgins", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Deportes Iquique", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Everton", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Huachipato", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Deportes La Serena", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Curico Unido", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Union La Calera", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Coquimbo Unido", league: "الدوري التشيلي", country: "تشيلي"},
                {name: "Santiago Wanderers", league: "الدوري التشيلي", country: "تشيلي"}
            ],
            "peru": [
                {name: "Alianza Lima", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Universitario", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Sporting Cristal", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Melgar", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Cienciano", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Sport Boys", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Deportivo Municipal", league: "الدوري البيروفي", country: "بيرو"},
                {name: "UTC Cajamarca", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Ayacucho FC", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Carlos A. Mannucci", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Cusco FC", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Alianza Atlético", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Academia Cantolao", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Deportivo Binacional", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Universidad San Martin", league: "الدوري البيروفي", country: "بيرو"},
                {name: "Universidad Cesar Vallejo", league: "الدوري البيروفي", country: "بيرو"}
            ],
            "ecuador": [
                {name: "Barcelona SC", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Emelec", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "LDU Quito", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Independiente del Valle", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Deportivo Cuenca", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "El Nacional", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Aucas", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Delfin", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Macara", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Universidad Catolica", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Tecnico Universitario", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Guayaquil City", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Mushuc Runa", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Orense", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "9 de Octubre", league: "الدوري الإكوادوري", country: "الإكوادور"},
                {name: "Cumbaya", league: "الدوري الإكوادوري", country: "الإكوادور"}
            ],
            "uruguay": [
                {name: "Penarol", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Nacional", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Defensor Sporting", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Danubio", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "River Plate Montevideo", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Cerro", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Wanderers", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Liverpool Montevideo", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Fenix", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Racing Club Montevideo", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Boston River", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Plaza Colonia", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Cerro Largo", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Deportivo Maldonado", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Juventud", league: "الدوري الأوروغواياني", country: "الأوروغواي"},
                {name: "Villa Teresa", league: "الدوري الأوروغواياني", country: "الأوروغواي"}
            ],
            "paraguay": [
                {name: "Olimpia", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Cerro Porteno", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Libertad", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Guarani", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Nacional", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Sol de America", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Sportivo Luqueno", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "General Diaz", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "River Plate Asuncion", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Guairena", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "12 de Octubre", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Sportivo San Lorenzo", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Tacuary", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Independiente CG", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Resistencia", league: "الدوري الباراغواياني", country: "باراغواي"},
                {name: "Deportivo Santani", league: "الدوري الباراغواياني", country: "باراغواي"}
            ],
            "bolivia": [
                {name: "The Strongest", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Bolivar", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Wilstermann", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Oriente Petrolero", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Jorge Wilstermann", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Real Potosi", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Blooming", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Nacional Potosi", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Royal Pari", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Guabira", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Aurora", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Always Ready", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Independiente Petrolero", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Real Santa Cruz", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "Universitario de Sucre", league: "الدوري البوليفي", country: "بوليفيا"},
                {name: "San Jose", league: "الدوري البوليفي", country: "بوليفيا"}
            ],
            "venezuela": [
                {name: "Caracas", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Deportivo Tachira", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Estudiantes de Merida", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Deportivo La Guaira", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Zamora", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Metropolitanos", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Monagas", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Portuguesa", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Aragua", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Trujillanos", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Lara", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Mineros de Guayana", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Atletico Venezuela", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Deportivo Lara", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Zulia", league: "الدوري الفنزويلي", country: "فنزويلا"},
                {name: "Llaneros de Guanare", league: "الدوري الفنزويلي", country: "فنزويلا"}
            ],
            "costa_rica": [
                {name: "Deportivo Saprissa", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Alajuelense", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Herediano", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Cartagines", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Perez Zeledon", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Santos de Guapiles", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "San Carlos", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Grecia", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Limón", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Guadalupe", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Jicaral", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Sporting San Jose", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "UCR", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Municipal Liberia", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Puntarenas", league: "الدوري الكوستاريكي", country: "كوستاريكا"},
                {name: "Carmelita", league: "الدوري الكوستاريكي", country: "كوستاريكا"}
            ],
            "honduras": [
                {name: "Olimpia", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Motagua", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Real Espana", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Marathon", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Platense", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Victoria", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Real Sociedad", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Lobos UPNFM", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Honduras Progreso", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Vida", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "UPNFM", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Parillas One", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Real de Minas", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Atletico Independiente", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "CDS Vida", league: "الدوري الهندوراسي", country: "هندوراس"},
                {name: "Juticalpa", league: "الدوري الهندوراسي", country: "هندوراس"}
            ],
            "el_salvador": [
                {name: "Alianza", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "FAS", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Aguila", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Isidro Metapan", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Santa Tecla", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Chalatenango", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Limeño", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Atletico Marte", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Once Municipal", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Sonsonate", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Firpo", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Platense", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Municipal Limeno", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Jocoro", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "CD Dragon", league: "الدوري السلفادوري", country: "السلفادور"},
                {name: "Atletico Balboa", league: "الدوري السلفادوري", country: "السلفادور"}
            ],
            "guatemala": [
                {name: "Comunicaciones", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Municipal", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Xelaju", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Antigua GFC", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Coban Imperial", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Malacateco", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Guastatoya", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Santa Lucia Cotzumalguapa", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Deportivo Mixco", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Iztapa", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Xinabajul", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Achuapa", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Siquinala", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Deportivo Sanarate", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Deportivo Coatepeque", league: "الدوري الغواتيمالي", country: "غواتيمالا"},
                {name: "Deportivo Petapa", league: "الدوري الغواتيمالي", country: "غواتيمالا"}
            ],
            "panama": [
                {name: "Tauro", league: "الدوري البنمي", country: "بنما"},
                {name: "Alianza", league: "الدوري البنمي", country: "بنما"},
                {name: "Plaza Amador", league: "الدوري البنمي", country: "بنما"},
                {name: "San Francisco", league: "الدوري البنمي", country: "بنما"},
                {name: "Arabe Unido", league: "الدوري البنمي", country: "بنما"},
                {name: "Sporting San Miguelito", league: "الدوري البنمي", country: "بنما"},
                {name: "Independiente", league: "الدوري البنمي", country: "بنما"},
                {name: "Atletico Chiriqui", league: "الدوري البنمي", country: "بنما"},
                {name: "Costa del Este", league: "الدوري البنمي", country: "بنما"},
                {name: "Veraguas", league: "الدوري البنمي", country: "بنما"},
                {name: "Atletico Nacional", league: "الدوري البنمي", country: "بنما"},
                {name: "CD Universitario", league: "الدوري البنمي", country: "بنما"},
                {name: "Atletico Bucaramanga", league: "الدوري البنمي", country: "بنما"},
                {name: "Deportivo del Este", league: "الدوري البنمي", country: "بنما"},
                {name: "Chorrillo", league: "الدوري البنمي", country: "بنما"},
                {name: "Atletico Veraguense", league: "الدوري البنمي", country: "بنما"}
            ],
            "jamaica": [
                {name: "Harbour View", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Arnett Gardens", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Portmore United", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Waterhouse", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Tivoli Gardens", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Cavalier", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Mount Pleasant", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Dunbeholden", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Molynes United", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Humble Lions", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Vere United", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Montego Bay United", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Reno", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "UWI", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Chapelton Maroons", league: "الدوري الجامايكي", country: "جامايكا"},
                {name: "Frazsiers Whip", league: "الدوري الجامايكي", country: "جامايكا"}
            ],
            "trinidad": [
                {name: "W Connection", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Defence Force", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Police FC", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Club Sando", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Point Fortin Civic", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Morvant Caledonia United", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "San Juan Jabloteh", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Caledonia AIA", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Central FC", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "St. Ann's Rangers", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Ma Pau Stars", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Joe Public", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "T&TEC", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "North East Stars", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "Police FC", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"},
                {name: "UTT", league: "الدوري الترينيدادي", country: "ترينيداد وتوباغو"}
            ],
            "australia": [
                {name: "Sydney FC", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Melbourne Victory", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Melbourne City", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Western Sydney Wanderers", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Adelaide United", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Brisbane Roar", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Perth Glory", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Central Coast Mariners", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Newcastle Jets", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Wellington Phoenix", league: "الدوري الأسترالي", country: "نيوزيلندا"},
                {name: "Macarthur FC", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Western United", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Gold Coast United", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "North Queensland Fury", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Canberra United", league: "الدوري الأسترالي", country: "أستراليا"},
                {name: "Wollongong Wolves", league: "الدوري الأسترالي", country: "أستراليا"}
            ],
            "new_zealand": [
                {name: "Auckland City", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Team Wellington", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Waitakere United", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Canterbury United", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Hawke's Bay United", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Wellington Phoenix Reserves", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Southern United", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Tasman United", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Eastern Suburbs", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Hamilton Wanderers", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Miramar Rangers", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Napier City Rovers", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Petone", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Western Springs", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Birkenhead United", league: "الدوري النيوزيلندي", country: "نيوزيلندا"},
                {name: "Christchurch United", league: "الدوري النيوزيلندي", country: "نيوزيلندا"}
            ],
            "india": [
                {name: "Bengaluru FC", league: "الدوري الهندي", country: "الهند"},
                {name: "Mumbai City", league: "الدوري الهندي", country: "الهند"},
                {name: "ATK Mohun Bagan", league: "الدوري الهندي", country: "الهند"},
                {name: "FC Goa", league: "الدوري الهندي", country: "الهند"},
                {name: "Chennaiyin FC", league: "الدوري الهندي", country: "الهند"},
                {name: "Kerala Blasters", league: "الدوري الهندي", country: "الهند"},
                {name: "Jamshedpur FC", league: "الدوري الهندي", country: "الهند"},
                {name: "Hyderabad FC", league: "الدوري الهندي", country: "الهند"},
                {name: "NorthEast United", league: "الدوري الهندي", country: "الهند"},
                {name: "Odisha FC", league: "الدوري الهندي", country: "الهند"},
                {name: "East Bengal", league: "الدوري الهندي", country: "الهند"},
                {name: "Punjab FC", league: "الدوري الهندي", country: "الهند"},
                {name: "Mohun Bagan", league: "الدوري الهندي", country: "الهند"},
                {name: "Churchill Brothers", league: "الدوري الهندي", country: "الهند"},
                {name: "Aizawl FC", league: "الدوري الهندي", country: "الهند"},
                {name: "Shillong Lajong", league: "الدوري الهندي", country: "الهند"}
            ],
            "thailand": [
                {name: "Buriram United", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Bangkok United", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Muangthong United", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Port FC", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Chiangrai United", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "BG Pathum United", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Ratchaburi", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Suphanburi", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Nakhon Ratchasima", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Prachuap", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Sukhothai", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Samut Prakan City", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "PTT Rayong", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Trat", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Chonburi", league: "الدوري التايلاندي", country: "تايلاند"},
                {name: "Police Tero", league: "الدوري التايلاندي", country: "تايلاند"}
            ],
            "vietnam": [
                {name: "Hanoi FC", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Hoang Anh Gia Lai", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Binh Duong", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Thanh Hoa", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Ha Noi T&T", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Song Lam Nghe An", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Nam Dinh", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Quang Nam", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Hai Phong", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Ho Chi Minh City", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Sanna Khanh Hoa", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "SHB Da Nang", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Quang Ninh", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Can Tho", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Dong Thap", league: "الدوري الفيتنامي", country: "فيتنام"},
                {name: "Long An", league: "الدوري الفيتنامي", country: "فيتنام"}
            ],
            "malaysia": [
                {name: "Johor Darul Ta'zim", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Kedah", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Selangor", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Pahang", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Terengganu", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Perak", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Kuala Lumpur City", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Sabah", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Penang", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Melaka United", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Sarawak United", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Negeri Sembilan", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "UiTM", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Petaling Jaya City", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Kelantan", league: "الدوري الماليزي", country: "ماليزيا"},
                {name: "Felda United", league: "الدوري الماليزي", country: "ماليزيا"}
            ],
            "indonesia": [
                {name: "Persib Bandung", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Persija Jakarta", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Arema FC", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Bali United", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Persebaya Surabaya", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "PSM Makassar", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Madura United", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Persita Tangerang", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Persikabo 1973", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Bhayangkara FC", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "PSIS Semarang", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Barito Putera", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "PSS Sleman", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Borneo FC", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "Dewa United", league: "الدوري الإندونيسي", country: "إندونيسيا"},
                {name: "RANS Nusantara", league: "الدوري الإندونيسي", country: "إندونيسيا"}
            ],
            "singapore": [
                {name: "Lion City Sailors", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Tampines Rovers", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Albirex Niigata Singapore", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Hougang United", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Geylang International", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Balestier Khalsa", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Tanjong Pagar United", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Young Lions", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Home United", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Warriors FC", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Brunei DPMM", league: "الدوري السنغافوري", country: "بروناي"},
                {name: "Woodlands Wellington", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Sengkang Punggol", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "SAFFC", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Gombak United", league: "الدوري السنغافوري", country: "سنغافورة"},
                {name: "Jurong FC", league: "الدوري السنغافوري", country: "سنغافورة"}
            ],
            "philippines": [
                {name: "United City", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Kaya FC-Iloilo", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Ceres-Negros", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Stallion Laguna", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Dynamic Herb Cebu", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Maharlika Manila", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "ADT", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Mendiola FC", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Philippine Army", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Green Archers United", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Global Cebu", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Loyola Meralco Sparks", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Davao Aguilas", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "JP Voltes", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Stallion FC", league: "الدوري الفلبيني", country: "الفلبين"},
                {name: "Philippine Air Force", league: "الدوري الفلبيني", country: "الفلبين"}
            ],
            "hong_kong": [
                {name: "Kitchee", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Eastern", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Lee Man", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Southern", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Rangers", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Happy Valley", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Resources Capital", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "HK U23", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Tai Po", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Yuen Long", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Pegasus", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Wofoo Tai Po", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Sun Hei", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Citizen", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "South China", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"},
                {name: "Biu Chun Glory Sky", league: "الدوري الهونغ كونغي", country: "هونغ كونغ"}
            ],
            "iran": [
                {name: "Persepolis", league: "الدوري الإيراني", country: "إيران"},
                {name: "Esteghlal", league: "الدوري الإيراني", country: "إيران"},
                {name: "Sepahan", league: "الدوري الإيراني", country: "إيران"},
                {name: "Tractor", league: "الدوري الإيراني", country: "إيران"},
                {name: "Foolad", league: "الدوري الإيراني", country: "إيران"},
                {name: "Zob Ahan", league: "الدوري الإيراني", country: "إيران"},
                {name: "Saipa", league: "الدوري الإيراني", country: "إيران"},
                {name: "Nassaji Mazandaran", league: "الدوري الإيراني", country: "إيران"},
                {name: "Mes Rafsanjan", league: "الدوري الإيراني", country: "إيران"},
                {name: "Gol Gohar", league: "الدوري الإيراني", country: "إيران"},
                {name: "Sanat Naft", league: "الدوري الإيراني", country: "إيران"},
                {name: "Aluminium Arak", league: "الدوري الإيراني", country: "إيران"},
                {name: "Paykan", league: "الدوري الإيراني", country: "إيران"},
                {name: "Naft Masjed Soleyman", league: "الدوري الإيراني", country: "إيران"},
                {name: "Machine Sazi", league: "الدوري الإيراني", country: "إيران"},
                {name: "Shahin Bushehr", league: "الدوري الإيراني", country: "إيران"}
            ],
            "iraq": [
                {name: "Al Shorta", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Quwa Al Jawiya", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Zawraa", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Talaba", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Najaf", league: "الدوري العراقي", country: "العراق"},
                {name: "Naft Al Wasat", league: "الدوري العراقي", country: "العراق"},
                {name: "Naft Maysan", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Minaa", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Karkh", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Hudood", league: "الدوري العراقي", country: "العراق"},
                {name: "Erbil", league: "الدوري العراقي", country: "العراق"},
                {name: "Duhok", league: "الدوري العراقي", country: "العراق"},
                {name: "Sulaymaniyah", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Kahraba", league: "الدوري العراقي", country: "العراق"},
                {name: "Naft Al Junoob", league: "الدوري العراقي", country: "العراق"},
                {name: "Al Simawa", league: "الدوري العراقي", country: "العراق"}
            ],
            "jordan": [
                {name: "Al Faisaly", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Wehdat", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Jazeera", league: "الدوري الأردني", country: "الأردن"},
                {name: "Shabab Al Ordon", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Ramtha", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Hussein", league: "الدوري الأردني", country: "الأردن"},
                {name: "That Ras", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Sareeh", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Buqa'a", league: "الدوري الأردني", country: "الأردن"},
                {name: "Ma'an", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Ahli", league: "الدوري الأردني", country: "الأردن"},
                {name: "Shabab Al Aqaba", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Salt", league: "الدوري الأردني", country: "الأردن"},
                {name: "Moghayer Al Sarhan", league: "الدوري الأردني", country: "الأردن"},
                {name: "Kfarsoum", league: "الدوري الأردني", country: "الأردن"},
                {name: "Al Yarmouk", league: "الدوري الأردني", country: "الأردن"}
            ],
            "lebanon": [
                {name: "Al Ahed", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Al Ansar", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Safa", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Nejmeh", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Shabab Al Sahel", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Tripoli", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Salam Zgharta", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Bourj", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Shabab Al Ghazieh", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Tadamon Sour", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Akhaa Ahli Aley", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Racing Beirut", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Hikma", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Shabab Al Arabi", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Al Islah Al Bourj", league: "الدوري اللبناني", country: "لبنان"},
                {name: "Al Mabarra", league: "الدوري اللبناني", country: "لبنان"}
            ],
            "syria": [
                {name: "Al Jaish", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Wahda", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Ittihad", league: "الدوري السوري", country: "سوريا"},
                {name: "Tishreen", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Shorta", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Karamah", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Futuwa", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Sahel", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Wathba", league: "الدوري السوري", country: "سوريا"},
                {name: "Jableh", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Horriya", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Nawair", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Majd", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Yarmouk", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Fairooza", league: "الدوري السوري", country: "سوريا"},
                {name: "Al Qardaha", league: "الدوري السوري", country: "سوريا"}
            ],
            "palestine": [
                {name: "Shabab Al Khalil", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Markaz Balata", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Shabab Al Am'ari", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Jabal Al Mukaber", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Ahli Al Khalil", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Taraji Wadi Al Nes", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Shabab Al Dhahiriya", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Islami Qalqilya", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Thaqafi Tulkarem", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Shabab Al Bireh", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Markaz Tulkarem", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Shabab Al Ama'ri", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Ahli Al Quds", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Markaz Shabab Al Am'ari", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Islami Al Bireh", league: "الدوري الفلسطيني", country: "فلسطين"},
                {name: "Shabab Al Khader", league: "الدوري الفلسطيني", country: "فلسطين"}
            ],
            "kuwait": [
                {name: "Al Kuwait", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Qadsia", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Arabi", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Salmiya", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Kazma", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Naser", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Shabab", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Fahaheel", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Sahel", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Tadhamon", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Yarmouk", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Sulaibikhat", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Jahra", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Khaitan", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Burgan", league: "الدوري الكويتي", country: "الكويت"},
                {name: "Al Salibikhaet", league: "الدوري الكويتي", country: "الكويت"}
            ],
            "bahrain": [
                {name: "Al Muharraq", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Riffa", league: "الدوري البحريني", country: "البحرين"},
                {name: "Manama", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Ahli", league: "الدوري البحريني", country: "البحرين"},
                {name: "East Riffa", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Hala", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Najma", league: "الدوري البحريني", country: "البحرين"},
                {name: "Busaiteen", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Shabab", league: "الدوري البحريني", country: "البحرين"},
                {name: "Malkiya", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Ittifaq", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Hadd", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Ittihad", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Tadamun", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Isa", league: "الدوري البحريني", country: "البحرين"},
                {name: "Al Qadam", league: "الدوري البحريني", country: "البحرين"}
            ],
            "oman": [
                {name: "Al Seeb", league: "الدوري العماني", country: "عمان"},
                {name: "Dhofar", league: "الدوري العماني", country: "عمان"},
                {name: "Al Suwaiq", league: "الدوري العماني", country: "عمان"},
                {name: "Al Nahda", league: "الدوري العماني", country: "عمان"},
                {name: "Al Oruba", league: "الدوري العماني", country: "عمان"},
                {name: "Al Nasr", league: "الدوري العماني", country: "عمان"},
                {name: "Sohar", league: "الدوري العماني", country: "عمان"},
                {name: "Al Rustaq", league: "الدوري العماني", country: "عمان"},
                {name: "Bahla", league: "الدوري العماني", country: "عمان"},
                {name: "Al Shabab", league: "الدوري العماني", country: "عمان"},
                {name: "Sur", league: "الدوري العماني", country: "عمان"},
                {name: "Al Musannah", league: "الدوري العماني", country: "عمان"},
                {name: "Al Salam", league: "الدوري العماني", country: "عمان"},
                {name: "Al Ittihad", league: "الدوري العماني", country: "عمان"},
                {name: "Al Kamil", league: "الدوري العماني", country: "عمان"},
                {name: "Al Bashayer", league: "الدوري العماني", country: "عمان"}
            ],
            "yemen": [
                {name: "Al Ahli Sana'a", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Tilal", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Wehda Sana'a", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Sha'ab Ibb", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Yarmuk Al Rawda", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Saqr", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Oruba", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Shula", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Wahda Aden", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Tadamon", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Shabab Al Baydaa", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Zohra", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Saeed", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Ittihad Ibb", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Ahli Taiz", league: "الدوري اليمني", country: "اليمن"},
                {name: "Al Sha'ab Hadramaut", league: "الدوري اليمني", country: "اليمن"}
            ],
            "sudan": [
                {name: "Al Hilal Omdurman", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Merreikh", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Merreikh Al Nahud", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Ahli Khartoum", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Hilal Port Sudan", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Ahli Atbara", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Mourada", league: "الدوري السوداني", country: "السودان"},
                {name: "Hay Al Wadi", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Khartoum", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Hilal Kaduqli", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Ahly Shendi", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Shorta", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Amal Atbara", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Nile", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Ittihad", league: "الدوري السوداني", country: "السودان"},
                {name: "Al Ahli Wad Madani", league: "الدوري السوداني", country: "السودان"}
            ],
            "ethiopia": [
                {name: "Saint George", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Ethiopian Coffee", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Fasil Kenema", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Dire Dawa City", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Adama City", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Hawassa City", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Wolaitta Dicha", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Bahir Dar Kenema", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Jimma Aba Jifar", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Sidama Coffee", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Mekelle 70 Enderta", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Hadiya Hossana", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Addis Ababa City", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Arba Minch City", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Wolkite City", league: "الدوري الإثيوبي", country: "إثيوبيا"},
                {name: "Sebeta City", league: "الدوري الإثيوبي", country: "إثيوبيا"}
            ],
            "kenya": [
                {name: "Gor Mahia", league: "الدوري الكيني", country: "كينيا"},
                {name: "AFC Leopards", league: "الدوري الكيني", country: "كينيا"},
                {name: "Tusker", league: "الدوري الكيني", country: "كينيا"},
                {name: "Sofapaka", league: "الدوري الكيني", country: "كينيا"},
                {name: "Ulinzi Stars", league: "الدوري الكيني", country: "كينيا"},
                {name: "Mathare United", league: "الدوري الكيني", country: "كينيا"},
                {name: "Bandari", league: "الدوري الكيني", country: "كينيا"},
                {name: "Kariobangi Sharks", league: "الدوري الكيني", country: "كينيا"},
                {name: "Nzoia Sugar", league: "الدوري الكيني", country: "كينيا"},
                {name: "Posta Rangers", league: "الدوري الكيني", country: "كينيا"},
                {name: "Kakamega Homeboyz", league: "الدوري الكيني", country: "كينيا"},
                {name: "Western Stima", league: "الدوري الكيني", country: "كينيا"},
                {name: "Sony Sugar", league: "الدوري الكيني", country: "كينيا"},
                {name: "Chemelil Sugar", league: "الدوري الكيني", country: "كينيا"},
                {name: "Thika United", league: "الدوري الكيني", country: "كينيا"},
                {name: "Nairobi City Stars", league: "الدوري الكيني", country: "كينيا"}
            ],
            "uganda": [
                {name: "KCCA", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Villa SC", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "URA", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Express FC", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Police FC", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "BUL FC", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Onduparaka", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Mbarara City", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Wakiso Giants", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Busoga United", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Kyetume", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Tooro United", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Maroons", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Bright Stars", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Soltilo Bright Stars", league: "الدوري الأوغندي", country: "أوغندا"},
                {name: "Kyetume FC", league: "الدوري الأوغندي", country: "أوغندا"}
            ],
            "tanzania": [
                {name: "Young Africans", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Simba SC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Azam FC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Mtibwa Sugar", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Coastal Union", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Kagera Sugar", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Ruvu Shooting", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Namungo FC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Mbao FC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Lipuli FC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Mbeya City", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "JKT Tanzania", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Prisons SC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Mwanza FC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "Maji Maji FC", league: "الدوري التنزاني", country: "تنزانيا"},
                {name: "African Sports", league: "الدوري التنزاني", country: "تنزانيا"}
            ],
            "ghana": [
                {name: "Asante Kotoko", league: "الدوري الغاني", country: "غانا"},
                {name: "Hearts of Oak", league: "الدوري الغاني", country: "غانا"},
                {name: "Medeama", league: "الدوري الغاني", country: "غانا"},
                {name: "Ashanti Gold", league: "الدوري الغاني", country: "غانا"},
                {name: "Aduana Stars", league: "الدوري الغاني", country: "غانا"},
                {name: "WAFA", league: "الدوري الغاني", country: "غانا"},
                {name: "Great Olympics", league: "الدوري الغاني", country: "غانا"},
                {name: "Bechem United", league: "الدوري الغاني", country: "غانا"},
                {name: "Berekum Chelsea", league: "الدوري الغاني", country: "غانا"},
                {name: "Dreams FC", league: "الدوري الغاني", country: "غانا"},
                {name: "Elmina Sharks", league: "الدوري الغاني", country: "غانا"},
                {name: "Karela United", league: "الدوري الغاني", country: "غانا"},
                {name: "Legon Cities", league: "الدوري الغاني", country: "غانا"},
                {name: "King Faisal", league: "الدوري الغاني", country: "غانا"},
                {name: "Inter Allies", league: "الدوري الغاني", country: "غانا"},
                {name: "Ebusua Dwarfs", league: "الدوري الغاني", country: "غانا"}
            ],
            "nigeria": [
                {name: "Enyimba", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Kano Pillars", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Rangers International", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Akwa United", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Lobi Stars", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Plateau United", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Heartland", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Shooting Stars", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Kwara United", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Nasarawa United", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Wikki Tourists", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Sunshine Stars", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Abia Warriors", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Rivers United", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "Katsina United", league: "الدوري النيجيري", country: "نيجيريا"},
                {name: "MFM FC", league: "الدوري النيجيري", country: "نيجيريا"}
            ],
            "cameroon": [
                {name: "Coton Sport", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Union Douala", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Canon Yaounde", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Bamboutos", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "UMS de Loum", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Stade Renard", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "APEJES Academy", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Fovu Club", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Colombe", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Dragon Club", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Panthère", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Astres", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "New Star", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Feutcheu FC", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "Avion Academy", league: "الدوري الكاميروني", country: "الكاميرون"},
                {name: "YOSA", league: "الدوري الكاميروني", country: "الكاميرون"}
            ],
            "ivory_coast": [
                {name: "ASEC Mimosas", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "AFAD Djékanou", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "SC Gagnoa", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "Stade d'Abidjan", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "WAC", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "SOA", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "San-Pédro", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "ASI d'Abengourou", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "FC San-Pédro", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "USC Bassam", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "Bouaké FC", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "CO Korhogo", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "Lys Sassandra", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "Séwé Sports", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "Williamsville AC", league: "الدوري الإيفواري", country: "ساحل العاج"},
                {name: "Stella Club", league: "الدوري الإيفواري", country: "ساحل العاج"}
            ],
            "senegal": [
                {name: "Diambars", league: "الدوري السنغالي", country: "السنغال"},
                {name: "Casa Sports", league: "الدوري السنغالي", country: "السنغال"},
                {name: "ASC Jaraaf", league: "الدوري السنغالي", country: "السنغال"},
                {name: "US Gorée", league: "الدوري السنغالي", country: "السنغال"},
                {name: "AS Douanes", league: "الدوري السنغالي", country: "السنغال"},
                {name: "Génération Foot", league: "الدوري السنغالي", country: "السنغال"},
                {name: "Stade de Mbour", league: "الدوري السنغالي", country: "السنغال"},
                {name: "ASC Linguère", league: "الدوري السنغالي", country: "السنغال"},
                {name: "AS Pikine", league: "الدوري السنغالي", country: "السنغال"},
                {name: "Teungueth FC", league: "الدوري السنغالي", country: "السنغال"},
                {name: "ASC SUNEOR", league: "الدوري السنغالي", country: "السنغال"},
                {name: "ASEC Ndiambour", league: "الدوري السنغالي", country: "السنغال"},
                {name: "US Ouakam", league: "الدوري السنغالي", country: "السنغال"},
                {name: "Diambars FC", league: "الدوري السنغالي", country: "السنغال"},
                {name: "Stade de Mbour", league: "الدوري السنغالي", country: "السنغال"},
                {name: "ASC SUNEOR", league: "الدوري السنغالي", country: "السنغال"}
            ],
            "mali": [
                {name: "Stade Malien", league: "الدوري المالي", country: "مالي"},
                {name: "Djoliba AC", league: "الدوري المالي", country: "مالي"},
                {name: "Real Bamako", league: "الدوري المالي", country: "مالي"},
                {name: "Onze Créateurs", league: "الدوري المالي", country: "مالي"},
                {name: "USFAS Bamako", league: "الدوري المالي", country: "مالي"},
                {name: "AS Bakaridjan", league: "الدوري المالي", country: "مالي"},
                {name: "AS Real Bamako", league: "الدوري المالي", country: "مالي"},
                {name: "CO Bamako", league: "الدوري المالي", country: "مالي"},
                {name: "AS Police", league: "الدوري المالي", country: "مالي"},
                {name: "AS Nianan", league: "الدوري المالي", country: "مالي"},
                {name: "AS Korofina", league: "الدوري المالي", country: "مالي"},
                {name: "AS Mamahira", league: "الدوري المالي", country: "مالي"},
                {name: "AS Black Stars", league: "الدوري المالي", country: "مالي"},
                {name: "AS Mandé", league: "الدوري المالي", country: "مالي"},
                {name: "AS Bamako", league: "الدوري المالي", country: "مالي"},
                {name: "AS Sigui", league: "الدوري المالي", country: "مالي"}
            ],
            "dr_congo": [
                {name: "TP Mazembe", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "AS Vita Club", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "DC Motema Pembe", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "AS Maniema Union", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "FC Saint Eloi Lupopo", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "SM Sanga Balende", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "JS Groupe Bazano", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "RCK", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "US Tshinkunku", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "FC Renaissance", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "AS Nyuki", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "FC MK", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "FC Lubumbashi Sport", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "FC Bilombe", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "FC Etoile du Kivu", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"},
                {name: "FC Bukavu Dawa", league: "الدوري الكونغولي الديمقراطي", country: "جمهورية الكونغو الديمقراطية"}
            ],
            "congo": [
                {name: "AC Léopards", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "AS Otôho", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "Diables Noirs", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "Etoile du Congo", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "JS Talangaï", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "CARA Brazzaville", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "Patronage Sainte-Anne", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "FC Kondzo", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "Inter Club", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "USM", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "AS Cheminots", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "FC Bilombé", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "FC Cuvette", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "FC Kondzo", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "FC Ngo", league: "الدوري الكونغولي", country: "جمهورية الكونغو"},
                {name: "FC Tchicamba", league: "الدوري الكونغولي", country: "جمهورية الكونغو"}
            ],
            "zambia": [
                {name: "Zanaco", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "ZESCO United", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Power Dynamos", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Nkana", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Green Buffaloes", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Red Arrows", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Forest Rangers", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Buildcon", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Lusaka Dynamos", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Green Eagles", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Napsa Stars", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Kabwe Warriors", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Nchanga Rangers", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Konkola Blades", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Lumwana Radiants", league: "الدوري الزامبي", country: "زامبيا"},
                {name: "Kitwe United", league: "الدوري الزامبي", country: "زامبيا"}
            ],
            "zimbabwe": [
                {name: "Dynamos", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Highlanders", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "CAPS United", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "FC Platinum", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Chicken Inn", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Ngezi Platinum", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Triangle United", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Harare City", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Bulawayo Chiefs", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Manica Diamonds", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Black Rhinos", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Yadah", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "ZPC Kariba", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Herentals", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Tenax", league: "الدوري الزيمبابوي", country: "زيمبابوي"},
                {name: "Cranborne Bullets", league: "الدوري الزيمبابوي", country: "زيمبابوي"}
            ],
            "south_africa": [
                {name: "Mamelodi Sundowns", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Kaizer Chiefs", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Orlando Pirates", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Bidvest Wits", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "SuperSport United", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Bloemfontein Celtic", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Cape Town City", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Maritzburg United", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "AmaZulu", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Baroka", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Black Leopards", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Chippa United", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Golden Arrows", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Highlands Park", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Polokwane City", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"},
                {name: "Stellenbosch", league: "الدوري الجنوب أفريقي", country: "جنوب أفريقيا"}
            ],
            "angola": [
                {name: "Petro de Luanda", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Primeiro de Agosto", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Sagrada Esperança", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Interclube", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Recreativo do Libolo", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Progresso do Sambizanga", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Kabuscorp", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Académica do Lobito", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Desportivo da Huíla", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Recreativo da Caála", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Santa Rita de Cássia", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Wiliete SC", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Sporting de Cabinda", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Ferroviário do Huambo", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "1º de Maio", league: "الدوري الأنغولي", country: "أنغولا"},
                {name: "Saurimo FC", league: "الدوري الأنغولي", country: "أنغولا"}
            ],
            "mozambique": [
                {name: "Ferroviário de Maputo", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Costa do Sol", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Liga Desportiva", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Ferroviário de Nampula", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Ferroviário da Beira", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Textáfrica", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Maxaquene", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Matchedje", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Vilankulo", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Chingale de Tete", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Estrela Vermelha", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Ferroviário de Quelimane", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Incomáti", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Chibuto", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "1º de Maio", league: "الدوري الموزمبيقي", country: "موزمبيق"},
                {name: "Águias de Pemba", league: "الدوري الموزمبيقي", country: "موزمبيق"}
            ]
        };

        // حالة الوضع الليلي
        let isNightMode = false;

        // تخزين بيانات الفريقين
        let teamData = {
            team1: { name: "", results: [], goals: [] },
            team2: { name: "", results: [], goals: [] }
        };

        // تهيئة النتائج للفرق
        document.addEventListener('DOMContentLoaded', function() {
            initializeTeamResults('team1-results', ['W', 'W', 'D', 'W', 'L']);
            initializeTeamResults('team2-results', ['W', 'D', 'L', 'W', 'W']);
            
            initializeGoalsInput('team1-goals', [2, 3, 1, 2, 0]);
            initializeGoalsInput('team2-goals', [2, 1, 0, 3, 2]);
            
            // إضافة حدث النقر لزر الحساب
            document.getElementById('calculate-btn').addEventListener('click', calculateDoubleChance);
            
            // إضافة حدث لزر تغيير الوضع
            document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
            
            // تحميل الوضع من التخزين المحلي
            loadThemePreference();
            
            // إغلاق الاقتراحات عند النقر خارجها
            document.addEventListener('click', function(e) {
                if (!e.target.matches('.search-input')) {
                    closeAllSuggestions();
                }
            });
        });

        // دالة إظهار الاقتراحات
        function showSuggestions(query, team) {
            const suggestionsBox = document.getElementById(`${team}-suggestions`);
            
            if (query.length < 2) {
                suggestionsBox.style.display = 'none';
                return;
            }
            
            const selectedLeague = document.getElementById('league-select').value;
            let filteredTeams = [];
            
            if (selectedLeague === 'all') {
                // البحث في جميع الدوريات
                for (const league in globalTeams) {
                    filteredTeams = filteredTeams.concat(
                        globalTeams[league].filter(teamObj => 
                            teamObj.name.toLowerCase().includes(query.toLowerCase())
                        )
                    );
                }
            } else {
                // البحث في الدوري المحدد فقط
                filteredTeams = globalTeams[selectedLeague].filter(teamObj => 
                    teamObj.name.toLowerCase().includes(query.toLowerCase())
                );
            }
            
            // عرض الاقتراحات
            if (filteredTeams.length > 0) {
                let suggestionsHTML = '';
                filteredTeams.forEach(teamObj => {
                    suggestionsHTML += `
                        <div class="suggestion-item" onclick="selectTeam('${teamObj.name}', '${team}')">
                            <div>${teamObj.name}</div>
                            <div class="team-league">${teamObj.league} - ${teamObj.country}</div>
                        </div>
                    `;
                });
                suggestionsBox.innerHTML = suggestionsHTML;
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        // دالة اختيار فريق من الاقتراحات
        function selectTeam(teamName, team) {
            document.getElementById(`${team}-search`).value = teamName;
            document.getElementById(`${team}-suggestions`).style.display = 'none';
            
            // تحديث اسم الفريق في البيانات
            if (team === 'team1') {
                teamData.team1.name = teamName;
            } else {
                teamData.team2.name = teamName;
            }
        }

        // دالة إغلاق جميع الاقتراحات
        function closeAllSuggestions() {
            document.getElementById('team1-suggestions').style.display = 'none';
            document.getElementById('team2-suggestions').style.display = 'none';
        }

        // دالة تصفية الفرق حسب الدوري
        function filterTeamsByLeague() {
            // إغلاق أي اقتراحات مفتوحة
            closeAllSuggestions();
            
            // مسح حقول البحث
            document.getElementById('team1-search').value = '';
            document.getElementById('team2-search').value = '';
        }

        // دالة تغيير الوضع الليلي/النهاري
        function toggleTheme() {
            isNightMode = !isNightMode;
            const body = document.body;
            const themeToggle = document.getElementById('theme-toggle');
            
            if (isNightMode) {
                body.classList.add('night-mode');
                themeToggle.textContent = '☀️';
            } else {
                body.classList.remove('night-mode');
                themeToggle.textContent = '🌙';
            }
            
            // حفظ التفضيل في التخزين المحلي
            localStorage.setItem('nightMode', isNightMode);
        }

        // دالة تحميل تفضيل الوضع
        function loadThemePreference() {
            const savedTheme = localStorage.getItem('nightMode');
            if (savedTheme === 'true') {
                isNightMode = true;
                document.body.classList.add('night-mode');
                document.getElementById('theme-toggle').textContent = '☀️';
            }
        }

        // دالة إعادة تعيين فريق معين
        function resetTeamData(team) {
            if (confirm(`هل تريد إعادة تعيين جميع بيانات ${team === 'team1' ? 'الفريق الأول' : 'الفريق الثاني'}؟`)) {
                // إعادة تعيين النتائج
                const initialResults = team === 'team1' ? ['W', 'W', 'D', 'W', 'L'] : ['W', 'D', 'L', 'W', 'W'];
                const initialGoals = team === 'team1' ? [2, 3, 1, 2, 0] : [2, 1, 0, 3, 2];
                
                initializeTeamResults(`${team}-results`, initialResults);
                initializeGoalsInput(`${team}-goals`, initialGoals);
                
                // إعادة تعيين اسم الفريق
                document.getElementById(`${team}-search`).value = '';
                
                alert(`✅ تم إعادة تعيين ${team === 'team1' ? 'الفريق الأول' : 'الفريق الثاني'} بنجاح`);
            }
        }

        // دالة إعادة تعيين كل البيانات
        function resetAllData() {
            if (confirm('هل تريد إعادة تعيين جميع البيانات؟ سيتم مسح كل شيء!')) {
                // إعادة تعيين الفريق الأول
                initializeTeamResults('team1-results', ['W', 'W', 'D', 'W', 'L']);
                initializeGoalsInput('team1-goals', [2, 3, 1, 2, 0]);
                document.getElementById('team1-search').value = '';
                
                // إعادة تعيين الفريق الثاني
                initializeTeamResults('team2-results', ['W', 'D', 'L', 'W', 'W']);
                initializeGoalsInput('team2-goals', [2, 1, 0, 3, 2]);
                document.getElementById('team2-search').value = '';
                
                // إعادة تعيين النتائج
                document.getElementById('results-container').innerHTML = 
                    '<p style="text-align: center; padding: 20px;">سيظهر تحليل الفرص المزدوجة هنا بعد إدخال البيانات</p>';
                document.getElementById('team-stats').style.display = 'none';
                document.getElementById('goals-prediction').style.display = 'none';
                document.getElementById('match-history').style.display = 'none';
                
                alert('✅ تم إعادة تعيين جميع البيانات بنجاح');
            }
        }
        
        // دالة لتهيئة أزرار نتائج الفريق
        function initializeTeamResults(containerId, initialResults) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            for (let i = 0; i < 5; i++) {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match-results';
                
                const matchLabel = document.createElement('span');
                matchLabel.textContent = `مباراة ${i+1}:`;
                matchLabel.style.width = '80px';
                matchDiv.appendChild(matchLabel);
                
                // إنشاء أزرار النتائج (فوز، تعادل، خسارة)
                const results = ['W', 'D', 'L'];
                const resultLabels = {'W': 'فوز', 'D': 'تعادل', 'L': 'خسارة'};
                const resultClasses = {'W': 'win', 'D': 'draw', 'L': 'lose'};
                
                results.forEach(result => {
                    const btn = document.createElement('button');
                    btn.className = `result-btn ${resultClasses[result]}`;
                    btn.textContent = resultLabels[result];
                    btn.dataset.result = result;
                    
                    // تحديد الزر الافتراضي بناءً على initialResults
                    if (result === initialResults[i]) {
                        btn.classList.add('selected');
                    }
                    
                    btn.addEventListener('click', function() {
                        // إزالة التحديد من جميع أزرار هذه المباراة
                        this.parentElement.querySelectorAll('.result-btn').forEach(b => {
                            b.classList.remove('selected');
                        });
                        
                        // تحديد الزر المختار
                        this.classList.add('selected');
                    });
                    
                    matchDiv.appendChild(btn);
                });
                
                container.appendChild(matchDiv);
            }
        }
        
        // دالة لتهيئة حقول إدخال الأهداف
        function initializeGoalsInput(containerId, initialGoals) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            for (let i = 0; i < 5; i++) {
                const goalsDiv = document.createElement('div');
                goalsDiv.className = 'goals-input';
                
                const matchLabel = document.createElement('span');
                matchLabel.textContent = `مباراة ${i+1}:`;
                matchLabel.style.width = '80px';
                goalsDiv.appendChild(matchLabel);
                
                const goalsInput = document.createElement('input');
                goalsInput.type = 'number';
                goalsInput.min = '0';
                goalsInput.value = initialGoals[i];
                goalsInput.dataset.match = i+1;
                goalsDiv.appendChild(goalsInput);
                
                const goalsText = document.createElement('span');
                goalsText.textContent = 'هدف';
                goalsDiv.appendChild(goalsText);
                
                container.appendChild(goalsDiv);
            }
        }
        
        // دالة لجمع نتائج الفريق
        function getTeamResults(containerId) {
            const container = document.getElementById(containerId);
            const matches = container.querySelectorAll('.match-results');
            const results = [];
            
            matches.forEach(match => {
                const selectedBtn = match.querySelector('.result-btn.selected');
                if (selectedBtn) {
                    results.push(selectedBtn.dataset.result);
                }
            });
            
            return results;
        }
        
        // دالة لجمع أهداف الفريق
        function getTeamGoals(containerId) {
            const container = document.getElementById(containerId);
            const inputs = container.querySelectorAll('input');
            const goals = [];
            
            inputs.forEach(input => {
                goals.push(parseInt(input.value) || 0);
            });
            
            return goals;
        }
        
        // دالة حساب الفرص المزدوجة مع التحليل المتقدم
        function calculateDoubleChance() {
            const team1Name = document.getElementById('team1-search').value || 'الفريق الأول';
            const team2Name = document.getElementById('team2-search').value || 'الفريق الثاني';
            
            const team1Results = getTeamResults('team1-results');
            const team2Results = getTeamResults('team2-results');
            
            const team1Goals = getTeamGoals('team1-goals');
            const team2Goals = getTeamGoals('team2-goals');
            
            // حساب النقاط بناءً على النتائج
            const team1Points = calculatePoints(team1Results);
            const team2Points = calculatePoints(team2Results);
            
            // حساب متوسط الأهداف
            const team1AvgGoals = team1Goals.reduce((a, b) => a + b, 0) / team1Goals.length;
            const team2AvgGoals = team2Goals.reduce((a, b) => a + b, 0) / team2Goals.length;
            
            // حساب القوة النسبية
            const totalPoints = team1Points + team2Points;
            const team1Strength = totalPoints > 0 ? team1Points / totalPoints : 0.5;
            const team2Strength = totalPoints > 0 ? team2Points / totalPoints : 0.5;
            
            // حساب الاحتمالات الأساسية
            const team1WinProb = team1Strength * (1 - team2Strength) * 0.8;
            const team2WinProb = team2Strength * (1 - team1Strength) * 0.8;
            const drawProb = 0.2 + (team1Strength * team2Strength * 0.3);
            
            // تطبيع الاحتمالات لتصل إلى 100%
            const totalProb = team1WinProb + team2WinProb + drawProb;
            const normalizedTeam1Win = (team1WinProb / totalProb) * 100;
            const normalizedTeam2Win = (team2WinProb / totalProb) * 100;
            const normalizedDraw = (drawProb / totalProb) * 100;
            
            // حساب الفرص المزدوجة
            const doubleChance1X = normalizedTeam1Win + normalizedDraw;
            const doubleChance12 = normalizedTeam1Win + normalizedTeam2Win;
            const doubleChanceX2 = normalizedDraw + normalizedTeam2Win;
            
            // حساب توقع الأهداف
            const predictedGoals = calculatePredictedGoals(team1AvgGoals, team2AvgGoals);
            
            // عرض النتائج
            displayAdvancedResults(
                team1Name, team2Name, 
                normalizedTeam1Win, normalizedTeam2Win, normalizedDraw,
                doubleChance1X, doubleChance12, doubleChanceX2,
                team1Results, team2Results, team1Points, team2Points,
                team1Goals, team2Goals, predictedGoals
            );
        }
        
        // دالة لحساب النقاط من النتائج
        function calculatePoints(results) {
            let points = 0;
            results.forEach(result => {
                if (result === 'W') points += 3;
                else if (result === 'D') points += 1;
                // لا نقاط للخسارة
            });
            return points;
        }
        
        // دالة لحساب توقع الأهداف
        function calculatePredictedGoals(team1Avg, team2Avg) {
            // حساب الأهداف المتوقعة بناءً على المتوسطات
            const team1Predicted = team1Avg * 0.8;
            const team2Predicted = team2Avg * 0.8;
            
            // حساب إجمالي الأهداف المتوقعة في المباراة
            const totalPredicted = team1Predicted + team2Predicted;
            
            return {
                team1: team1Predicted,
                team2: team2Predicted,
                total: totalPredicted
            };
        }
        
        // دالة لعرض النتائج المتقدمة
        function displayAdvancedResults(team1Name, team2Name, team1Win, team2Win, draw, 
                                       doubleChance1X, doubleChance12, doubleChanceX2,
                                       team1Results, team2Results, team1Points, team2Points,
                                       team1Goals, team2Goals, predictedGoals) {
            
            const resultsContainer = document.getElementById('results-container');
            const matchHistory = document.getElementById('match-history');
            const teamStats = document.getElementById('team-stats');
            const goalsPrediction = document.getElementById('goals-prediction');
            
            // تنسيق النتائج
            const formatPercent = (value) => {
                return value.toFixed(1) + '%';
            };
            
            // حساب إجمالي الأهداف
            const team1TotalGoals = team1Goals.reduce((a, b) => a + b, 0);
            const team2TotalGoals = team2Goals.reduce((a, b) => a + b, 0);
            
            // إنشاء محتوى النتائج المتقدم
            let resultsHTML = `
                <div class="probability-card">
                    <h3>🎯 الاحتمالات الأساسية</h3>
                    <div class="probability-item">
                        <div class="probability-header">
                            <span class="team1-color">فوز ${team1Name}</span>
                            <span>${formatPercent(team1Win)}</span>
                        </div>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${team1Win}%"></div>
                        </div>
                    </div>
                    
                    <div class="probability-item">
                        <div class="probability-header">
                            <span>تعادل</span>
                            <span>${formatPercent(draw)}</span>
                        </div>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${draw}%"></div>
                        </div>
                    </div>
                    
                    <div class="probability-item">
                        <div class="probability-header">
                            <span class="team2-color">فوز ${team2Name}</span>
                            <span>${formatPercent(team2Win)}</span>
                        </div>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${team2Win}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="probability-card">
                    <h3>🔄 الفرص المزدوجة <span class="accuracy-high">(دقة عالية)</span></h3>
                    
                    <div class="probability-item">
                        <div class="probability-header">
                            <span>${team1Name} أو تعادل (1X)</span>
                            <span>${formatPercent(doubleChance1X)}</span>
                        </div>
                        <div class="probability-value">${formatPercent(doubleChance1X)}</div>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${doubleChance1X}%"></div>
                        </div>
                    </div>
                    
                    <div class="probability-item">
                        <div class="probability-header">
                            <span>${team1Name} أو ${team2Name} (12)</span>
                            <span>${formatPercent(doubleChance12)}</span>
                        </div>
                        <div class="probability-value">${formatPercent(doubleChance12)}</div>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${doubleChance12}%"></div>
                        </div>
                    </div>
                    
                    <div class="probability-item">
                        <div class="probability-header">
                            <span>تعادل أو ${team2Name} (X2)</span>
                            <span>${formatPercent(doubleChanceX2)}</span>
                        </div>
                        <div class="probability-value">${formatPercent(doubleChanceX2)}</div>
                        <div class="probability-bar">
                            <div class="probability-fill" style="width: ${doubleChanceX2}%"></div>
                        </div>
                    </div>
                </div>
            `;
            
            resultsContainer.innerHTML = resultsHTML;
            
            // إنشاء إحصائيات الفريقين المتقدمة
            let statsHTML = `
                <div class="stats-card">
                    <div class="stats-title team1-color">${team1Name}</div>
                    <div class="goals-summary">إجمالي الأهداف: ${team1TotalGoals}</div>
                    <div>متوسط الأهداف: ${(team1TotalGoals / 5).toFixed(1)}</div>
                    <div>النقاط: ${team1Points}</div>
                </div>
                
                <div class="stats-card">
                    <div class="stats-title team2-color">${team2Name}</div>
                    <div class="goals-summary">إجمالي الأهداف: ${team2TotalGoals}</div>
                    <div>متوسط الأهداف: ${(team2TotalGoals / 5).toFixed(1)}</div>
                    <div>النقاط: ${team2Points}</div>
                </div>
            `;
            
            teamStats.innerHTML = statsHTML;
            teamStats.style.display = 'flex';
            
            // إنشاء توقع الأهداف المتقدم
            let predictionHTML = `
                <div class="prediction-title">🎯 توقع الأهداف في المباراة القادمة</div>
                <div style="display: flex; justify-content: space-around; text-align: center;">
                    <div>
                        <div class="team1-color">${team1Name}</div>
                        <div class="prediction-value">${predictedGoals.team1.toFixed(1)}</div>
                        <div>هدف متوقع</div>
                    </div>
                    <div>
                        <div>المجموع</div>
                        <div class="prediction-value">${predictedGoals.total.toFixed(1)}</div>
                        <div>أهداف متوقعة</div>
                    </div>
                    <div>
                        <div class="team2-color">${team2Name}</div>
                        <div class="prediction-value">${predictedGoals.team2.toFixed(1)}</div>
                        <div>هدف متوقع</div>
                    </div>
                </div>
            `;
            
            goalsPrediction.innerHTML = predictionHTML;
            goalsPrediction.style.display = 'block';
            
            // تحديث سجل المباريات
            const historyBody = document.getElementById('history-body');
            let historyHTML = '';
            
            // إضافة سجل الفريق الأول
            historyHTML += `
                <tr>
                    <td class="team1-color">${team1Name}</td>
                    <td>${team1Results.map(r => getResultSymbol(r)).join(' ')}</td>
                    <td>${team1Points}</td>
                    <td>${team1Goals.join(' - ')}</td>
                </tr>
            `;
            
            // إضافة سجل الفريق الثاني
            historyHTML += `
                <tr>
                    <td class="team2-color">${team2Name}</td>
                    <td>${team2Results.map(r => getResultSymbol(r)).join(' ')}</td>
                    <td>${team2Points}</td>
                    <td>${team2Goals.join(' - ')}</td>
                </tr>
            `;
            
            historyBody.innerHTML = historyHTML;
            matchHistory.style.display = 'block';
        }
        
        // دالة للحصول على رمز النتيجة
        function getResultSymbol(result) {
            switch(result) {
                case 'W': return '✅';
                case 'D': return '➖';
                case 'L': return '❌';
                default: return '?';
            }
        }
    

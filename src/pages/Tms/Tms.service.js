export const tournaments = [
  {
    tournament_id: "T-001",
    tournament_name: "National Sports Championship 2024",
    tournament_description:
      "India's biggest inter-school sports tournament with multi-sport disciplines.",
    status: "upcoming",
    is_published: true,
    is_active: true,
    featured: true,
    sport_type: "multi-sport",
    location: "New Delhi",
    participants: 256,
    start_date: "2024-07-15",
    end_date: "2024-08-10",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/logo-mobile.png",
        web: "https://placehold.co/400/4338CA/FFFFFF?text=NSC+24",
      },
      league_banner: {
        mobile: "https://cdn.example.com/banner-mobile.png",
        web: "https://placehold.co/1200x600/4338CA/FFFFFF?text=National+Sports+Championship",
      },
    },
  },
  {
    tournament_id: "T-002",
    tournament_name: "Premier Cricket League",
    tournament_description:
      "Annual cricket tournament between state teams with qualifiers and knockout rounds.",
    status: "active",
    is_published: true,
    is_active: true,
    featured: true,
    sport_type: "cricket",
    location: "Mumbai",
    participants: 32,
    start_date: "2024-04-10",
    end_date: "2024-06-30",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/cricket-logo-mobile.png",
        web: "https://placehold.co/400/047857/FFFFFF?text=PCL",
      },
      league_banner: {
        mobile: "https://cdn.example.com/cricket-banner-mobile.png",
        web: "https://placehold.co/1200x600/047857/FFFFFF?text=Premier+Cricket+League",
      },
    },
  },
  {
    tournament_id: "T-003",
    tournament_name: "District Football League",
    tournament_description:
      "Local football league featuring teams from all districts.",
    status: "completed",
    is_published: true,
    is_active: false,
    featured: false,
    sport_type: "football",
    location: "Kolkata",
    participants: 24,
    start_date: "2023-11-15",
    end_date: "2024-01-20",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/football-logo-mobile.png",
        web: "https://placehold.co/400/9D174D/FFFFFF?text=DFL",
      },
      league_banner: {
        mobile: "https://cdn.example.com/football-banner-mobile.png",
        web: "https://placehold.co/1200x600/9D174D/FFFFFF?text=District+Football+League",
      },
    },
  },
  {
    tournament_id: "T-004",
    tournament_name: "Basketball Championship Series",
    tournament_description:
      "Elite basketball tournament featuring the top teams from across the country.",
    status: "upcoming",
    is_published: true,
    is_active: true,
    featured: false,
    sport_type: "basketball",
    location: "Bangalore",
    participants: 16,
    start_date: "2024-08-05",
    end_date: "2024-09-15",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/bball-logo-mobile.png",
        web: "https://placehold.co/400/D97706/FFFFFF?text=BCS",
      },
      league_banner: {
        mobile: "https://cdn.example.com/bball-banner-mobile.png",
        web: "https://placehold.co/1200x600/D97706/FFFFFF?text=Basketball+Championship",
      },
    },
  },
  {
    tournament_id: "T-005",
    tournament_name: "Women's Tennis Open",
    tournament_description:
      "Premier tennis tournament for women players from all states.",
    status: "active",
    is_published: true,
    is_active: true,
    featured: true,
    sport_type: "tennis",
    location: "Chennai",
    participants: 64,
    start_date: "2024-03-20",
    end_date: "2024-04-05",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/tennis-logo-mobile.png",
        web: "https://placehold.co/400/7C3AED/FFFFFF?text=WTO",
      },
      league_banner: {
        mobile: "https://cdn.example.com/tennis-banner-mobile.png",
        web: "https://placehold.co/1200x600/7C3AED/FFFFFF?text=Women's+Tennis+Open",
      },
    },
  },
  {
    tournament_id: "T-006",
    tournament_name: "National Swimming Championship",
    tournament_description:
      "Annual aquatic sports competition featuring the nation's best swimmers.",
    status: "upcoming",
    is_published: true,
    is_active: true,
    featured: false,
    sport_type: "swimming",
    location: "Goa",
    participants: 200,
    start_date: "2024-09-10",
    end_date: "2024-09-20",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/swimming-logo-mobile.png",
        web: "https://placehold.co/400/0EA5E9/FFFFFF?text=NSC",
      },
      league_banner: {
        mobile: "https://cdn.example.com/swimming-banner-mobile.png",
        web: "https://placehold.co/1200x600/0EA5E9/FFFFFF?text=National+Swimming+Championship",
      },
    },
  },
  {
    tournament_id: "T-007",
    tournament_name: "Hockey Premier League",
    tournament_description:
      "Professional hockey league featuring teams from across the country.",
    status: "completed",
    is_published: true,
    is_active: false,
    featured: false,
    sport_type: "hockey",
    location: "Punjab",
    participants: 12,
    start_date: "2023-10-05",
    end_date: "2023-12-15",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/hockey-logo-mobile.png",
        web: "https://placehold.co/400/475569/FFFFFF?text=HPL",
      },
      league_banner: {
        mobile: "https://cdn.example.com/hockey-banner-mobile.png",
        web: "https://placehold.co/1200x600/475569/FFFFFF?text=Hockey+Premier+League",
      },
    },
  },
  {
    tournament_id: "T-008",
    tournament_name: "Badminton Super Series",
    tournament_description:
      "Elite badminton tournament featuring singles and doubles competitions.",
    status: "active",
    is_published: true,
    is_active: true,
    featured: true,
    sport_type: "badminton",
    location: "Hyderabad",
    participants: 128,
    start_date: "2024-05-01",
    end_date: "2024-05-20",
    tournament_configuration: {
      league_logo: {
        mobile: "https://cdn.example.com/badminton-logo-mobile.png",
        web: "https://placehold.co/400/DB2777/FFFFFF?text=BSS",
      },
      league_banner: {
        mobile: "https://cdn.example.com/badminton-banner-mobile.png",
        web: "https://placehold.co/1200x600/DB2777/FFFFFF?text=Badminton+Super+Series",
      },
    },
  },
];

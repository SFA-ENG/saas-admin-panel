export const tournaments = {
  tournaments: [
    {
      tournament_id: "T-001",
      tournament_name: "National Sports Championship 2024",
      tournament_description:
        "India's biggest inter-school sports tournament with multi-sport disciplines.",
      status: "UPCOMING",
      is_published: true,
      is_active: true,
      featured: true,
      sports: ["CRICKET", "FOOTBALL", "TENNIS", "BADMINTON"],
      genders: ["MALE", "FEMALE"],
      location: "New Delhi",
      participants: 256,
      start_date: "2024-07-15",
      end_date: "2024-08-10",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/logo-mobile.png",
          web: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl84wJ6oOsnRqqVV5UIXa6cyHldHKc0_-EMA&s",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/banner-mobile.png",
            web: "https://www.shutterstock.com/image-vector/banner-template-national-sports-day-260nw-2259724341.jpg",
          },
          {
            mobile: "https://cdn.example.com/banner-mobile.png",
            web: "https://img.freepik.com/free-vector/flat-national-sports-day-horizontal-banner-template_52683-65864.jpg",
          },
        ],
      },
    },
    {
      tournament_id: "T-002",
      tournament_name: "Premier Cricket League",
      tournament_description:
        "Annual cricket tournament between state teams with qualifiers and knockout rounds.",
      status: "ACTIVE",
      is_published: true,
      is_active: true,
      featured: true,
      sports: ["CRICKET"],
      genders: ["MALE"],
      location: "Mumbai",
      participants: 32,
      start_date: "2024-04-10",
      end_date: "2024-06-30",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/cricket-logo-mobile.png",
          web: "https://img.freepik.com/premium-vector/happy-national-sports-day-vector-illustration_7888-944.jpg",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/cricket-banner-mobile.png",
            web: "https://img.freepik.com/free-psd/sport-games-horizontal-banner-with-photo_23-2149047155.jpg",
          },
        ],
      },
    },
    {
      tournament_id: "T-003",
      tournament_name: "District Football League",
      tournament_description:
        "Local football league featuring teams from all districts.",
      status: "COMPLETED",
      is_published: true,
      is_active: false,
      featured: false,
      sports: ["FOOTBALL"],
      genders: ["MALE"],
      location: "Kolkata",
      participants: 24,
      start_date: "2023-11-15",
      end_date: "2024-01-20",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/football-logo-mobile.png",
          web: "https://placehold.co/400/9D174D/FFFFFF?text=DFL",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/football-banner-mobile.png",
            web: "https://www.lsraheja.org/wp-content/uploads/2022/08/National-Sports-Day-Banner-600x337.jpgv",
          },
        ],
      },
    },
    {
      tournament_id: "T-004",
      tournament_name: "Basketball Championship Series",
      tournament_description:
        "Elite basketball tournament featuring the top teams from across the country.",
      status: "UPCOMING",
      is_published: true,
      is_active: true,
      featured: false,
      sports: ["BASKETBALL"],
      genders: ["MALE"],
      location: "Bangalore",
      participants: 16,
      start_date: "2024-08-05",
      end_date: "2024-09-15",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/bball-logo-mobile.png",
          web: "https://placehold.co/400/D97706/FFFFFF?text=BCS",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/bball-banner-mobile.png",
            web: "https://cdn.vectorstock.com/i/1000v/72/46/national-sports-day-vintage-banner-with-athletes-vector-53297246.jpg",
          },
        ],
      },
    },
    {
      tournament_id: "T-005",
      tournament_name: "Women's Tennis Open",
      tournament_description:
        "Premier tennis tournament for women players from all states.",
      status: "ACTIVE",
      is_published: true,
      is_active: true,
      featured: true,
      sports: ["TENNIS"],
      genders: ["FEMALE"],
      location: "Chennai",
      participants: 64,
      start_date: "2024-03-20",
      end_date: "2024-04-05",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/tennis-logo-mobile.png",
          web: "https://placehold.co/400/7C3AED/FFFFFF?text=WTO",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/tennis-banner-mobile.png",
            web: "https://placehold.co/1200x600/7C3AED/FFFFFF?text=Women's+Tennis+Open",
          },
        ],
      },
    },
    {
      tournament_id: "T-006",
      tournament_name: "National Swimming Championship",
      tournament_description:
        "Annual aquatic sports competition featuring the nation's best swimmers.",
      status: "UPCOMING",
      is_published: true,
      is_active: true,
      featured: false,
      sports: ["SWIMMING"],
      genders: ["MALE", "FEMALE"],
      location: "Goa",
      participants: 200,
      start_date: "2024-09-10",
      end_date: "2024-09-20",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/swimming-logo-mobile.png",
          web: "https://placehold.co/400/0EA5E9/FFFFFF?text=NSC",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/swimming-banner-mobile.png",
            web: "https://placehold.co/1200x600/0EA5E9/FFFFFF?text=National+Swimming+Championship",
          },
        ],
      },
    },
    {
      tournament_id: "T-007",
      tournament_name: "Hockey Premier League",
      tournament_description:
        "Professional hockey league featuring teams from across the country.",
      status: "COMPLETED",
      is_published: true,
      is_active: false,
      featured: false,
      sports: ["HOCKEY"],
      genders: ["MALE", "FEMALE"],
      location: "Punjab",
      participants: 12,
      start_date: "2023-10-05",
      end_date: "2023-12-15",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/hockey-logo-mobile.png",
          web: "https://placehold.co/400/475569/FFFFFF?text=HPL",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/hockey-banner-mobile.png",
            web: "https://placehold.co/1200x600/475569/FFFFFF?text=Hockey+Premier+League",
          },
        ],
      },
    },
    {
      tournament_id: "T-008",
      tournament_name: "Badminton Super Series",
      tournament_description:
        "Elite badminton tournament featuring singles and doubles competitions.",
      status: "ACTIVE",
      is_published: true,
      is_active: true,
      featured: true,
      sports: ["BADMINTON"],
      genders: ["MALE", "FEMALE"],
      location: "Hyderabad",
      participants: 128,
      start_date: "2024-05-01",
      end_date: "2024-05-20",
      tournament_configuration: {
        league_logo: {
          mobile: "https://cdn.example.com/badminton-logo-mobile.png",
          web: "https://placehold.co/400/DB2777/FFFFFF?text=BSS",
        },
        league_banner: [
          {
            mobile: "https://cdn.example.com/badminton-banner-mobile.png",
            web: "https://placehold.co/1200x600/DB2777/FFFFFF?text=Badminton+Super+Series",
          },
        ],
      },
    },
  ],
  metadata: {
    active_tournaments: 3,
    total_tournaments: 10,
    upcoming_tournaments: 20,
    filters: {
      status: ["ACTIVE", "UPCOMING", "COMPLETED"],
      sports: [
        "CRICKET",
        "FOOTBALL",
        "TENNIS",
        "BASKETBALL",
        "SWIMMING",
        "HOCKEY",
        "BADMINTON",
      ],
    },
  },
};

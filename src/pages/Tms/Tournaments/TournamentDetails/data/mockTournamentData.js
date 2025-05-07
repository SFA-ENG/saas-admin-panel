// Mock data - in a real app, this would come from an API
export const mockTournamentData = {
  sports: ["Athletics", "Badminton", "Swimming"],
  tenantId: "df04533a-4452-53e6-87d9-e1dabcef5d17",
  tournamentId: "02cd6655-3d94-4145-aa64-b65224fbd84b",
  type: "OPEN_REGISTRATION_TEAM",
  name: "National Youth Championship 2025",
  description:
    "An all-India inter-school championship featuring athletics, badminton, and swimming events.",
  status: "DRAFT",
  isPublished: false,
  isActive: true,
  medias: [
    {
      category: "IMAGE",
      usage: "LOGO",
      variant: "DESKTOP",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Iconic_sports_logo.png/600px-Iconic_sports_logo.png",
      position: 1,
    },
    {
      category: "IMAGE",
      usage: "BANNER",
      variant: "MOBILE",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      position: 2,
    },
  ],
  seasons: [
    {
      seasonId: "s1-2025-mumbai",
      name: "Mumbai Season 2025",
      description: "First season of the championship held in Mumbai.",
      medias: [
        {
          category: "IMAGE",
          usage: "LOGO",
          variant: "DESKTOP",
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sports_event_logo.png/600px-Sports_event_logo.png",
          position: 1,
        },
        {
          category: "IMAGE",
          usage: "BANNER",
          variant: "MOBILE",
          url: "https://images.unsplash.com/photo-1600281031348-7c65a9093a0b",
          position: 2,
        },
      ],
      participationRules: {
        AND: [
          {
            field: "COUNTRY",
            operator: "=",
            value: "India",
          },
        ],
      },
      startDate: "2025-06-01",
      endDate: "2025-06-15",
      registrationStartDate: "2025-05-01",
      registrationEndDate: "2025-05-25",
      tenantId: "5a23f1d3-fd5e-5bb1-bbfa-41a2f45b4dc0",
      isPublished: false,
      isActive: true,
      locations: [
        {
          locationId: "loc-mumbai-01",
          name: "Mumbai",
          description: "Major sporting venue in Mumbai",
          type: "CITY",
          countryCode: "IN",
        },
      ],
      sports: [
        {
          sportsId: "sp-athletics",
          name: "Athletics",
          events: [
            {
              eventId: "ev-100m",
              name: "100m Dash",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-06-02",
              endDate: "2025-06-03",
              eventType: "INDIVIDUAL",
              categoryTree: {
                primary: "TRACK",
                secondary: "SPRINT",
                tertiary: null,
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-100m-m-u18",
                  name: "Men's U-18 100m",
                  description: "U-18 boys 100m dash",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "MALE" },
                      { field: "AGE", operator: "<=", value: 18 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 20, available: 20 },
                  gameFormat: "KNOCKOUT",
                },
                {
                  subEventId: "sub-100m-f-u18",
                  name: "Women's U-18 100m",
                  description: "U-18 girls 100m dash",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "FEMALE" },
                      { field: "AGE", operator: "<=", value: 18 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 20, available: 18 },
                  gameFormat: "KNOCKOUT",
                },
              ],
            },
            {
              eventId: "ev-long-jump",
              name: "Long Jump",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-06-04",
              endDate: "2025-06-05",
              eventType: "INDIVIDUAL",
              categoryTree: {
                primary: "FIELD",
                secondary: "JUMP",
                tertiary: "LONG_JUMP",
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-lj-m-u16",
                  name: "Men's U-16 Long Jump",
                  description: "Boys long jump event",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "MALE" },
                      { field: "AGE", operator: "<=", value: 16 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 12, available: 12 },
                  gameFormat: "LEAGUE",
                },
              ],
            },
          ],
        },
        {
          sportsId: "sp-badminton",
          name: "Badminton",
          events: [
            {
              eventId: "ev-bdm-team",
              name: "Team Badminton",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-06-06",
              endDate: "2025-06-08",
              eventType: "TEAM",
              categoryTree: {
                primary: "INDOOR",
                secondary: "RACKET_SPORTS",
                tertiary: "BADMINTON",
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-bdm-mix",
                  name: "Mixed Doubles",
                  description: "Mixed team doubles",
                  participationRules: {
                    AND: [{ field: "AGE", operator: "<=", value: 20 }],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 4, minPlayers: 2 },
                  inventoryMetada: { total: 10, available: 10 },
                  gameFormat: "ROUND_ROBIN",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      seasonId: "s2-2025-delhi",
      name: "Delhi Season 2025",
      description: "Second season of the championship in Delhi.",
      medias: [],
      participationRules: {
        AND: [
          {
            field: "COUNTRY",
            operator: "=",
            value: "India",
          },
        ],
      },
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      registrationStartDate: "2025-06-01",
      registrationEndDate: "2025-06-25",
      tenantId: "5a23f1d3-fd5e-5bb1-bbfa-41a2f45b4dc0",
      isPublished: false,
      isActive: true,
      locations: [
        {
          locationId: "loc-delhi-01",
          name: "Delhi",
          description: "National stadium in Delhi",
          type: "CITY",
          countryCode: "IN",
        },
      ],
      sports: [
        {
          sportsId: "sp-swimming",
          name: "Swimming",
          events: [
            {
              eventId: "ev-swim-50m",
              name: "50m Freestyle",
              isActive: true,
              isPublished: false,
              status: "DRAFT",
              startDate: "2025-07-02",
              endDate: "2025-07-03",
              eventType: "INDIVIDUAL",
              categoryTree: {
                primary: "WATER",
                secondary: "FREESTYLE",
                tertiary: null,
                quaternary: null,
              },
              subEvents: [
                {
                  subEventId: "sub-swim-m-u14",
                  name: "Boys U-14 50m",
                  description: "Freestyle swim for boys under 14",
                  participationRules: {
                    AND: [
                      { field: "GENDER", operator: "=", value: "MALE" },
                      { field: "AGE", operator: "<=", value: 14 },
                    ],
                  },
                  isActive: true,
                  isPublished: false,
                  status: "DRAFT",
                  teamMetadata: { maxPlayers: 1, minPlayers: 1 },
                  inventoryMetada: { total: 10, available: 10 },
                  gameFormat: "KNOCKOUT",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}; 
// Storage implementation for the sports administration app

class MemStorage {
  constructor() {
    this.teams = new Map();
    this.matches = new Map();
    this.matchStats = new Map();
    this.tournaments = new Map();
    this.academyPrograms = new Map();
    this.coaches = new Map();
    this.sfaNextPrograms = new Map();
    this.sportsCamps = new Map();
    this.users = new Map();
    this.userRoles = new Map();
    this.activities = new Map();
    
    this.teamsCounter = 1;
    this.matchesCounter = 1;
    this.matchStatsCounter = 1;
    this.tournamentsCounter = 1;
    this.academyProgramsCounter = 1;
    this.coachesCounter = 1;
    this.sfaNextProgramsCounter = 1;
    this.sportsCampsCounter = 1;
    this.usersCounter = 1;
    this.userRolesCounter = 1;
    this.activitiesCounter = 1;
    
    // Initialize with some default data
    this.initializeData();
  }
  
  initializeData() {
    // Add some default teams
    const barcelonaId = this.createTeam({
      name: 'FC Barcelona',
      logo: 'barca.png',
      sport: 'Football'
    }).id;
    
    const madridId = this.createTeam({
      name: 'Real Madrid',
      logo: 'madrid.png',
      sport: 'Football'
    }).id;
    
    // Add a live match
    const matchId = this.createMatch({
      homeTeamId: barcelonaId,
      awayTeamId: madridId,
      homeScore: 2,
      awayScore: 1,
      league: 'La Liga',
      status: 'LIVE',
      startTime: new Date(),
      currentTime: '67\'',
      lastGoal: 'Lewandowski (55\')'
    }).id;
    
    // Add match statistics
    this.createMatchStats({
      matchId,
      teamId: barcelonaId,
      possession: '58%',
      shots: 12,
      shotsOnTarget: 5,
      fouls: 7,
      corners: 6,
      offsides: 2
    });
    
    this.createMatchStats({
      matchId,
      teamId: madridId,
      possession: '42%',
      shots: 8,
      shotsOnTarget: 3,
      fouls: 10,
      corners: 4,
      offsides: 3
    });
    
    // Add some default activities
    this.createActivity({
      userId: 1,
      action: 'CREATE',
      description: 'Tournament \'Summer League\' created',
      entityType: 'TOURNAMENT',
      entityId: 1,
      timestamp: new Date(),
      user: 'Admin'
    });
    
    this.createActivity({
      userId: 2,
      action: 'CREATE',
      description: 'New coach added to Basketball Academy',
      entityType: 'COACH',
      entityId: 1,
      timestamp: new Date(),
      user: 'Manager'
    });
  }
  
  // Dashboard
  async getDashboardStats() {
    return {
      tournaments: {
        count: 12,
        teamsCount: 156,
        status: 'ACTIVE'
      },
      academy: {
        coachesCount: 24,
        programsCount: 8,
        studentsCount: 342,
        status: 'ACTIVE'
      },
      sfaNext: {
        programsCount: 5,
        initiativesCount: 3,
        status: 'IN PROGRESS'
      },
      sportsCamps: {
        upcomingCount: 4,
        registrationsPending: 120,
        status: 'UPCOMING'
      }
    };
  }
  
  async getRecentActivities() {
    return Array.from(this.activities.values());
  }
  
  // Teams
  async getTeams() {
    return Array.from(this.teams.values());
  }
  
  async getTeamById(id) {
    return this.teams.get(id);
  }
  
  async createTeam(teamData) {
    const id = this.teamsCounter++;
    const team = {
      id,
      ...teamData,
      createdAt: new Date()
    };
    this.teams.set(id, team);
    return team;
  }
  
  // Matches
  async getMatches() {
    return Array.from(this.matches.values());
  }
  
  async getMatchById(id) {
    const match = this.matches.get(id);
    if (!match) return null;
    
    const homeTeam = this.teams.get(match.homeTeamId);
    const awayTeam = this.teams.get(match.awayTeamId);
    
    const homeStats = Array.from(this.matchStats.values()).find(
      stat => stat.matchId === id && stat.teamId === match.homeTeamId
    );
    
    const awayStats = Array.from(this.matchStats.values()).find(
      stat => stat.matchId === id && stat.teamId === match.awayTeamId
    );
    
    return {
      ...match,
      homeTeam,
      awayTeam,
      homeStats,
      awayStats
    };
  }
  
  async createMatch(matchData) {
    const id = this.matchesCounter++;
    const match = {
      id,
      ...matchData
    };
    this.matches.set(id, match);
    return match;
  }
  
  // Match Statistics
  async createMatchStats(statsData) {
    const id = this.matchStatsCounter++;
    const stats = {
      id,
      ...statsData
    };
    this.matchStats.set(id, stats);
    return stats;
  }
  
  // Tournaments
  async getTournaments() {
    return Array.from(this.tournaments.values());
  }
  
  async getTournamentById(id) {
    return this.tournaments.get(id);
  }
  
  async createTournament(tournamentData) {
    const id = this.tournamentsCounter++;
    const tournament = {
      id,
      ...tournamentData
    };
    this.tournaments.set(id, tournament);
    
    // Create activity
    this.createActivity({
      userId: 1,
      action: 'CREATE',
      description: `Tournament '${tournamentData.name}' created`,
      entityType: 'TOURNAMENT',
      entityId: id,
      timestamp: new Date(),
      user: 'Admin'
    });
    
    return tournament;
  }
  
  // Academy
  async getAcademyPrograms() {
    return Array.from(this.academyPrograms.values());
  }
  
  async createAcademyProgram(programData) {
    const id = this.academyProgramsCounter++;
    const program = {
      id,
      ...programData
    };
    this.academyPrograms.set(id, program);
    return program;
  }
  
  // Coaches
  async getCoaches() {
    return Array.from(this.coaches.values());
  }
  
  async createCoach(coachData) {
    const id = this.coachesCounter++;
    const coach = {
      id,
      ...coachData
    };
    this.coaches.set(id, coach);
    
    // Create activity
    this.createActivity({
      userId: 2,
      action: 'CREATE',
      description: `New coach added to ${coachData.sport} Academy`,
      entityType: 'COACH',
      entityId: id,
      timestamp: new Date(),
      user: 'Manager'
    });
    
    return coach;
  }
  
  // SFA Next
  async getSFANextPrograms() {
    return Array.from(this.sfaNextPrograms.values());
  }
  
  async createSFANextProgram(programData) {
    const id = this.sfaNextProgramsCounter++;
    const program = {
      id,
      ...programData
    };
    this.sfaNextPrograms.set(id, program);
    return program;
  }
  
  // Sports Camps
  async getSportsCamps() {
    return Array.from(this.sportsCamps.values());
  }
  
  async createSportsCamp(campData) {
    const id = this.sportsCampsCounter++;
    const camp = {
      id,
      ...campData
    };
    this.sportsCamps.set(id, camp);
    
    // Create activity
    this.createActivity({
      userId: 1,
      action: 'CREATE',
      description: `Sports Camp '${campData.name}' scheduled`,
      entityType: 'SPORTS_CAMP',
      entityId: id,
      timestamp: new Date(),
      user: 'Admin'
    });
    
    return camp;
  }
  
  // Users
  async getUsers() {
    return Array.from(this.users.values());
  }
  
  async getUserById(id) {
    return this.users.get(id);
  }
  
  async createUser(userData) {
    const id = this.usersCounter++;
    const user = {
      id,
      ...userData,
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }
  
  // User Roles
  async getUserRoles() {
    return Array.from(this.userRoles.values());
  }
  
  async createUserRole(roleData) {
    const id = this.userRolesCounter++;
    const role = {
      id,
      ...roleData
    };
    this.userRoles.set(id, role);
    
    // Create activity
    this.createActivity({
      userId: 1,
      action: 'CREATE',
      description: `New user role '${roleData.name}' created`,
      entityType: 'USER_ROLE',
      entityId: id,
      timestamp: new Date(),
      user: 'Admin'
    });
    
    return role;
  }
  
  // Activities
  async createActivity(activityData) {
    const id = this.activitiesCounter++;
    const activity = {
      id,
      ...activityData
    };
    this.activities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();

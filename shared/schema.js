// Teams
const teams = {
  id: 'serial',
  name: 'text',
  logo: 'text',
  sport: 'text',
  createdAt: 'timestamp'
};

// Matches
const matches = {
  id: 'serial',
  homeTeamId: 'integer',
  awayTeamId: 'integer',
  homeScore: 'integer',
  awayScore: 'integer',
  league: 'text',
  status: 'text',
  startTime: 'timestamp',
  currentTime: 'text',
  lastGoal: 'text'
};

// Match Statistics
const matchStats = {
  id: 'serial',
  matchId: 'integer',
  teamId: 'integer',
  possession: 'text',
  shots: 'integer',
  shotsOnTarget: 'integer',
  fouls: 'integer',
  corners: 'integer',
  offsides: 'integer'
};

// Tournaments
const tournaments = {
  id: 'serial',
  name: 'text',
  sport: 'text',
  startDate: 'date',
  endDate: 'date',
  status: 'text',
  teamsCount: 'integer',
  description: 'text'
};

// Academy Programs
const academyPrograms = {
  id: 'serial',
  name: 'text',
  sport: 'text',
  studentsCount: 'integer',
  coachesCount: 'integer',
  description: 'text',
  status: 'text'
};

// Coaches
const coaches = {
  id: 'serial',
  name: 'text',
  sport: 'text',
  programId: 'integer',
  email: 'text',
  phone: 'text',
  status: 'text'
};

// SFA Next Programs
const sfaNextPrograms = {
  id: 'serial',
  name: 'text',
  sport: 'text',
  participantsCount: 'integer',
  status: 'text',
  description: 'text'
};

// Sports Camps
const sportsCamps = {
  id: 'serial',
  name: 'text',
  sport: 'text',
  startDate: 'date',
  endDate: 'date',
  location: 'text',
  registrationsCount: 'integer',
  status: 'text'
};

// Users
const users = {
  id: 'serial',
  name: 'text',
  email: 'text',
  password: 'text',
  roleId: 'integer',
  status: 'text',
  lastLogin: 'timestamp'
};

// User Roles
const userRoles = {
  id: 'serial',
  name: 'text',
  description: 'text',
  permissions: 'text'
};

// Recent Activities
const activities = {
  id: 'serial',
  userId: 'integer',
  action: 'text',
  description: 'text',
  entityType: 'text',
  entityId: 'integer',
  timestamp: 'timestamp'
};

module.exports = {
  teams,
  matches,
  matchStats,
  tournaments,
  academyPrograms,
  coaches,
  sfaNextPrograms,
  sportsCamps,
  users,
  userRoles,
  activities
};

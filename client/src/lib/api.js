import { apiRequest } from './queryClient';

// Dashboard
export const getDashboardStats = async () => {
  const res = await apiRequest('GET', '/api/dashboard');
  return res.json();
};

// Tournaments
export const getTournaments = async () => {
  const res = await apiRequest('GET', '/api/tournaments');
  return res.json();
};

export const createTournament = async (data) => {
  const res = await apiRequest('POST', '/api/tournaments', data);
  return res.json();
};

// Matches
export const getMatches = async () => {
  const res = await apiRequest('GET', '/api/matches');
  return res.json();
};

export const getMatchById = async (id) => {
  const res = await apiRequest('GET', `/api/matches/${id}`);
  return res.json();
};

// Academy
export const getAcademyData = async () => {
  const res = await apiRequest('GET', '/api/academy');
  return res.json();
};

export const getCoaches = async () => {
  const res = await apiRequest('GET', '/api/academy/coaches');
  return res.json();
};

export const createProgram = async (data) => {
  const res = await apiRequest('POST', '/api/academy/programs', data);
  return res.json();
};

// SFA Next
export const getSFANextPrograms = async () => {
  const res = await apiRequest('GET', '/api/sfa-next');
  return res.json();
};

// Sports Camps
export const getSportsCamps = async () => {
  const res = await apiRequest('GET', '/api/sports-camps');
  return res.json();
};

export const createCamp = async (data) => {
  const res = await apiRequest('POST', '/api/sports-camps', data);
  return res.json();
};

// Users
export const getUsers = async () => {
  const res = await apiRequest('GET', '/api/users');
  return res.json();
};

export const getUserRoles = async () => {
  const res = await apiRequest('GET', '/api/users/roles');
  return res.json();
};

export const createUser = async (data) => {
  const res = await apiRequest('POST', '/api/users', data);
  return res.json();
};

export const createRole = async (data) => {
  const res = await apiRequest('POST', '/api/users/roles', data);
  return res.json();
};

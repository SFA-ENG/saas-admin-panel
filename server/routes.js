import express from 'express';
import { createServer } from 'http';
import { storage } from './storage';

export async function registerRoutes(app) {
  // API Routes
  const apiRouter = express.Router();
  app.use('/api', apiRouter);

  // Dashboard
  apiRouter.get('/dashboard', async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      const activities = await storage.getRecentActivities();
      
      res.json({
        stats,
        activities
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Teams
  apiRouter.get('/teams', async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.post('/teams', async (req, res) => {
    try {
      const team = await storage.createTeam(req.body);
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Matches
  apiRouter.get('/matches', async (req, res) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.get('/matches/:id', async (req, res) => {
    try {
      const match = await storage.getMatchById(parseInt(req.params.id));
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tournaments
  apiRouter.get('/tournaments', async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.post('/tournaments', async (req, res) => {
    try {
      const tournament = await storage.createTournament(req.body);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Academy
  apiRouter.get('/academy', async (req, res) => {
    try {
      const programs = await storage.getAcademyPrograms();
      const coaches = await storage.getCoaches();
      
      res.json({
        programs,
        coaches,
        stats: {
          students: 342,
          coaches: 24,
          programs: 8
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.get('/academy/coaches', async (req, res) => {
    try {
      const coaches = await storage.getCoaches();
      res.json(coaches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // SFA Next
  apiRouter.get('/sfa-next', async (req, res) => {
    try {
      const programs = await storage.getSFANextPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Sports Camps
  apiRouter.get('/sports-camps', async (req, res) => {
    try {
      const camps = await storage.getSportsCamps();
      res.json(camps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.post('/sports-camps', async (req, res) => {
    try {
      const camp = await storage.createSportsCamp(req.body);
      res.status(201).json(camp);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Users
  apiRouter.get('/users', async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.post('/users', async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.get('/users/roles', async (req, res) => {
    try {
      const roles = await storage.getUserRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  apiRouter.post('/users/roles', async (req, res) => {
    try {
      const role = await storage.createUserRole(req.body);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix with /api
  const apiRouter = express.Router();
  
  // Get all simulations
  apiRouter.get("/simulations", async (req, res) => {
    try {
      const simulations = await storage.getAllSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulations" });
    }
  });
  
  // Get simulation by slug
  apiRouter.get("/simulations/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const simulation = await storage.getSimulationBySlug(slug);
      
      if (!simulation) {
        return res.status(404).json({ message: "Simulation not found" });
      }
      
      res.json(simulation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulation" });
    }
  });
  
  // Get simulations by category
  apiRouter.get("/categories/:slug/simulations", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const simulations = await storage.getSimulationsByCategory(slug);
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulations for category" });
    }
  });
  
  // Get featured simulations
  apiRouter.get("/simulations/featured", async (req, res) => {
    try {
      const simulations = await storage.getFeaturedSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured simulations" });
    }
  });
  
  // Get new simulations
  apiRouter.get("/simulations/new", async (req, res) => {
    try {
      const simulations = await storage.getNewSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new simulations" });
    }
  });
  
  // Get popular simulations
  apiRouter.get("/simulations/popular", async (req, res) => {
    try {
      const simulations = await storage.getPopularSimulations();
      res.json(simulations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular simulations" });
    }
  });
  
  // Get all categories
  apiRouter.get("/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get category by slug
  apiRouter.get("/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}

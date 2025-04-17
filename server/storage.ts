import { 
  users, type User, type InsertUser,
  simulations, type Simulation, type InsertSimulation,
  categories, type Category, type InsertCategory 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Simulations
  getAllSimulations(): Promise<Simulation[]>;
  getSimulationBySlug(slug: string): Promise<Simulation | undefined>;
  getSimulationsByCategory(category: string): Promise<Simulation[]>;
  getFeaturedSimulations(): Promise<Simulation[]>;
  getNewSimulations(): Promise<Simulation[]>;
  getPopularSimulations(): Promise<Simulation[]>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private simulationsMap: Map<number, Simulation>;
  private categoriesMap: Map<number, Category>;
  currentUserId: number;
  currentSimulationId: number;
  currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.simulationsMap = new Map();
    this.categoriesMap = new Map();
    this.currentUserId = 1;
    this.currentSimulationId = 1;
    this.currentCategoryId = 1;
    
    // Initialize with some default categories and simulations
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add categories
    const analyticalCategory: InsertCategory = {
      name: "Analytical Chemistry",
      icon: "test-tube",
      slug: "analytical",
      description: "Techniques for separating, identifying, and quantifying matter"
    };
    
    const physicalCategory: InsertCategory = {
      name: "Physical Chemistry",
      icon: "drop",
      slug: "physical",
      description: "Study of macroscopic and particulate phenomena in chemical systems"
    };
    
    const organicCategory: InsertCategory = {
      name: "Organic Chemistry",
      icon: "atom",
      slug: "organic",
      description: "Study of the structure, properties, and reactions of organic compounds"
    };
    
    this.createCategory(analyticalCategory);
    this.createCategory(physicalCategory);
    this.createCategory(organicCategory);
    
    // Add simulations
    const acidBaseTitration: InsertSimulation = {
      title: "Acid-Base Titration",
      description: "Simulate titrations with strong acids and bases",
      slug: "acid-base-titration",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1532634993-15f421e42ec0?q=80&w=2070&auto=format&fit=crop",
      duration: "10-15 min",
      difficulty: "Intermediate",
      isFeatured: true,
      isNew: false,
      isPopular: true,
      path: "/simulations/acid-base-titration"
    };
    
    const gasLaws: InsertSimulation = {
      title: "Gas Laws Exploration",
      description: "Investigate pressure, volume, and temperature relationships",
      slug: "gas-laws",
      category: "physical",
      imageUrl: "https://images.unsplash.com/photo-1575503802870-45de6a6217c8?q=80&w=2070&auto=format&fit=crop",
      duration: "15-20 min",
      difficulty: "Beginner",
      isFeatured: false,
      isNew: true,
      isPopular: false,
      path: "/simulations/gas-laws"
    };
    
    const redoxReactions: InsertSimulation = {
      title: "Redox Reactions",
      description: "Visualize electron transfer in redox reactions",
      slug: "redox-reactions",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1580894732930-0babd100d356?q=80&w=2070&auto=format&fit=crop",
      duration: "20 min",
      difficulty: "Advanced",
      isFeatured: false,
      isNew: false,
      isPopular: false,
      path: "/simulations/redox-reactions"
    };
    
    const molecularOrbital: InsertSimulation = {
      title: "Molecular Orbital Theory",
      description: "Explore molecular orbital formation and bonding",
      slug: "molecular-orbital",
      category: "physical",
      imageUrl: "https://images.unsplash.com/photo-1564937683015-a22c9266ee8c?q=80&w=2070&auto=format&fit=crop",
      duration: "25 min",
      difficulty: "Advanced",
      isFeatured: false,
      isNew: false,
      isPopular: false,
      path: "/simulations/molecular-orbital"
    };
    
    const spectroscopy: InsertSimulation = {
      title: "Spectroscopy Basics",
      description: "Learn about light-matter interactions",
      slug: "spectroscopy",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1616661316529-3338a04a1b5b?q=80&w=2128&auto=format&fit=crop",
      duration: "15 min",
      difficulty: "Intermediate",
      isFeatured: false,
      isNew: true,
      isPopular: false,
      path: "/simulations/spectroscopy"
    };
    
    const chromatography: InsertSimulation = {
      title: "Chromatography",
      description: "Separate and analyze complex mixtures",
      slug: "chromatography",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=2069&auto=format&fit=crop",
      duration: "15 min",
      difficulty: "Intermediate",
      isFeatured: false,
      isNew: false,
      isPopular: false,
      path: "/simulations/chromatography"
    };
    
    const potentiometry: InsertSimulation = {
      title: "Potentiometry",
      description: "Measure electrode potentials in solutions",
      slug: "potentiometry",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1576086776090-12f074ba4388?q=80&w=2080&auto=format&fit=crop",
      duration: "20 min",
      difficulty: "Advanced",
      isFeatured: false,
      isNew: false,
      isPopular: false,
      path: "/simulations/potentiometry"
    };
    
    const thermodynamics: InsertSimulation = {
      title: "Thermodynamics Explorer",
      description: "Study energy transfer and transformation",
      slug: "thermodynamics",
      category: "physical",
      imageUrl: "https://images.unsplash.com/photo-1619435545129-91c6ffa4eb05?q=80&w=2134&auto=format&fit=crop",
      duration: "20 min",
      difficulty: "Intermediate",
      isFeatured: false,
      isNew: false,
      isPopular: false,
      path: "/simulations/thermodynamics"
    };
    
    this.createSimulation(acidBaseTitration);
    this.createSimulation(gasLaws);
    this.createSimulation(redoxReactions);
    this.createSimulation(molecularOrbital);
    this.createSimulation(spectroscopy);
    this.createSimulation(chromatography);
    this.createSimulation(potentiometry);
    this.createSimulation(thermodynamics);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Simulations methods
  async getAllSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulationsMap.values());
  }
  
  async getSimulationBySlug(slug: string): Promise<Simulation | undefined> {
    return Array.from(this.simulationsMap.values()).find(
      (simulation) => simulation.slug === slug,
    );
  }
  
  async getSimulationsByCategory(category: string): Promise<Simulation[]> {
    return Array.from(this.simulationsMap.values()).filter(
      (simulation) => simulation.category === category,
    );
  }
  
  async getFeaturedSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulationsMap.values()).filter(
      (simulation) => simulation.isFeatured,
    );
  }
  
  async getNewSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulationsMap.values()).filter(
      (simulation) => simulation.isNew,
    );
  }
  
  async getPopularSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulationsMap.values()).filter(
      (simulation) => simulation.isPopular,
    );
  }
  
  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const id = this.currentSimulationId++;
    const simulation: Simulation = { ...insertSimulation, id };
    this.simulationsMap.set(id, simulation);
    return simulation;
  }
  
  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesMap.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categoriesMap.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();

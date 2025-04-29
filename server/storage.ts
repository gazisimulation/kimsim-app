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
      name: "Analitik Kimya",
      icon: "test-tube",
      slug: "analytical",
      description: "Maddeleri ayırma, tanımlama ve ölçme teknikleri"
    };
    
    const physicalCategory: InsertCategory = {
      name: "Fiziksel Kimya",
      icon: "drop",
      slug: "physical",
      description: "Kimyasal sistemlerdeki makroskopik ve parçacık fenomenlerinin incelenmesi"
    };
    
    const organicCategory: InsertCategory = {
      name: "Organik Kimya",
      icon: "atom",
      slug: "organic",
      description: "Organik bileşiklerin yapısı, özellikleri ve reaksiyonlarının incelenmesi"
    };
    
    const quantumCategory: InsertCategory = {
      name: "Kuantum Kimyası",
      icon: "atom",
      slug: "quantum",
      description: "Kuantum mekaniği ilkelerini kullanarak atom ve moleküllerin incelenmesi"
    };
    
    const electrochemistryCategory: InsertCategory = {
      name: "Elektrokimya",
      icon: "zap",
      slug: "electrochemistry",
      description: "Elektronların hareketine neden olan ve elektrik üreten kimyasal süreçlerin incelenmesi"
    };
    
    this.createCategory(analyticalCategory);
    this.createCategory(physicalCategory);
    this.createCategory(organicCategory);
    this.createCategory(quantumCategory);
    this.createCategory(electrochemistryCategory);
    
    // Add simulations
    const acidBaseTitration: InsertSimulation = {
      title: "Asit-Baz Titrasyonu",
      description: "Güçlü asit ve bazlarla titrasyon simülasyonu yapın",
      slug: "acid-base-titration",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1532634993-15f421e42ec0?q=80&w=2070&auto=format&fit=crop",
      duration: "10-15 dk",
      difficulty: "Orta",
      isFeatured: true,
      isNew: false,
      isPopular: true,
      path: "/simulations/acid-base-titration"
    };
    
    const quantumAtomModel: InsertSimulation = {
      title: "Kuantum Atom Modeli",
      description: "Atomik orbitallerdeki elektron olasılık bulutlarını görselleştirin",
      slug: "quantum-atom-model",
      category: "quantum",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
      duration: "15 dk",
      difficulty: "İleri",
      isFeatured: false,
      isNew: true,
      isPopular: true,
      path: "/simulations/quantum-atom-model"
    };
    
    const chemicalBonds: InsertSimulation = {
      title: "Kimyasal Bağlar 3B",
      description: "Metalik, iyonik ve kovalent bağlanma mekanizmalarını 3B ortamda keşfedin",
      slug: "chemical-bonds",
      category: "physical",
      imageUrl: "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=3419&auto=format&fit=crop",
      duration: "20 dk",
      difficulty: "Orta",
      isFeatured: false,
      isNew: true,
      isPopular: false,
      path: "/simulations/chemical-bonds"
    };
    
    const molecularOrbital: InsertSimulation = {
      title: "Moleküler Orbital Teorisi",
      description: "Moleküler orbital oluşumunu ve bağlanmayı keşfedin",
      slug: "molecular-orbital",
      category: "quantum",
      imageUrl: "https://images.unsplash.com/photo-1564937683015-a22c9266ee8c?q=80&w=2070&auto=format&fit=crop",
      duration: "25 dk",
      difficulty: "İleri",
      isFeatured: false,
      isNew: false,
      isPopular: true,
      path: "/simulations/molecular-orbital"
    };
    
    // State Change Simulation
    const stateChange: InsertSimulation = {
      title: "Faz Geçişleri",
      description: "Ayarlanabilir parametrelerle maddenin hal değişimlerini keşfedin",
      slug: "state-change",
      category: "physical",
      imageUrl: "https://images.unsplash.com/photo-1506755594592-349d12a7c52a?q=80&w=2070&auto=format&fit=crop",
      duration: "25 dk",
      difficulty: "Başlangıç",
      isFeatured: true,
      isNew: true,
      isPopular: false,
      path: "/simulations/state-change"
    };
    
    // Gas Laws Simulation
    const gasLaws: InsertSimulation = {
      title: "Gaz Yasaları ve Kinetik Teori",
      description: "Gaz davranışı, ideal gaz yasası, kinetik teori, gaz karışımları ve gerçek gazları keşfedin",
      slug: "gas-laws",
      category: "physical",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=3270&auto=format&fit=crop",
      duration: "30 dk",
      difficulty: "Orta",
      isFeatured: true,
      isNew: true,
      isPopular: true,
      path: "/simulations/gas-laws"
    };
    
    // Battery Simulation
    const batterySimulator: InsertSimulation = {
      title: "Pil ve Elektrokimya",
      description: "Farklı pil türleri ve elektrokimyasal reaksiyonlarla pillerin nasıl çalıştığına dair interaktif görselleştirme",
      slug: "battery-simulator",
      category: "electrochemistry",
      imageUrl: "https://images.unsplash.com/photo-1584277261846-c6a1672ed979?q=80&w=2070&auto=format&fit=crop",
      duration: "25 dk",
      difficulty: "Orta",
      isFeatured: true,
      isNew: true,
      isPopular: true,
      path: "/simulations/battery-simulator"
    };
    
    // Chemistry Calculators
    const chemistryCalculators: InsertSimulation = {
      title: "Kimya Hesaplayıcıları",
      description: "İdeal Gaz Yasası, pH, Molarite, Kuantum Sayıları ve daha fazlasını içeren temel kimya hesaplayıcıları koleksiyonu",
      slug: "chemistry-calculators",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2070&auto=format&fit=crop",
      duration: "15 dk",
      difficulty: "Başlangıç",
      isFeatured: true,
      isNew: true,
      isPopular: true,
      path: "/simulations/chemistry-calculators"
    };

    const onesim: InsertSimulation = {
      title: "Karbon Allotrop",
      description: "Karbon ve Allotroplar",
      slug: "onesim",
      category: "analytical",
      imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2070&auto=format&fit=crop",
      duration: "15 dk",
      difficulty: "Başlangıç",
      isFeatured: true,
      isNew: true,
      isPopular: true,
      path: "/simulations/onesim"
    };
    
    this.createSimulation(acidBaseTitration);
    this.createSimulation(quantumAtomModel);
    this.createSimulation(chemicalBonds);
    this.createSimulation(molecularOrbital);
    this.createSimulation(stateChange);
    this.createSimulation(gasLaws);
    this.createSimulation(batterySimulator);
    this.createSimulation(chemistryCalculators);
    this.createSimulation(onesim);
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

import { 
  users, 
  type User, 
  type InsertUser, 
  contactMessages, 
  type ContactMessage, 
  type InsertContactMessage, 
  prijsOffertes,
  type PrijsOfferte,
  type InsertPrijsOfferte
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  
  // Prijsofferte methods
  createPrijsOfferte(offerte: InsertPrijsOfferte): Promise<PrijsOfferte>;
  getAllPrijsOffertes(): Promise<PrijsOfferte[]>;
  getPrijsOfferte(id: number): Promise<PrijsOfferte | undefined>;
  
  // Zendingen methods (voor dashboard)
  getZendingenByUserId(userId: number): Promise<any[]>;
  getActiveZendingenCount(): Promise<number>;
  getDeliveredZendingenCount(): Promise<number>;
  getAverageDeliveryTime(): Promise<string>;
  getCustomerSatisfaction(): Promise<string>;
  getZendingById(id: number): Promise<any | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private prijsOffertes: Map<number, PrijsOfferte>;
  private zendingen: Map<number, any>;
  private userCurrentId: number;
  private contactMessageCurrentId: number;
  private prijsOfferteCurrentId: number;
  private zendingCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.prijsOffertes = new Map();
    this.zendingen = new Map();
    this.userCurrentId = 1;
    this.contactMessageCurrentId = 1;
    this.prijsOfferteCurrentId = 1;
    this.zendingCurrentId = 1;
    
    // Voorbeeldzendingen voor dashboarddemo
    this.initializeZendingen();
  }
  
  // Initialiseer voorbeeld zendingen
  private initializeZendingen() {
    // Standaardzendingen uit de mockdata
    const mockZendingen = [
      {
        id: 1,
        userId: 2, // Dit is de user ID van Huso
        trackingCode: "PNL12345678",
        status: "onderweg",
        prioriteit: "standaard",
        verzendDatum: new Date("2025-05-10T10:30:00"),
        geplanndeAfleverDatum: new Date("2025-05-13T12:00:00"),
        verzender: "Kantoor Supplies B.V.",
        ontvanger: "Tech Solutions N.V.",
        ophaladres: "Industrieweg 45, 1234 AB Amsterdam",
        afleveradres: "Businesspark 12, 5678 CD Rotterdam",
        prijs: "€45,95",
        betaald: true,
        lastUpdate: {
          status: "onderweg",
          locatie: "Distributiecentrum Utrecht",
          tijdstip: new Date("2025-05-11T14:45:00"),
        },
      },
      {
        id: 2,
        userId: 2,
        trackingCode: "PNL23456789",
        status: "gepland",
        prioriteit: "spoed",
        verzendDatum: new Date("2025-05-12T09:00:00"),
        geplanndeAfleverDatum: new Date("2025-05-12T17:00:00"),
        verzender: "Fashion Store B.V.",
        ontvanger: "Boutique Elegance",
        ophaladres: "Modestraat 78, 2345 EF Den Haag",
        afleveradres: "Winkelplein 34, 6789 GH Groningen", 
        prijs: "€75,50",
        betaald: false,
        lastUpdate: {
          status: "gepland",
          locatie: "Wachtend op ophaling",
          tijdstip: new Date("2025-05-11T15:30:00"),
        },
      },
      {
        id: 3, 
        userId: 2,
        trackingCode: "PNL34567890",
        status: "afgeleverd",
        prioriteit: "standaard",
        verzendDatum: new Date("2025-05-09T11:15:00"),
        geplanndeAfleverDatum: new Date("2025-05-11T13:00:00"),
        werkelijkeAfleverDatum: new Date("2025-05-11T12:45:00"),
        verzender: "Electronics Plus",
        ontvanger: "IT Solutions",
        ophaladres: "Techstraat 12, 3456 JK Eindhoven",
        afleveradres: "Computerweg 45, 7890 LM Utrecht",
        prijs: "€32,75",
        betaald: true,
        lastUpdate: {
          status: "afgeleverd",
          locatie: "Computerweg 45, Utrecht",
          tijdstip: new Date("2025-05-11T12:45:00"),
        },
      }
    ];
    
    // Voeg alle mockzendingen toe aan de Map
    mockZendingen.forEach(zending => {
      this.zendingen.set(zending.id, zending);
      // Update de current ID zodat nieuwe zendingen een uniek ID krijgen
      if (zending.id >= this.zendingCurrentId) {
        this.zendingCurrentId = zending.id + 1;
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      id, 
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      role: insertUser.role || "klant",
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      bedrijf: insertUser.bedrijf || null,
      telefoon: insertUser.telefoon || null,
      adres: insertUser.adres || null,
      postcode: insertUser.postcode || null,
      plaats: insertUser.plaats || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    const updatedUser = {
      ...user,
      lastLogin: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const now = new Date();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: now,
      phone: insertMessage.phone || null,
      location: insertMessage.location || null,
      ipAddress: insertMessage.ipAddress || null
    };
    this.contactMessages.set(id, message);
    return message;
  }
  
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  // Prijsofferte methods
  async createPrijsOfferte(insertOfferte: InsertPrijsOfferte): Promise<PrijsOfferte> {
    const id = this.prijsOfferteCurrentId++;
    const now = new Date();
    const offerte: PrijsOfferte = { 
      ...insertOfferte, 
      id, 
      createdAt: now,
      bedrijf: insertOfferte.bedrijf || null,
      ipAddress: insertOfferte.ipAddress || null,
      bericht: insertOfferte.bericht || null,
      prijsIndicatie: insertOfferte.prijsIndicatie || null
    };
    this.prijsOffertes.set(id, offerte);
    return offerte;
  }
  
  async getAllPrijsOffertes(): Promise<PrijsOfferte[]> {
    return Array.from(this.prijsOffertes.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getPrijsOfferte(id: number): Promise<PrijsOfferte | undefined> {
    return this.prijsOffertes.get(id);
  }
  
  // Zendingen methods voor dashboard
  async getZendingenByUserId(userId: number): Promise<any[]> {
    return Array.from(this.zendingen.values())
      .filter(zending => zending.userId === userId)
      .sort((a, b) => b.verzendDatum.getTime() - a.verzendDatum.getTime());
  }
  
  async getActiveZendingenCount(): Promise<number> {
    return Array.from(this.zendingen.values())
      .filter(zending => zending.status !== "afgeleverd" && zending.status !== "geannuleerd")
      .length;
  }
  
  async getDeliveredZendingenCount(): Promise<number> {
    return Array.from(this.zendingen.values())
      .filter(zending => zending.status === "afgeleverd")
      .length;
  }
  
  async getAverageDeliveryTime(): Promise<string> {
    const afgeleverd = Array.from(this.zendingen.values())
      .filter(zending => zending.status === "afgeleverd" && zending.werkelijkeAfleverDatum && zending.verzendDatum);
    
    if (afgeleverd.length === 0) {
      return "0.0 dagen";
    }
    
    const totalDays = afgeleverd.reduce((sum, zending) => {
      const verzendDatum = new Date(zending.verzendDatum);
      const afleverDatum = new Date(zending.werkelijkeAfleverDatum);
      const diffTime = Math.abs(afleverDatum.getTime() - verzendDatum.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return sum + diffDays;
    }, 0);
    
    return (totalDays / afgeleverd.length).toFixed(1) + " dagen";
  }
  
  async getCustomerSatisfaction(): Promise<string> {
    // Demo waarde voor klanttevredenheid
    return "4.8 / 5";
  }
  
  async getZendingById(id: number): Promise<any | undefined> {
    return this.zendingen.get(id);
  }
}

export const storage = new MemStorage();

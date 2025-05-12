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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private prijsOffertes: Map<number, PrijsOfferte>;
  private userCurrentId: number;
  private contactMessageCurrentId: number;
  private prijsOfferteCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.prijsOffertes = new Map();
    this.userCurrentId = 1;
    this.contactMessageCurrentId = 1;
    this.prijsOfferteCurrentId = 1;
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
}

export const storage = new MemStorage();

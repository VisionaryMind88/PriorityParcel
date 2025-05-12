import { users, type User, type InsertUser, contactMessages, type ContactMessage, type InsertContactMessage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const now = new Date();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: now 
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
}

export const storage = new MemStorage();

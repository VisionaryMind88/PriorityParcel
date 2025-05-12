import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertPrijsOfferteSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import express from "express";
import path from "path";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from root public directory
  app.use(express.static(path.join(process.cwd(), 'public')));
  
  // Serve static files from client/public directory
  app.use(express.static(path.join(process.cwd(), 'client', 'public')));
  // Contact form submission endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = insertContactMessageSchema.parse({
        ...req.body,
        ipAddress: req.ip || req.socket.remoteAddress
      });
      
      // Store the contact message
      const savedMessage = await storage.createContactMessage(validatedData);
      
      // Return success response
      return res.status(201).json({
        id: savedMessage.id,
        message: "Contact message submitted successfully"
      });
    } catch (error) {
      console.error("Error handling contact form submission:", error);
      
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      return res.status(500).json({
        message: "Error processing your request"
      });
    }
  });
  
  // Get all contact messages (would typically be protected in production)
  app.get("/api/contact", async (_req: Request, res: Response) => {
    try {
      const messages = await storage.getAllContactMessages();
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({
        message: "Error processing your request"
      });
    }
  });
  
  // Handle prijsofferte requests
  app.post("/api/prijsofferte", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = insertPrijsOfferteSchema.parse({
        ...req.body,
        ipAddress: req.ip || req.socket.remoteAddress
      });
      
      // Store the contact message
      const savedOfferte = await storage.createPrijsOfferte(validatedData);
      
      // Email sending would be handled here in production with SendGrid
      // For now we only log the data
      console.log("Received price quote request:", {
        id: savedOfferte.id,
        naam: savedOfferte.naam,
        email: savedOfferte.email,
        telefoon: savedOfferte.telefoon,
        transportType: savedOfferte.transportType,
        timestamp: savedOfferte.createdAt
      });
      
      // Return success response
      return res.status(201).json({
        id: savedOfferte.id,
        message: "Prijsofferte aanvraag succesvol ingediend"
      });
    } catch (error) {
      console.error("Error handling prijsofferte submission:", error);
      
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validatiefout",
          errors: validationError.details
        });
      }
      
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het verwerken van uw aanvraag"
      });
    }
  });

  // User login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      // Validate login request
      const loginSchema = z.object({
        email: z.string().email({ message: "Voer een geldig e-mailadres in" }),
        password: z.string().min(6, { message: "Ongeldig wachtwoord" }),
        rememberMe: z.boolean().optional(),
      });
      
      const validatedData = loginSchema.parse(req.body);
      
      // In a real implementation, this would verify against hashed passwords
      // Here we'll just look for the user by email (since usernames might not have emails)
      const users = await storage.getAllUsers();
      const user = users.find(u => u.email === validatedData.email);
      
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ 
          message: "Ongeldige inloggegevens" 
        });
      }
      
      // Update last login timestamp
      await storage.updateUserLastLogin(user.id);
      
      // In a real implementation, this would create a secure session token
      // For now, we'll just return the user info (excluding password)
      const { password, ...userWithoutPassword } = user;
      
      // Create a token that includes the user ID so we can identify the user later
      const token = `mock-jwt-token-${Date.now()}-${user.id}`;
      
      return res.status(200).json({
        user: userWithoutPassword,
        token: token, // In a real implementation, this would be a JWT token
      });
      
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validatiefout",
          errors: validationError.details
        });
      }
      
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het inloggen"
      });
    }
  });
  
  // Get authenticated user information
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      // In a real implementation, this would verify the user's session/token
      // For now, we'll mock the authentication by returning a user if the auth header exists
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Niet geautoriseerd" });
      }
      
      // Extract the token (we'll use it to identify the user)
      const token = authHeader.split(' ')[1];
      // Check if the token contains a user ID (our mock tokens have format "mock-jwt-token-{timestamp}-{userId}")
      const tokenParts = token.split('-');
      const userId = tokenParts.length > 3 ? parseInt(tokenParts[4], 10) : 2; // Default to user 2 if not found
      
      // Find the user by ID
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
      }
      
      // Remove the password before sending the response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
      
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van gebruikersgegevens"
      });
    }
  });

  // Create a demo user for testing (normally this would be in a registration endpoint)
  app.post("/api/demo-user", async (req: Request, res: Response) => {
    try {
      // Check if we already have demo users
      const users = await storage.getAllUsers();
      
      // Create users if none exist
      if (users.length === 0) {
        // Create a demo user
        const demoUser = {
          username: "johndoe",
          email: "john.doe@example.com",
          password: "wachtwoord123",
          firstName: "John",
          lastName: "Doe",
          bedrijf: "Voorbeeld BV",
          telefoon: "+31 6 12345678",
          adres: "Voorbeeldstraat 123",
          postcode: "1234 AB",
          plaats: "Amsterdam",
          role: "klant"
        };
        
        // Create a user with the provided credentials
        const customUser = {
          username: "husobosna",
          email: "husobosna8@gmail.com",
          password: "flufica1",
          firstName: "Huso",
          lastName: "Bosna",
          bedrijf: "Priorityparcel",
          telefoon: "+31 6 12345678",
          adres: "Meanderhof 97",
          postcode: "4337 GP",
          plaats: "Middelburg",
          role: "klant"
        };
        
        // Create both users
        const newDemoUser = await storage.createUser(demoUser);
        const newCustomUser = await storage.createUser(customUser);
        
        // Return information about created users (without passwords)
        const { password: pass1, ...demoUserWithoutPassword } = newDemoUser;
        const { password: pass2, ...customUserWithoutPassword } = newCustomUser;
        
        return res.status(201).json({
          message: "Gebruikers aangemaakt",
          users: [demoUserWithoutPassword, customUserWithoutPassword]
        });
      } else {
        return res.status(200).json({
          message: "Demo gebruikers bestaan al",
          count: users.length
        });
      }
      
    } catch (error) {
      console.error("Error creating demo user:", error);
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het aanmaken van de demo gebruiker"
      });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response) => {
    // In a real implementation, this would invalidate the user's session token
    return res.status(200).json({ message: "Succesvol uitgelogd" });
  });
  
  // API routes voor dashboard
  
  // Haal alle zendingen op voor een gebruiker
  app.get("/api/zendingen", async (req: Request, res: Response) => {
    try {
      // Normaal zouden we de user ID uit de geauthenticeerde gebruiker halen
      // Voor nu gebruiken we de user ID uit de query parameter of default naar 2 (Huso)
      const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : 2;
      
      const zendingen = await storage.getZendingenByUserId(userId);
      
      return res.status(200).json(zendingen);
    } catch (error) {
      console.error("Error fetching zendingen:", error);
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van zendingen"
      });
    }
  });
  
  // Haal dashboard statistieken op
  app.get("/api/dashboard/stats", async (_req: Request, res: Response) => {
    try {
      // Verzamel alle dashboardstatistieken
      const [activeZendingen, afgeleverdZendingen, gemiddeldeTijd, klanttevredenheid] = await Promise.all([
        storage.getActiveZendingenCount(),
        storage.getDeliveredZendingenCount(),
        storage.getAverageDeliveryTime(),
        storage.getCustomerSatisfaction()
      ]);
      
      const totaalZendingen = activeZendingen + afgeleverdZendingen;
      
      return res.status(200).json({
        totaalZendingen,
        actieveZendingen: activeZendingen,
        afgeleverd: afgeleverdZendingen,
        gemiddeldeLeveringstijd: gemiddeldeTijd,
        klanttevredenheid
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van dashboardstatistieken"
      });
    }
  });
  
  // Haal details van een specifieke zending op
  app.get("/api/zendingen/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Ongeldig zending ID" });
      }
      
      const zending = await storage.getZendingById(id);
      
      if (!zending) {
        return res.status(404).json({ message: "Zending niet gevonden" });
      }
      
      return res.status(200).json(zending);
    } catch (error) {
      console.error("Error fetching zending:", error);
      return res.status(500).json({
        message: "Er is een fout opgetreden bij het ophalen van de zending"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

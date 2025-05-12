import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import express from "express";
import path from "path";

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

  const httpServer = createServer(app);

  return httpServer;
}

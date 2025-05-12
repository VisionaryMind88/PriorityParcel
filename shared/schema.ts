import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum types voor offerteaanvragen
export const transportTypeEnum = z.enum(["nationaal", "internationaal"]);
export const gewichtEnum = z.enum(["0-5", "5-10", "10-20", "20-50", "50+"]);
export const afmetingenEnum = z.enum(["klein", "middel", "groot", "extra-groot"]);
export const spoedEnum = z.enum(["standaard", "spoed", "extra-spoed"]);

// Contact form submissions
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  message: text("message").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schema for contact messages
export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  location: true,
  message: true,
  ipAddress: true,
});

// User schema (kept from original template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Prijsofferte schema
export const prijsOffertes = pgTable("prijs_offertes", {
  id: serial("id").primaryKey(),
  transportType: text("transportType").notNull(),
  gewicht: text("gewicht").notNull(),
  afmetingen: text("afmetingen").notNull(),
  spoed: text("spoed").notNull(),
  naam: text("naam").notNull(),
  bedrijf: text("bedrijf"),
  email: text("email").notNull(),
  telefoon: text("telefoon").notNull(),
  ophaladres: text("ophaladres").notNull(),
  afleveradres: text("afleveradres").notNull(),
  bericht: text("bericht"),
  prijsIndicatie: text("prijsIndicatie"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schema voor prijsoffertes
export const insertPrijsOfferteSchema = createInsertSchema(prijsOffertes).pick({
  transportType: true,
  gewicht: true,
  afmetingen: true,
  spoed: true,
  naam: true,
  bedrijf: true,
  email: true,
  telefoon: true,
  ophaladres: true,
  afleveradres: true,
  bericht: true,
  prijsIndicatie: true,
  ipAddress: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertPrijsOfferte = z.infer<typeof insertPrijsOfferteSchema>;
export type PrijsOfferte = typeof prijsOffertes.$inferSelect;

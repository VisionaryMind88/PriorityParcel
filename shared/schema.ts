import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum types voor offerteaanvragen
export const transportTypeEnum = z.enum(["nationaal", "internationaal"]);
export const gewichtEnum = z.enum(["0-5", "5-10", "10-20", "20-50", "50+"]);
export const afmetingenEnum = z.enum(["klein", "middel", "groot", "extra-groot"]);
export const spoedEnum = z.enum(["standaard", "spoed", "extra-spoed"]);

// Nieuwe enum types voor het dashboard
export const userRoleEnum = z.enum(["admin", "klant", "medewerker"]);
export const zendingStatusEnum = z.enum(["gepland", "opgehaald", "onderweg", "afgeleverd", "vertraagd", "geannuleerd"]);

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

// Verbeterd user schema voor het dashboard
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("klant"),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  bedrijf: varchar("bedrijf", { length: 200 }),
  telefoon: varchar("telefoon", { length: 20 }),
  adres: varchar("adres", { length: 255 }),
  postcode: varchar("postcode", { length: 10 }),
  plaats: varchar("plaats", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
  bedrijf: true,
  telefoon: true,
  adres: true,
  postcode: true,
  plaats: true,
});

// Klanten tabel voor bedrijven
export const klanten = pgTable("klanten", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bedrijfsnaam: varchar("bedrijfsnaam", { length: 200 }).notNull(),
  kvkNummer: varchar("kvk_nummer", { length: 20 }),
  btwNummer: varchar("btw_nummer", { length: 20 }),
  contactPersoon: varchar("contact_persoon", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull(),
  telefoon: varchar("telefoon", { length: 20 }).notNull(),
  factuurAdres: varchar("factuur_adres", { length: 255 }),
  factuurPostcode: varchar("factuur_postcode", { length: 10 }),
  factuurPlaats: varchar("factuur_plaats", { length: 100 }),
  isActief: boolean("is_actief").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertKlantSchema = createInsertSchema(klanten).pick({
  userId: true,
  bedrijfsnaam: true,
  kvkNummer: true,
  btwNummer: true,
  contactPersoon: true,
  email: true,
  telefoon: true,
  factuurAdres: true,
  factuurPostcode: true,
  factuurPlaats: true,
  isActief: true,
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

// Zendingen tabel voor het dashboard
export const zendingen = pgTable("zendingen", {
  id: serial("id").primaryKey(),
  trackingCode: varchar("tracking_code", { length: 20 }).notNull().unique(),
  klantId: integer("klant_id").references(() => klanten.id),
  userId: integer("user_id").references(() => users.id),
  status: varchar("status", { length: 20 }).notNull().default("gepland"),
  prioriteit: varchar("prioriteit", { length: 20 }).notNull().default("standaard"),
  transportType: varchar("transport_type", { length: 20 }).notNull(),
  omschrijving: text("omschrijving"),
  gewicht: varchar("gewicht", { length: 10 }),
  afmetingen: varchar("afmetingen", { length: 50 }),
  verzendDatum: timestamp("verzend_datum"),
  geplanndeAfleverDatum: timestamp("geplannde_aflever_datum"),
  werkelijkeAfleverDatum: timestamp("werkelijke_aflever_datum"),
  ophaladres: varchar("ophaladres", { length: 255 }).notNull(),
  ophaalPostcode: varchar("ophaal_postcode", { length: 10 }),
  ophaalPlaats: varchar("ophaal_plaats", { length: 100 }),
  ophaalLand: varchar("ophaal_land", { length: 100 }).default("Nederland"),
  afleveradres: varchar("afleveradres", { length: 255 }).notNull(),
  afleverPostcode: varchar("aflever_postcode", { length: 10 }),
  afleverPlaats: varchar("aflever_plaats", { length: 100 }),
  afleverLand: varchar("aflever_land", { length: 100 }).default("Nederland"),
  verzender: varchar("verzender", { length: 200 }),
  ontvanger: varchar("ontvanger", { length: 200 }),
  ontvangerTelefoon: varchar("ontvanger_telefoon", { length: 20 }),
  opmerkingen: text("opmerkingen"),
  prijs: varchar("prijs", { length: 20 }),
  betaald: boolean("betaald").default(false),
  factuurId: integer("factuur_id"),
  chauffeurId: integer("chauffeur_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertZendingSchema = createInsertSchema(zendingen).pick({
  trackingCode: true,
  klantId: true,
  userId: true,
  status: true,
  prioriteit: true,
  transportType: true,
  omschrijving: true,
  gewicht: true,
  afmetingen: true,
  verzendDatum: true,
  geplanndeAfleverDatum: true,
  werkelijkeAfleverDatum: true,
  ophaladres: true,
  ophaalPostcode: true,
  ophaalPlaats: true,
  ophaalLand: true,
  afleveradres: true,
  afleverPostcode: true,
  afleverPlaats: true,
  afleverLand: true,
  verzender: true,
  ontvanger: true,
  ontvangerTelefoon: true,
  opmerkingen: true,
  prijs: true,
  betaald: true,
  factuurId: true,
  chauffeurId: true,
});

// Zending updates/statuswijzigingen
export const zendingUpdates = pgTable("zending_updates", {
  id: serial("id").primaryKey(),
  zendingId: integer("zending_id").notNull().references(() => zendingen.id),
  status: varchar("status", { length: 20 }).notNull(),
  locatie: varchar("locatie", { length: 255 }),
  opmerking: text("opmerking"),
  door: integer("door").references(() => users.id),
  tijdstip: timestamp("tijdstip").defaultNow().notNull(),
});

export const insertZendingUpdateSchema = createInsertSchema(zendingUpdates).pick({
  zendingId: true,
  status: true,
  locatie: true,
  opmerking: true,
  door: true,
});

export type InsertKlant = z.infer<typeof insertKlantSchema>;
export type Klant = typeof klanten.$inferSelect;

export type InsertZending = z.infer<typeof insertZendingSchema>;
export type Zending = typeof zendingen.$inferSelect;

export type InsertZendingUpdate = z.infer<typeof insertZendingUpdateSchema>;
export type ZendingUpdate = typeof zendingUpdates.$inferSelect;

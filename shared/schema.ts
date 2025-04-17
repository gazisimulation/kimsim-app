import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Simulation model
export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  duration: text("duration").notNull(),
  difficulty: text("difficulty").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isPopular: boolean("is_popular").default(false),
  path: text("path").notNull(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
});

export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;

// Categories model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

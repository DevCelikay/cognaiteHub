import { z } from "zod/v4";

// Clients
export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email").optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

// Projects
export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["active", "archived"]).default("active"),
  client_id: z.string().uuid().nullable().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// Tasks
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  project_id: z.string().uuid().nullable().optional(),
});

export const toggleTaskSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean(),
});

// Notes
export const createNoteSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

export const updateNoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

// Transcripts
export const createTranscriptSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  source: z.string().optional(),
  recorded_at: z.string().optional(),
});

export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: "active" | "archived";
  client_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectWithClient = Project & {
  clients: Pick<Client, "id" | "name"> | null;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  position: number;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskWithProject = Task & {
  projects: Pick<Project, "id" | "name"> | null;
};

export type Note = {
  id: string;
  project_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRole = "owner" | "admin" | "member";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Transcript = {
  id: string;
  project_id: string;
  title: string;
  content: string | null;
  source: string | null;
  recorded_at: string | null;
  created_at: string;
  updated_at: string;
};

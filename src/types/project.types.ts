export interface ProjectMetadata {
  title: string;
  description: string;
  createdAt: string;
  projectDue?: string;
  coverImage: string;
  tags: string[];
  capabilities?: string[];
  awards?: string;
  order?: number;
  repository?: string;
  docs?: string;
  url?: string;
}

export interface Project extends ProjectMetadata {
  _id: string;
  slug: string;
  coverImageBlur?: string;
}

export interface ProjectMetadata {
  title: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  projectDue?: string;
  coverImage: string;
  heroImage?: string;
  tags: string[];
  capabilities?: string[];
  awards?: string;
  recommendedOrder?: number;
  repository?: string;
  docs?: string;
  url?: string;
}

export interface Project extends ProjectMetadata {
  _id: string;
  slug: string;
  coverImageBlur?: string;
  heroImageBlur?: string;
}

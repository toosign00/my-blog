export interface PostMetadata {
  title: string;
  subtitle: string;
  createdAt: string;
  modifiedAt: string;
  coverImage: string;
  category: string;
  tags?: string[];
  comments?: boolean;
}

export interface Post extends PostMetadata {
  _id: string;
  slug: string;
  coverImageBlur?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export const slugify = (text: string): string => {
  return text.toLowerCase().replace(/[\s/]/g, "-");
};

export const decodeSlugSegment = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

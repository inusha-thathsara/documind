export const SEARCH_DOCS_QUERY = `
  *[_type == "doc" && (
    title match $keyword + "*" || 
    description match $keyword + "*" || 
    $keyword in tags
  )] | score(title match $keyword + "*") | order(_score desc) [0...5] {
    _id,
    title,
    slug,
    category,
    description,
    body
  }
`;

export const GET_ALL_DOCS_QUERY = `
  *[_type == "doc"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    category,
    description,
    tags
  }
`;

export const GET_DOC_BY_SLUG_QUERY = `
  *[_type == "doc" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    description,
    tags,
    body,
    _createdAt
  }
`;

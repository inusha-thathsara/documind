export default {
  name: 'doc',
  title: 'Documentation Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'AI & Machine Learning', value: 'ai-ml'},
          {title: 'Architecture & Systems', value: 'architecture'},
          {title: 'Frontend & Creative UI', value: 'frontend'},
          {title: 'Web3 & Blockchain', value: 'web3'},
          {title: 'Getting Started', value: 'getting-started'},
          {title: 'Guides & Tutorials', value: 'guides'},
          {title: 'API Reference', value: 'api-reference'},
          {title: 'Showcase & Case Studies', value: 'examples'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Used for search context and preview cards.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'code',
          title: 'Code Block',
          options: {
            withFilename: true,
          }
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
}

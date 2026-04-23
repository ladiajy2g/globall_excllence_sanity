export default {
  name: 'advert',
  title: 'Advert',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'adLink',
      title: 'Ad Link',
      type: 'url',
    },
    {
      name: 'adVideoUrl',
      title: 'Ad Video URL',
      type: 'url',
    },
    {
      name: 'placement',
      title: 'Placement',
      type: 'string',
      options: {
        list: [
          { title: 'Top Banner', value: 'top-banner' },
          { title: 'Footer Banner', value: 'footer-banner' },
          { title: 'Hero Bottom', value: 'hero-bottom' },
          { title: 'Between Sections', value: 'between-sections' },
          { title: 'Home Grid', value: 'home-grid' },
          { title: 'Article Sidebar', value: 'article-sidebar' },
        ],
      },
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}

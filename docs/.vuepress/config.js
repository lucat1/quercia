module.exports = {
  title: 'Quercia',
  description: 'The next-like framework for your monolith application',

  themeConfig: {
    navbar: false,
    sidebar: [
      {
        title: 'Get started',
        children: ['/', '/setup'],
        sidebar: 'auto'
      },
      {
        title: 'Backends',
        children: ['/backends/', '/backends/go'],
        sidebar: 'auto'
      },
      {
        title: 'Internals',
        children: ['/internals/', '/internals/template'],
        sidebar: 'auto'
      }
    ]
  }
}

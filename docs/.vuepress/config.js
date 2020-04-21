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
        children: [
          '/internals/',
          '/internals/cli',
          '/internals/hooks',
          {
            title: 'Tasks',
            children: [
              'internals/tasks/structure',
              'internals/tasks/config',
              'internals/tasks/builder'
            ],
            sidebar: 'auto'
          },
          '/internals/runtime'
        ],
        sidebar: 'auto'
      }
    ]
  }
}

module.exports = {
  title: 'ZYQ',
  description: '专注于记录技术点滴',
  themeConfig: {
    nav: [
      { text: 'Vue', link: '/vue/' },
      { text: 'React', link: '/react/' },
      { text: 'JS', link: '/js/' },
      { text: 'CSS', link: '/css/' },
      { text: '其他', link: '/other/' },
      { text: 'Github', link: 'https://github.com/kingkadienm' },
    ],
    sidebar: {
      '/vue/': [
        '',
        'about'
      ],
      '/react/': [
        '',
        'react'
      ],
      '/js/': [
        ''
      ],
      '/css/': [
        ''
      ],
      '/other/': [
        '',
        'prettier'
      ]
    }
  },
  markdown: {
    lineNumbers: true
  }
}

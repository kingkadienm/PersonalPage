module.exports = {
    title: 'Wangzs',
    description: '专注于记录技术点滴',
    themeConfig: {
        nav: [
            {text: 'Android', link: '/android/'},
            {text: 'Flutter', link: '/flutter/'},
            {text: 'Python', link: '/python/'},
            {text: 'Goland', link: '/goland/'},
            {text: 'Vue', link: '/vue/'},
            {text: 'React', link: '/react/'},
            {text: 'JS', link: '/js/'},
            {text: 'CSS', link: '/css/'},
            {text: '其他', link: '/other/'},
            {text: 'Github', link: 'https://github.com/kingkadienm'},
        ],
        sidebar: {
            '/android/': [
                '',
                'custom_view',
                'aidl',
                '面试'
            ],
            '/flutter/': [
                '',
            ],
            '/python/': [
                '',
            ],
            '/goland/': [
                '',
            ],
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

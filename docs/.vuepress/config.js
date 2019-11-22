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
                'Android知识点收集',
                '面试',
                '适配'
            ],
            '/flutter/': [
                '',
                'Flutter2Android_1',
                'Flutter2Android_2',
                '2019-11-22',
                '2019-11-22_2',
                'Flutter2Android_2',
                'Flutter_plugin'
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

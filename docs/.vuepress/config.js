module.exports = {
    title: '云端记事集',
    description: '专注于记录技术点滴',
    themeConfig: {
        nav: [
            {text: '移动端', items: [
                {text: 'Android', link: '/android/'},
                {text: 'Flutter', link: '/flutter/'}
            ]},
            {text: '后端', items: [
                {text: 'Java', link: '/java/'},
                {text: 'Python', link: '/python/'},
                {text: 'Go', link: '/goland/'}
            ]},
            {text: '前端', items: [
                {text: 'Vue', link: '/vue/'},
                {text: 'React', link: '/react/'},
                {text: 'JS', link: '/js/'},
                {text: 'CSS', link: '/css/'}
            ]},
            {text: '网络', link: '/network/'},
            {text: '其他', link: '/other/'},
            {text: 'Github', link: 'https://github.com/kingkadienm', target: '_blank'},
        ],
        sidebar: {
            '/android/': [
                '',
                {
                    title: '基础篇',
                    children: ['custom_view', 'aidl', 'Android知识点收集', 'android面试题大全', 'Android面试问答详解', 'java', '适配']
                },
                {title: '进阶篇', children: ['android-advanced']},
                {title: '实战篇', children: ['android-project']}
            ],
            '/java/': [
                '',
                {
                    title: '一、基础内功',
                    children: ['java-basics', 'java-collections']
                },
                {
                    title: '二、JVM 与并发',
                    children: ['java-jvm', 'java-concurrent', 'java-advanced']
                },
                {
                    title: '三、企业开发',
                    children: ['java-spring', 'java-persistence', 'java-middleware']
                },
                {
                    title: '四、架构与工程化',
                    children: ['java-architecture', 'java-devops', 'java-source-advanced']
                },
                {
                    title: '五、工程实践',
                    children: ['java-project']
                }
            ],
            '/flutter/': [
                '',
                {title: 'Dart 基础', children: ['2019-11-22', '2019-11-22_2']},
                {title: '与原生交互', children: ['Flutter2Android_1', 'Flutter2Android_2']},
                {title: '开发配置', children: ['flutter_configuration_mac', 'flutter_configuration_window', 'fvm-config']},
                {title: '插件开发', children: ['Flutter_plugin']},
                {title: '进阶', children: ['flutter-advanced', 'getx']},
                {title: '实战', children: ['flutter-project']}
            ],
            '/python/': [
                '',
                {title: '基础', children: ['python-basics']},
                {title: '进阶', children: ['python-advanced']},
                {title: '实战', children: ['python-project']}
            ],
            '/goland/': [
                '',
                {title: '基础', children: ['go-basics']},
                {title: '进阶', children: ['go-advanced']},
                {title: '实战', children: ['go-project']}
            ],
            '/vue/': [
                '',
                {title: '基础', children: ['vue-basics']},
                {title: '进阶', children: ['vue-advanced']},
                {title: '实战', children: ['vue-project']},
                {title: '其他', children: ['about']}
            ],
            '/react/': [
                '',
                {title: '入门', children: ['react', 'react-basics']},
                {title: 'Hooks', children: ['react-hooks']},
                {title: '进阶', children: ['react-advanced']},
                {title: '实战', children: ['react-project']}
            ],
            '/js/': [
                '',
                {title: '基础', children: ['js-basics']},
                {title: '进阶', children: ['js-advanced']}
            ],
            '/css/': [
                '',
                {title: '基础', children: ['css-basics']},
                {title: '进阶', children: ['css-advanced', 'scroll']}
            ],
            '/network/': [
                '',
                {title: '入门', children: ['network-basics']},
                {title: '进阶', children: ['network-advanced']}
            ],
            '/other/': [
                '',
                'prettier'
            ]
        },
        sidebarDepth: 2,
        lastUpdated: '最后更新',
        smoothScroll: true,
        searchMaxSuggestions: 10
    },
    markdown: {
        lineNumbers: true
    }
}

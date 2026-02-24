export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  if (typeof window !== 'undefined') {
    const base = (router.history && router.history.base) || ''
    const addFooter = () => {
      setTimeout(() => {
        const page = document.querySelector('.page') || document.querySelector('.theme-default-content')
        if (page && !page.querySelector('.site-footer')) {
          const footer = document.createElement('div')
          footer.className = 'site-footer'
          footer.style.cssText = 'text-align: center; padding: 2rem 0; margin-top: 4rem; color: #6a737d; font-size: 14px; border-top: 1px solid #eaecef;'
          footer.innerHTML = `
            <p style="margin: 0;">
              MIT Licensed | Copyright © 2024-present 云端记事集 | 
              <a href="https://beian.miit.gov.cn/" target="_blank" style="color: #6a737d; text-decoration: none;">京ICP备2026006357号-1</a>
              <img src="${base}/image/beian.png" alt="京ICP备2026006357号-1" style="width: 16px; height: 16px;"/>
              <a href="https://beian.mps.gov.cn/#/query/webSearch?code=11010502059429" rel="noreferrer" target="_blank">京公网安备11010502059429号</a>
            </p>
          `
          page.appendChild(footer)
        }
      }, 500)
    }
    
    router.afterEach(() => {
      addFooter()
    })
    
    if (document.readyState === 'complete') {
      addFooter()
    } else {
      window.addEventListener('load', addFooter)
      document.addEventListener('DOMContentLoaded', addFooter)
    }
  }
}

(() => {
  'use strict';

  const canonicalPath = '/battlescope/';

  function installHomepageLinks() {
    const section = document.querySelector('.ega-battlescope-section');
    if (!section) return false;

    const primaryLink = section.querySelector('.ega-battlescope-feature');
    if (!primaryLink) return false;
    primaryLink.href = canonicalPath;
    section.querySelectorAll('a[href="/rm-battlescope/"], a[href="/battlescope/"]').forEach(link => {
      if (link !== primaryLink) link.remove();
    });
    const description = section.querySelector('.ega-battlescope-copy p');
    if (description) {
      description.textContent = '把 RMUC 2026 比赛数据转化为赛局趋势、交战态势、强队对标、操作表现与三维战场回放。';
    }
    section.querySelectorAll('.ega-battlescope-metrics span').forEach(metric => {
      if (metric.querySelector('small')?.textContent.trim() === '分析模块') {
        metric.querySelector('strong').textContent = '5';
      }
    });

    return true;
  }

  function install() {
    const isHomepage = location.pathname === '/' || location.pathname === '/index.html';
    const homepageReady = !isHomepage || installHomepageLinks();
    if (homepageReady) observer.disconnect();
  }

  const observer = new MutationObserver(install);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  install();
})();

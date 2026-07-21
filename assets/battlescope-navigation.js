(() => {
  'use strict';

  const canonicalPath = '/battlescope/';
  const threeDimensionalPath = '/battlescope/3d/';

  function installHeaderLink() {
    const navigation = document.getElementById('site-navigation');
    if (!navigation) return false;
    if (!navigation.querySelector('[data-battlescope-nav]')) {
      const link = document.createElement('a');
      link.href = canonicalPath;
      link.dataset.battlescopeNav = '';
      link.textContent = '赛训复盘';
      const contact = navigation.querySelector('a[href="/contact"]');
      navigation.insertBefore(link, contact || null);
    }
    return true;
  }

  function installHomepageLinks() {
    const section = document.querySelector('.ega-battlescope-section');
    if (!section) return false;

    section.querySelectorAll('a[href="/rm-battlescope/"]').forEach(link => {
      link.href = canonicalPath;
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

    if (!section.querySelector('.ega-battlescope-quick-links')) {
      const links = document.createElement('nav');
      links.className = 'ega-battlescope-quick-links';
      links.setAttribute('aria-label', '赛训复盘快捷入口');
      links.innerHTML = `
        <a href="${canonicalPath}"><span>RM BattleScope</span><strong>进入赛训复盘平台</strong><i aria-hidden="true">→</i></a>
        <a class="is-three-dimensional" href="${threeDimensionalPath}"><span>3D REPLAY</span><strong>直接打开三维战场</strong><i aria-hidden="true">↗</i></a>`;
      section.querySelector('.section-wrap')?.appendChild(links);
    }
    return true;
  }

  function install() {
    const headerReady = installHeaderLink();
    const isHomepage = location.pathname === '/' || location.pathname === '/index.html';
    const homepageReady = !isHomepage || installHomepageLinks();
    if (headerReady && homepageReady) observer.disconnect();
  }

  const observer = new MutationObserver(install);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  install();
})();

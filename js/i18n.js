/**
 * i18n — Sistema de tradução PT/EN
 * Carrega JSONs, aplica traduções via data-i18n, persiste no localStorage.
 */

const I18n = (() => {
  const STORAGE_KEY = 'lang';
  const DEFAULT_LANG = 'pt';
  const cache = {};

  function getSavedLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function saveLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  async function loadTranslations(lang) {
    if (cache[lang]) return cache[lang];

    try {
      const response = await fetch(`i18n/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      cache[lang] = await response.json();
      return cache[lang];
    } catch (err) {
      console.error(`i18n: Could not load ${lang}.json`, err);
      return null;
    }
  }

  function applyTranslations(translations) {
    if (!translations) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key] !== undefined) {
        el.textContent = translations[key];
      }
    });
  }

  function updateHtmlLang(lang) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }

  function updateToggleButton(lang) {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    const label = lang === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese';
    btn.setAttribute('aria-label', label);
  }

  async function setLang(lang) {
    const translations = await loadTranslations(lang);
    if (!translations) return;

    applyTranslations(translations);
    updateHtmlLang(lang);
    updateToggleButton(lang);
    saveLang(lang);
  }

  function getCurrentLang() {
    return getSavedLang();
  }

  function toggle() {
    const current = getSavedLang();
    const next = current === 'pt' ? 'en' : 'pt';
    setLang(next);
  }

  async function init() {
    const lang = getSavedLang();
    await setLang(lang);

    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  return { init, setLang, toggle, getCurrentLang };
})();

document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
});

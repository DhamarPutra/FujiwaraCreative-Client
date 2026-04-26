import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "store": "Store",
        "about": "About",
        "contact": "Contact"
      },
      "hero": {
        "title": "Innovative Solutions for Your Digital Needs",
        "subtitle": "Fujiwara Creative specializes in high-quality web development, HAKI certification, and IT consulting.",
        "cta": "Explore Services"
      }
    }
  },
  id: {
    translation: {
      "nav": {
        "home": "Beranda",
        "store": "Layanan",
        "about": "Tentang",
        "contact": "Kontak"
      },
      "hero": {
        "title": "Solusi Inovatif untuk Kebutuhan Digital Anda",
        "subtitle": "Fujiwara Creative ahli dalam pembuatan web berkualitas tinggi, pengurusan HAKI, dan konsultasi IT.",
        "cta": "Lihat Layanan"
      }
    }
  }
};

const savedLang = Cookies.get('lang') || 'id';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

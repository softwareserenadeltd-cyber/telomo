import React, { useState, useEffect } from "react";
import "./Footer.css";

// Translations object
const translations = {
  da: {
    questions: "Spørgsmål?",
    contactUs: "Kontakt os",
    faq: "FAQ",
    helpCenter: "Hjælpecenter",
    termsOfUse: "Brugsbetingelser",
    privacy: "Fortrolighed",
    cookieSettings: "Cookie-indstillinger",
    companyInfo: "Virksomhedsoplysninger"
  },
  en: {
    questions: "Questions?",
    contactUs: "Contact Us",
    faq: "FAQ",
    helpCenter: "Help Center",
    termsOfUse: "Terms of Use",
    privacy: "Privacy",
    cookieSettings: "Cookie Settings",
    companyInfo: "Company Information"
  },
  ar: {
    questions: "أسئلة؟",
    contactUs: "اتصل بنا",
    faq: "الأسئلة الشائعة",
    helpCenter: "مركز المساعدة",
    termsOfUse: "شروط الاستخدام",
    privacy: "الخصوصية",
    cookieSettings: "إعدادات ملفات تعريف الارتباط",
    companyInfo: "معلومات الشركة"
  },
  fr: {
    questions: "Des questions ?",
    contactUs: "Contactez-nous",
    faq: "FAQ",
    helpCenter: "Centre d'aide",
    termsOfUse: "Conditions d'utilisation",
    privacy: "Confidentialité",
    cookieSettings: "Paramètres des cookies",
    companyInfo: "Informations sur l'entreprise"
  },
  es: {
    questions: "¿Preguntas?",
    contactUs: "Contáctanos",
    faq: "Preguntas frecuentes",
    helpCenter: "Centro de ayuda",
    termsOfUse: "Términos de uso",
    privacy: "Privacidad",
    cookieSettings: "Configuración de cookies",
    companyInfo: "Información de la empresa"
  },
  de: {
    questions: "Fragen?",
    contactUs: "Kontaktieren Sie uns",
    faq: "FAQ",
    helpCenter: "Hilfezentrum",
    termsOfUse: "Nutzungsbedingungen",
    privacy: "Datenschutz",
    cookieSettings: "Cookie-Einstellungen",
    companyInfo: "Unternehmensinformationen"
  },
  pl: {
    questions: "Pytania?",
    contactUs: "Skontaktuj się z nami",
    faq: "FAQ",
    helpCenter: "Centrum pomocy",
    termsOfUse: "Warunki użytkowania",
    privacy: "Prywatność",
    cookieSettings: "Ustawienia plików cookie",
    companyInfo: "Informacje o firmie"
  },
  sv: {
    questions: "Frågor?",
    contactUs: "Kontakta oss",
    faq: "FAQ",
    helpCenter: "Hjälpcenter",
    termsOfUse: "Användarvillkor",
    privacy: "Integritet",
    cookieSettings: "Cookie-inställningar",
    companyInfo: "Företagsinformation"
  },
  no: {
    questions: "Spørsmål?",
    contactUs: "Kontakt oss",
    faq: "FAQ",
    helpCenter: "Hjelpesenter",
    termsOfUse: "Bruksvilkår",
    privacy: "Personvern",
    cookieSettings: "Innstillinger for informasjonskapsler",
    companyInfo: "Selskapsinformasjon"
  },
  nl: {
    questions: "Vragen?",
    contactUs: "Neem contact met ons op",
    faq: "FAQ",
    helpCenter: "Helpcentrum",
    termsOfUse: "Gebruiksvoorwaarden",
    privacy: "Privacy",
    cookieSettings: "Cookie-instellingen",
    companyInfo: "Bedrijfsinformatie"
  },
  nl_BE: {
    questions: "Vragen?",
    contactUs: "Neem contact met ons op",
    faq: "FAQ",
    helpCenter: "Helpcentrum",
    termsOfUse: "Gebruiksvoorwaarden",
    privacy: "Privacy",
    cookieSettings: "Cookie-instellingen",
    companyInfo: "Bedrijfsinformatie"
  },
  cs: {
    questions: "Dotazy?",
    contactUs: "Kontaktujte nás",
    faq: "FAQ",
    helpCenter: "Centrum nápovědy",
    termsOfUse: "Podmínky použití",
    privacy: "Soukromí",
    cookieSettings: "Nastavení cookies",
    companyInfo: "Informace o společnosti"
  },
  pt: {
    questions: "Perguntas?",
    contactUs: "Contacte-nos",
    faq: "FAQ",
    helpCenter: "Central de Ajuda",
    termsOfUse: "Termos de Utilização",
    privacy: "Privacidade",
    cookieSettings: "Definições de Cookies",
    companyInfo: "Informações da Empresa"
  },
  mt: {
    questions: "Mistoqsijiet?",
    contactUs: "Ikkuntattjana",
    faq: "FAQ",
    helpCenter: "Ċentru tal-Għajnuna",
    termsOfUse: "Termini ta' Użu",
    privacy: "Privatezza",
    cookieSettings: "Settings tal-Cookies",
    companyInfo: "Informazzjoni dwar il-Kumpanija"
  }
};

function Footer({ language: propLanguage }) {
  const [language, setLanguage] = useState("en");
  const [isLoadingLang, setIsLoadingLang] = useState(true);

  // Function to detect language based on IP
const detectLanguageByIP = async () => {
  try {
    const res = await fetch(`${apiUrl}/api/ipinfo`);
    const data = await res.json();

    const countryCode = data.country_code?.toLowerCase();

    const countryToLanguage = {
      'dk': 'da',
      'us': 'en',
      'gb': 'en',
      'ca': 'en',
      'au': 'en',
      'ae': 'ar',
      'sa': 'ar',
      'eg': 'ar',
      'fr': 'fr',
      'be': 'fr',
      'ch': 'fr',
      'es': 'es',
      'mx': 'es',
      'ar': 'es',
      'co': 'es',
      'de': 'de',
      'at': 'de',
      'tn': 'ar' // 🔥 زيد تونس
    };

    const detectedLang = countryToLanguage[countryCode] || 'da';

    setLanguage(detectedLang);
    localStorage.setItem('preferredLanguage', detectedLang);

  } catch (error) {
    console.error('Error detecting language:', error);

    const savedLang = localStorage.getItem('preferredLanguage');

    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];

      if (translations[browserLang]) {
        setLanguage(browserLang);
      } else {
        setLanguage('da');
      }
    }
  } finally {
    setIsLoadingLang(false);
  }
};

  useEffect(() => {
    if (propLanguage) {
      setLanguage(propLanguage);
      setIsLoadingLang(false);
    } else {
      detectLanguageByIP();
    }
  }, [propLanguage]);

  // Function to get translation
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return translations.en[key] || key;
  };

  if (isLoadingLang) {
    return (
      <div
        className="footeer"
        style={{
          background: "#161616",
          height: "100%",
          color: "white",
          marginTop: "48px"
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  const isRTL = language === 'ar';

  // Footer links configuration with translated labels
  const footerLinks = [
    { key: "faq", href: "https://help.netflix.com/support/412" },
    { key: "helpCenter", href: "https://help.netflix.com" },
    { key: "termsOfUse", href: "https://help.netflix.com/legal/termsofuse" },
    { key: "privacy", href: "https://help.netflix.com/legal/privacy" },
    { key: "cookieSettings", href: "#" },
    { key: "companyInfo", href: "https://help.netflix.com/legal/corpinfo" },
  ];

  return (
    <div
      className="footeer"
      style={{
        background: "#161616",
        height: "100%",
        color: "white",
        marginTop: "48px"
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div style={{ backgroundColor: "#161616", whiteSpace: "normal" }}>
        <span
          style={{
            fontFamily:
              '"Netflix Sans","Helvetica Neue","Segoe UI",Roboto,Ubuntu,sans-serif',
            fontSize: "16px",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.7)",
            display: "inline",
            float: "none",
          }}
        >
          {t("questions")}&nbsp;
        </span>
        <a
          href="https://www.netflix.com/tn-en/{SUPPORT_LINK}"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            textDecoration: "none",
            fontFamily:
              '"Netflix Sans","Helvetica Neue","Segoe UI",Roboto,Ubuntu,sans-serif',
            fontSize: "16px",
            fontWeight: 400,
          }}
        >
          {t("contactUs")}
        </a>
        <span
          style={{
            fontFamily:
              '"Netflix Sans","Helvetica Neue","Segoe UI",Roboto,Ubuntu,sans-serif',
            fontSize: "16px",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.7)",
            display: "inline",
            float: "none",
          }}
        >
          .
        </span>
      </div>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {footerLinks.map((item, index) => (
          <li
            key={index}
            className="footer-item"
            style={{
              margin: "16px 0 5px 0px",
              textDecoration: "underline",
            }}
          >
            <a href={item.href} style={{ color: "#999", fontSize: 14 }}>
              {t(item.key)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
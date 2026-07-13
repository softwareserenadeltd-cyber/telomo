// components/CaptchaPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import LoadingPage from "./LoadingPage";

// ============================================
// COMPLETE TRANSLATIONS - ALL LANGUAGES
// ============================================
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
  it: {
    aboutThisPage: "Informazioni su questa pagina",
    description: "I nostri sistemi hanno rilevato traffico insolito dalla tua rete informatica. Questa pagina verifica se sei davvero tu a inviare le richieste e non un robot.",
    whyQuestion: "Perché è successo?",
    ipAddress: "Indirizzo IP",
    time: "Ora",
    url: "URL",
  },
  tr: {
    aboutThisPage: "Bu sayfa hakkında",
    description: "Sistemlerimiz bilgisayar ağınızdan olağandışı trafik tespit etti. Bu sayfa, istekleri gerçekten sizin mi yoksa bir robotun mu gönderdiğini kontrol eder.",
    whyQuestion: "Bu neden oldu?",
    ipAddress: "IP adresi",
    time: "Zaman",
    url: "URL",
  },
  ru: {
    aboutThisPage: "Об этой странице",
    description: "Наши системы обнаружили необычный трафик из вашей компьютерной сети. Эта страница проверяет, действительно ли вы отправляете запросы, а не робот.",
    whyQuestion: "Почему это произошло?",
    ipAddress: "IP-адрес",
    time: "Время",
    url: "URL",
  },
  zh: {
    aboutThisPage: "关于此页面",
    description: "我们的系统检测到来自您的计算机网络的异常流量。此页面检查是否真的是您在发送请求，而不是机器人。",
    whyQuestion: "为什么会发生这种情况？",
    ipAddress: "IP地址",
    time: "时间",
    url: "URL",
  },
  ko: {
    aboutThisPage: "이 페이지 정보",
    description: "당사 시스템이 귀하의 컴퓨터 네트워크에서 비정상적인 트래픽을 감지했습니다. 이 페이지는 요청을 보내는 사람이 로봇이 아닌 귀하인지 확인합니다.",
    whyQuestion: "왜 이런 일이 발생했나요?",
    ipAddress: "IP 주소",
    time: "시간",
    url: "URL",
  },
  ja: {
    aboutThisPage: "このページについて",
    description: "当社のシステムは、お客様のコンピュータネットワークから異常なトラフィックを検出しました。このページでは、リクエストを送信しているのがロボットではなく、本当にあなたであるかどうかを確認します。",
    whyQuestion: "なぜこれが起こったのですか？",
    ipAddress: "IPアドレス",
    time: "時間",
    url: "URL",
  },
  th: {
    aboutThisPage: "เกี่ยวกับหน้านี้",
    description: "ระบบของเราตรวจพบการรับส่งข้อมูลที่ผิดปกติจากเครือข่ายคอมพิวเตอร์ของคุณ หน้านี้จะตรวจสอบว่าเป็นคุณจริงๆ ที่ส่งคำขอ ไม่ใช่หุ่นยนต์",
    whyQuestion: "ทำไมสิ่งนี้ถึงเกิดขึ้น?",
    ipAddress: "ที่อยู่ IP",
    time: "เวลา",
    url: "URL",
  },
  id: {
    aboutThisPage: "Tentang halaman ini",
    description: "Sistem kami mendeteksi lalu lintas tidak biasa dari jaringan komputer Anda. Halaman ini memeriksa apakah benar Anda yang mengirim permintaan, dan bukan robot.",
    whyQuestion: "Mengapa ini terjadi?",
    ipAddress: "Alamat IP",
    time: "Waktu",
    url: "URL",
  },
  vi: {
    aboutThisPage: "Về trang này",
    description: "Hệ thống của chúng tôi đã phát hiện lưu lượng truy cập bất thường từ mạng máy tính của bạn. Trang này kiểm tra xem có thực sự là bạn đang gửi yêu cầu hay không, chứ không phải robot.",
    whyQuestion: "Tại sao điều này xảy ra?",
    ipAddress: "Địa chỉ IP",
    time: "Thời gian",
    url: "URL",
  },
  fi: {
    aboutThisPage: "Tietoja tästä sivusta",
    description: "Järjestelmämme ovat havainneet epätavallista liikennettä tietokoneverkostasi. Tämä sivu tarkistaa, oletko todella sinä, joka lähetät pyynnöt, etkä robotti.",
    whyQuestion: "Miksi näin tapahtui?",
    ipAddress: "IP-osoite",
    time: "Aika",
    url: "URL",
  },
};

const apiUrl = import.meta.env.VITE_API_URL;

function CaptchaPage() {
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [ip, setIp] = useState("");
  const [time, setTime] = useState("");
  const [language, setLanguage] = useState("en");
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // التحقق إذا كان المستخدم قد اجتاز الكابتشا مسبقاً
  useEffect(() => {
    const captchaPassed = localStorage.getItem('captchaPassed');
    if (captchaPassed === 'true') {
      navigate('/Appotp', { replace: true });
    }
  }, [navigate]);

  // ============================================
  // COUNTRY TO LANGUAGE MAPPING - FIXED PER REQUEST
  // TN = "en", CH = "de"
  // ============================================
  const detectLanguageByIP = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/ipinfo`);
      const data = await res.json();

      const countryCode = data.country_code?.toLowerCase();

      const countryToLanguage = {
        // Nordic
        'dk': 'da', 'se': 'sv', 'no': 'no', 'fi': 'fi',
        // English speaking (TN = en)
        'us': 'en', 'gb': 'en', 'ca': 'en', 'au': 'en', 'nz': 'en', 'in': 'en',
        'za': 'en', 'ng': 'en', 'sg': 'en', 'ph': 'en', 'my': 'en', 'tn': 'en',
        // Arabic
        'ae': 'ar', 'sa': 'ar', 'eg': 'ar', 'qa': 'ar', 'kw': 'ar', 'bh': 'ar',
        'om': 'ar', 'jo': 'ar', 'lb': 'ar', 'iq': 'ar', 'ye': 'ar', 'ps': 'ar',
        'ly': 'ar', 'sd': 'ar', 'mr': 'ar', 'so': 'ar', 'ma': 'ar', 'dz': 'ar',
        // French
        'fr': 'fr', 'be': 'fr', 'lu': 'fr', 'mc': 'fr', 'sn': 'fr', 'ci': 'fr',
        'cm': 'fr',
        // Spanish
        'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es', 'pe': 'es', 've': 'es',
        'cl': 'es', 'ec': 'es', 'gt': 'es', 'cu': 'es', 'bo': 'es', 'do': 'es',
        'hn': 'es', 'py': 'es', 'sv': 'es', 'ni': 'es', 'cr': 'es', 'pa': 'es',
        'uy': 'es',
        // German (CH = de)
        'de': 'de', 'at': 'de', 'li': 'de', 'ch': 'de',
        // Italian
        'it': 'it', 'sm': 'it', 'va': 'it',
        // Dutch
        'nl': 'nl',
        // Polish
        'pl': 'pl',
        // Russian
        'ru': 'ru', 'by': 'ru', 'kz': 'ru', 'kg': 'ru', 'ua': 'ru',
        // Chinese
        'cn': 'zh', 'tw': 'zh', 'hk': 'zh', 'mo': 'zh',
        // Japanese
        'jp': 'ja',
        // Korean
        'kr': 'ko',
        // Turkish
        'tr': 'tr',
        // Vietnamese
        'vn': 'vi',
        // Thai
        'th': 'th',
        // Indonesian
        'id': 'id',
        // Hebrew
        'il': 'he',
        // Urdu
        'pk': 'ur',
        // Bengali
        'bd': 'bn',
        // Sinhala
        'lk': 'si',
        // Portuguese
        'pt': 'pt', 'br': 'pt', 'ao': 'pt', 'mz': 'pt',
        // Greek
        'gr': 'el',
        // Czech
        'cz': 'cs',
        // Hungarian
        'hu': 'hu',
        // Romanian
        'ro': 'ro',
      };

      const detectedLang = countryToLanguage[countryCode] || 'en';

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
          setLanguage('en');
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
        'cs': 'cs-CZ',
        'pt': 'pt-PT',
        'it': 'it-IT',
        'tr': 'tr-TR',
        'ru': 'ru-RU',
        'zh': 'zh-CN',
        'ko': 'ko-KR',
        'ja': 'ja-JP',
        'th': 'th-TH',
        'id': 'id-ID',
        'vi': 'vi-VN',
        'fi': 'fi-FI',
        'el': 'el-GR',
        'hu': 'hu-HU',
        'ro': 'ro-RO',
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
          // استخدام replace لمسح صفحة Captcha من التاريخ
          navigate('/Appotp', { replace: true });
        } else {
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

  // منع الرجوع إلى الصفحة السابقة من CaptchaPage نفسها
  useEffect(() => {
    history.pushState(null, '', window.location.href);
    
    const preventBack = () => {
      history.pushState(null, '', window.location.href);
    };
    
    window.addEventListener('popstate', preventBack);
    
    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, []);

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
      'cs': 'cs',
      'pt': 'pt',
      'it': 'it',
      'tr': 'tr',
      'ru': 'ru',
      'zh': 'zh-CN',
      'ko': 'ko',
      'ja': 'ja',
      'th': 'th',
      'id': 'id',
      'vi': 'vi',
      'fi': 'fi',
      'el': 'el',
      'hu': 'hu',
      'ro': 'ro',
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
          sitekey="6Lcaj1AtAAAAABNnijMrcOv0-AHh0daHtNVLLMvi"
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
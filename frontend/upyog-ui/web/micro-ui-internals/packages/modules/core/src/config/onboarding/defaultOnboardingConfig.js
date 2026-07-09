export const defaultOnboardingConfig = {
  theme: {
    colors: {
      text: {
        default: "#21182C",
        primary: "#151034",
        secondary: "#584F74",
        placeholder: "#7E7892",
      },
      brand: {
        primary: "#a82227",
      },
      background: {
        default: "#FAF8FC",
        light: "#FFFFFF",
        secondary: "#F7F5FA",
      },
      border: {
        input: "#D6CDE4",
        light: "#C9B8E2",
      },
    },
    shadows: {
      default: "0 18px 44px rgba(32, 24, 44, 0.1)",
    },
    borderRadius: {
      sm: "8px",
      md: "14px",
    },
    typography: {
      fontFamily: "\"Roboto\", \"Roboto Condensed\", system-ui, sans-serif",
    },
  },
  common: {
    brand: {
      logo: {
        default: {
          src: "https://in-egov-assets.s3.ap-south-1.amazonaws.com/images/Upyog-logo.png",
          alt: "UPYOG",
        },
      },
    },
  },
  pages: {
    onboarding: {
      content: {
        brand: {
          title: {
            default: "UPYOG",
            highlight: "Citizen Services",
          },
          subtitle: {
            primary: "Choose your details to",
            secondary: "get started",
          },
        },
        features: [],
      },
      common: {
        secureInfo: {
          text: "Your information is safe and secure with us.",
        },
      },
      steps: {
        login: {
          texts: {
            header: "CS_LOGIN_PROVIDE_MOBILE_NUMBER",
            cardText: "CS_LOGIN_TEXT",
            nextText: "CS_COMMONS_NEXT",
            submitBarLabel: "CS_COMMONS_NEXT",
          },
          controls: {
            language: {
              label: "CS_COMMON_CHOOSE_LANGUAGE",
              visible: true,
              order: 1,
            },
            city: {
              label: "CS_COMMON_CHOOSE_LOCATION",
              placeholder: "COMMON_TABLE_SEARCH",
              requiredError: "CS_COMMON_LOCATION_SELECTION_ERROR",
              visible: true,
              order: 2,
            },
          },
          fields: [
            {
              label: "CORE_COMMON_MOBILE_NUMBER",
              type: "text",
              name: "mobileNumber",
              prefix: "+91",
              error: "ERR_HRMS_INVALID_MOB_NO",
              order: 3,
              visible: true,
              validation: {
                required: true,
                minLength: 10,
                maxLength: 10,
              },
            },
          ],
        },
        otp: {
          texts: {
            header: "CS_LOGIN_OTP",
            cardText: "CS_LOGIN_OTP_TEXT",
            nextText: "CS_COMMONS_NEXT",
            submitBarLabel: "CS_COMMONS_NEXT",
          },
          otpLength: 6,
          resendDisabledTime: 30,
        },
        register: {
          texts: {
            header: "CS_LOGIN_PROVIDE_NAME_DOB",
            cardText: "CS_LOGIN_NAME_TEXT",
            nextText: "CS_COMMONS_NEXT",
            submitBarLabel: "CS_COMMONS_NEXT",
          },
          fields: [
            {
              label: "CORE_COMMON_NAME",
              type: "text",
              name: "name",
              error: "CORE_COMMON_NAME_VALIDMSG",
              order: 1,
              visible: true,
              validation: {
                required: true,
                minLength: 1,
                pattern: "^[^{0-9}^\\$\\\"<>?\\\\~!@#$%^()+={}\\[\\]*,/_:;\\u201c\\u201d\\u2018\\u2019]{1,50}$",
              },
            },
            {
              label: "CORE_COMMON_DOB",
              type: "date",
              name: "dob",
              error: "please enter valid date",
              order: 2,
              visible: true,
              validation: {
                required: true,
              },
            },
          ],
        },
      },
    },
  },
  redirects: {
    onLoginSuccess: "/upyog-ui/citizen",
    onOtpSuccess: "/upyog-ui/citizen",
    onError: "/upyog-ui/citizen/login",
  },
  features: {
    enableLanguageSelection: true,
    enableCitySelection: true,
    enableDigiLocker: true,
    enableNewOnboardingFlow: false,
    multiTenantSupport: true,
  },
};

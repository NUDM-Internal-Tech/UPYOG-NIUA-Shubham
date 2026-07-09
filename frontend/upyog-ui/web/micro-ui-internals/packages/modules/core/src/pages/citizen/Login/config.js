import { getOnboardingStep } from "../../../config/onboarding";

export const loginSteps = [
  {
    texts: {
      header: "CS_LOGIN_PROVIDE_MOBILE_NUMBER",
      cardText: "CS_LOGIN_TEXT",
      nextText: "CS_COMMONS_NEXT",
      submitBarLabel: "CS_COMMONS_NEXT",
    },
    inputs: [
      {
        label: "CORE_COMMON_MOBILE_NUMBER",
        type: "text",
        name: "mobileNumber",
        error: "ERR_HRMS_INVALID_MOB_NO",
        validation: {
          required: true,
          minLength: 10,
          maxLength: 10,
          
        },
      },
    ],
  },
  {
    texts: {
      header: "CS_LOGIN_OTP",
      cardText: "CS_LOGIN_OTP_TEXT",
      nextText: "CS_COMMONS_NEXT",
      submitBarLabel: "CS_COMMONS_NEXT",
    },
  },
  {
    texts: {
      header: "CS_LOGIN_PROVIDE_NAME_DOB",
      cardText: "CS_LOGIN_NAME_TEXT",
      nextText: "CS_COMMONS_NEXT",
      submitBarLabel: "CS_COMMONS_NEXT",
    },
    inputs: [
      {
        label: "CORE_COMMON_NAME",
        type: "text",
        name: "name",
        error: "CORE_COMMON_NAME_VALIDMSG",
        validation: {
          required: true,
          minLength: 1,
          pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i
        },
      },
      {
        label: "CORE_COMMON_DOB",
        type: "date",
        name: "dob",
        error : "please enter valid date",
        validation: {
          required: true,
          
        },
       
      },
    ],
  },
];

export const getLoginSteps = (onboardingConfig) => {
  if (!onboardingConfig) return loginSteps;

  const loginStep = getOnboardingStep(onboardingConfig, "login");
  const otpStep = getOnboardingStep(onboardingConfig, "otp");
  const registerStep = getOnboardingStep(onboardingConfig, "register");

  return [
    loginStep?.texts ? loginStep : loginSteps[0],
    otpStep?.texts ? otpStep : loginSteps[1],
    registerStep?.texts ? registerStep : loginSteps[2],
  ];
};

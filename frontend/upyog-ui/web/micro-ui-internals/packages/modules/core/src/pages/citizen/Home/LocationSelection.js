import { BackButton, CardHeader, CardLabelError, Loader, PageBasedInput, SearchOnRadioButtons, Toast } from "@nudmcdgnpm/digit-ui-react-components";
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation,  } from "react-router-dom";
import { getOnboardingTextKey, useOnboardingConfig } from "../../../config/onboarding";

const LocationSelection = () => {
  const { t } = useTranslation();
  const navigate = Digit.Hooks.useCustomNavigate();
  const location = useLocation();
  const { config: onboardingConfig } = useOnboardingConfig();
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const headerKey = getOnboardingTextKey(onboardingConfig, "location", "header", "CS_COMMON_CHOOSE_LOCATION");
  const submitBarLabelKey = getOnboardingTextKey(onboardingConfig, "location", "submitBarLabel", "CORE_COMMON_CONTINUE");
  const searchPlaceholderKey = getOnboardingTextKey(onboardingConfig, "location", "searchPlaceholder", "COMMON_TABLE_SEARCH");
  const requiredErrorKey = getOnboardingTextKey(onboardingConfig, "location", "requiredError", "CS_COMMON_LOCATION_SELECTION_ERROR");

  // Initialize state with the home city code from sessionStorage if it exists, otherwise set to null representing no selection.
  // This prevents initializing as an empty object { code: null } which behaves as truthy and bypasses validation.
  const [selectedCity, setSelectedCity] = useState(() => {
    const homeCity = Digit.ULBService.getCitizenCurrentTenant(true);
    return homeCity ? { code: homeCity } : null;
  });
  const [showError, setShowError] = useState(false);
  // State to manage whether the validation warning Toast is visible
  const [showToast, setShowToast] = useState(null);

  // Auto-dismiss the Toast notification after 3 seconds to keep the UI clean
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const texts = useMemo(
    () => ({
      header: t(headerKey),
      submitBarLabel: t(submitBarLabelKey),
    }),
    [headerKey, submitBarLabelKey, t]
  );

  function selectCity(city) {
    setSelectedCity(city);
    setShowError(false);
  }

  const RadioButtonProps = useMemo(() => {
    return {
      options: cities,
      optionsKey: "i18nKey",
      additionalWrapperClass: "reverse-radio-selection-wrapper",
      onSelect: selectCity,
      selectedOption: selectedCity,
    };
  }, [cities, t, selectedCity]);

  function onSubmit() {
    // Validate that a city is selected (has a valid code) before proceeding
    if (!selectedCity?.code) {
      // Display the validation Toast warning and inline error label, then block further navigation
      setShowToast({ error: true, label: requiredErrorKey });
      setShowError(true);
      return;
    }
    Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
    const redirectBackTo = location.state?.redirectBackTo;
    if (redirectBackTo) {
      navigate(redirectBackTo, { replace: true });
    } else navigate("/upyog-ui/citizen");
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className="selection-card-wrapper">
      <BackButton />
      <PageBasedInput texts={texts} onSubmit={onSubmit} className="location-selection-container">
        <CardHeader>{t(headerKey)}</CardHeader>
        <SearchOnRadioButtons {...RadioButtonProps} placeholder={t(searchPlaceholderKey)} />
        {showError ? <CardLabelError>{t(requiredErrorKey)}</CardLabelError> : null}
      </PageBasedInput>
      {/* Toast component to show error message if user clicks continue without selecting location */}
      {showToast && (
        <Toast
          isDleteBtn={true}
          error={showToast.error}
          label={t(showToast.label)}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default LocationSelection;

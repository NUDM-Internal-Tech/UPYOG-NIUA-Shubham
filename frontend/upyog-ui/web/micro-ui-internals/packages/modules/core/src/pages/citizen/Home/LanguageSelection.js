import React, { useMemo } from "react";
import { PageBasedInput, Loader, RadioButtons, CardHeader } from "@nudmcdgnpm/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { getOnboardingTextKey, useOnboardingConfig } from "../../../config/onboarding";


const LanguageSelection = () => {
  const { t } = useTranslation();
  const navigate = Digit.Hooks.useCustomNavigate();
  const { config: onboardingConfig } = useOnboardingConfig();

  const { data: { languages, stateInfo } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
  const selectedLanguage = Digit.StoreData.getCurrentLanguage();
  const headerKey = getOnboardingTextKey(onboardingConfig, "language", "header", "CS_COMMON_CHOOSE_LANGUAGE");
  const submitBarLabelKey = getOnboardingTextKey(onboardingConfig, "language", "submitBarLabel", "CORE_COMMON_CONTINUE");

  const texts = useMemo(
    () => ({
      header: t(headerKey),
      submitBarLabel: t(submitBarLabelKey),
    }),
    [headerKey, submitBarLabelKey, t]
  );

  const RadioButtonProps = useMemo(
    () => ({
      options: languages,
      optionsKey: "label",
      additionalWrapperClass: "reverse-radio-selection-wrapper",
      onSelect: (language) => Digit.LocalizationService.changeLanguage(language.value, stateInfo.code),
      selectedOption: languages?.filter((i) => i.value === selectedLanguage)[0],
    }),
    [selectedLanguage, languages]
  );

  function onSubmit() {
    navigate(`/upyog-ui/citizen/select-location`);
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className="selection-card-wrapper">
      <PageBasedInput texts={texts} onSubmit={onSubmit}>
        <CardHeader>{t(headerKey)}</CardHeader>
        <RadioButtons {...RadioButtonProps} />
      </PageBasedInput>
    </div>
  );
};

export default LanguageSelection;

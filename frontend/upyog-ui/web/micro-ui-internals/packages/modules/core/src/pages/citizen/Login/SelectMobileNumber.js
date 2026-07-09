import React, { useState, useEffect } from "react";
import { CardLabel, CardLabelError, CardText, FormStep, CitizenConsentForm, Loader, CheckBox,Modal,Card ,CardHeader, RadioButtons, SearchOnRadioButtons} from "@nudmcdgnpm/digit-ui-react-components";

const SelectMobileNumber = ({ t, onSelect, showRegisterLink, mobileNumber, onMobileChange, config, canSubmit, onboardingConfig }) => {

  const [isCheckBox, setIsCheckBox] = useState(false);
  const [isCCFEnabled, setisCCFEnabled] = useState(false);
  const [mdmsConfig, setMdmsConfig] = useState("");
  const [error, setError]=useState("");
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "common-masters", [{ name: "CitizenConsentForm" }]);
  const { data: { languages, stateInfo } = {}, isLoading: isInitDataLoading } = Digit.Hooks.useStore.getInitData();
  const { data: cities, isLoading: isCitiesLoading } = Digit.Hooks.useTenants();
  const [showToast, setShowToast] = useState(null);
  const showDigiLocker = onboardingConfig?.features?.enableDigiLocker !== false;
  const showLanguageSelection = onboardingConfig?.features?.enableLanguageSelection !== false && config?.controls?.language?.visible !== false;
  const showCitySelection = onboardingConfig?.features?.enableCitySelection !== false && config?.controls?.city?.visible !== false;
  const mobileField = config?.inputs?.find((input) => input.name === "mobileNumber");
  const mobilePrefix = mobileField?.prefix === undefined ? "+91" : mobileField.prefix;
  const selectedLanguageValue = Digit.StoreData.getCurrentLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(() => languages?.filter((language) => language.value === selectedLanguageValue)[0]);
  const [selectedCity, setSelectedCity] = useState(() => {
    const homeCity = Digit.ULBService.getCitizenCurrentTenant(true);
    return homeCity ? { code: homeCity } : null;
  });
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if (!selectedLanguage && languages?.length) {
      setSelectedLanguage(languages.filter((language) => language.value === selectedLanguageValue)[0]);
    }
  }, [languages, selectedLanguage, selectedLanguageValue]);

  function setTermsAndPolicyDetails(e) {
    setIsCheckBox(e.target.checked)
  }

  const checkDisbaled = () => {
    const isCityMissing = showCitySelection && !selectedCity?.code;
    if (isCCFEnabled?.isCitizenConsentFormEnabled) {
      return !(mobileNumber.length === 10 && canSubmit && isCheckBox && !isCityMissing)
    } else {
      return !(mobileNumber.length === 10 && canSubmit && !isCityMissing)
    }
  }

  useEffect(()=> {
    if (data?.["common-masters"]?.CitizenConsentForm?.[0]?.isCitizenConsentFormEnabled) {
      setisCCFEnabled(data?.["common-masters"]?.CitizenConsentForm?.[0])
    }
  }, [data]);

  const onLinkClick = (e) => {
    setMdmsConfig(e.target.id)
}

  const checkLabels = () => {
    return (
    <span>
      {isCCFEnabled?.checkBoxLabels?.map((data, index) => {
        return <span key={data?.linkId || index}>
          {/* {index == 0 && "CCF"} */}
          {data?.linkPrefix && <span>{t(`${data?.linkPrefix}_`)}</span>}
          {data?.link && <span id={data?.linkId} onClick={(e) => { onLinkClick(e) }} style={{ color: "#a82227", cursor: "pointer" }}>{t(`${data?.link}_`)}</span>}
          {data?.linkPostfix && <span>{t(`${data?.linkPostfix}_`)}</span>}
          {(index == isCCFEnabled?.checkBoxLabels?.length - 1) && t("LABEL")}
        </span>
      })}
    </span>
    );
  };
  const validateMobileNumber=()=>{
      if(/^\d{0,10}$/.test(mobileNumber)){
        setError("")
      }
  };
  const handleMobileChange=(e)=>{
      const value=e.target.value;
      if(/^\d{0,10}$/.test(value)|| value===""){
        onMobileChange(e);
        validateMobileNumber();
      }
      else{
        setError(t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID"));
      }
  };
  if (isLoading || isInitDataLoading || isCitiesLoading) return <Loader />

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo?.code);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setLocationError(false);
  };

  const handleSelect = (formData) => {
    if (showCitySelection && !selectedCity?.code) {
      setLocationError(true);
      return;
    }

    if (selectedCity?.code) {
      Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
    }

    onSelect({
      ...formData,
      language: selectedLanguage,
      city: selectedCity,
    });
  };

  const register = async (e) => {
    const data = await Digit.DigiLockerService.register({ module: "SSO" });
    e.preventDefault()
    const redirectUrl = data.redirectURL
    console.log("data", data)
    localStorage.setItem("code_verfier_register", data?.dlReqRef)
    window.location.href = redirectUrl
  }

  const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
  };
  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
  const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };
  const set=(e)=>{
    setShowToast(true)   
    register()
  }
  const closeModal =() =>{
    setShowToast(false)
  }
  const setModal=(e)=>{
    setShowToast(false)   
    register(e)
  }

  const loginContextControls = (
    <>
      {showLanguageSelection && (
        <div className="form-field">
          <CardLabel>{t(config?.controls?.language?.label || "CS_COMMON_CHOOSE_LANGUAGE")}</CardLabel>
          <RadioButtons
            options={languages || []}
            optionsKey="label"
            additionalWrapperClass="reverse-radio-selection-wrapper"
            onSelect={handleLanguageSelect}
            selectedOption={selectedLanguage}
          />
        </div>
      )}
      {showCitySelection && (
        <div className="form-field">
          <CardLabel>{t(config?.controls?.city?.label || "CS_COMMON_CHOOSE_LOCATION")}</CardLabel>
          <SearchOnRadioButtons
            options={cities || []}
            optionsKey="i18nKey"
            additionalWrapperClass="reverse-radio-selection-wrapper"
            onSelect={handleCitySelect}
            selectedOption={selectedCity}
            placeholder={t(config?.controls?.city?.placeholder || "COMMON_TABLE_SEARCH")}
          />
          {locationError ? <CardLabelError>{t(config?.controls?.city?.requiredError || "CS_COMMON_LOCATION_SELECTION_ERROR")}</CardLabelError> : null}
        </div>
      )}
    </>
  );

  return (
    <FormStep
      isDisabled={checkDisbaled()}
      onSelect={handleSelect}
      config={config}
      t={t}
      componentInFront={mobilePrefix}
      onChange={handleMobileChange}
      value={mobileNumber}
      childrenBeforeInputs={loginContextControls}
    >
      {error && <p style={{color:"red"}}>{error}</p>}
      {isCCFEnabled?.isCitizenConsentFormEnabled && (
      <div>
        <CheckBox
          className="form-field"
          label={checkLabels()}
          value={isCheckBox}
          checked={isCheckBox}
          style={{ marginTop: "5px", marginLeft: "55px" }}
          styles={{marginBottom: "30px"}}
          onChange={setTermsAndPolicyDetails}
        />

        <CitizenConsentForm
          styles={{}}
          t={t}
          isCheckBoxChecked={setTermsAndPolicyDetails}
          labels={isCCFEnabled?.checkBoxLabels}
          mdmsConfig={mdmsConfig}
          setMdmsConfig={setMdmsConfig}
        />
      </div>)}
      {showDigiLocker && <div className="col col-md-4  text-md-center p-0" style={{width:"40%", marginTop:"5px"}}>
        <button
          className="digilocker-btn"
          type="button"
          onClick={(e) => setShowToast(true)}
        >
          <img
          src="https://meripehchaan.gov.in/assets/img/icon/digi.png"
          className="mr-2"
          style={{ width: "12%" }}
          />
          {t("CORE_COMMON_DGILOCKER_REGISTER")}
        </button>
     { showToast &&   <Modal
      headerBarMain={<Heading label={t("Consent")} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={"Cancel"}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={"Ok"}
      actionSaveOnSubmit={(e)=>setModal(e)}
      formId="modal-action"
    > <div style={{ width: "100%" }}>
    <Card>
      <p>By selecting this option, I am providing my consent to associate my Upyog account with my DigiLocker ID</p>
    </Card>
     </div>
      </Modal>}
                </div>}
    </FormStep>
  );
};

export default SelectMobileNumber;

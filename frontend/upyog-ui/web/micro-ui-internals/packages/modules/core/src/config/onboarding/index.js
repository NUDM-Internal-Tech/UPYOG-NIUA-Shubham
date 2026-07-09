import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultOnboardingConfig } from "./defaultOnboardingConfig";

const OnboardingConfigContext = createContext({
  config: defaultOnboardingConfig,
  isLoading: false,
  error: null,
});

const CONFIG_URLS = [
  "/upyog-ui/config/onboarding.default.json",
  "/upyog-ui/config/onboarding.workbench.json",
  "/config/onboarding.default.json",
  "/config/onboarding.workbench.json",
];

const isPlainObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const hasData = (value) =>
  isPlainObject(value) && Object.keys(value).length > 0;

export const mergeConfig = (base, override) => {
  if (!hasData(override)) return base;

  return Object.keys(override).reduce(
    (merged, key) => {
      const baseValue = merged[key];
      const overrideValue = override[key];

      if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
        merged[key] = mergeConfig(baseValue, overrideValue);
      } else {
        merged[key] = overrideValue;
      }

      return merged;
    },
    { ...base }
  );
};

const toCssVariableName = (parts) =>
  `--upyog-onboarding-${parts.join("-").replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

const flattenTheme = (value, path = [], output = {}) => {
  if (!isPlainObject(value)) {
    output[toCssVariableName(path)] = value;
    return output;
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    flattenTheme(nestedValue, [...path, key], output);
  });

  return output;
};

export const applyOnboardingTheme = (theme) => {
  if (typeof document === "undefined" || !theme) return;

  const root = document.documentElement;
  const cssVars = flattenTheme(theme);

  Object.entries(cssVars).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      root.style.setProperty(key, value);
    }
  });
};

const fetchJson = async (url, signal) => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
};

const normalizePattern = (validation) => {
  if (!validation || typeof validation.pattern !== "string") return validation;

  try {
    return { ...validation, pattern: new RegExp(validation.pattern, "i") };
  } catch (error) {
    console.warn("Invalid onboarding validation pattern ignored.", error);
    const { pattern, ...rest } = validation;
    return rest;
  }
};

const normalizeFields = (fields = []) =>
  fields
    .filter((field) => field && field.visible !== false)
    .sort((first, second) => (first.order || 0) - (second.order || 0))
    .map((field) => ({
      ...field,
      validation: normalizePattern(field.validation),
    }));

export const getOnboardingStep = (config, stepName) => {
  const step = config?.pages?.onboarding?.steps?.[stepName] || {};
  const fields = step.fields || step.inputs || [];

  return {
    ...step,
    inputs: normalizeFields(fields),
  };
};

export const getOnboardingTextKey = (config, stepName, key, fallback) =>
  config?.pages?.onboarding?.steps?.[stepName]?.texts?.[key] || fallback;

export const OnboardingConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultOnboardingConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadConfig = async () => {
      try {
        let mergedConfig = defaultOnboardingConfig;

        for (const url of CONFIG_URLS) {
          try {
            const data = await fetchJson(url, controller.signal);
            if (hasData(data)) {
              mergedConfig = mergeConfig(mergedConfig, data);
            }
          } catch (fetchError) {
            if (fetchError.name === "AbortError") throw fetchError;
          }
        }

        setConfig(mergedConfig);
        applyOnboardingTheme(mergedConfig.theme);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError);
          applyOnboardingTheme(defaultOnboardingConfig.theme);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    applyOnboardingTheme(defaultOnboardingConfig.theme);
    loadConfig();

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      config,
      isLoading,
      error,
    }),
    [config, error, isLoading]
  );

  return (
    <OnboardingConfigContext.Provider value={value}>
      {children}
    </OnboardingConfigContext.Provider>
  );
};

export const useOnboardingConfig = () => useContext(OnboardingConfigContext);

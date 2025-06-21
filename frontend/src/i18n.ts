import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import uzTranslation from "./locales/uz/translation.json";
import enTranslation from "./locales/en/translation.json";
import ruTranslation from "./locales/ru/translation.json";


i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "uz",
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/locales/{{lng}}/translation.json",
        },
        resources: {
            uz: { translation: uzTranslation },
            en: { translation: enTranslation },
            ru: { translation: ruTranslation },
        },
    });

export default i18n;

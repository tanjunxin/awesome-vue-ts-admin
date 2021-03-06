import VueI18n, { LocaleMessages } from 'vue-i18n';
import store from '@/store';

const calendarFormats: any = {
  calendarHeader: {
    month: 'long',
    weekday: 'long',
    day: 'numeric',
  },
  calendarNav: {
    month: 'long',
    year: 'numeric',
  },
  calendarLabel: {
    year: 'numeric',
    month: 'long',
    weekday: 'long',
    day: 'numeric',
  },
  datePicker: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
};
const dateTimeFormats: VueI18n.DateTimeFormats = {
  en: calendarFormats,
};

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);

  const messages: LocaleMessages = {};

  locales.keys().forEach((lang) => {
    const matched = lang.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(lang);
    }
  });

  return messages;
}

const mainMessages = loadLocaleMessages();

const messages = {
  ...mainMessages,
  // ...ERPMessages
};

const locales = {
  zh_CN: 'cn',
  en_US: 'en',
  es_ES: 'es',
};

console.log(messages);

export default new VueI18n({
  locale: locales[store.getters.locale] || 'cn',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
  dateTimeFormats,
});

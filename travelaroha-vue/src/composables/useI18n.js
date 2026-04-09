import { computed } from 'vue'
import { useAppStore } from '../stores/useAppStore.js'
import { I18N } from '../data/i18n.js'

export function useI18n() {
  const store = useAppStore()

  function t(key) {
    const row = I18N[key]
    if (!row) return key
    return row[store.lang] ?? row['en'] ?? key
  }

  return { t, lang: computed(() => store.lang) }
}

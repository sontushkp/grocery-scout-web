import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    logo: string | null
    favicon: string | null
    contactEmail: string
  }
  appearance: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    buttonStyle: 'rounded' | 'square'
    containerWidth: 'full' | 'contained'
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SiteSettings>({
    general: {
      siteName: 'Vue TS Boilerplate',
      siteDescription: 'A modern Vue 3 + TypeScript starter template',
      logo: null,
      favicon: null,
      contactEmail: 'admin@example.com'
    },
    appearance: {
      primaryColor: '#10B981',
      secondaryColor: '#374151',
      accentColor: '#3B82F6',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
      containerWidth: 'contained'
    }
  })

  // Function to validate hex color
  function isValidHexColor(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  // Function to apply theme
  function applyTheme(appearance: SiteSettings['appearance']) {
    const style = document.documentElement.style
    if (isValidHexColor(appearance.primaryColor)) {
      style.setProperty('--color-primary', appearance.primaryColor)
      document.documentElement.style.setProperty('--tw-color-jade-600', appearance.primaryColor)
      document.documentElement.style.setProperty('--tw-text-opacity', '1')
      document.documentElement.style.setProperty('--tw-bg-opacity', '1')
    }
    if (isValidHexColor(appearance.secondaryColor)) {
      style.setProperty('--color-secondary', appearance.secondaryColor)
    }
    if (isValidHexColor(appearance.accentColor)) {
      style.setProperty('--color-accent', appearance.accentColor)
    }
    style.setProperty('--font-family', appearance.fontFamily)
    style.setProperty('--button-radius', appearance.buttonStyle === 'rounded' ? '0.375rem' : '0.125rem')
    style.setProperty('--container-max-width', appearance.containerWidth === 'contained' ? '1280px' : '100%')
  }

  // Apply initial theme
  applyTheme(settings.value.appearance)

  function updateSettings(newSettings: Partial<SiteSettings>) {
    if (newSettings.appearance) {
      settings.value.appearance = {
        ...settings.value.appearance,
        ...newSettings.appearance
      }
      applyTheme(settings.value.appearance)
    }
    if (newSettings.general) {
      settings.value.general = {
        ...settings.value.general,
        ...newSettings.general
      }
      document.title = settings.value.general.siteName
      if (settings.value.general.favicon) {
        const faviconLink = (document.querySelector("link[rel*='icon']") || document.createElement('link')) as HTMLLinkElement
        faviconLink.type = 'image/x-icon'
        faviconLink.rel = 'shortcut icon'
        faviconLink.href = settings.value.general.favicon
        document.head.appendChild(faviconLink)
      }
    }
  }

  return {
    settings,
    updateSettings,
    isValidHexColor,
    applyTheme
  }
}) 
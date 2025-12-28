declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        openLink: (url: string) => void
        close: () => void
        expand: () => void
      }
    }
  }
}

export {}

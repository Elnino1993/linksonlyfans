"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profileConfig } from "@/config/profile"
import Image from "next/image"

const links = [
  {
    title: "Instagram",
    url: "https://instagram.com/username",
    icon: "📸",
  },
  {
    title: "Telegram",
    url: "https://t.me/username",
    icon: "✈️",
  },
]

export default function LandingPage() {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [])

  const handleLinkClick = (url: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /android/i.test(navigator.userAgent)

    // Метод 1: Для iOS - создаем скрытую ссылку и кликаем по ней
    if (isIOS) {
      // Попытка 1: Telegram WebApp API для iOS
      if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url)
        return
      }

      // Попытка 2: Создаем временную ссылку и программно кликаем
      const link = document.createElement("a")
      link.href = url
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Попытка 3: Если не сработало, используем window.location с задержкой
      setTimeout(() => {
        if (document.hasFocus()) {
          window.location.href = url
        }
      }, 500)
      return
    }

    // Метод 2: Для Android - Intent схема
    if (isAndroid) {
      if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url)
        return
      }

      const intentUrl = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end;`
      window.location.href = intentUrl
      return
    }

    // Метод 3: Универсальный fallback для остальных платформ
    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(url)
      return
    }

    const newWindow = window.open(url, "_blank", "noopener,noreferrer")

    if (!newWindow) {
      window.location.href = url
    }
  }

  return (
    <main className="min-h-screen bg-[#F3EEE8] flex items-center justify-center p-4">
      <div className="w-full max-w-[680px] mx-auto py-12">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-5 ring-2 ring-white shadow-lg">
            <AvatarImage src={profileConfig.avatarUrl || "/placeholder.svg"} alt={profileConfig.username} />
            <AvatarFallback className="text-2xl">{profileConfig.avatarFallback}</AvatarFallback>
          </Avatar>

          <h1 className="text-xl font-semibold text-black">{profileConfig.username}</h1>
        </div>

        <div className="px-4">
          <Button
            onClick={() => handleLinkClick(profileConfig.mainLink.url)}
            className="w-full h-auto py-4 px-6 text-base font-medium bg-white hover:bg-gray-50 text-black border-0 shadow-sm rounded-full transition-all duration-200 hover:shadow-md"
          >
            <div className="relative w-6 h-6 mr-3">
              <Image src="/images/onlyfans-logo.png" alt="OnlyFans" width={24} height={24} className="object-contain" />
            </div>
            <span className="flex-1 text-center">{profileConfig.mainLink.title}</span>
          </Button>
        </div>

        <p className="text-xs text-gray-600 text-center mt-12 px-4">{profileConfig.footerText}</p>
      </div>
    </main>
  )
}

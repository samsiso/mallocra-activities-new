"use client"

import { useState, useEffect } from "react"

interface ExchangeRates {
  EUR: number
  USD: number
  GBP: number
}

interface CurrencyConversion {
  rates: ExchangeRates | null
  selectedCurrency: keyof ExchangeRates
  convertPrice: (eurPrice: number) => number
  formatPrice: (price: number) => string
  setCurrency: (currency: keyof ExchangeRates) => void
  loading: boolean
}

export function useCurrencyConversion(): CurrencyConversion {
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof ExchangeRates>("EUR")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchRates() {
      setLoading(true)
      try {
        // Free API: exchangerate-api.com
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/EUR`
        )
        const data = await response.json()

        setRates({
          EUR: 1,
          USD: data.rates.USD,
          GBP: data.rates.GBP
        })
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error)
        // Fallback rates
        setRates({ EUR: 1, USD: 1.1, GBP: 0.85 })
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
    // Update rates every hour
    const interval = setInterval(fetchRates, 3600000)
    return () => clearInterval(interval)
  }, [])

  const convertPrice = (eurPrice: number): number => {
    if (!rates) return eurPrice
    return eurPrice * rates[selectedCurrency]
  }

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price)

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedPrice)
  }

  return {
    rates,
    selectedCurrency,
    convertPrice,
    formatPrice,
    setCurrency: setSelectedCurrency,
    loading
  }
}

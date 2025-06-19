"use client"

import { useCurrencyConversion } from "@/lib/hooks/use-currency-conversion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function CurrencySelector() {
  const { selectedCurrency, setCurrency, loading } = useCurrencyConversion()

  const currencies = [
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" }
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-orange-500/30 bg-orange-500/10 text-white hover:bg-orange-500/20"
          disabled={loading}
        >
          {currencies.find(c => c.code === selectedCurrency)?.flag}{" "}
          {selectedCurrency}
          <ChevronDown className="ml-1 size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-orange-500/30 bg-gray-900"
      >
        {currencies.map(currency => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrency(currency.code)}
            className="cursor-pointer text-white hover:bg-orange-500/20"
          >
            <span className="mr-2">{currency.flag}</span>
            {currency.code} - {currency.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

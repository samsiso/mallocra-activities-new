"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, Activity, Users, Star, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface SearchResult {
  id: string
  type: "activity" | "user" | "review" | "booking"
  title: string
  description: string
  category?: string
  status?: string
  rating?: number
  date?: string
  relevance: number
}

interface UniversalSearchProps {
  onResultClick?: (result: SearchResult) => void
}

export default function UniversalSearch({
  onResultClick
}: UniversalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Mock data - In production, this would come from your API
  const mockData = useMemo(
    () => [
      {
        id: "1",
        type: "activity" as const,
        title: "Alcúdia Bay Boat Trip",
        description:
          "Explore the beautiful waters of Alcúdia Bay with snorkeling and beach visits",
        category: "Water Sports",
        status: "active",
        rating: 4.8,
        date: "2024-01-15",
        relevance: 0
      },
      {
        id: "2",
        type: "activity" as const,
        title: "Serra de Tramuntana Hiking",
        description:
          "Guided hiking tour through UNESCO World Heritage mountain range",
        category: "Land Adventures",
        status: "active",
        rating: 4.6,
        date: "2024-01-12",
        relevance: 0
      },
      {
        id: "3",
        type: "user" as const,
        title: "John Smith",
        description: "Customer from UK, 5 bookings, joined March 2024",
        category: "customer",
        status: "active",
        date: "2024-03-01",
        relevance: 0
      },
      {
        id: "4",
        type: "review" as const,
        title: "Amazing boat experience!",
        description:
          "Had the most wonderful time on the Alcúdia Bay trip. Highly recommended!",
        rating: 5,
        date: "2024-01-20",
        relevance: 0
      },
      {
        id: "5",
        type: "activity" as const,
        title: "Palma Cathedral Tour",
        description:
          "Historical guided tour of the magnificent Gothic cathedral",
        category: "Cultural",
        status: "active",
        rating: 4.7,
        date: "2024-01-10",
        relevance: 0
      }
    ],
    []
  )

  const calculateRelevance = (item: any, searchTerm: string): number => {
    if (!searchTerm) return 1

    const term = searchTerm.toLowerCase()
    let score = 0

    // Title match (highest weight)
    if (item.title.toLowerCase().includes(term)) {
      score += 10
    }

    // Description match
    if (item.description.toLowerCase().includes(term)) {
      score += 5
    }

    // Category match
    if (item.category?.toLowerCase().includes(term)) {
      score += 3
    }

    // Exact word matches
    const titleWords = item.title.toLowerCase().split(" ")
    const termWords = term.split(" ")

    termWords.forEach(termWord => {
      titleWords.forEach(titleWord => {
        if (titleWord === termWord) {
          score += 8
        } else if (titleWord.startsWith(termWord)) {
          score += 4
        }
      })
    })

    return score
  }

  const performSearch = async (term: string, type: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    let filteredData = mockData

    // Filter by type
    if (type !== "all") {
      filteredData = filteredData.filter(item => item.type === type)
    }

    // Calculate relevance and filter
    const searchResults = filteredData
      .map(item => ({
        ...item,
        relevance: calculateRelevance(item, term)
      }))
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10) // Limit results

    setResults(searchResults)
    setLoading(false)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm, searchType)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, searchType])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "activity":
        return <Activity className="size-4 text-orange-500" />
      case "user":
        return <Users className="size-4 text-blue-500" />
      case "review":
        return <Star className="size-4 text-yellow-500" />
      case "booking":
        return <Calendar className="size-4 text-green-500" />
      default:
        return <Search className="size-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "activity":
        return "border-orange-500 text-orange-400"
      case "user":
        return "border-blue-500 text-blue-400"
      case "review":
        return "border-yellow-500 text-yellow-400"
      case "booking":
        return "border-green-500 text-green-400"
      default:
        return "border-gray-500 text-gray-400"
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    setSearchTerm("")
    onResultClick?.(result)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search activities, users, reviews..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            className="border-gray-700 bg-gray-800 pl-10 text-white placeholder:text-gray-400"
          />
        </div>

        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-32 border-gray-700 bg-gray-800 text-white">
            <Filter className="mr-2 size-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="activity">Activities</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="review">Reviews</SelectItem>
            <SelectItem value="booking">Bookings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (searchTerm || results.length > 0) && (
        <Card className="absolute top-full z-50 mt-2 w-full border-gray-700 bg-gray-800 shadow-xl">
          <CardContent className="p-0">
            {loading && (
              <div className="p-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="size-4 animate-spin rounded-full border-2 border-gray-600 border-t-orange-500"></div>
                  <span>Searching...</span>
                </div>
              </div>
            )}

            {!loading && results.length === 0 && searchTerm && (
              <div className="p-4 text-center text-gray-400">
                No results found for "{searchTerm}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="max-h-96 overflow-y-auto">
                {results.map(result => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex w-full items-start space-x-3 p-4 text-left transition-colors hover:bg-gray-700"
                  >
                    {getTypeIcon(result.type)}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">
                          {result.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getTypeColor(result.type)}`}
                        >
                          {result.type}
                        </Badge>
                        {result.rating && (
                          <Badge
                            variant="outline"
                            className="border-yellow-500 text-xs text-yellow-400"
                          >
                            {result.rating}⭐
                          </Badge>
                        )}
                      </div>

                      <p className="mt-1 truncate text-sm text-gray-400">
                        {result.description}
                      </p>

                      <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                        {result.category && <span>{result.category}</span>}
                        {result.date && (
                          <span>
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                        )}
                        <span>Relevance: {result.relevance}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="border-t border-gray-700 p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
}

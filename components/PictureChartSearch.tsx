"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchAndParseCsv, type PictureChartItem } from "@/utils/csvParser"

export default function PictureChartSearch() {
  const [items, setItems] = useState<PictureChartItem[]>([])
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<PictureChartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<PictureChartItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAndParseCsv(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/New%20Microsoft%20Office%20Excel%20Worksheet-tjmEZCln8fKQACYoPMPPh9jyjM3Jol.csv",
        )
        setItems(data)
      } catch (error) {
        console.error("Error fetching CSV data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (query) {
      const filtered = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [query, items])

  const handleSelect = (item: PictureChartItem) => {
    setSelectedItem(item)
    setQuery(item.name)
    setSuggestions([])
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Selected item:", selectedItem)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a Picture Chart item"
          className="w-full"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
            {suggestions.map((item) => (
              <li
                key={item.slNo}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
        <Button type="submit" className="mt-2 w-full">
          Search
        </Button>
      </form>
      {selectedItem && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Selected Item:</h2>
          <p>Name: {selectedItem.name}</p>
          <p>Serial Number: {selectedItem.slNo}</p>
        </div>
      )}
    </div>
  )
}


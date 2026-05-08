"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface SearchInputProps {
  placeholder?: string
  value?:       string
  onChange?:    (value: string) => void
  onSearch?:    (value: string) => void
  className?:   string
  size?:        "sm" | "default" | "lg"
  autoFocus?:   boolean
}

const sizes = {
  sm:      "h-8  text-xs  pl-8   pr-3",
  default: "h-10 text-sm  pl-9   pr-4",
  lg:      "h-12 text-base pl-11  pr-5",
}

const iconSizes = {
  sm:      "size-3.5 left-2.5",
  default: "size-4   left-3",
  lg:      "size-5   left-3.5",
}

export function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
  onSearch,
  className,
  size = "default",
  autoFocus,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const currentValue = value ?? internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInternalValue(v)
    onChange?.(v)
  }

  const handleClear = () => {
    setInternalValue("")
    onChange?.("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(currentValue)
    }
    if (e.key === "Escape") {
      handleClear()
    }
  }

  return (
    <div className={cn("relative", className)}>
      {/* Search icon */}
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          iconSizes[size],
        )}
        aria-hidden
      />

      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "w-full rounded-lg border border-input bg-background",
          "text-foreground placeholder:text-muted-foreground",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
          "hover:border-primary/40",
          "[&::-webkit-search-cancel-button]:hidden",
          sizes[size],
          currentValue && "pr-9",
        )}
      />

      {/* Clear button */}
      {currentValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpar busca"
          className={cn(
            "absolute right-2.5 top-1/2 -translate-y-1/2",
            "rounded-full p-0.5 text-muted-foreground",
            "transition-colors duration-150 hover:text-foreground",
          )}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

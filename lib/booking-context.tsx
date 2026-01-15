"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Booking {
  id: string
  sport: string
  venue: string
  ground: string
  date: string
  time: string
  duration: number
  price: number
  status: "pending" | "confirmed" | "cancelled"
  userId: string
}

interface BookingContextType {
  currentBooking: Partial<Booking> | null
  bookings: Booking[]
  setCurrentBooking: (booking: Partial<Booking> | null) => void
  confirmBooking: (booking: Booking) => void
  cancelBooking: (id: string) => void
  addBooking: (booking: Booking) => void
  removeBooking: (id: string) => void
  lastConfirmedBooking: Booking | null
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<Booking | null>(null)

  const confirmBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking])
    setLastConfirmedBooking(booking)
    setCurrentBooking(null)
  }

  const cancelBooking = (id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)))
  }

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking])
  }

  const removeBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <BookingContext.Provider
      value={{
        currentBooking,
        bookings,
        setCurrentBooking,
        confirmBooking,
        cancelBooking,
        addBooking,
        removeBooking,
        lastConfirmedBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider")
  }
  return context
}

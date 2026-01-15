"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Clock, Package, Search, SortAsc, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useBooking } from "@/lib/booking-context"
import { BookingBill } from "@/components/booking-bill"
import type { Booking } from "@/lib/booking-context"

export default function BookingsPage() {
  const { isAuthenticated } = useAuth()
  const { bookings } = useBooking()
  const router = useRouter()

  const [universalSearch, setUniversalSearch] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "price" | "sport">("date")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBillDialog, setShowBillDialog] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.sport.toLowerCase().includes(universalSearch.toLowerCase()) ||
      booking.venue.toLowerCase().includes(universalSearch.toLowerCase()) ||
      booking.ground.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "price") {
      return b.price - a.price
    } else {
      return a.sport.localeCompare(b.sport)
    }
  })

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowBillDialog(true)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5 bg-cover bg-center bg-fixed" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your slot bookings</p>
          </div>

          {bookings.length > 0 && (
            <Card className="mb-6 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    <Input
                      placeholder="Universal Search - Search by sport, venue, or ground..."
                      value={universalSearch}
                      onChange={(e) => setUniversalSearch(e.target.value)}
                      className="pl-10 h-12 text-base border-primary/30"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "price" | "sport")}
                      className="px-4 py-2 border rounded-md bg-background h-12"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="price">Sort by Price</option>
                      <option value="sport">Sort by Sport</option>
                    </select>
                  </div>
                </div>
                {universalSearch && (
                  <p className="text-sm text-muted-foreground mt-2">Found {filteredBookings.length} bookings</p>
                )}
              </CardContent>
            </Card>
          )}

          {bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">Start by booking your first slot</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/booking">Book Now</a>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBookings.map((booking) => (
                <Card key={booking.id} className="hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{booking.sport}</CardTitle>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {booking.time} ({booking.duration} mins)
                      </span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">Total Paid</span>
                        <span className="text-xl font-bold text-primary">₹{booking.price}</span>
                      </div>
                      <Button
                        onClick={() => handleViewDetails(booking)}
                        className="w-full bg-primary hover:bg-primary/90"
                        size="sm"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details & QR Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>

      <BookingBill
        booking={selectedBooking}
        open={showBillDialog}
        onClose={() => {
          setShowBillDialog(false)
          setSelectedBooking(null)
        }}
      />
    </div>
  )
}

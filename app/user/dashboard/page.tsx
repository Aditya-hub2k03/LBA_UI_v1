"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, TrendingUp, Clock, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useBooking } from "@/lib/booking-context"

export default function UserDashboard() {
  const { isAuthenticated, user } = useAuth()
  const { bookings } = useBooking()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "user") {
    return null
  }

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "text-blue-500" },
    {
      label: "Active Bookings",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: TrendingUp,
      color: "text-green-500",
    },
    { label: "Hours Played", value: Math.floor(bookings.length * 0.5), icon: Clock, color: "text-orange-500" },
    { label: "Points Earned", value: bookings.length * 10, icon: Award, color: "text-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background opacity-50" />
      <div className="absolute inset-0 bg-[url('/abstract-sports-pattern.png')] opacity-5 bg-cover bg-center bg-fixed" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {"Welcome back, "}
              {user.name}!
            </h1>
            <p className="text-muted-foreground">{"Here's an overview of your activity"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{"Quick Actions"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <a href="/booking">{"Book New Slot"}</a>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a href="/bookings">{"View All Bookings"}</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{"Recent Activity"}</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">{"No recent activity"}</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-medium">{booking.sport}</p>
                          <p className="text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <span className="text-primary font-semibold">₹{booking.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Calendar, DollarSign, Activity, UserPlus, Trash2, UserX, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useBooking } from "@/lib/booking-context"
import { Badge } from "@/components/ui/badge"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  bookings: number
}

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth()
  const { bookings, addBooking, removeBooking } = useBooking()
  const router = useRouter()

  const [users, setUsers] = useState<AdminUser[]>([
    { id: "1", name: "Test User", email: "user@test.com", role: "user", bookings: 0 },
  ])
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [addBookingOpen, setAddBookingOpen] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [bookingSport, setBookingSport] = useState("")
  const [bookingGround, setBookingGround] = useState("")
  const [bookingDate, setBookingDate] = useState("")
  const [universalSearch, setUniversalSearch] = useState("")
  const [bookingSortBy, setBookingSortBy] = useState<"date" | "price">("date")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      alert("Please fill all fields!")
      return
    }
    const newUser: AdminUser = {
      id: `${users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: "user",
      bookings: 0,
    }
    setUsers([...users, newUser])
    setNewUserName("")
    setNewUserEmail("")
    setAddUserOpen(false)
    alert("User added successfully!")
  }

  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user?")) {
      setUsers(users.filter((u) => u.id !== userId))
      alert("User removed successfully!")
    }
  }

  const handleAddBooking = () => {
    if (!selectedUserId || !bookingSport || !bookingGround || !bookingDate) {
      alert("Please fill all fields!")
      return
    }
    const newBooking = {
      id: `booking-${Date.now()}`,
      sport: bookingSport,
      venue: "Indoor Arena",
      ground: bookingGround,
      date: bookingDate,
      time: "10:00 AM",
      price: 500,
      status: "confirmed" as const,
      userId: selectedUserId,
    }
    addBooking(newBooking)
    setSelectedUserId("")
    setBookingSport("")
    setBookingGround("")
    setBookingDate("")
    setAddBookingOpen(false)
    alert("Booking added successfully!")
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0)

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-500" },
    { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "text-green-500" },
    { label: "Revenue", value: `₹${totalRevenue}`, icon: DollarSign, color: "text-orange-500" },
    { label: "Active Courts", value: "18", icon: Activity, color: "text-purple-500" },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(universalSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.sport.toLowerCase().includes(universalSearch.toLowerCase()) ||
      booking.ground.toLowerCase().includes(universalSearch.toLowerCase()) ||
      booking.venue.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (bookingSortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return b.price - a.price
  })

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background opacity-50" />
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5 bg-cover bg-center bg-fixed" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{"Admin Dashboard"}</h1>
            <p className="text-muted-foreground">{"Monitor and manage user operations"}</p>
          </div>

          <Card className="mb-6 border-primary/20">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  placeholder="Universal Search - Search across all users and bookings..."
                  value={universalSearch}
                  onChange={(e) => setUniversalSearch(e.target.value)}
                  className="pl-10 h-12 text-base border-primary/30"
                />
              </div>
              {universalSearch && (
                <p className="text-sm text-muted-foreground mt-2">
                  Found {filteredUsers.length} users and {filteredBookings.length} bookings
                </p>
              )}
            </CardContent>
          </Card>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{"User Management (Regular Users Only)"}</CardTitle>
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      {"Add User"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{"Add New User"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="user-name">{"Name"}</Label>
                        <Input
                          id="user-name"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Enter user name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-email">{"Email"}</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="Enter user email"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Note: Admins can only add regular users</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddUserOpen(false)}>
                        {"Cancel"}
                      </Button>
                      <Button onClick={handleAddUser}>{"Add User"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <Badge className="mt-1 capitalize">{u.role}</Badge>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveUser(u.id)}>
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{"Booking Management"}</CardTitle>
                <Dialog open={addBookingOpen} onOpenChange={setAddBookingOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      {"Add Booking"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{"Add User Booking"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="select-user">{"Select User"}</Label>
                        <select
                          id="select-user"
                          className="w-full p-2 border rounded-md bg-background"
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                          <option value="">{"Select a user"}</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="booking-sport">{"Sport"}</Label>
                        <Input
                          id="booking-sport"
                          value={bookingSport}
                          onChange={(e) => setBookingSport(e.target.value)}
                          placeholder="e.g., Badminton"
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking-ground">{"Ground"}</Label>
                        <Input
                          id="booking-ground"
                          value={bookingGround}
                          onChange={(e) => setBookingGround(e.target.value)}
                          placeholder="e.g., Court 1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking-date">{"Date"}</Label>
                        <Input
                          id="booking-date"
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddBookingOpen(false)}>
                        {"Cancel"}
                      </Button>
                      <Button onClick={handleAddBooking}>{"Add Booking"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <select
                    value={bookingSortBy}
                    onChange={(e) => setBookingSortBy(e.target.value as "date" | "price")}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="price">Sort by Price</option>
                  </select>
                </div>
                {sortedBookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No bookings found</p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {sortedBookings.map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold">
                            {booking.sport} - {booking.ground}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} • {booking.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">₹{booking.price}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm("Remove this booking?")) {
                                removeBooking(booking.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{"Recent Bookings"}</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-muted-foreground">{"No bookings yet"}</p>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-semibold">
                          {booking.sport} - {booking.ground}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.venue} • {new Date(booking.date).toLocaleDateString()} • {booking.time}
                        </p>
                      </div>
                      <span className="font-bold text-primary">₹{booking.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  )
}

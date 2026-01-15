"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Settings,
  Users,
  DollarSign,
  TrendingUp,
  Tag,
  Plus,
  Ban,
  CheckCircle,
  MapPin,
  Dumbbell,
  CreditCard,
  UserPlus,
  Search,
  UserX,
  Building2,
  Layers,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useBooking } from "@/lib/booking-context"
import { COUPONS, SPORTS, VENUES, PAYMENT_METHODS } from "@/mock-data/sports"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface Court {
  id: string
  name: string
  venue: string
  status: "active" | "blocked"
}

interface Coupon {
  code: string
  discount: number
  description: string
  expiryDate: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

interface Sport {
  id: string
  name: string
  description: string
  image: string
  price: number
}

interface Venue {
  id: string
  name: string
  location: string
  address: string
  image: string
  grounds: string[]
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
}

export default function ManagerDashboard() {
  const { isAuthenticated, user } = useAuth()
  const { bookings } = useBooking()
  const router = useRouter()

  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS)
  const [courts, setCourts] = useState<Court[]>([
    { id: "1", name: "Court 1", venue: "Indoor Arena", status: "active" },
    { id: "2", name: "Court 2", venue: "Indoor Arena", status: "active" },
    { id: "3", name: "Court 3", venue: "Outdoor Complex", status: "active" },
    { id: "4", name: "Court 4", venue: "Outdoor Complex", status: "blocked" },
  ])
  const [users, setUsers] = useState<AdminUser[]>([
    { id: "1", name: "Test User", email: "user@test.com", role: "user" },
    { id: "2", name: "Admin User", email: "admin@test.com", role: "admin" },
  ])
  const [sports, setSports] = useState<Sport[]>(SPORTS)
  const [venues, setVenues] = useState<Venue[]>(VENUES)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS)
  const [pricing, setPricing] = useState(SPORTS[0].price)

  const [pricingOpen, setPricingOpen] = useState(false)
  const [couponOpen, setCouponOpen] = useState(false)
  const [userManagementOpen, setUserManagementOpen] = useState(false)
  const [sportOpen, setSportOpen] = useState(false)
  const [venueOpen, setVenueOpen] = useState(false)
  const [groundOpen, setGroundOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [blockCourtOpen, setBlockCourtOpen] = useState(false)

  const [newPrice, setNewPrice] = useState(pricing)
  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState("")
  const [couponDesc, setCouponDesc] = useState("")
  const [couponExpiry, setCouponExpiry] = useState("")
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"user" | "admin">("user")

  const [sportName, setSportName] = useState("")
  const [sportDesc, setSportDesc] = useState("")
  const [sportPrice, setSportPrice] = useState("")
  const [sportImage, setSportImage] = useState("")

  const [venueName, setVenueName] = useState("")
  const [venueLocation, setVenueLocation] = useState("")
  const [venueAddress, setVenueAddress] = useState("")
  const [venueImage, setVenueImage] = useState("")

  const [selectedVenueForGround, setSelectedVenueForGround] = useState("")
  const [groundName, setGroundName] = useState("")

  const [paymentName, setPaymentName] = useState("")
  const [paymentIcon, setPaymentIcon] = useState("")

  const [universalSearch, setUniversalSearch] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "manager") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  const handleUpdatePricing = () => {
    if (!newPrice || Number(newPrice) <= 0) {
      alert("Please enter a valid price!")
      return
    }
    setPricing(Number(newPrice))
    setPricingOpen(false)
    alert("Pricing updated successfully!")
  }

  const handleCreateCoupon = () => {
    if (!couponCode || !couponDiscount || !couponDesc || !couponExpiry) {
      alert("Please fill all fields!")
      return
    }
    const newCoupon: Coupon = {
      code: couponCode.toUpperCase(),
      discount: Number(couponDiscount),
      description: couponDesc,
      expiryDate: couponExpiry,
    }
    setCoupons([...coupons, newCoupon])
    setCouponCode("")
    setCouponDiscount("")
    setCouponDesc("")
    setCouponExpiry("")
    setCouponOpen(false)
    alert("Coupon created successfully!")
  }

  const toggleCourtStatus = (courtId: string) => {
    setCourts(
      courts.map((court) =>
        court.id === courtId ? { ...court, status: court.status === "active" ? "blocked" : "active" } : court,
      ),
    )
  }

  const handleAddMember = () => {
    if (!newMemberName || !newMemberEmail) {
      alert("Please fill all fields!")
      return
    }
    const newMember: AdminUser = {
      id: `${users.length + 1}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    }
    setUsers([...users, newMember])
    setNewMemberName("")
    setNewMemberEmail("")
    setNewMemberRole("user")
    setUserManagementOpen(false)
    alert(`${newMemberRole === "admin" ? "Admin" : "User"} added successfully!`)
  }

  const handleRemoveMember = (memberId: string) => {
    const member = users.find((u) => u.id === memberId)
    if (confirm(`Remove this ${member?.role}?`)) {
      setUsers(users.filter((u) => u.id !== memberId))
      alert(`${member?.role === "admin" ? "Admin" : "User"} removed successfully!`)
    }
  }

  const handleAddSport = () => {
    if (!sportName || !sportDesc || !sportPrice) {
      alert("Please fill all required fields!")
      return
    }
    const newSport: Sport = {
      id: sportName.toLowerCase().replace(/\s+/g, "-"),
      name: sportName,
      description: sportDesc,
      image: sportImage || "/placeholder.svg?height=300&width=400",
      price: Number(sportPrice),
    }
    setSports([...sports, newSport])
    setSportName("")
    setSportDesc("")
    setSportPrice("")
    setSportImage("")
    setSportOpen(false)
    alert("Sport added successfully!")
  }

  const handleAddVenue = () => {
    if (!venueName || !venueLocation || !venueAddress) {
      alert("Please fill all required fields!")
      return
    }
    const newVenue: Venue = {
      id: `venue-${venues.length + 1}`,
      name: venueName,
      location: venueLocation,
      address: venueAddress,
      image: venueImage || "/placeholder.svg?height=300&width=400",
      grounds: [],
    }
    setVenues([...venues, newVenue])
    setVenueName("")
    setVenueLocation("")
    setVenueAddress("")
    setVenueImage("")
    setVenueOpen(false)
    alert("Venue added successfully!")
  }

  const handleAddGround = () => {
    if (!selectedVenueForGround || !groundName) {
      alert("Please select a venue and enter ground name!")
      return
    }
    setVenues(venues.map((v) => (v.id === selectedVenueForGround ? { ...v, grounds: [...v.grounds, groundName] } : v)))
    setGroundName("")
    setSelectedVenueForGround("")
    setGroundOpen(false)
    alert("Ground added successfully!")
  }

  const handleAddPaymentMethod = () => {
    if (!paymentName || !paymentIcon) {
      alert("Please fill all fields!")
      return
    }
    const newMethod: PaymentMethod = {
      id: paymentName.toLowerCase().replace(/\s+/g, "-"),
      name: paymentName,
      icon: paymentIcon,
    }
    setPaymentMethods([...paymentMethods, newMethod])
    setPaymentName("")
    setPaymentIcon("")
    setPaymentOpen(false)
    alert("Payment method added successfully!")
  }

  const handleToggleCourtStatus = (courtId: string) => {
    setCourts(
      courts.map((court) =>
        court.id === courtId ? { ...court, status: court.status === "active" ? "blocked" : "active" } : court,
      ),
    )
    setBlockCourtOpen(false)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(universalSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(universalSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const filteredCourts = courts.filter(
    (court) =>
      court.name.toLowerCase().includes(universalSearch.toLowerCase()) ||
      court.venue.toLowerCase().includes(universalSearch.toLowerCase()) ||
      court.status.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(universalSearch.toLowerCase()) ||
      coupon.description.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(universalSearch.toLowerCase()) ||
      venue.address.toLowerCase().includes(universalSearch.toLowerCase()) ||
      venue.location.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const filteredSports = sports.filter(
    (sport) =>
      sport.name.toLowerCase().includes(universalSearch.toLowerCase()) ||
      sport.description.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  const filteredPaymentMethods = paymentMethods.filter((method) =>
    method.name.toLowerCase().includes(universalSearch.toLowerCase()),
  )

  if (!isAuthenticated || user?.role !== "manager") {
    return null
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0)

  const stats = [
    { label: "System Users", value: users.length, icon: Users, color: "text-blue-500" },
    { label: "Total Revenue", value: `₹${totalRevenue}`, icon: DollarSign, color: "text-green-500" },
    { label: "Active Coupons", value: coupons.length, icon: Tag, color: "text-orange-500" },
    { label: "Total Venues", value: venues.length, icon: Building2, color: "text-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
      <div className="absolute inset-0 bg-[url('/abstract-network.png')] opacity-5 bg-cover bg-center bg-fixed" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-balance">Manager Dashboard</h1>
            <p className="text-muted-foreground text-pretty">Full system control and management</p>
          </div>

          <Card className="mb-8 border-primary/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  placeholder="Universal Search - Search across users, courts, coupons, venues, sports, payment methods..."
                  value={universalSearch}
                  onChange={(e) => setUniversalSearch(e.target.value)}
                  className="pl-10 h-12 text-base border-primary/30 focus-visible:ring-primary"
                />
              </div>
              {universalSearch && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {filteredUsers.length} {filteredUsers.length === 1 ? "member" : "members"}
                  </Badge>
                  <Badge variant="secondary">
                    {filteredCourts.length} {filteredCourts.length === 1 ? "court" : "courts"}
                  </Badge>
                  <Badge variant="secondary">
                    {filteredCoupons.length} {filteredCoupons.length === 1 ? "coupon" : "coupons"}
                  </Badge>
                  <Badge variant="secondary">
                    {filteredVenues.length} {filteredVenues.length === 1 ? "venue" : "venues"}
                  </Badge>
                  <Badge variant="secondary">
                    {filteredSports.length} {filteredSports.length === 1 ? "sport" : "sports"}
                  </Badge>
                  <Badge variant="secondary">
                    {filteredPaymentMethods.length} payment {filteredPaymentMethods.length === 1 ? "method" : "methods"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
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

          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Management Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <Dialog open={pricingOpen} onOpenChange={setPricingOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Manage Pricing</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Pricing</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="base-price">Base Price (per hour)</Label>
                      <Input
                        id="base-price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        placeholder="Enter price"
                      />
                      <p className="text-sm text-muted-foreground mt-2">Current: ₹{pricing}</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPricingOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdatePricing}>Update</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={couponOpen} onOpenChange={setCouponOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Create Coupons</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="coupon-code">Coupon Code</Label>
                      <Input
                        id="coupon-code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g., SAVE50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount-amount">Discount Amount (₹)</Label>
                      <Input
                        id="discount-amount"
                        type="number"
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(e.target.value)}
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coupon-description">Description</Label>
                      <Input
                        id="coupon-description"
                        value={couponDesc}
                        onChange={(e) => setCouponDesc(e.target.value)}
                        placeholder="e.g., Save ₹50 on your booking"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input
                        id="expiry-date"
                        type="date"
                        value={couponExpiry}
                        onChange={(e) => setCouponExpiry(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCouponOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCoupon}>Create Coupon</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={userManagementOpen} onOpenChange={setUserManagementOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Manage Users</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>User & Admin Management</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h4 className="font-semibold mb-3">Add New Member</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="member-name">Name</Label>
                          <Input
                            id="member-name"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="Enter member name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="member-email">Email</Label>
                          <Input
                            id="member-email"
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            placeholder="Enter member email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="member-role">Role</Label>
                          <select
                            id="member-role"
                            className="w-full p-2 border rounded-md bg-background"
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value as "user" | "admin")}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <Button onClick={handleAddMember} className="w-full">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add {newMemberRole === "admin" ? "Admin" : "User"}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">All Users & Admins</h4>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {filteredUsers.map((member) => (
                          <div key={member.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                              <Badge className="mt-1 capitalize">{member.role}</Badge>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(member.id)}>
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {filteredUsers.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">No members found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={blockCourtOpen} onOpenChange={setBlockCourtOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Ban className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Block Courts</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Court Status Management</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {filteredCourts.map((court) => (
                        <div key={court.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-semibold">{court.name}</p>
                            <p className="text-sm text-muted-foreground">{court.venue}</p>
                            <Badge variant={court.status === "active" ? "default" : "destructive"} className="mt-1">
                              {court.status === "active" ? "Active" : "Blocked"}
                            </Badge>
                          </div>
                          <Button
                            variant={court.status === "active" ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleToggleCourtStatus(court.id)}
                          >
                            {court.status === "active" ? (
                              <>
                                <Ban className="mr-2 h-4 w-4" /> Block
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" /> Unblock
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                      {filteredCourts.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No courts found</p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={sportOpen} onOpenChange={setSportOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Add Sport</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sport</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sport-name">Sport Name</Label>
                      <Input
                        id="sport-name"
                        value={sportName}
                        onChange={(e) => setSportName(e.target.value)}
                        placeholder="e.g., Football"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sport-desc">Description</Label>
                      <Textarea
                        id="sport-desc"
                        value={sportDesc}
                        onChange={(e) => setSportDesc(e.target.value)}
                        placeholder="Describe the sport..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="sport-price">Price per Slot (₹)</Label>
                      <Input
                        id="sport-price"
                        type="number"
                        value={sportPrice}
                        onChange={(e) => setSportPrice(e.target.value)}
                        placeholder="e.g., 700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sport-image">Image URL (optional)</Label>
                      <Input
                        id="sport-image"
                        value={sportImage}
                        onChange={(e) => setSportImage(e.target.value)}
                        placeholder="Image URL"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSportOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSport}>Add Sport</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={venueOpen} onOpenChange={setVenueOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Add Venue</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Venue</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="venue-name">Venue Name</Label>
                      <Input
                        id="venue-name"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="e.g., Downtown Sports Center"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue-location">GPS Location</Label>
                      <Input
                        id="venue-location"
                        value={venueLocation}
                        onChange={(e) => setVenueLocation(e.target.value)}
                        placeholder="e.g., 17.6887° N, 83.1774° E"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue-address">Address</Label>
                      <Textarea
                        id="venue-address"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        placeholder="Enter full address..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue-image">Image URL (optional)</Label>
                      <Input
                        id="venue-image"
                        value={venueImage}
                        onChange={(e) => setVenueImage(e.target.value)}
                        placeholder="Image URL"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setVenueOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddVenue}>Add Venue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={groundOpen} onOpenChange={setGroundOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Add Ground</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Ground</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="select-venue">Select Venue</Label>
                      <select
                        id="select-venue"
                        className="w-full p-2 rounded-md border bg-background"
                        value={selectedVenueForGround}
                        onChange={(e) => setSelectedVenueForGround(e.target.value)}
                      >
                        <option value="">-- Select Venue --</option>
                        {venues.map((venue) => (
                          <option key={venue.id} value={venue.id}>
                            {venue.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="ground-name">Ground Name</Label>
                      <Input
                        id="ground-name"
                        value={groundName}
                        onChange={(e) => setGroundName(e.target.value)}
                        placeholder="e.g., Court G"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setGroundOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddGround}>Add Ground</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full h-auto py-4 justify-start hover:bg-primary/10 bg-transparent"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold">Add Payment</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payment-name">Payment Method Name</Label>
                      <Input
                        id="payment-name"
                        value={paymentName}
                        onChange={(e) => setPaymentName(e.target.value)}
                        placeholder="e.g., PayPal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-icon">Icon (emoji or symbol)</Label>
                      <Input
                        id="payment-icon"
                        value={paymentIcon}
                        onChange={(e) => setPaymentIcon(e.target.value)}
                        placeholder="e.g., 💰"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPaymentMethod}>Add Method</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Venues & Grounds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {filteredVenues.map((venue) => (
                    <div
                      key={venue.id}
                      className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{venue.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {venue.location}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{venue.address}</p>
                        </div>
                        <Badge variant="secondary">{venue.grounds.length} grounds</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {venue.grounds.map((ground, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ground}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredVenues.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No venues found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Court Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredCourts.map((court) => (
                    <div key={court.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{court.name}</p>
                        <p className="text-sm text-muted-foreground">{court.venue}</p>
                        <Badge className="mt-1" variant={court.status === "active" ? "default" : "destructive"}>
                          {court.status === "active" ? "Active" : "Blocked"}
                        </Badge>
                      </div>
                      <Button
                        variant={court.status === "active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleCourtStatus(court.id)}
                      >
                        {court.status === "active" ? (
                          <>
                            <Ban className="mr-1 h-4 w-4" /> Block
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-1 h-4 w-4" /> Unblock
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                  {filteredCourts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No courts found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Available Sports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {filteredSports.map((sport) => (
                    <div key={sport.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{sport.name}</h4>
                        <Badge className="bg-green-500">{`₹${sport.price}/hr`}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{sport.description}</p>
                    </div>
                  ))}
                  {filteredSports.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No sports found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {filteredPaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border text-center hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-2">{method.icon}</div>
                      <p className="font-medium text-sm">{method.name}</p>
                    </div>
                  ))}
                </div>
                {filteredPaymentMethods.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No payment methods found</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Active Coupons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredCoupons.map((coupon, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="font-mono">{coupon.code}</Badge>
                        <span className="text-sm font-bold text-primary">-₹{coupon.discount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {filteredCoupons.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No coupons found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20">
                    <span className="font-semibold">Total Revenue</span>
                    <span className="text-2xl font-bold text-green-500">₹{totalRevenue}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
                    <span className="font-semibold">Total Bookings</span>
                    <span className="text-2xl font-bold text-blue-500">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg border border-purple-500/20">
                    <span className="font-semibold">Avg Booking Value</span>
                    <span className="text-2xl font-bold text-purple-500">
                      ₹{bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>All Bookings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No bookings in the system</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">
                          {booking.sport} - {booking.ground}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.venue} • {new Date(booking.date).toLocaleDateString()} • {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary">₹{booking.price}</span>
                        <p className="text-xs text-muted-foreground capitalize">{booking.status}</p>
                      </div>
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

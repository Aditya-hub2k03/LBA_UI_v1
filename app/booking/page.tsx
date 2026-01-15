"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { useBooking } from "@/lib/booking-context"
import { SPORTS, VENUES, TIME_SLOTS } from "@/mock-data/sports"
import { BookingBill } from "@/components/booking-bill"
import type { Booking } from "@/lib/booking-context"

type BookingStep = "sport" | "venue" | "slot" | "payment"

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { setCurrentBooking, confirmBooking } = useBooking()

  const [currentStep, setCurrentStep] = useState<BookingStep>("sport")
  const [selectedSport, setSelectedSport] = useState(searchParams.get("sport") || "")
  const [selectedVenue, setSelectedVenue] = useState("")
  const [selectedGround, setSelectedGround] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [showBill, setShowBill] = useState(false)
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null)

  const steps = [
    { id: "sport", label: "Select Sport", description: "Choose your sport" },
    { id: "venue", label: "Select Venue", description: "Pick a location" },
    { id: "slot", label: "Select Slot", description: "Choose your time" },
    { id: "payment", label: "Payment", description: "Complete booking" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (currentStep === "sport" && selectedSport) {
      setCurrentStep("venue")
    } else if (currentStep === "venue" && selectedVenue && selectedGround) {
      setCurrentStep("slot")
    } else if (currentStep === "slot" && selectedTime && selectedDate) {
      setCurrentStep("payment")
    }
  }

  const handleBooking = () => {
    const sport = SPORTS.find((s) => s.id === selectedSport)
    const booking = {
      id: Date.now().toString(),
      sport: sport?.name || "",
      venue: VENUES.find((v) => v.id === selectedVenue)?.name || "",
      ground: selectedGround,
      date: selectedDate,
      time: selectedTime,
      duration: 30,
      price: sport?.pricePerSlot || 0,
      status: "confirmed" as const,
      userId: user?.id || "",
    }

    confirmBooking(booking)
    setCompletedBooking(booking)
    setShowBill(true)
  }

  const handleBillClose = () => {
    setShowBill(false)
    router.push("/bookings")
  }

  const getSlotStatus = (time: string) => {
    const random = Math.random()
    if (random > 0.7) return "unavailable"
    if (random > 0.5) return "available"
    if (random > 0.3) return "hot"
    return "blocked"
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
      <div className="absolute inset-0 bg-[url('/abstract-sports-pattern.png')] opacity-5 bg-cover bg-center bg-fixed" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          {/* Progress Stepper */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                        index <= currentStepIndex ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentStepIndex ? <Check size={24} /> : index + 1}
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-semibold text-sm">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded transition-all ${
                        index < currentStepIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === "sport" && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Sport</h2>
                  <RadioGroup value={selectedSport} onValueChange={setSelectedSport}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {SPORTS.map((sport) => (
                        <Label key={sport.id} htmlFor={sport.id} className="cursor-pointer">
                          <Card
                            className={`hover:shadow-lg transition-all ${selectedSport === sport.id ? "border-primary border-2" : ""}`}
                          >
                            <div className="relative h-48">
                              <img
                                src={sport.image || "/placeholder.svg"}
                                alt={sport.name}
                                className="w-full h-full object-cover rounded-t-lg"
                              />
                              {selectedSport === sport.id && (
                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                                  <Check size={20} />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <RadioGroupItem value={sport.id} id={sport.id} className="sr-only" />
                              <h3 className="font-bold text-xl mb-2">{sport.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{sport.description}</p>
                              <p className="text-xl font-bold text-primary">₹{sport.pricePerSlot}/slot</p>
                            </CardContent>
                          </Card>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                  <div className="mt-8 flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleNext}
                      disabled={!selectedSport}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Continue <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === "venue" && (
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-center">Select Venue & Ground</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-xl mb-4">Venues</h3>
                      <RadioGroup
                        value={selectedVenue}
                        onValueChange={(value) => {
                          setSelectedVenue(value)
                          setSelectedGround("")
                        }}
                      >
                        <div className="space-y-4">
                          {VENUES.map((venue) => (
                            <Label key={venue.id} htmlFor={venue.id} className="cursor-pointer">
                              <Card
                                className={`hover:shadow-lg transition-all ${selectedVenue === venue.id ? "border-primary border-2" : ""}`}
                              >
                                <CardContent className="p-4 flex gap-4">
                                  <img
                                    src={venue.image || "/placeholder.svg"}
                                    alt={venue.name}
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <RadioGroupItem value={venue.id} id={venue.id} className="sr-only" />
                                    <h4 className="font-bold">{venue.name}</h4>
                                    <p className="text-sm text-muted-foreground">{venue.address}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </Label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <h3 className="font-bold text-xl mb-4">Grounds</h3>
                      {selectedVenue ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {VENUES.find((v) => v.id === selectedVenue)?.grounds.map((ground, index) => (
                            <Button
                              key={ground}
                              variant={selectedGround === ground ? "default" : "outline"}
                              className={`h-20 ${selectedGround === ground ? "bg-primary" : ""}`}
                              onClick={() => setSelectedGround(ground)}
                            >
                              {ground}
                              {index === 2 && <Badge className="ml-2 bg-destructive">🔥 Hot</Badge>}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Please select a venue first</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep("sport")}>
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleNext}
                      disabled={!selectedVenue || !selectedGround}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Continue <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === "slot" && (
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-center">Select Date & Time Slot</h2>

                  <div className="mb-8">
                    <Label className="text-lg mb-3 block font-semibold">Select Date</Label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() + i)
                        const dateStr = date.toISOString().split("T")[0]
                        return (
                          <Button
                            key={dateStr}
                            variant={selectedDate === dateStr ? "default" : "outline"}
                            className={`min-w-[120px] ${selectedDate === dateStr ? "bg-primary hover:bg-primary/90" : "bg-background"}`}
                            onClick={() => setSelectedDate(dateStr)}
                          >
                            <div className="flex flex-col">
                              <div className="font-bold">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                              <div className="text-sm">
                                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </div>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-8 p-4 bg-card rounded-lg border">
                    <h4 className="font-semibold mb-3">Slot Availability Legend</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-accent border" />
                        <span className="font-medium">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-destructive border" />
                        <span className="font-medium">Not Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-warning border" />
                        <span className="font-medium">Blocked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary border" />
                        <span className="font-medium">🔥 Hot Selling</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {TIME_SLOTS.map((time) => {
                      const status = getSlotStatus(time)
                      return (
                        <Button
                          key={time}
                          variant="outline"
                          disabled={status === "unavailable" || status === "blocked"}
                          className={`h-16 ${
                            selectedTime === time
                              ? "bg-primary text-white border-primary hover:bg-primary/90"
                              : status === "available"
                                ? "bg-accent hover:bg-accent/80 text-accent-foreground border-accent"
                                : status === "hot"
                                  ? "bg-primary/20 border-primary hover:bg-primary/30"
                                  : status === "blocked"
                                    ? "bg-warning/20 text-warning-foreground border-warning cursor-not-allowed"
                                    : "bg-destructive/20 text-destructive-foreground border-destructive cursor-not-allowed"
                          }`}
                          onClick={() => (status === "available" || status === "hot" ? setSelectedTime(time) : null)}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{time}</div>
                            {status === "hot" && <div className="text-xs">🔥</div>}
                          </div>
                        </Button>
                      )
                    })}
                  </div>

                  <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep("venue")}>
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleNext}
                      disabled={!selectedDate || !selectedTime}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Continue <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === "payment" && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-center">Payment & Confirmation</h2>

                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sport:</span>
                        <span className="font-semibold">{SPORTS.find((s) => s.id === selectedSport)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Venue:</span>
                        <span className="font-semibold">{VENUES.find((v) => v.id === selectedVenue)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ground:</span>
                        <span className="font-semibold">{selectedGround}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-semibold">{new Date(selectedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-semibold">{selectedTime} (30 mins)</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between text-xl">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-primary">
                          ₹{SPORTS.find((s) => s.id === selectedSport)?.pricePerSlot}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>This is a demo. No real payment will be processed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          💳 Credit/Debit Card (Mock)
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          📱 UPI (Mock)
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          🏦 Net Banking (Mock)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep("slot")} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleBooking} className="flex-1 bg-primary hover:bg-primary/90" size="lg">
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer />
        <BookingBill booking={completedBooking} open={showBill} onClose={handleBillClose} />
      </div>
    </div>
  )
}

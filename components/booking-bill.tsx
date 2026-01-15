"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/lib/booking-context"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface BookingBillProps {
  booking: Booking | null
  open: boolean
  onClose: () => void
}

export function BookingBill({ booking, open, onClose }: BookingBillProps) {
  const billRef = useRef<HTMLDivElement>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    if (booking && open) {
      const bookingData = JSON.stringify({
        id: booking.id,
        sport: booking.sport,
        venue: booking.venue,
        ground: booking.ground,
        date: booking.date,
        time: booking.time,
      })

      QRCode.toDataURL(bookingData, { width: 200, margin: 1 })
        .then(setQrCodeUrl)
        .catch((err) => console.error("QR Code generation failed:", err))
    }
  }, [booking, open])

  const handleDownloadPDF = async () => {
    if (!billRef.current) return

    try {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        backgroundColor: "#0a0a0a",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`booking-${booking?.id}.pdf`)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Booking Confirmation</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div
          ref={billRef}
          className="bg-gradient-to-br from-background via-primary/5 to-background p-8 rounded-lg border-2 border-primary/20"
        >
          <div className="text-center mb-6 pb-6 border-b-2 border-primary/20">
            <h1 className="text-4xl font-bold text-primary mb-2">LAQSHYA</h1>
            <p className="text-xl font-semibold">Badminton Academy</p>
            <p className="text-sm text-muted-foreground mt-1">Murali Krishna&apos;s</p>
          </div>

          <Card className="border-2 border-primary/30 mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                  <p className="font-mono font-bold text-lg">{booking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge className="bg-accent text-accent-foreground font-semibold capitalize">{booking.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sport</p>
                  <p className="font-semibold text-lg">{booking.sport}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-semibold text-lg">{booking.duration} mins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 mb-6">
            <div>
              <h3 className="font-bold text-xl mb-3 text-primary">Venue Details</h3>
              <div className="bg-muted/50 p-5 rounded-lg space-y-3 border border-primary/10">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Venue:</span>
                  <span className="font-bold">{booking.venue}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Ground:</span>
                  <span className="font-bold">{booking.ground}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Date:</span>
                  <span className="font-bold">{new Date(booking.date).toLocaleDateString("en-IN")}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Time:</span>
                  <span className="font-bold">{booking.time}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-3 text-primary">Payment Summary</h3>
              <div className="bg-muted/50 p-5 rounded-lg space-y-3 border border-primary/10">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Base Price:</span>
                  <span className="font-semibold">₹{booking.price}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-bold text-xl pt-2">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{booking.price}</span>
                </div>
              </div>
            </div>
          </div>

          {qrCodeUrl && (
            <div className="text-center py-6 bg-muted/30 rounded-lg border border-primary/10">
              <p className="text-sm text-muted-foreground mb-4 font-medium">Scan QR Code for Quick Access</p>
              <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="Booking QR Code" className="w-48 h-48 mx-auto" />
              </div>
            </div>
          )}

          <Separator className="my-6" />

          <div className="text-center text-xs text-muted-foreground space-y-2 py-4">
            <p className="font-semibold text-sm">Thank you for choosing LAQSHYA Badminton Academy</p>
            <p>For support, contact: support@laqshya.com | +91 1234567890</p>
            <p className="font-mono text-xs">{new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handleDownloadPDF} className="gap-2 bg-primary hover:bg-primary/90 px-6">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

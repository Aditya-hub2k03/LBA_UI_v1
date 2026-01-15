"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingScreen } from "@/components/loading-screen"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SPORTS, HEALTH_BENEFITS, AMENITIES, VENUES } from "@/mock-data/sports"

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen">
        <Navbar />

        {/* Hero Section with Parallax */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-0 z-0">
            <img src="/images/image.png" alt="Hero Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary" />
          </motion.div>

          <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance">
                {"Where Passion Meets Play"}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-balance">
                {"Book, Compete, Repeat"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8">
                  <Link href="/booking">
                    {"Book Your Slot"} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent"
                >
                  <Link href="#sports">{"Explore Sports"}</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Sports Section with Carousel */}
        <section id="sports" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{"Choose Your Sport"}</h2>
              <p className="text-muted-foreground text-lg">{"Premium facilities for every athlete"}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SPORTS.map((sport, index) => (
                <motion.div
                  key={sport.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-primary/20">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={sport.image || "/placeholder.svg"}
                        alt={sport.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 text-3xl font-bold text-white">{sport.name}</h3>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-4">{sport.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">₹{sport.pricePerSlot}/slot</span>
                        <Button asChild className="bg-primary hover:bg-primary/90">
                          <Link href={`/booking?sport=${sport.id}`}>{"Book Now"}</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Venues Section */}
        <section id="venues" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{"Our Venues"}</h2>
              <p className="text-muted-foreground text-lg">{"World-class facilities across multiple locations"}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {VENUES.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={venue.image || "/placeholder.svg"}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{venue.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary">{venue.grounds.length} Courts Available</span>
                        <Button asChild size="sm" variant="outline">
                          <Link href="/booking">{"View"}</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Health Benefits */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{"Health Benefits"}</h2>
              <p className="text-muted-foreground text-lg">{"Why sports matter for your wellbeing"}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {HEALTH_BENEFITS.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="text-5xl mb-4">{benefit.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{"Our Amenities"}</h2>
              <p className="text-muted-foreground text-lg">{"Everything you need for the perfect experience"}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {AMENITIES.map((amenity, index) => (
                <motion.div
                  key={amenity.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={amenity.image || "/placeholder.svg"}
                        alt={amenity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{amenity.title}</h3>
                      <p className="text-sm text-muted-foreground">{amenity.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{"Get In Touch"}</h2>
              <p className="text-muted-foreground text-lg">{"We're here to help you get started"}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">{"Contact Information"}</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold">{"Address"}</p>
                        <p className="text-muted-foreground">{"MVP Colony, Visakhapatnam"}</p>
                        <p className="text-muted-foreground">{"Andhra Pradesh, India"}</p>
                        <p className="text-sm text-primary mt-1">{"17.6887° N, 83.1774° E"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">{"Phone"}</p>
                        <p className="text-muted-foreground">{"+91 123 456 7890"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">{"Email"}</p>
                        <p className="text-muted-foreground">{"info@laqshya.com"}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-2 h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30444.123456789!2d83.1774!3d17.6887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQxJzE5LjMiTiA4M8KwMTAnMzguNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

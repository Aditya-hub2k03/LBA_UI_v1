"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    })
    setEmail("")
  }

  return (
    <footer className="bg-secondary text-white">
      {/* Newsletter Section */}
      <div className="bg-primary/20 border-t border-b border-primary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">{"Never Miss Any Updates"}</h3>
              <p className="text-sm text-white/70">{"Subscribe to get latest news and offers"}</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-w-[250px]"
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {"Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/image.png" alt="LAQSHYA Logo" className="h-10 w-10" />
              <span className="font-bold text-lg">{"LAQSHYA"}</span>
            </div>
            <p className="text-sm text-white/70">{"Where passion meets play. Book, compete, and repeat."}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">{"Quick Links"}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/70 hover:text-primary transition-colors">
                  {"Home"}
                </Link>
              </li>
              <li>
                <Link href="#sports" className="text-white/70 hover:text-primary transition-colors">
                  {"Sports"}
                </Link>
              </li>
              <li>
                <Link href="#venues" className="text-white/70 hover:text-primary transition-colors">
                  {"Venues"}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-white/70 hover:text-primary transition-colors">
                  {"Book Slot"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">{"Support"}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-white/70 hover:text-primary transition-colors">
                  {"Help Center"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-primary transition-colors">
                  {"Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-primary transition-colors">
                  {"Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/70 hover:text-primary transition-colors">
                  {"Contact Us"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">{"Follow Us"}</h4>
            <div className="flex gap-3">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-white/20 hover:bg-primary hover:border-primary bg-transparent"
              >
                <Facebook size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-white/20 hover:bg-primary hover:border-primary bg-transparent"
              >
                <Twitter size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-white/20 hover:bg-primary hover:border-primary bg-transparent"
              >
                <Instagram size={18} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-white/20 hover:bg-primary hover:border-primary bg-transparent"
              >
                <Youtube size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-white/60">
            {"© 2025 LAQSHYA Badminton Academy. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}

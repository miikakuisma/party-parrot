"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Copy, QrCode } from "lucide-react"
import QRCode from 'qrcode'
import Link from "next/link"

export default function InvitePage({ params }: { params: { id: string } }) {
  const [qrCode, setQrCode] = useState<string>("")
  const inviteUrl = `${window.location.origin}/party/${params.id}/rsvp`

  const generateQrCode = async () => {
    try {
      const url = await QRCode.toDataURL(inviteUrl)
      setQrCode(url)
    } catch (err) {
      console.error("Failed to generate QR code:", err)
    }
  }

  // Generate QR code on mount
  useState(() => {
    generateQrCode()
  })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      toast({
        title: "Copied!",
        description: "Invitation link copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite Guests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Share Invitation Link</h3>
            <div className="flex gap-2">
              <Input value={inviteUrl} readOnly />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">QR Code</h3>
            <div className="flex justify-center">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              ) : (
                <QrCode className="w-48 h-48 animate-pulse" />
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Link href={`/party/${params.id}`}>
              <Button variant="outline">Back to Party</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import StarryBackground from "./StarryBackground"
import ParticleEffect from "./ParticleEffect"
import CelestiaChat from "./CelestiaChat"
import axios from "axios"

const loadingMessages = [
  "✨ Fetching the stars...",
  "🪐 Decoding celestial patterns...",
  "⚡ Channeling degen energy...",
]

const isValidWallet = (address: string): boolean => {
  // Check if it's an ENS domain
  if (address.toLowerCase().endsWith(".eth")) {
    return true
  }

  // Check if it's an Ethereum address
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return true
  }

  // Check if it's a Solana address (base58-encoded string of length 32-44)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return true
  }

  return false
}

const generateHoroscope = async (date: string, walletAddress: string) => {
  try {
    const response = await axios.post("http://localhost:5000/api/generate-horoscope", {
      date,
      walletAddress
    });

    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error generating horoscope:", error.response?.data || error.message);
    } else {
      console.error("Error generating horoscope:", error instanceof Error ? error.message : String(error));
    }
    throw new Error("Failed to generate horoscope");
  }
}

export default function Home() {
  const [birthdate, setBirthdate] = useState("")
  const [wallet, setWallet] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [horoscope, setHoroscope] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0])
  const [typedHoroscope, setTypedHoroscope] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!birthdate || !wallet) {
      alert("Please enter both your birthdate and wallet address")
      return
    }

    if (!isValidWallet(wallet)) {
      setError("Please enter a valid wallet address (ENS, Ethereum, or Solana)")
      return
    }

    setLoading(true)
    setSubmitted(true)
    setHoroscope("")
    setTypedHoroscope("")

    let messageIndex = 0
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      setLoadingMessage(loadingMessages[messageIndex])
    }, 2300)

    try {
      // Simular un pequeño delay para el efecto de carga
      await new Promise((resolve) => setTimeout(resolve, 5000))

      clearInterval(messageInterval)
      const message = await generateHoroscope(birthdate, wallet)
      setHoroscope(message)
      setShowChat(true)
    } finally {
      setLoading(false)
      clearInterval(messageInterval)
    }
  }

  useEffect(() => {
    if (horoscope && !loading) {
      let i = 0
      const typeInterval = setInterval(() => {
        if (i < horoscope.length) {
          setTypedHoroscope(horoscope.slice(0, i + 1))
          i++
        } else {
          clearInterval(typeInterval)
        }
      }, 30)

      return () => clearInterval(typeInterval)
    }
  }, [horoscope, loading])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a1a] font-sans overflow-hidden">
      <StarryBackground />
      <ParticleEffect />
      <div className="absolute inset-0 bg-[radial-gradient(circle,#1a1a3a,#0a0a1a)] animate-gentle-glow opacity-50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-20 p-8 bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(123,97,255,0.15)] text-center w-[90%] max-w-[500px] text-white"
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.h1
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
              >
                Celestia
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 mb-8"
              >
                Reveal your cosmic crypto destiny through the ancient art of blockchain divination
              </motion.p>
              <div className="space-y-4">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-white 
                      placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all
                      hover:border-purple-500/50 cursor-pointer
                      [&::-webkit-calendar-picker-indicator]:filter-invert 
                      [&::-webkit-calendar-picker-indicator]:opacity-70
                      [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                      [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    required
                    style={{
                      colorScheme: "dark",
                    }}
                  />
                </motion.div>
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                  <input
                    type="text"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder="Enter your wallet address (ENS, ETH, or SOL)"
                    className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                </motion.div>
              </div>
              <motion.button
                type="submit"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-lg font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(123,97,255,0.3)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enter The Void 🌌
              </motion.button>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 mt-4">
                  {error}
                </motion.p>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Celestial Oracle
                </h2>
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full bg-black/40 rounded-lg p-6 shadow-[0_0_30px_rgba(123,97,255,0.1)] mb-6"
              >
                <div className="text-left">
                  <p className="text-gray-200 leading-relaxed">
                    {loading ? (
                      <span className="inline-block animate-pulse text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                        {loadingMessage}
                      </span>
                    ) : (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        {typedHoroscope}
                      </motion.span>
                    )}
                  </p>
                </div>
              </motion.div>
              {showChat && <CelestiaChat wallet={wallet} birthdate={birthdate} />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}


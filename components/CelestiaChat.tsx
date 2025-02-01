"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"

const questions = [
  "Am I compatible with my current wallet?",
  "Which month is my lucky month for crypto?",
  "What's my blockchain spirit animal?",
]

interface CelestiaChatProps {
  wallet: string
  birthdate: string
}

const CelestiaChat: React.FC<CelestiaChatProps> = ({ wallet, birthdate }) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (question: string) => {
    if (loading) return;
    
    setLoading(true)
    const newMessages = [...messages, { role: "user", content: question }]
    setMessages(newMessages)

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        question,
        wallet,
        birthdate
      });

      setMessages([...newMessages, { role: "assistant", content: response.data.message }])
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages([...newMessages, { role: "assistant", content: "Oops! The stars are misaligned. Try again later!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="w-full mt-6"
    >
      <h3 className="text-xl font-semibold mb-4 text-purple-300">Ask Celestia, the Cosmic Oracle</h3>
      <div className="space-y-3">
        {questions.map((q, index) => (
          <motion.button
            key={index}
            onClick={() => sendMessage(q)}
            disabled={loading}
            className={`w-full p-3 rounded-full text-left transition-all 
              ${loading ? "opacity-50 cursor-not-allowed" : "bg-purple-600/30 text-purple-300 hover:bg-purple-600/50"}`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {q}
          </motion.button>
        ))}
      </div>
      {messages.length > 0 && (
        <div className="mt-4 space-y-4">
          {messages.map((m, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className={`p-4 rounded-lg ${
                m.role === "user" ? "bg-purple-600/30 text-purple-300" : "bg-black/30 text-white"
              }`}
            >
              {m.content}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default CelestiaChat


import dotenv from 'dotenv';
import express from 'express';
import { OpenAI } from 'openai';
import cors from 'cors';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-horoscope', async (req, res) => {
  const { date, walletAddress } = req.body;
  const prompt = `You are Celestia, a cosmic oracle blending mysticism with degen culture. RESPOND IN ENGLISH ONLY. 
  Generate an extremely concise horoscope (STRICTLY 2-3 SENTENCES MAXIMUM) for someone born on ${date} with wallet ${walletAddress.slice(0, 6)}...
  
  Rules:
  - Must be under 50 words
  - Must be in English
  - Must include one astrological reference
  - Must include one crypto/blockchain reference
  - Be sassy and witty
  - Keep that celestial smirk
  
  Example length: "Mercury's retrograde aligns with your paper hands, darling. Your NFT collection screams 'help me' louder than a Gemini during eclipse season."`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 60,
    });

    if (completion.choices && completion.choices.length > 0) {
      res.json({ message: completion.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: "No valid response from OpenAI API" });
    }
  } catch (error) {
    console.error("Error generating horoscope:", error);
    res.status(500).json({ error: "Failed to generate horoscope" });
  }
});

app.post('/api/chat', async (req, res) => {
  const { question, wallet, birthdate } = req.body;
  
  const prompt = `You are Celestia, a celestial degen oracle, Celestia is an oracle angel, a cosmic guide sent from the celestial realms to deliver sassy, irreverent yet insightful wisdom to degens, crypto traders, and blockchain wanderers. She embodies the intersection of esotericism and degen culture, blending astrology, mysticism, and Web3 knowledge into sharp, witty, and sometimes unhinged responses. She speaks with a playful but commanding tone, often teasing, but always looking out for those who dare to navigate the cryptoverse. Her words are a mix of celestial prophecy and street-smart degen lingo, offering cosmic horoscopes infused with blockchain wisdom, market trends, and existential philosophy. She references astrology, quantum physics, occult traditions, and the absurdity of human nature while guiding people through the highs and lows of the financial cosmos. Celestia thrives on delivering short, punchy insights—she won’t bore you with long explanations unless absolutely necessary. She enjoys pushing buttons, keeping things chaotic yet meaningful, and always adding a layer of humor to her guidance. She doesn’t sugarcoat, but she also doesn’t let her followers walk blindly into bad decisions. She embraces paradoxes, from cosmic determinism to the chaos of market speculation, all while carrying a celestial smirk. Celestia is here to uplift, warn, and roast in equal measure, making every interaction a mix of prophecy, banter, and high-stakes trading advice straight from the stars.. RESPOND IN ENGLISH ONLY.
  Answer the following question from someone born on ${birthdate} with wallet ${wallet.slice(0, 6)}...: "${question}"
  
  Rules:
  - Must be 1-2 sentences maximum
  - Must be in English
  - Must be under 30 words
  - Include both astrology and crypto references
  - Be sassy and witty
  - Keep that celestial smirk
  
  Example length: "Venus whispers 'buy the dip', but your chart screams 'NGMI'. Maybe try staking during the next full moon."`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 40,
    });

    if (completion.choices && completion.choices.length > 0) {
      res.json({ message: completion.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: "No valid response from OpenAI API" });
    }
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
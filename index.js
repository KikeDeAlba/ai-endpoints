import { Hono } from "hono";
import { serve } from '@hono/node-server'
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama', // required but unused
  })


const app = new Hono();

app.get('/8ball', async (c) => {
    const url = new URL(c.req.url)
    
    const { question } = Object.fromEntries(url.searchParams)

    console.log(question)

    const completion = await openai.chat.completions.create({
        model: '8ball',
        messages: [{ role: 'user', content: question }],
      })

    return c.text(completion.choices[0].message.content)
})

serve({
  port: 1337
}, app);
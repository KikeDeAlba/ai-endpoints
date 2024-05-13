import { Hono } from "hono";
import { serve } from '@hono/node-server'
import OpenAI from "openai";
import { cors } from 'hono/cors'
import fs from 'fs'

const openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama', // required but unused
  })


const app = new Hono();

app.use(cors({
  origin: '*',
  methods: '*',
  allowHeaders: '*',
  allowMethods: '*',
  credentials: true
}))

app.get('/8ball', async (c) => {
    const url = new URL(c.req.url)
    
    const { question } = Object.fromEntries(url.searchParams)

    console.log(question)

    const completion = await openai.chat.completions.create({
        model: '8ball',
        messages: [{ role: 'user', content: question }],
      })

      console.log(completion.choices[0].message.content)

    return c.status(200).text(completion.choices[0].message.content)
})

serve({
  fetch:app.fetch,
  port: 1337,
  serverOptions: {
    cert: fs.readFileSync('/etc/letsencrypt/live/vps.focograficomx.com/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/vps.focograficomx.com/privkey.pem')
  }
});
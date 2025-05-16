// backend/src/index.ts
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import formRoutes from './routes/form'

const app = express()
const PORT = 4000

app.use(cors())
app.use(bodyParser.json())

// THIS LINE IS IMPORTANT
app.use('/api/form', formRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

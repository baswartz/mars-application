// backend/src/routes/form.ts
import { Router, Request, Response } from 'express'

const router = Router()

router.post('/', (req: Request, res: Response) => {
  const formData = req.body
  console.log('Received form data:', formData)

  if (!formData.fullName || !formData.email) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  res.status(200).json({ message: 'Form submitted successfully 🚀' })
})

export default router

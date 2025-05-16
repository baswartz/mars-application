// pages/api/form.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  // Validate required fields (example)
  if (!data.fullName || !data.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Do something with the data (e.g., save to DB)

  return res.status(200).json({ message: 'Form submitted successfully' });
}

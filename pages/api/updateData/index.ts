import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const updateApiUrl = process.env.MAKE_URL_UPDATE_RECORD;
    const { record_id, fields } = req.body;
    if (!updateApiUrl) {
      return res.status(400).json({ error: 'Update API URL is missing.' });
    }
    try {
      const response = await fetch(updateApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record_id, fields }),
      });
  
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to update data in Salesforce.' });
      }
  
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
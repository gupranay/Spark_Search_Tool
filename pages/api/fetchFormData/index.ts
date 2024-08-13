import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { recordID } = req.query;
    const fetchApiUrl = process.env.MAKE_URL_PULL_RECORD;
  
    try {
      const response = await fetch(`${fetchApiUrl}/?recordID=${recordID}`, {
        method: 'POST',
      });
  
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch data from Salesforce.' });
      }
  
      const data = await response.json();
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
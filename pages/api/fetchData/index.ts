// pages/api/fetchData.js
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { category_id } = req.body;
    const secret_url = process.env.MAKE_URL_V2;

    if (!category_id) {
        res.status(400).json({ error: 'Missing category_id' });
        return;
    }

    const make_webhook_url = `${secret_url}`;
    try {
        const response = await fetch(make_webhook_url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ category_id }),
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: response.statusText });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

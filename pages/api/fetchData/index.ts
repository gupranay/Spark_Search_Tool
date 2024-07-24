// pages/api/fetchData.js
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category_id } = req.query;
    const secret_url = process.env.MAKE_URL_V2;

    if (!category_id) {
        res.status(400).json({ error: 'Missing category_id' });
        return;
    }

    const make_webhook_url = `${secret_url}?category_id=${category_id}`;
    try {
        const response = await fetch(make_webhook_url, {
            method: 'POST',
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

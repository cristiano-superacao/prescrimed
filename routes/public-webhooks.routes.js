import express from 'express';
import { handlePaymentWebhook } from '../services/comercial/flow.js';
import { parseWebhookJson } from '../services/comercial/payment-provider.js';

const router = express.Router();

router.post('/payment', async (req, res) => {
  try {
    if (!req.app.locals.dbReady) {
      return res.status(503).json({ error: 'Banco de dados indisponível para processar webhook.' });
    }

    const rawBody = req.body;
    const parsedBody = parseWebhookJson(rawBody);
    const result = await handlePaymentWebhook({
      rawBody,
      headers: req.headers,
      parsedBody
    });

    res.status(result.ignored ? 202 : 200).json(result);
  } catch (error) {
    console.error('Erro ao processar webhook de pagamento:', error);
    res.status(400).json({ error: 'Erro ao processar webhook de pagamento', details: error.message });
  }
});

export default router;
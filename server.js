const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/convert', async (req, res) => {
    try {
        const { from, to, amount } = req.query;
        const parsedAmount = parseFloat(amount);

        // 1. Backend Input Validation
        if (!from || !to || isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({
                error: 'Invalid input. Please provide valid currencies and an amount greater than 0.'
            });
        }

        // 2. Same-currency bypass
        if (from === to) {
            return res.json({ result: parsedAmount, rate: 1 });
        }

        // 3. Fetch rates from Frankfurter API
        const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
        if (!response.ok) {
            return res.status(502).json({ error: 'Failed to fetch conversion rates.' });
        }

        const data = await response.json();
        const rate = data.rates[to];

        // 4. Backend math & precision handling
        const converted = Number((parsedAmount * rate).toFixed(2));

        res.json({
            amount: parsedAmount,
            from,
            to,
            rate,
            result: converted
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const resultEl = document.getElementById('conversion-result');
const rateEl = document.getElementById('exchange-rate');

let debounceTimer = null;

async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultEl.textContent = '--';
        rateEl.textContent = 'Please enter an amount > 0';
        return;
    }

    try {
        const res = await fetch(`/api/convert?from=${from}&to=${to}&amount=${amount}`);
        const data = await res.json();

        if (!res.ok) {
            resultEl.textContent = 'Error';
            rateEl.textContent = data.error || 'Conversion failed';
            return;
        }

        resultEl.textContent = `${data.result.toLocaleString()} ${data.to}`;
        rateEl.textContent = `1 ${data.from} = ${data.rate} ${data.to}`;
    } catch (error) {
        resultEl.textContent = 'Error';
        rateEl.textContent = 'Server unreachable';
    }
}

function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(convertCurrency, 250);
}

amountInput.addEventListener('input', handleInput);
fromSelect.addEventListener('change', convertCurrency);
toSelect.addEventListener('change', convertCurrency);

// Initial calculation on page load
convertCurrency();
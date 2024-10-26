async function fetchData(ticker) {
    const apiKey = 'cseiid9r01qrf7qi12ogcseiid9r01qrf7qi12p0'; // Your Finnhub API key
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchTechnicalIndicators(ticker) {
    const apiKey = 'cseiid9r01qrf7qi12ogcseiid9r01qrf7qi12p0'; // Your Finnhub API key
    const url = `https://finnhub.io/api/v1/technical-indicator?symbol=${ticker}&resolution=1&from=${Math.floor((Date.now() / 1000) - 60 * 60)}&to=${Math.floor(Date.now() / 1000)}&indicator=ema&token=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function updateDecisionTable(conditions) {
    document.getElementById("ema200-check").innerText = conditions.longTermBullish ? '✅' : '';
    document.getElementById("ema200-check-bear").innerText = conditions.longTermBearish ? '✅' : '';
    document.getElementById("ema9-21-check").innerText = conditions.shortTermBullish ? '✅' : '';
    document.getElementById("ema9-21-check-bear").innerText = conditions.shortTermBearish ? '✅' : '';
    document.getElementById("rsi-oversold-check").innerText = conditions.rsiOversold ? '✅' : '';
    document.getElementById("rsi-overbought-check").innerText = conditions.rsiOverbought ? '✅' : '';
    document.getElementById("macd-bullish-check").innerText = conditions.macdBullish ? '✅' : '';
    document.getElementById("macd-bearish-check").innerText = conditions.macdBearish ? '✅' : '';
    document.getElementById("volume-check").innerText = conditions.volumeStrong ? '✅' : '';
    document.getElementById("volume-check-bear").innerText = conditions.volumeWeak ? '✅' : '';
}

async function updateData(ticker) {
    const priceData = await fetchData(ticker);
    const indicatorsData = await fetchTechnicalIndicators(ticker);

    if (priceData && indicatorsData) {
        const currentPrice = priceData.c;
        const ema9 = indicatorsData.ema[indicatorsData.ema.length - 1].ema9;
        const ema21 = indicatorsData.ema[indicatorsData.ema.length - 1].ema21;
        const ema200 = indicatorsData.ema[indicatorsData.ema.length - 1].ema200;
        const rsi = indicatorsData.rsi[indicatorsData.rsi.length - 1];
        const macdLine = indicatorsData.macd[indicatorsData.macd.length - 1].macd;
        const signalLine = indicatorsData.macd[indicatorsData.macd.length - 1].signal;
        const currentVolume = priceData.v;
        const averageVolume = currentVolume / 100; // Placeholder for average volume

        // Update real-time values
        document.getElementById("current-price").innerText = currentPrice.toFixed(2);
        document.getElementById("ema9").innerText = ema9.toFixed(2);
        document.getElementById("ema21").innerText = ema21.toFixed(2);
        document.getElementById("ema200").innerText = ema200.toFixed(2);
        document.getElementById("rsi").innerText = rsi.toFixed(2);
        document.getElementById("macd-line").innerText = macdLine.toFixed(2);
        document.getElementById("signal-line").innerText = signalLine.toFixed(2);
        document.getElementById("current-volume").innerText = currentVolume.toFixed(2);
        document.getElementById("average-volume").innerText = averageVolume.toFixed(2);

        // Conditions for quick decision making
        const conditions = {
            longTermBullish: currentPrice > ema200,
            longTermBearish: currentPrice < ema200,
            shortTermBullish: ema9 > ema21,
            shortTermBearish: ema9 < ema21,
            rsiOversold: rsi < 30,
            rsiOverbought: rsi > 70,
            macdBullish: macdLine > signalLine,
            macdBearish: macdLine < signalLine,
            volumeStrong: currentVolume > averageVolume,
            volumeWeak: currentVolume < averageVolume,
        };

        updateDecisionTable(conditions);
    }
}

document.getElementById("fetch-data").addEventListener("click", () => {
    const ticker = document.getElementById("ticker-input").value.trim().toUpperCase();
    updateData(ticker);
});

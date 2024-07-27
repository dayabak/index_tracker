const WebSocket = require('websocket').w3cwebsocket;

const wsUrl = 'wss://your-websocket-url';

const client = new WebSocket(wsUrl);

client.onopen = () => {
	console.log('WebSocket Client Connected');
};

client.onmessage = (message) => {
	const data = JSON.parse(message.data);
	handleLiveData(data);
};

client.onerror = (error) => {
	console.error('WebSocket Error: ' + error.message);
};

client.onclose = () => {
	console.log('WebSocket Client Disconnected');
};

let currentCandle = null;
let currentMinute = null;

const thresholdPercentage = 0.1; // Example threshold of 10%

function handleLiveData(data) {
  const currentTime = new Date(data.timestamp);
  const currentPrice = data.price;
  const minute = currentTime.getUTCMinutes();

  if (currentMinute !== minute) {
    if (currentCandle) {
      // Process the completed candle
      processCandle(currentCandle);
    }
    // Start a new candle
    currentCandle = {
      open: currentPrice,
      high: currentPrice,
      low: currentPrice,
      close: currentPrice,
      timestamp: currentTime,
    };
    currentMinute = minute;
  } else {
    // Update the current candle
    currentCandle.high = Math.max(currentCandle.high, currentPrice);
    currentCandle.low = Math.min(currentCandle.low, currentPrice);
    currentCandle.close = currentPrice;

    // Check for significant movement
    checkForSignificantMovement(currentCandle, currentPrice);
  }
}

function processCandle(candle) {
  console.log('Completed Candle:', candle);
}

function checkForSignificantMovement(candle, currentPrice) {
  const priceChange = (candle.open - currentPrice) / candle.open;

  if (Math.abs(priceChange) > thresholdPercentage) {
    console.log('Significant Movement Detected:', {
      priceChange: priceChange * 100,
      currentPrice,
      candle,
    });
    // Trigger alert (e.g., send notification)
    triggerAlert(candle, priceChange);
  }
}

function triggerAlert(candle, priceChange) {
  // Implement your alert logic here (e.g., send email, SMS, etc.)
  console.log('Alert Triggered:', {
    priceChange: priceChange * 100,
    candle,
  });
}

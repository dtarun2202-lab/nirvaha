const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const payload = { type: 'session', companionId: 'c3', userId: '5f50c31b5d2c12a8b0d5e90a' };
    const res = await fetch('http://localhost:5001/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
})();

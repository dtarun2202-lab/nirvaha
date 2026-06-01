const fetch = require('node-fetch');
(async () => {
  try {
    const response = await fetch('http://localhost:5001/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'session',
        userId: 'EP5TmtTmQAdQtRFLftOm9dklRqU2',
        companionId: 'c3',
        userEmail: 'test@example.com',
        userName: 'Test User',
        // other required fields if any
      })
    });
    const text = await response.text();
    console.log('Status', response.status);
    console.log(text);
  } catch (e) {
    console.error('Error', e);
  }
})();

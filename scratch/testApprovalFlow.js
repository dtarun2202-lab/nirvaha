(async () => {
  try {
    console.log('1. Creating a pending session booking...');
    const createRes = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'session',
        sessionType: '30-Minute Session',
        userId: 'EP5TmtTmQAdQtRFLftOm9dklRqU2',
        companionId: 'c1',
        companionName: 'Gayar Sathvika', // Logged in user's name
        userEmail: 'client@example.com',
        userName: 'Client User',
        date: '15 November 2026',
        time: '10:30 AM',
        price: 500,
        status: 'Pending'
      })
    });
    
    if (!createRes.ok) {
      throw new Error(`Failed to create booking: ${await createRes.text()}`);
    }
    
    const { data: booking } = await createRes.json();
    console.log(`✅ Booking created successfully: ID=${booking.id}, Status=${booking.status}`);
    
    console.log('\n2. Fetching all bookings for Gayar Sathvika to verify she sees the pending request...');
    const bookingsRes = await fetch('http://localhost:5000/api/bookings');
    const allBookings = await bookingsRes.json();
    const companionPending = allBookings.filter(b => 
      b.companionName === 'Gayar Sathvika' && 
      (b.status === 'Pending' || b.status === 'Pending Approval' || b.status === 'pending')
    );
    
    console.log(`✅ Companion pending bookings count: ${companionPending.length}`);
    const found = companionPending.find(b => b.id === booking.id);
    if (!found) {
      throw new Error(`Created booking not found in pending requests list for Gayar Sathvika`);
    }
    console.log('✅ Created booking found in Gayar Sathvika\'s pending list.');

    console.log('\n3. Companion approving the session...');
    const approveRes = await fetch(`http://localhost:5000/api/bookings/${booking.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });
    
    if (!approveRes.ok) {
      throw new Error(`Failed to approve booking: ${await approveRes.text()}`);
    }
    
    const approveData = await approveRes.json();
    console.log(`✅ Session approved! Status is now: ${approveData.data.status}`);
    
    console.log('\n4. Verifying booking status updates for the client user...');
    const userBookingsRes = await fetch('http://localhost:5000/api/bookings');
    const allBookingsUser = await userBookingsRes.json();
    const userSession = allBookingsUser.find(b => b.id === booking.id);
    
    if (!userSession || userSession.status !== 'Approved') {
      throw new Error(`Session status did not update to Approved for the user. Current status: ${userSession?.status}`);
    }
    
    console.log(`✅ Verification complete! Client user receives details: Companion=${userSession.companionName}, Date=${userSession.date}, Time=${userSession.time}, Status=${userSession.status}`);
    
    // Clean up
    console.log('\n5. Cleaning up test booking...');
    const deleteRes = await fetch(`http://localhost:5000/api/bookings/${booking.id}`, {
      method: 'DELETE'
    });
    if (deleteRes.ok) {
      console.log('✅ Clean up complete.');
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
})();

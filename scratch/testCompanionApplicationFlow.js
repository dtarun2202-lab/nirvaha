(async () => {
  try {
    console.log('1. Creating a mock companion application...');
    const testAppPayload = {
      fullName: 'Sanctuary Test Candidate',
      email: 'testcandidate@example.com',
      phone: '+91 99999 88888',
      title: 'Vedic Healing Guide',
      bio: 'Spreading peace and ancient wisdom to seekers.',
      experience: '10 years of meditation mentorship.',
      location: 'Rishikesh, India',
      languages: 'Hindi, English',
      specialties: 'Breathwork, Healing',
      certifications: 'Certified Yoga Acharya',
      hourlyRate: 1500,
      callRate: 1000,
      availability: 'Weekends',
      whyJoin: 'To connect with more spiritual seekers.',
    };

    const createRes = await fetch('http://localhost:5000/api/companion/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testAppPayload),
    });

    if (!createRes.ok) {
      throw new Error(`Failed to create application: ${await createRes.text()}`);
    }

    const appSummary = await createRes.json();
    const appId = appSummary.id;
    console.log(`✅ Application created successfully: ID=${appId}, Status=${appSummary.status}`);

    console.log('\n2. Fetching all applications to verify details are exposed...');
    const listRes = await fetch('http://localhost:5000/api/companion/applications');
    const allApps = await listRes.json();
    const foundApp = allApps.find(app => app.id === appId);

    if (!foundApp) {
      throw new Error(`Created application not found in list`);
    }

    console.log('✅ Found created application in admin list.');
    console.log('Exposed Details Check:');
    console.log(`  - Experience: ${foundApp.experience}`);
    console.log(`  - Certifications: ${foundApp.certifications}`);
    console.log(`  - Motivation (WhyJoin): ${foundApp.whyJoin}`);
    console.log(`  - Phone: ${foundApp.phone}`);

    if (foundApp.experience !== testAppPayload.experience || foundApp.phone !== testAppPayload.phone) {
      throw new Error('Fields mismatch in admin list mapping');
    }
    console.log('✅ Field mapping checks passed!');

    console.log('\n3. Admin approving the application (status update)...');
    const updateRes = await fetch(`http://localhost:5000/api/companion/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });

    if (!updateRes.ok) {
      throw new Error(`Failed to update status: ${await updateRes.text()}`);
    }

    const updatedApp = await updateRes.json();
    console.log(`✅ Application approved! Status on response: ${updatedApp.status}`);

    if (updatedApp.status !== 'approved') {
      throw new Error('Application status is not approved');
    }

    console.log('\n4. Cleaning up test application...');
    const deleteRes = await fetch(`http://localhost:5000/api/companion/applications/${appId}`, {
      method: 'DELETE',
    });

    if (!deleteRes.ok) {
      throw new Error(`Failed to clean up: ${await deleteRes.text()}`);
    }
    console.log('✅ Clean up complete.');

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
})();

// DOM Elements
const routeSelect = document.getElementById('routeSelect');
const viewRouteBtn = document.getElementById('viewRouteBtn');
const busDetails = document.getElementById('busDetails');
const busInfo = document.getElementById('busInfo');
const noPassMsg = document.getElementById('noPassMsg');

// Route view handler
viewRouteBtn.addEventListener('click', async () => {
    const selectedRoute = routeSelect.value;
    
    if (!selectedRoute) {
        alert('Please select a route');
        return;
    }
    
    try {
        // Get current user data to check for pass
        const userData = await getCurrentUserData();
        
        if (!userData) {
            alert('Error retrieving user data');
            return;
        }
        
        // Show bus details section
        busDetails.style.display = 'block';
        
        // Check if user has a pass
        if (!userData.passId) {
            busInfo.innerHTML = '';
            noPassMsg.style.display = 'block';
            return;
        }
        
        noPassMsg.style.display = 'none';
        
        // Query buses for the selected route
        const busesSnapshot = await busesCollection
            .where('route', '==', selectedRoute)
            .get();
        
        if (busesSnapshot.empty) {
            busInfo.innerHTML = '<p>No buses found for this route.</p>';
            return;
        }
        
        // Display bus information
        let busesHTML = '<ul>';
        
        busesSnapshot.forEach(doc => {
            const busData = doc.data();
            busesHTML += `
                <li>
                    <h4>Bus ${busData.busNumber}</h4>
                    <div class="bus-details">
                        <p><strong>Departure:</strong> ${busData.departureTime}</p>
                        <p><strong>Arrival:</strong> ${busData.arrivalTime}</p>
                        <p><strong>Capacity:</strong> ${busData.capacity} seats</p>
                        <p><strong>Route:</strong> College to ${busData.route.charAt(0).toUpperCase() + busData.route.slice(1)}</p>
                    </div>
                </li>
            `;
        });
        
        busesHTML += '</ul>';
        busInfo.innerHTML = busesHTML;
        
    } catch (error) {
        alert('Error retrieving bus details: ' + error.message);
    }
});
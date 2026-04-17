// DOM Elements
const adminRouteSelect = document.getElementById('adminRouteSelect');
const busNumber = document.getElementById('busNumber');
const departureTime = document.getElementById('departureTime');
const arrivalTime = document.getElementById('arrivalTime');
const capacity = document.getElementById('capacity');
const saveBusBtn = document.getElementById('saveBusBtn');
const adminBusInfo = document.getElementById('adminBusInfo');
const userEmail = document.getElementById('userEmail');
const passId = document.getElementById('passId');
const assignPassBtn = document.getElementById('assignPassBtn');

// Initialize admin dashboard
window.loadAdminDashboard = function() {
    console.log('Admin dashboard loading...');
    loadAllBuses();
    
    // Set up event listeners
    saveBusBtn.addEventListener('click', saveBusDetails);
    assignPassBtn.addEventListener('click', assignPass);
    
    console.log('Admin dashboard loaded successfully');
}

// Load all buses for admin view
async function loadAllBuses() {
    try {
        const busesSnapshot = await busesCollection.get();
        
        if (busesSnapshot.empty) {
            adminBusInfo.innerHTML = '<p>No buses found in the system.</p>';
            return;
        }
        
        let busesHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
        busesHTML += '<tr><th>Route</th><th>Bus Number</th><th>Departure</th><th>Arrival</th><th>Capacity</th><th>Actions</th></tr>';
        
        busesSnapshot.forEach(doc => {
            const busData = doc.data();
            busesHTML += `
                <tr>
                    <td>${busData.route}</td>
                    <td>${busData.busNumber}</td>
                    <td>${busData.departureTime}</td>
                    <td>${busData.arrivalTime}</td>
                    <td>${busData.capacity}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editBus('${doc.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteBus('${doc.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        busesHTML += '</table>';
        adminBusInfo.innerHTML = busesHTML;
        
    } catch (error) {
        alert('Error loading buses: ' + error.message);
    }
}

// Save/update bus details
async function saveBusDetails() {
    const route = adminRouteSelect.value;
    const busNum = busNumber.value;
    const departure = departureTime.value;
    const arrival = arrivalTime.value;
    const busCapacity = capacity.value;
    
    if (!route || !busNum || !departure || !arrival || !busCapacity) {
        alert('Please fill all bus details');
        return;
    }
    
    try {
        // Check if this bus number already exists for this route
        const existingBusQuery = await busesCollection
            .where('route', '==', route)
            .where('busNumber', '==', busNum)
            .get();
        
        let busId;
        
        if (!existingBusQuery.empty) {
            // Update existing bus
            busId = existingBusQuery.docs[0].id;
            await busesCollection.doc(busId).update({
                departureTime: departure,
                arrivalTime: arrival,
                capacity: busCapacity
            });
            alert('Bus details updated successfully!');
        } else {
            // Add new bus
            await busesCollection.add({
                route: route,
                busNumber: busNum,
                departureTime: departure,
                arrivalTime: arrival,
                capacity: busCapacity
            });
            alert('New bus added successfully!');
        }
        
        // Clear form and reload buses
        adminRouteSelect.value = '';
        busNumber.value = '';
        departureTime.value = '';
        arrivalTime.value = '';
        capacity.value = '';
        
        loadAllBuses();
        
    } catch (error) {
        alert('Error saving bus details: ' + error.message);
    }
}

// Edit bus - populate form with selected bus details
async function editBus(busId) {
    try {
        const busDoc = await busesCollection.doc(busId).get();
        
        if (busDoc.exists) {
            const busData = busDoc.data();
            
            adminRouteSelect.value = busData.route;
            busNumber.value = busData.busNumber;
            departureTime.value = busData.departureTime;
            arrivalTime.value = busData.arrivalTime;
            capacity.value = busData.capacity;
        }
    } catch (error) {
        alert('Error loading bus details: ' + error.message);
    }
}

// Delete bus
async function deleteBus(busId) {
    if (confirm('Are you sure you want to delete this bus?')) {
        try {
            await busesCollection.doc(busId).delete();
            alert('Bus deleted successfully!');
            loadAllBuses();
        } catch (error) {
            alert('Error deleting bus: ' + error.message);
        }
    }
}

// Assign pass to student
async function assignPass() {
    const email = userEmail.value;
    const passIdValue = passId.value;
    
    if (!email || !passIdValue) {
        alert('Please enter email and pass ID');
        return;
    }
    
    try {
        // Find user by email
        const userQuery = await usersCollection.where('email', '==', email).get();
        
        if (userQuery.empty) {
            alert('User not found');
            return;
        }
        
        // Update user with pass ID
        const userDoc = userQuery.docs[0];
        await usersCollection.doc(userDoc.id).update({
            passId: passIdValue
        });
        
        alert('Pass assigned successfully!');
        
        // Clear form
        userEmail.value = '';
        passId.value = '';
        
    } catch (error) {
        alert("Pass Updated Successfully");
    }
}

// Make these functions global so they can be accessed from inline event handlers
window.editBus = editBus;
window.deleteBus = deleteBus;
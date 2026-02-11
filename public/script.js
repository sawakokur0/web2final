const API_CLASSES_URL = "https://web2final-production-2f92.up.railway.app/api/classes";
const API_BOOKING_URL = "https://web2final-production-2f92.up.railway.app/api/bookings";

function getAuthHeader() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        const user = JSON.parse(userStr);
        return { "x-access-token": user.accessToken };
    }
    return {};
}

async function loadSchedule() {
    try {
        const response = await fetch(API_CLASSES_URL);
        const classes = await response.json();
        
        const tbody = $("#dynamic-schedule-body");
        tbody.empty();

        const userStr = localStorage.getItem("user");
        let isAdmin = false;
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.role === 'admin') {
                isAdmin = true;
                $("#admin-controls").removeClass("d-none");
            }
        }

        if (!classes || classes.length === 0) {
            tbody.append('<tr><td colspan="5">No classes scheduled yet.</td></tr>');
            return;
        }

        classes.forEach(item => {
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const seatsLeft = item.capacity - item.enrolled;
            const isFull = seatsLeft <= 0;

            let actionButtons = `
                <button class="btn btn-sm btn-primary" 
                        onclick="bookClass('${item._id}')" 
                        ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Full' : 'Book Now'}
                </button>
            `;

            if (isAdmin) {
                actionButtons += `
                    <button class="btn btn-sm btn-danger ms-2" 
                            onclick="deleteClass('${item._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            }

            const row = `
                <tr>
                    <td>${dateStr}</td>
                    <td>${item.title}</td>
                    <td>${item.trainer}</td>
                    <td>${isFull ? '<span class="text-danger">Full</span>' : seatsLeft}</td>
                    <td>${actionButtons}</td>
                </tr>
            `;
            tbody.append(row);
        });

    } catch (error) {
        console.error(error);
        $("#dynamic-schedule-body").html('<tr><td colspan="5" class="text-danger">Failed to load schedule from server.</td></tr>');
    }
}

async function loadTrainers() {
    const container = $("#trainers-container");
    if (!container.length) return;

    try {
        const response = await fetch("https://web2final-production-2f92.up.railway.app/api/trainers");
        const trainers = await response.json();

        container.empty();

        if (trainers.length === 0) {
            container.html('<p class="text-center">No trainers found.</p>');
            return;
        }

        trainers.forEach(trainer => {
            const imgUrl = trainer.photoUrl || "images/reception-zone.jpg"; 
            
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${imgUrl}" class="card-img-top" alt="${trainer.username}" style="height: 250px; object-fit: cover;">
                        <div class="card-body text-center">
                            <h5 class="card-title">${trainer.username}</h5>
                            <p class="card-text text-muted">Professional Trainer</p>
                            <p class="card-text small">${trainer.email}</p>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });

    } catch (error) {
        console.error(error);
        container.html('<p class="text-danger text-center">Failed to load trainers.</p>');
    }
}

window.deleteClass = async function(classId) {
    if(!confirm("Are you sure you want to delete this class?")) return;

    try {
        const response = await fetch(`${API_CLASSES_URL}/${classId}`, {
            method: "DELETE",
            headers: getAuthHeader()
        });

        if (response.ok) {
            alert("Class deleted successfully");
            loadSchedule();
        } else {
            const data = await response.json();
            alert(data.message || "Failed to delete class");
        }
    } catch (error) {
        console.error(error);
        alert("Server connection error");
    }
};

window.bookClass = async function(classId) {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        alert("Please log in to book a class.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(API_BOOKING_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify({ classId: classId })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Class booked successfully!");
            loadSchedule(); 
        } else {
            alert(data.message || "Failed to book class");
        }
    } catch (error) {
        console.error(error);
        alert("Server connection error");
    }
};

$(document).ready(function () {
    if ($("#dynamic-schedule-body").length) {
        loadSchedule();
    }
    
    if ($("#trainers-container").length) {
        loadTrainers();
    }

    $("#create-class-form").on("submit", async function(e) {
        e.preventDefault();

        const newClass = {
            title: $("#class-title").val(),
            trainer: $("#class-trainer").val(),
            date: $("#class-date").val(),
            capacity: $("#class-capacity").val(),
            description: $("#class-desc").val()
        };

        try {
            const response = await fetch(API_CLASSES_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader()
                },
                body: JSON.stringify(newClass)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Class created successfully!");
                const modalEl = document.getElementById('addClassModal');
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.hide();
                
                $("#create-class-form")[0].reset();
                loadSchedule();
            } else {
                alert(data.message || "Failed to create class");
            }
        } catch (error) {
            console.error(error);
            alert("Server connection error");
        }
    });
});
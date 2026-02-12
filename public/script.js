if (typeof API_CLASSES_URL === 'undefined') {
  var API_CLASSES_URL = "https://web2final-production-2f92.up.railway.app/api/classes";
}
if (typeof API_BOOKING_URL === 'undefined') {
  var API_BOOKING_URL = "https://web2final-production-2f92.up.railway.app/api/bookings";
}
if (typeof API_TRAINERS_URL === 'undefined') {
  var API_TRAINERS_URL = "https://web2final-production-2f92.up.railway.app/api/trainers";
}

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
            if (user && (user.role === 'admin' || user.roles?.includes('admin'))) {
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
                <button class="btn btn-sm btn-primary" onclick="bookClass('${item._id}')" ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Full' : 'Book Now'}
                </button>
            `;

            if (isAdmin) {
                actionButtons += `
                    <button class="btn btn-sm btn-danger ms-2" onclick="deleteClass('${item._id}')">
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
        $("#dynamic-schedule-body").html('<tr><td colspan="5" class="text-danger">Failed to load schedule.</td></tr>');
    }
}

async function loadTrainers() {
    const container = $("#trainers-container");
    if (!container.length) return;

    try {
        const response = await fetch(API_TRAINERS_URL);
        const trainers = await response.json();
        container.empty();

        if (!trainers || trainers.length === 0) {
            container.html('<p class="text-center">No trainers found.</p>');
            return;
        }

        trainers.forEach(trainer => {
            const imgUrl = trainer.image ? `images/${trainer.image}` : "images/7e2b1f9067975727810c94e9691c8d69.jpg"; 
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${imgUrl}" class="card-img-top" alt="${trainer.username}" style="height: 300px; object-fit: cover;">
                        <div class="card-body text-center">
                            <h5 class="card-title fw-bold">${trainer.username}</h5>
                            <p class="card-text text-muted small">${trainer.email}</p>
                            <span class="badge bg-dark mb-3">Professional Trainer</span>
                            <a href="contact.html" class="btn btn-outline-primary w-100">Contact</a>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });
    } catch (error) {
        container.html('<p class="text-danger text-center">Failed to load trainers.</p>');
    }
}

window.deleteClass = async function(classId) {
    if(!confirm("Delete this class?")) return;
    try {
        const response = await fetch(`${API_CLASSES_URL}/${classId}`, {
            method: "DELETE",
            headers: getAuthHeader()
        });
        if (response.ok) {
            loadSchedule();
        }
    } catch (error) {
        alert("Error deleting class");
    }
};

window.bookClass = async function(classId) {
    if (!localStorage.getItem("user")) {
        window.location.href = "login.html";
        return;
    }
    try {
        const response = await fetch(API_BOOKING_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getAuthHeader() },
            body: JSON.stringify({ classId: classId })
        });
        if (response.ok) {
            alert("Booked!");
            loadSchedule(); 
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert("Connection error");
    }
};

$(document).ready(function () {
    if ($("#dynamic-schedule-body").length) loadSchedule();
    if ($("#trainers-container").length) loadTrainers();

    $("#trainer-search").on("input", function() {
        const value = $(this).val().toLowerCase();
        $("#trainers-container .col-md-4").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

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
                headers: { "Content-Type": "application/json", ...getAuthHeader() },
                body: JSON.stringify(newClass)
            });
            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('addClassModal')).hide();
                $("#create-class-form")[0].reset();
                loadSchedule();
            }
        } catch (error) {
            alert("Error creating class");
        }
    });
});
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

$(document).ready(function () {
    console.log("jQuery is ready!");

    const themeToggleButton = $('#theme-toggle');
    const body = $('body');

    function applyInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'night') {
            body.addClass('night-mode');
            themeToggleButton.html('<i class="fas fa-sun"></i>');
        } else {
            body.removeClass('night-mode');
            themeToggleButton.html('<i class="fas fa-moon"></i>');
        }
    }

    themeToggleButton.on('click', () => {
        body.toggleClass('night-mode');
        if (body.hasClass('night-mode')) {
            localStorage.setItem('theme', 'night');
            themeToggleButton.html('<i class="fas fa-sun"></i>');
        } else {
            localStorage.setItem('theme', 'day');
            themeToggleButton.html('<i class="fas fa-moon"></i>');
        }
    });

    applyInitialTheme();

    if ($("#dynamic-schedule-body").length) {
        loadSchedule();
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
            console.error("Error creating class:", error);
            alert("Server connection error");
        }
    });

    const trainers = [
        { id: 1, name: 'Anna', specialty: 'Yoga Instructor', bio: 'Certified yoga teacher.', img: 'images/5413438310036140376.jpg', alt: 'Trainer Anna' },
        { id: 2, name: 'Alina', specialty: 'Fitness Coach', bio: 'Specialist in functional training.', img: 'images/5413438310036140384.jpg', alt: 'Trainer Alina' },
        { id: 3, name: 'Sarah', specialty: 'Pilates Instructor', bio: 'Certified Pilates instructor.', img: 'images/5413438310036140377.jpg', alt: 'Trainer Sarah' },
        { id: 4, name: 'Maria', specialty: 'Strength Coach', bio: 'Strength and conditioning.', img: 'images/5413438310036140381.jpg', alt: 'Trainer Maria' }
    ];

    const trainersGrid = $('#trainers-grid');
    if (trainersGrid.length) {
        let trainersHTML = '';
        trainers.forEach(trainer => {
            trainersHTML += `
            <div class="col-lg-3 col-md-6 trainer-card-container">
                <div class="card trainer-card text-center h-100">
                    <img src="${trainer.img}" class="card-img-top" alt="${trainer.alt}">
                    <div class="card-body d-flex flex-column">
                        <h3 class="card-title">${trainer.name}</h3>
                        <p class="trainer-specialty">${trainer.specialty}</p>
                        <p class="card-text">${trainer.bio}</p>
                    </div>
                </div>
            </div>`;
        });
        trainersGrid.html(trainersHTML);
    }

    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        alert("Message sent (Demo)");
    });
});


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
            if (user.role === 'admin') {
                isAdmin = true;
                $("#admin-controls").removeClass("d-none");
            }
        }

        if (classes.length === 0) {
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
        console.error("Error loading schedule:", error);
        $("#dynamic-schedule-body").html('<tr><td colspan="5" class="text-danger">Failed to load schedule from server.</td></tr>');
    }
}

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
            alert("Booking successful!");
            loadSchedule();
        } else {
            alert(data.message || "Booking failed");
        }
    } catch (error) {
        console.error("Error booking class:", error);
        alert("Something went wrong.");
    }
};

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
        console.error("Error deleting class:", error);
        alert("Server connection error");
    }
};
const API_CLASSES_URL = "https://web2final-production-2f92.up.railway.app/api/classes";
const API_BOOKING_URL = "https://web2final-production-2f92.up.railway.app/api/bookings";

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

        if (classes.length === 0) {
            tbody.append('<tr><td colspan="5">No classes scheduled yet.</td></tr>');
            return;
        }

        classes.forEach(item => {
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const seatsLeft = item.capacity - item.enrolled;
            const isFull = seatsLeft <= 0;

            const row = `
                <tr>
                    <td>${dateStr}</td>
                    <td>${item.title}</td>
                    <td>${item.trainer}</td>
                    <td>${isFull ? '<span class="text-danger">Full</span>' : seatsLeft}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" 
                                onclick="bookClass('${item._id}')" 
                                ${isFull ? 'disabled' : ''}>
                            ${isFull ? 'Full' : 'Book Now'}
                        </button>
                    </td>
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

    const user = JSON.parse(userStr);

    try {
        const response = await fetch(API_BOOKING_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": user.accessToken
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
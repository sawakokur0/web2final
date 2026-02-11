const API_BASE_URL = "https://web2final-production-2f92.up.railway.app/api";

document.addEventListener("DOMContentLoaded", () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && user.accessToken) {
        $("#nav-login, #nav-signup").addClass("d-none");
        $("#nav-profile, #nav-logout").removeClass("d-none");
        
        if (window.location.pathname.includes("profile.html")) {
            $("#profile-welcome").text(`Welcome, ${user.username}!`);
            $("#profile-email").text(user.email);
            
            $("#profile-name-input").val(user.username);
            
            loadMyBookings(user.accessToken);

            $("#update-name-btn").off("click").on("click", async () => {
                const newName = $("#profile-name-input").val().trim();
                $("#update-message").empty();

                if (!newName) {
                    $("#update-message").html('<div class="alert alert-warning">Username cannot be empty</div>');
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/users/profile`, {
                        method: "PUT",
                        headers: { 
                            "Content-Type": "application/json",
                            "x-access-token": user.accessToken 
                        },
                        body: JSON.stringify({ username: newName })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        user.username = newName;
                        localStorage.setItem("user", JSON.stringify(user));
                        $("#profile-welcome").text(`Welcome, ${newName}!`);
                        $("#update-message").html('<div class="alert alert-success">Name updated successfully!</div>');
                        setTimeout(() => $("#update-message").empty(), 3000);
                    } else {
                        $("#update-message").html(`<div class="alert alert-danger">${data.message || "Update failed"}</div>`);
                    }
                } catch (error) {
                    console.error("Error updating profile:", error);
                    $("#update-message").html('<div class="alert alert-danger">Server connection error</div>');
                }
            });
        }
    } else {
        $("#nav-login, #nav-signup").removeClass("d-none");
        $("#nav-profile, #nav-logout").addClass("d-none");
        
        if (window.location.pathname.includes("profile.html")) {
            window.location.href = "login.html";
        }
    }

    $("#nav-logout, #profile-logout-btn").on("click", (e) => {
        e.preventDefault();
        logout();
    });
});

$("#signup-form").on("submit", async function(e) {
    e.preventDefault();
    const username = $("#signup-name").val();
    const email = $("#signup-email").val();
    const password = $("#signup-password").val();

    $("#signup-error").addClass("d-none");
    $("#signup-success").addClass("d-none");

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            $("#signup-success").text(data.message).removeClass("d-none");
            setTimeout(() => window.location.href = "login.html", 2000);
        } else {
            $("#signup-error").text(data.message || "Error occurred").removeClass("d-none");
        }
    } catch (error) {
        $("#signup-error").text("Server connection failed").removeClass("d-none");
    }
});

$("#login-form").on("submit", async function(e) {
    e.preventDefault();
    const email = $("#login-email").val();
    const password = $("#login-password").val();

    $("#login-error").addClass("d-none");

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = "profile.html";
        } else {
            $("#login-error").text(data.message || "Invalid credentials").removeClass("d-none");
        }
    } catch (error) {
        $("#login-error").text("Server connection failed").removeClass("d-none");
    }
});

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

async function loadMyBookings(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/bookings`, {
            method: "GET",
            headers: { "x-access-token": token }
        });
        
        const bookings = await response.json();
        const container = $("#my-bookings-list");
        
        if (container.length) {
            container.empty();
            if (bookings.length === 0) {
                container.append('<li class="list-group-item">No bookings yet.</li>');
                return;
            }

            bookings.forEach(b => {
                if(!b.class) return; 

                const date = new Date(b.class.date).toLocaleString();
                
                container.append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${b.class.title}</strong> with ${b.class.trainer}
                            <br>
                            <small class="text-muted">${date}</small>
                        </div>
                        <div>
                            <span class="badge bg-success rounded-pill me-2">Active</span>
                            <button class="btn btn-sm btn-outline-danger cancel-btn" data-id="${b._id}">Cancel</button>
                        </div>
                    </li>
                `);
            });

            $(".cancel-btn").on("click", async function() {
                const bookingId = $(this).data("id");
                if(!confirm("Are you sure you want to cancel this booking?")) return;

                try {
                    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
                        method: "DELETE",
                        headers: { "x-access-token": token }
                    });
                    
                    if (res.ok) {
                        alert("Booking cancelled.");
                        loadMyBookings(token); 
                    } else {
                        alert("Failed to cancel booking.");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error connecting to server.");
                }
            });
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
        $("#my-bookings-list").html('<li class="list-group-item text-danger">Error loading bookings</li>');
    }
}
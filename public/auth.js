const API_URL = "https://web2final-production-2f92.up.railway.app/api/auth/";
const API_USER_URL = "https://web2final-production-2f92.up.railway.app/api/users/";

function getAuthHeader() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    return { "x-access-token": user.accessToken };
  }
  return {};
}

async function handleRegister(event) {
  event.preventDefault();
  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");
  const passInput = document.getElementById("signup-password");
  if (!nameInput || !emailInput || !passInput) return;
  const username = nameInput.value;
  const email = emailInput.value;
  const password = passInput.value;
  try {
    const response = await fetch(API_URL + "signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "login.html";
    } else {
      const errorDiv = document.getElementById("signup-error");
      if (errorDiv) {
          errorDiv.textContent = data.message || "Registration failed";
          errorDiv.classList.remove("d-none");
      } else {
          alert(data.message || "Registration failed");
      }
    }
  } catch (error) {
    console.error(error);
    alert("Server connection error");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  if (!emailInput || !passwordInput) return;
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    const response = await fetch(API_URL + "signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }), 
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "profile.html";
    } else {
      const errorDiv = document.getElementById("login-error");
      if (errorDiv) {
          errorDiv.textContent = data.message || "Invalid email or password";
          errorDiv.classList.remove("d-none");
      } else {
          alert(data.message || "Login failed");
      }
    }
  } catch (error) {
    console.error(error);
    const errorDiv = document.getElementById("login-error");
    if (errorDiv) {
        errorDiv.textContent = "Server connection error";
        errorDiv.classList.remove("d-none");
    }
  }
}

function checkLoginStatus() {
  const userStr = localStorage.getItem("user");
  const navLogin = document.getElementById("nav-login");
  const navSignup = document.getElementById("nav-signup");
  const navProfile = document.getElementById("nav-profile");
  const navLogout = document.getElementById("nav-logout");
  if (userStr) {
    if (navLogin) navLogin.classList.add("d-none");
    if (navSignup) navSignup.classList.add("d-none");
    if (navProfile) navProfile.classList.remove("d-none");
    if (navLogout) navLogout.classList.remove("d-none");
    if (navLogout) {
        navLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }
  } else {
    if (navLogin) navLogin.classList.remove("d-none");
    if (navSignup) navSignup.classList.remove("d-none");
    if (navProfile) navProfile.classList.add("d-none");
    if (navLogout) navLogout.classList.add("d-none");
  }
}

async function loadProfile() {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    if (window.location.pathname.includes("profile.html")) {
        window.location.href = "login.html";
    }
    return;
  }
  const user = JSON.parse(userStr);
  const welcomeEl = document.getElementById("profile-welcome");
  const emailEl = document.getElementById("profile-email");
  if (welcomeEl) welcomeEl.textContent = `Welcome, ${user.username}!`;
  if (emailEl) emailEl.textContent = user.email;
  loadMyBookings();
}

async function loadMyBookings() {
  const container = document.getElementById("my-bookings-list");
  if (!container) return;
  try {
    const response = await fetch(API_USER_URL + "bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      }
    });
    const bookings = await response.json();
    if (!Array.isArray(bookings) || bookings.length === 0) {
      container.innerHTML = "<li class='list-group-item'>You haven't booked any classes yet.</li>";
      return;
    }
    let html = "";
    bookings.forEach(b => {
      if (!b.class) return;
      const dateObj = new Date(b.class.date);
      const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      html += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${b.class.title}</strong><br>
            <small class="text-muted">${dateStr}</small>
          </div>
          <div>
            <span class="badge bg-success rounded-pill me-2">Booked</span>
            <button class="btn btn-sm btn-outline-danger" onclick="cancelBooking('${b._id}')">Cancel</button>
          </div>
        </li>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
    container.innerHTML = '<li class="list-group-item text-danger">Error loading bookings.</li>';
  }
}

async function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;
  try {
    const response = await fetch("https://web2final-production-2f92.up.railway.app/api/bookings/" + bookingId, {
      method: "DELETE",
      headers: getAuthHeader()
    });
    if (response.ok) {
      alert("Booking cancelled successfully!");
      loadMyBookings();
    } else {
      const data = await response.json();
      alert(data.message || "Failed to cancel booking");
    }
  } catch (error) {
    console.error(error);
    alert("Server connection error");
  }
}
window.cancelBooking = cancelBooking;

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  const registerForm = document.getElementById("signup-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  if (document.getElementById("profile-welcome") || document.getElementById("my-bookings-list")) {
    loadProfile();
  }
});
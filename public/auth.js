var API_URL = "/api/auth/";
var API_USER_URL = "/api/users/";
var API_BOOKING_URL = "/api/bookings/";

function getAuthHeader() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    return { "x-access-token": user.accessToken };
  }
  return {};
}

window.cancelBooking = async function(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  try {
    const response = await fetch(`${API_BOOKING_URL}${bookingId}`, {
      method: "DELETE",
      headers: getAuthHeader()
    });

    if (response.ok) {
      alert("Booking cancelled");
      loadMyBookings();
    } else {
      const data = await response.json();
      alert(data.message || "Failed to cancel");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

async function updateProfileName() {
  const nameInput = document.getElementById("profile-name-input");
  const messageEl = document.getElementById("update-message");
  if (!nameInput || !nameInput.value) return;

  try {
    const response = await fetch(API_USER_URL + "profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify({ username: nameInput.value })
    });

    const data = await response.json();

    if (response.ok) {
      const user = JSON.parse(localStorage.getItem("user"));
      user.username = data.username;
      localStorage.setItem("user", JSON.stringify(user));

      if (messageEl) {
        messageEl.textContent = "Name updated successfully!";
        messageEl.className = "text-success mt-2";
      }
      const welcomeEl = document.getElementById("profile-welcome");
      if (welcomeEl) welcomeEl.textContent = `Welcome, ${data.username}!`;
    } else {
      alert(data.message || "Update failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");
  const passInput = document.getElementById("signup-password");
  try {
    const response = await fetch(API_URL + "signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: nameInput.value, email: emailInput.value, password: passInput.value }),
    });
    if (response.ok) {
      alert("Registration successful!");
      window.location.href = "login.html";
    } else {
      const data = await response.json();
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  try {
    const response = await fetch(API_URL + "signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput.value, password: passwordInput.value }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "profile.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error(error);
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
      navLogout.onclick = () => { localStorage.removeItem("user"); window.location.href = "login.html"; };
    }
  }
}

async function loadProfile() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  const user = JSON.parse(userStr);
  const welcomeEl = document.getElementById("profile-welcome");
  const emailEl = document.getElementById("profile-email");
  const nameInput = document.getElementById("profile-name-input");
  if (welcomeEl) welcomeEl.textContent = `Welcome, ${user.username}!`;
  if (emailEl) emailEl.textContent = user.email;
  if (nameInput) nameInput.value = user.username;
  loadMyBookings();
}

async function loadMyBookings() {
  const container = document.getElementById("my-bookings-list");
  if (!container) return;
  try {
    const response = await fetch(API_USER_URL + "bookings", {
      method: "GET",
      headers: getAuthHeader()
    });
    const bookings = await response.json();
    let html = "";
    if (!bookings || !bookings.length) {
      html = "<li class='list-group-item'>No bookings yet.</li>";
    } else {
      bookings.forEach(b => {
        if (!b.class) return;
        const date = new Date(b.class.date).toLocaleString();
        html += `<li class="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>${b.class.title}</strong><br><small>${date}</small></div>
          <button class="btn btn-sm btn-outline-danger" onclick="cancelBooking('${b._id}')">Cancel</button>
        </li>`;
      });
    }
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  if (document.getElementById("profile-welcome")) loadProfile();
  const regForm = document.getElementById("signup-form");
  if (regForm) regForm.addEventListener("submit", handleRegister);
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  const updateBtn = document.getElementById("update-name-btn");
  if (updateBtn) updateBtn.addEventListener("click", updateProfileName);
});
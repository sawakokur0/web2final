const API_URL = "https://web2final-production-2f92.up.railway.app/api/auth/";

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
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_URL + "signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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
    alert("An error occurred");
  }
}

function checkLoginStatus() {
  const userStr = localStorage.getItem("user");
  const navLinks = document.getElementById("nav-links");
  if (!navLinks) return;

  if (userStr) {
    const user = JSON.parse(userStr);
    navLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
      <li class="nav-item"><a class="nav-link" href="services.html">Services</a></li>
      <li class="nav-item"><a class="nav-link" href="schedule.html">Schedule</a></li>
      <li class="nav-item"><a class="nav-link" href="trainers.html">Trainers</a></li>
      <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
      <li class="nav-item"><a class="nav-link active" href="profile.html">${user.username}</a></li>
      <li class="nav-item"><a class="nav-link" href="#" id="logout-link">Logout</a></li>
    `;

    document.getElementById("logout-link").addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  } else {
    navLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
      <li class="nav-item"><a class="nav-link" href="services.html">Services</a></li>
      <li class="nav-item"><a class="nav-link" href="schedule.html">Schedule</a></li>
      <li class="nav-item"><a class="nav-link" href="trainers.html">Trainers</a></li>
      <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
      <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
      <li class="nav-item"><a class="nav-link" href="signup.html">Sign Up</a></li>
    `;
  }
}

async function loadProfile() {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    window.location.href = "login.html";
    return;
  }
  const user = JSON.parse(userStr);

  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("profile-email").textContent = user.email;
  
  if (user.roles && user.roles.includes("ROLE_ADMIN")) {
      document.getElementById("profile-role").textContent = "Admin";
  } else {
      document.getElementById("profile-role").textContent = "User";
  }
}

async function loadMyBookings() {
  const container = document.getElementById("my-bookings-list");
  if (!container) return;

  try {
    const response = await fetch("https://web2final-production-2f92.up.railway.app/api/users/bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        container.innerHTML = '<p class="text-danger">Session expired. Please <a href="login.html">login again</a>.</p>';
        return;
      }
      throw new Error("Failed to fetch bookings");
    }

    const bookings = await response.json();

    if (!Array.isArray(bookings) || bookings.length === 0) {
      container.innerHTML = "<p>You haven't booked any classes yet.</p>";
      return;
    }

    let html = '<ul class="list-group">';
    bookings.forEach(b => {
      if (!b.classId) return; 
      
      const dateObj = new Date(b.classId.date);
      const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      html += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${b.classId.title}</strong> with ${b.classId.trainer}<br>
            <small class="text-muted">${dateStr}</small>
          </div>
          <span class="badge bg-success rounded-pill">Confirmed</span>
        </li>
      `;
    });
    html += "</ul>";
    container.innerHTML = html;

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="text-danger">Error loading your bookings.</p>';
  }
}

if (document.getElementById("register-form")) {
  document.getElementById("register-form").addEventListener("submit", handleRegister);
}

if (document.getElementById("login-form")) {
  document.getElementById("login-form").addEventListener("submit", handleLogin);
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  if (document.getElementById("profile-username")) {
    loadProfile();
    loadMyBookings();
  }
  
  const logoutBtn = document.getElementById("logout-btn");
  if(logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
});
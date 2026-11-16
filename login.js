
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginUsername = document.getElementById("userName");
const loginPassword = document.getElementById("password");
const toast = document.getElementById("toast");

let toastTimer;

// Toast notification function
function showToast(message, type = "error") {

  if (!toast) {
    console.error("Toast element not found!");
    return;
  }

  // Clear previous timer
  clearTimeout(toastTimer);

  // Set toast message
  toast.textContent = message;

  // Apply Tailwind styles
  toast.className = `
    fixed top-5 right-5
    px-6 py-4 rounded-lg
    text-white text-sm font-medium
    shadow-lg z-[9999]
    transition-all duration-300
    opacity-100 translate-x-0
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
  `;

  // Display toast
  toast.classList.remove("hidden");
  toast.style.display = "block";

  // Hide toast after 3 seconds
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
    toast.style.display = "none";
  }, 3000);
}


// Login function
if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    // Validate empty fields
    if (!username || !password.trim()) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      showToast("Password must be at least 8 characters!", "error");
      return;
    }

    try {

      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in...";

      const response = await fetch(
        "https://dummyjson.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: password,
            expiresInMins: 30
          })
        }
      );

      const data = await response.json();

      console.log("API Status:", response.status);
      console.log("API Response:", data);

      // Successful login
      if (response.ok && data.accessToken) {

        showToast("Login successful!", "success");

        localStorage.setItem("token", data.accessToken);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
          })
        );

        setTimeout(() => {
          window.location.href = "./index.html";
        }, 2000);

      }

      // Incorrect credentials
      else if (response.status === 400 || response.status === 401) {

        showToast("Incorrect username or password!", "error");

      }

      else {

        showToast(
          data.message || "Something went wrong!",
          "error"
        );

      }

    } catch (error) {

      console.error("Login Error:", error);

      showToast("Unable to connect to server!", "error");

    } finally {

      loginBtn.disabled = false;
      loginBtn.textContent = "Login";

    }

  });

}

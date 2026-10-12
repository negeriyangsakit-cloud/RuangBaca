const firebaseConfig = {
  apiKey: "AIzaSyAR4gSaceVjp_cNJBQP_iiOBEzwWVVU-g0",
  authDomain: "ruangbaca-dd797.firebaseapp.com",
  projectId: "ruangbaca-dd797",
  storageBucket: "ruangbaca-dd797.firebasestorage.app",
  messagingSenderId: "9601713040",
  appId: "1:9601713040:web:bcf701eba5cc94aa7e2915"
};


/* INISIALISASI FIREBASE */
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

/* PESAN STATUS */
const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");

/* LOGIN */
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    loginMessage.textContent = "Sedang masuk...";

    try {
      await auth.signInWithEmailAndPassword(email, password);
      loginMessage.textContent = "Berhasil masuk ke RuangBaca!";
    } catch (error) {
      loginMessage.textContent =
        "Login gagal: " + error.message;
    }
  });
}

/* PENDAFTARAN */
const registerForm = document.getElementById("daftar");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    registerMessage.textContent = "Sedang membuat akun...";

    try {
      const result = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await result.user.updateProfile({
        displayName: name
      });

      registerMessage.textContent =
        "Akun berhasil dibuat! Silakan masuk ke RuangBaca.";

      registerForm.reset();
    } catch (error) {
      registerMessage.textContent =
        "Pendaftaran gagal: " + error.message;
    }
  });
}

/* STATUS LOGIN DAN AKUN SAYA */
const navLogin = document.getElementById("nav-login");
const navRegister = document.getElementById("nav-register");
const navAccount = document.getElementById("nav-account");
const authGrid = document.querySelector(".auth-grid");

const accountPanel = document.createElement("div");
accountPanel.className = "auth-card";
accountPanel.hidden = true;

const accountTitle = document.createElement("h3");
accountTitle.textContent = "Akun Saya";

const accountName = document.createElement("p");
const accountEmail = document.createElement("p");

const logoutButton = document.createElement("button");
logoutButton.type = "button";
logoutButton.className = "btn btn-outline";
logoutButton.textContent = "Keluar dari akun";

accountPanel.append(accountTitle, accountName, accountEmail, logoutButton);

if (authGrid) authGrid.appendChild(accountPanel);

if (navAccount) {
  navAccount.addEventListener("click", function () {
    accountPanel.hidden = !accountPanel.hidden;
  });
}

logoutButton.addEventListener("click", async function () {
  try {
    await auth.signOut();
  } catch (error) {
    alert("Gagal keluar: " + error.message);
  }
});

auth.onAuthStateChanged(function (user) {
  const loggedIn = !!user;

  if (navLogin) navLogin.hidden = loggedIn;
  if (navRegister) navRegister.hidden = loggedIn;
  if (navAccount) navAccount.hidden = !loggedIn;

  if (loginForm) loginForm.hidden = loggedIn;
  if (registerForm) registerForm.hidden = loggedIn;

  accountPanel.hidden = true;

  if (user) {
    accountName.textContent = "Nama: " + (user.displayName || "Belum diatur");
    accountEmail.textContent = "Email: " + (user.email || "Tidak tersedia");
    console.log("Pengguna masuk:", user.email);
  }
});

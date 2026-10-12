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

/* CEK STATUS LOGIN */
auth.onAuthStateChanged(function (user) {
  if (user) {
    console.log("Pengguna masuk:", user.email);
  } else {
    console.log("Belum ada pengguna yang masuk.");
  }
});

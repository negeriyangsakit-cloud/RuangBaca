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

/* KATALOG DINAMIS RUANGBACA - FIRESTORE */
(function () {
  const grid = document.getElementById("books-grid");
  if (!grid || typeof firebase.firestore !== "function") return;

  const db = firebase.firestore();
  const searchInput = document.querySelector(
    '.searchbar input[type="search"]'
  );
  const chips = document.querySelectorAll(".chips .chip");

  let books = [];
  let activeCategory = "Semua buku";

  const status = document.createElement("p");
  status.className = "section-sub";
  status.textContent = "Memuat koleksi buku...";
  grid.before(status);

  const reader = document.createElement("article");
  reader.className = "auth-card";
  reader.hidden = true;
  reader.style.marginTop = "24px";
  grid.after(reader);

  function safeText(value) {
    return String(value == null ? "" : value);
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  function renderBooks() {
    const query = (searchInput ? searchInput.value : "")
      .trim()
      .toLowerCase();

    const filtered = books.filter(function (book) {
      const category = safeText(book.category);
      const matchesCategory =
        activeCategory === "Semua buku" ||
        category.toLowerCase() === activeCategory.toLowerCase();

      const searchable = [
        book.title,
        book.author,
        book.category,
        book.description
      ].map(safeText).join(" ").toLowerCase();

      return matchesCategory && searchable.includes(query);
    });

    grid.replaceChildren();

    if (!filtered.length) {
      status.textContent = books.length
        ? "Belum ada buku yang cocok dengan pencarian ini."
        : "Belum ada buku terbit yang tersedia.";
      return;
    }

    status.textContent = "Menampilkan " + filtered.length + " buku.";

    filtered.forEach(function (book, index) {
      const card = makeElement("article", "book-card");
      const cover = makeElement("div", "cover c" + ((index % 8) + 1));
      cover.append(
        makeElement("span", "cover-tag", safeText(book.category)),
        makeElement("strong", "", safeText(book.title)),
        makeElement("small", "", "RUANGBACA DIGITAL")
      );

      const info = makeElement("div", "book-info");
      info.append(
        makeElement("span", "genre", safeText(book.category)),
        makeElement("h3", "", safeText(book.title)),
        makeElement("p", "", safeText(book.author))
      );

      const bottom = makeElement("div", "book-bottom");
      bottom.append(
        makeElement("span", "available", "● Tersedia")
      );

      const button = makeElement("button", "borrow", "Baca ↗");
      button.type = "button";
      button.addEventListener("click", function () {
        reader.replaceChildren();
        reader.hidden = false;

        reader.append(
          makeElement("h3", "", safeText(book.title)),
          makeElement("p", "", "Penulis: " + safeText(book.author)),
          makeElement("p", "", "Kategori: " + safeText(book.category)),
          makeElement("p", "", safeText(book.description))
        );

        const content = makeElement("div");
        content.style.whiteSpace = "pre-wrap";
        content.style.lineHeight = "1.8";
        content.textContent = safeText(book.content) ||
          "Isi buku belum tersedia.";
        reader.append(content);

        const close = makeElement("button", "btn btn-outline", "Tutup bacaan");
        close.type = "button";
        close.style.marginTop = "20px";
        close.addEventListener("click", function () {
          reader.hidden = true;
        });
        reader.append(close);
        reader.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      bottom.append(button);
      info.append(bottom);
      card.append(cover, info);
      grid.append(card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderBooks);
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeCategory = chip.textContent.trim();

      chips.forEach(function (item) {
        item.classList.toggle("active", item === chip);
      });

      renderBooks();
    });
  });

  db.collection("books")
    .where("status", "==", "published")
    .get()
    .then(function (snapshot) {
      books = snapshot.docs.map(function (doc) {
        return doc.data();
      });

      renderBooks();
    })
    .catch(function (error) {
      console.error("Gagal memuat katalog:", error);
      status.textContent =
        "Katalog belum bisa dimuat. Periksa koneksi dan aturan Firestore.";
    });
})();

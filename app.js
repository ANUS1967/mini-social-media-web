document.addEventListener("DOMContentLoaded", () => {
  const authBox = document.getElementById("authBox");
  const socialBox = document.getElementById("socialBox");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");
  const toggleForm = document.getElementById("toggleForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const postInput = document.getElementById("postInput");
  const postBtn = document.getElementById("postBtn");
  const postsContainer = document.getElementById("postsContainer");
  const logoutBtn = document.getElementById("logoutBtn");
  const searchInput = document.getElementById("searchInput");

  let isLogin = false;
  let currentUser = localStorage.getItem("currentUser") || null;

  function showAuth() {
    authBox.style.display = "block";
    socialBox.style.display = "none";
  }

  function showSocial() {
    authBox.style.display = "none";
    socialBox.style.display = "block";
    renderPosts();
  }

  toggleForm.addEventListener("click", () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Login" : "Sign Up";
    submitBtn.textContent = isLogin ? "Login" : "Sign Up";
    toggleForm.textContent = isLogin ? "Sign Up" : "Login";
    nameInput.style.display = isLogin ? "none" : "block";
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
  });

  submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill all fields!");
      return;
    }

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        alert("Incorrect email or password!");
        return;
      }
      currentUser = user.email;
      localStorage.setItem("currentUser", currentUser);
      showSocial();
    } else {
      if (users.some(u => u.email === email)) {
        alert("Email already exists!");
        return;
      }
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful!");
      toggleForm.click(); // switch to login after signup
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    currentUser = null;
    showAuth();
  });

  postBtn.addEventListener("click", () => {
    const content = postInput.value.trim();
    if (!content) return;
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift({
      id: Date.now(),
      user: currentUser,
      content: content,
      likes: 0
    });
    localStorage.setItem("posts", JSON.stringify(posts));
    postInput.value = "";
    renderPosts();
  });

  function renderPosts() {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const searchTerm = searchInput.value.trim().toLowerCase();
    postsContainer.innerHTML = "";

    posts.filter(p => p.content.toLowerCase().includes(searchTerm)).forEach(p => {
      const postDiv = document.createElement("div");
      postDiv.className = "postCard";
      postDiv.innerHTML = `
        <p>${p.content}</p>
        <div class="actions">
          <span>By: ${p.user}</span>
          <div>
            <button class="actionBtn likeBtn">❤️ ${p.likes}</button>
            ${p.user === currentUser ? '<button class="actionBtn deleteBtn">🗑️</button>' : ''}
          </div>
        </div>
      `;

      postDiv.querySelector(".likeBtn").addEventListener("click", () => {
        p.likes++;
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
      });

      const delBtn = postDiv.querySelector(".deleteBtn");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          posts = posts.filter(post => post.id !== p.id);
          localStorage.setItem("posts", JSON.stringify(posts));
          renderPosts();
        });
      }

      postsContainer.appendChild(postDiv);
    });
  }

  searchInput.addEventListener("input", renderPosts);

  if (currentUser) showSocial();
  else showAuth();
});

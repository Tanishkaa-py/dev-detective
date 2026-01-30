const input = document.getElementById("searchInput");
const profileCard = document.getElementById("profileCard");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    fetchUser(input.value);
  }
});

async function fetchUser(username) {
  profileCard.innerHTML = "";
  errorDiv.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("User Not Found");
    }

    const data = await response.json();
    showProfile(data);

    // ✅ FETCH REPOS ONLY AFTER USER EXISTS
    const repoResponse = await fetch(data.repos_url);
    const repos = await repoResponse.json();
    showRepos(repos);

  } catch (error) {
    errorDiv.textContent = "❌ User Not Found";
    errorDiv.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function showProfile(user) {
  profileCard.innerHTML = `
    <img src="${user.avatar_url}" width="100" />
    <h2>${user.name || "No Name"}</h2>
    <p>${user.bio || "No bio available"}</p>
    <p>Joined: ${formatDate(user.created_at)}</p>
    ${
      user.blog
        ? `<a href="${user.blog}" target="_blank">${user.blog}</a>`
        : ""
    }
  `;
}

function showRepos(repos) {
  const topRepos = repos
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  let repoHTML = "<h3>Latest Repositories</h3>";

  topRepos.forEach(repo => {
    repoHTML += `
      <p>
        <a href="${repo.html_url}" target="_blank">
          ${repo.name}
        </a>
        (${formatDate(repo.created_at)})
      </p>
    `;
  });

  profileCard.innerHTML += repoHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

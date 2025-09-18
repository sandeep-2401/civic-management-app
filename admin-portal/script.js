const API_URL = "http://localhost:5000/api/admin/issues";

// Fetch and render all issues
async function fetchIssues() {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Failed to fetch issues");

    const issues = await res.json();
    renderIssues(issues);
    updateStats(issues);
  } catch (err) {
    console.error("❌ Error fetching issues:", err);
    document.getElementById("issues-grid").innerHTML =
      "<p class='text-danger'>Failed to load issues.</p>";
  }
}

// Render issues into Bootstrap cards
function renderIssues(issues) {
  const container = document.getElementById("issues-grid");
  container.innerHTML = "";

  if (!issues || issues.length === 0) {
    container.innerHTML = "<p class='text-muted'>No issues reported.</p>";
    return;
  }

  issues.forEach((issue) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";

    card.innerHTML = `
      <div class="card shadow-sm issue-card">
        ${
          issue.image_url
            ? `<img src="${issue.image_url}" class="card-img-top" alt="Issue photo">`
            : `<img src="https://via.placeholder.com/300x180?text=No+Image" class="card-img-top" alt="No image">`
        }
        <div class="card-body">
          <h5 class="card-title">${issue.description}</h5>
          <p class="card-text">📍 ${issue.latitude}, ${issue.longitude}</p>
          <p class="card-text text-muted">🕒 ${new Date(
            issue.created_at
          ).toLocaleString()}</p>

          <label class="form-label">Status:</label>
          <select data-id="${issue.id}" class="form-select status-select mb-2">
            <option value="pending" ${issue.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="in_progress" ${issue.status === "in_progress" ? "selected" : ""}>In Progress</option>
            <option value="resolved" ${issue.status === "resolved" ? "selected" : ""}>Resolved</option>
            <option value="rejected" ${issue.status === "rejected" ? "selected" : ""}>Rejected</option>
          </select>

          <button class="btn btn-danger btn-sm delete-btn" data-id="${issue.id}">Delete</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach listeners to status dropdowns
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", handleStatusChange);
  });

  // Attach listeners to delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// Handle status change
async function handleStatusChange(e) {
  const issueId = e.target.getAttribute("data-id");
  const newStatus = e.target.value;

  try {
    const res = await fetch(`${API_URL}/${issueId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`❌ Failed: ${err.message}`);
      return;
    }

    const updated = await res.json();
    alert(`✅ Status updated to ${updated.status}`);
    fetchIssues(); // reload issues to refresh UI
  } catch (err) {
    console.error("⚠️ Error updating status:", err);
    alert("⚠️ Error connecting to server");
  }
}

// Handle delete
async function handleDelete(e) {
  const issueId = e.target.getAttribute("data-id");
  if (!confirm("Are you sure you want to delete this issue?")) return;

  try {
    const res = await fetch(`${API_URL}/${issueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`❌ Failed: ${err.error}`);
      return;
    }

    alert("✅ Issue deleted successfully");
    fetchIssues(); // refresh UI
  } catch (err) {
    console.error("⚠️ Error deleting issue:", err);
    alert("⚠️ Error connecting to server");
  }
}

// Update stats cards
function updateStats(issues) {
  document.getElementById("total-issues").textContent = issues.length;
  document.getElementById("resolved-issues").textContent = issues.filter(
    (i) => i.status === "resolved"
  ).length;
  document.getElementById("inprogress-issues").textContent = issues.filter(
    (i) => i.status === "in_progress"
  ).length;
}

// Load issues on page load
fetchIssues();

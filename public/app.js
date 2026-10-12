const appState = {
  user: null,
  hasElectionStarted: false,
  candidates: [
    {
      id: 1,
      name: "Amina Shah",
      party: "Community First",
      description: "A community organizer focused on accessible services, education, and listening to local residents.",
      photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=720&q=85",
      votes: 0
    },
    {
      id: 2,
      name: "Bilal Khan",
      party: "Forward Together",
      description: "A small-business advocate working toward practical local improvements and transparent decision-making.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=85",
      votes: 0
    },
    {
      id: 3,
      name: "Sara Ahmed",
      party: "People's Voice",
      description: "A teacher supporting inclusive opportunities, youth programs, and responsible community leadership.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=85",
      votes: 0
    },
    {
      id: 4,
      name: "Hamza Malik",
      party: "Community First",
      description: "A local volunteer focused on cleaner neighborhoods, public spaces, and practical community projects.",
      photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=720&q=85",
      votes: 0
    },
    {
      id: 5,
      name: "Noor Fatima",
      party: "Forward Together",
      description: "A youth mentor who supports better learning opportunities, skills training, and inclusive programs.",
      photoUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=720&q=85",
      votes: 0
    },
    {
      id: 6,
      name: "Zain Ali",
      party: "People's Voice",
      description: "A small-business owner interested in transparent leadership and supporting local entrepreneurs.",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=85",
      votes: 0
    }
  ],
  votedEmails: new Set(),
  nextCandidateId: 7,
  accountMode: "login",
  accountModal: null,
  candidateModal: null
};

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  toast.setAttribute("role", "status");
  const row = document.createElement("div");
  row.className = "d-flex";
  const text = document.createElement("div");
  text.className = "toast-body";
  text.textContent = message;
  const close = document.createElement("button");
  close.type = "button";
  close.className = "btn-close btn-close-white me-2 m-auto";
  close.dataset.bsDismiss = "toast";
  close.setAttribute("aria-label", "Close");
  row.append(text, close);
  toast.append(row);
  container.append(toast);
  toast.addEventListener("hidden.bs.toast", () => toast.remove(), { once: true });
  bootstrap.Toast.getOrCreateInstance(toast, { delay: 4000 }).show();
}

function setAccountMode(mode) {
  appState.accountMode = mode;
  const isRegister = mode === "register";
  document.getElementById("accountModalTitle").textContent = isRegister ? "Create a demo account" : "Sign in";
  document.getElementById("accountSubmitButton").textContent = isRegister ? "Register demo" : "Sign in demo";
  document.getElementById("nameField").classList.toggle("d-none", !isRegister);
  document.getElementById("demoName").required = isRegister;
  document.getElementById("showLoginButton").classList.toggle("active", !isRegister);
  document.getElementById("showRegisterButton").classList.toggle("active", isRegister);
  document.getElementById("authError").classList.add("d-none");
  document.getElementById("authSuccess").classList.add("d-none");
}

function updateAccountButton() {
  const button = document.getElementById("accountButton");
  button.textContent = appState.user
    ? `${appState.user.name} · Sign out`
    : "Sign in / Register";
  button.onclick = appState.user ? signOutDemo : null;
  if (appState.user) {
    button.removeAttribute("data-bs-toggle");
    button.removeAttribute("data-bs-target");
  } else {
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#accountModal");
  }
}

function signOutDemo() {
  appState.user = null;
  updateAccountButton();
  renderCandidates();
  showToast("Signed out of the temporary demo account.");
}

function handleAccountSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const errorBox = document.getElementById("authError");
  const successBox = document.getElementById("authSuccess");
  errorBox.classList.add("d-none");
  successBox.classList.add("d-none");
  if (!form.reportValidity()) return;

  const email = document.getElementById("demoEmail").value.trim().toLowerCase();
  const password = document.getElementById("demoPassword").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorBox.textContent = "Enter a valid email-shaped demo label.";
    errorBox.classList.remove("d-none");
    return;
  }
  if (!password) {
    errorBox.textContent = "Type any sample text in the password field. It will not be saved or checked.";
    errorBox.classList.remove("d-none");
    return;
  }

  const nameInput = document.getElementById("demoName");
  const name = appState.accountMode === "register"
    ? nameInput.value.trim()
    : email.split("@")[0].replace(/[._-]+/g, " ");
  if (appState.accountMode === "register" && name.length < 2) {
    errorBox.textContent = "Enter a demo name using at least 2 characters.";
    errorBox.classList.remove("d-none");
    return;
  }

  appState.user = { name: name || "Demo voter", email };
  document.getElementById("demoPassword").value = "";
  successBox.textContent = "Demo identity ready. Nothing was sent to a server or saved.";
  successBox.classList.remove("d-none");
  updateAccountButton();
  renderCandidates();
  window.setTimeout(() => appState.accountModal.hide(), 700);
}

function makeCandidateCard(candidate) {
  const column = document.createElement("div");
  column.className = "col-md-6 col-xl-4 candidate-column";
  const article = document.createElement("article");
  article.className = "candidate-card";
  const imageWrap = document.createElement("div");
  imageWrap.className = "candidate-image-wrap";
  const image = document.createElement("img");
  image.src = candidate.photoUrl;
  image.alt = `Portrait of ${candidate.name}`;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.remove();
    imageWrap.classList.add("candidate-image-fallback");
    imageWrap.textContent = candidate.name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  }, { once: true });
  imageWrap.append(image);

  const body = document.createElement("div");
  body.className = "candidate-card-body";
  const party = document.createElement("div");
  party.className = "candidate-party";
  party.textContent = candidate.party;
  const name = document.createElement("h3");
  name.textContent = candidate.name;
  const description = document.createElement("p");
  description.textContent = candidate.description;
  const voteButton = document.createElement("button");
  voteButton.type = "button";
  voteButton.className = "btn btn-dark rounded-pill w-100 mt-2";

  const alreadyVoted = appState.user && appState.votedEmails.has(appState.user.email);
  voteButton.textContent = alreadyVoted
    ? "You've already voted"
    : `Vote for ${candidate.name.split(" ")[0]}`;
  voteButton.disabled = !appState.user || alreadyVoted || !appState.hasElectionStarted;
  if (!appState.user) {
    voteButton.disabled = false;
    voteButton.addEventListener("click", () => {
      setAccountMode("login");
      appState.accountModal.show();
    });
  } else if (appState.hasElectionStarted && !alreadyVoted) {
    voteButton.addEventListener("click", () => castDemoVote(candidate.id));
  }

  body.append(party, name, description, voteButton);
  article.append(imageWrap, body);
  column.append(article);
  return column;
}

function renderCandidates() {
  const list = document.getElementById("candidateList");
  list.replaceChildren();
  const query = document.getElementById("candidateSearch").value.trim().toLowerCase();
  const party = document.getElementById("partyFilter").value.toLowerCase();
  const filtered = appState.candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(query) &&
    (!party || candidate.party.toLowerCase() === party)
  );
  filtered.forEach(candidate => list.append(makeCandidateCard(candidate)));
  document.getElementById("candidateEmpty").classList.toggle("d-none", filtered.length > 0);

  const parties = [...new Set(appState.candidates.map(candidate => candidate.party))].sort();
  const filter = document.getElementById("partyFilter");
  const selected = filter.value;
  filter.replaceChildren(new Option("All parties", ""));
  parties.forEach(value => filter.add(new Option(value, value)));
  if (parties.includes(selected)) filter.value = selected;
}

function renderResults() {
  const totalVotes = appState.candidates.reduce((total, candidate) => total + candidate.votes, 0);
  document.getElementById("totalVotes").textContent = totalVotes.toLocaleString();
  const list = document.getElementById("resultsList");
  list.replaceChildren();
  if (appState.candidates.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-secondary mb-0";
    empty.textContent = "Add demo candidates to see the results.";
    list.append(empty);
    return;
  }

  [...appState.candidates]
    .sort((first, second) => second.votes - first.votes || first.name.localeCompare(second.name))
    .forEach((candidate, index) => {
      const percentage = totalVotes === 0 ? 0 : Math.round(candidate.votes / totalVotes * 1000) / 10;
      const row = document.createElement("div");
      row.className = "result-row";
      const top = document.createElement("div");
      top.className = "result-row-top";
      const label = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = candidate.name;
      const party = document.createElement("span");
      party.textContent = candidate.party;
      label.append(name, party);
      const count = document.createElement("div");
      count.className = "result-count";
      count.textContent = `${candidate.votes.toLocaleString()} · ${percentage}%`;
      top.append(label, count);

      const track = document.createElement("div");
      track.className = "progress result-progress";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", `${candidate.name}: ${percentage}%`);
      track.setAttribute("aria-valuenow", String(percentage));
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", "100");
      const bar = document.createElement("div");
      bar.className = "progress-bar" + (index === 0 && totalVotes > 0 ? " progress-bar-leading" : "");
      bar.style.width = `${percentage}%`;
      track.append(bar);
      row.append(top, track);
      list.append(row);
    });
}

function refreshDemo() {
  const status = document.getElementById("heroElectionStatus");
  const dot = document.getElementById("heroStatusDot");
  const notice = document.getElementById("electionNotice");
  const isOpen = appState.hasElectionStarted;
  status.textContent = isOpen ? "The demo vote is open" : "A better choice starts with you";
  dot.classList.toggle("status-dot-open", isOpen);
  notice.textContent = isOpen
    ? "This demo election is open. Sign in with sample details to try a Vote button."
    : "This demo is closed. Open it from the demo admin controls to try voting.";
  notice.classList.remove("d-none");
  document.getElementById("openElectionButton").disabled = isOpen;
  document.getElementById("closeElectionButton").disabled = !isOpen;
  renderCandidates();
  renderResults();
  renderAdminCandidates();
}

function castDemoVote(candidateId) {
  if (!appState.user) {
    showToast("Use the sign-in demo first.", "warning");
    return;
  }
  if (!appState.hasElectionStarted) {
    showToast("The demo election is closed.", "warning");
    return;
  }
  if (appState.votedEmails.has(appState.user.email)) {
    showToast("This demo account has already voted in this page.", "warning");
    return;
  }
  const candidate = appState.candidates.find(item => item.id === candidateId);
  if (!candidate) {
    showToast("That demo candidate could not be found.", "danger");
    return;
  }
  candidate.votes += 1;
  appState.votedEmails.add(appState.user.email);
  showToast("Demo vote counted in this page only.");
  refreshDemo();
}

function renderAdminCandidates() {
  const body = document.getElementById("adminCandidateList");
  body.replaceChildren();
  appState.candidates.forEach(candidate => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const name = document.createElement("strong");
    name.textContent = candidate.name;
    nameCell.append(name);
    const partyCell = document.createElement("td");
    partyCell.textContent = candidate.party;
    const votesCell = document.createElement("td");
    votesCell.textContent = candidate.votes.toLocaleString();
    const actionsCell = document.createElement("td");
    actionsCell.className = "text-end";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn btn-sm btn-outline-dark rounded-pill me-2";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => openCandidateModal(candidate));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-sm btn-outline-danger rounded-pill";
    deleteButton.textContent = "Delete";
    deleteButton.disabled = candidate.votes > 0;
    deleteButton.title = candidate.votes > 0 ? "A candidate with demo votes cannot be deleted." : "Delete candidate";
    deleteButton.addEventListener("click", () => deleteDemoCandidate(candidate));
    actionsCell.append(editButton, deleteButton);
    row.append(nameCell, partyCell, votesCell, actionsCell);
    body.append(row);
  });
}

function openCandidateModal(candidate = null) {
  document.getElementById("candidateForm").reset();
  document.getElementById("candidateFormError").classList.add("d-none");
  document.getElementById("candidateId").value = candidate ? String(candidate.id) : "";
  document.getElementById("candidateName").value = candidate ? candidate.name : "";
  document.getElementById("candidateParty").value = candidate ? candidate.party : "";
  document.getElementById("candidatePhoto").value = candidate ? candidate.photoUrl : "";
  document.getElementById("candidateDescription").value = candidate ? candidate.description : "";
  document.getElementById("candidateModalTitle").textContent = candidate ? "Edit demo candidate" : "Add demo candidate";
  appState.candidateModal.show();
}

function saveDemoCandidate(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const errorBox = document.getElementById("candidateFormError");
  errorBox.classList.add("d-none");
  if (!form.reportValidity()) return;

  const name = document.getElementById("candidateName").value.trim();
  const party = document.getElementById("candidateParty").value.trim();
  const photoUrl = document.getElementById("candidatePhoto").value.trim();
  const description = document.getElementById("candidateDescription").value.trim();
  let photo;
  try {
    photo = new URL(photoUrl);
  } catch {
    errorBox.textContent = "Enter a valid HTTPS photo URL.";
    errorBox.classList.remove("d-none");
    return;
  }
  if (photo.protocol !== "https:") {
    errorBox.textContent = "Candidate photo links must start with https://.";
    errorBox.classList.remove("d-none");
    return;
  }

  const id = Number(document.getElementById("candidateId").value);
  if (id) {
    const candidate = appState.candidates.find(item => item.id === id);
    if (!candidate) {
      errorBox.textContent = "That demo candidate could not be found.";
      errorBox.classList.remove("d-none");
      return;
    }
    Object.assign(candidate, { name, party, photoUrl, description });
  } else {
    appState.candidates.push({ id: appState.nextCandidateId++, name, party, photoUrl, description, votes: 0 });
  }

  appState.candidateModal.hide();
  document.getElementById("adminSuccess").textContent = "Demo candidate saved in this page only.";
  document.getElementById("adminSuccess").classList.remove("d-none");
  refreshDemo();
}

function deleteDemoCandidate(candidate) {
  if (candidate.votes > 0) {
    showToast("Candidates with demo votes cannot be deleted.", "warning");
    return;
  }
  if (!window.confirm(`Remove ${candidate.name} from this page?`)) return;
  appState.candidates = appState.candidates.filter(item => item.id !== candidate.id);
  refreshDemo();
}

document.addEventListener("DOMContentLoaded", () => {
  appState.accountModal = new bootstrap.Modal(document.getElementById("accountModal"));
  appState.candidateModal = new bootstrap.Modal(document.getElementById("candidateModal"));
  document.getElementById("currentYear").textContent = String(new Date().getFullYear());
  document.getElementById("candidateSearch").addEventListener("input", renderCandidates);
  document.getElementById("partyFilter").addEventListener("change", renderCandidates);
  document.getElementById("accountForm").addEventListener("submit", handleAccountSubmit);
  document.getElementById("showLoginButton").addEventListener("click", () => setAccountMode("login"));
  document.getElementById("showRegisterButton").addEventListener("click", () => setAccountMode("register"));
  document.getElementById("candidateForm").addEventListener("submit", saveDemoCandidate);
  document.getElementById("newCandidateButton").addEventListener("click", () => openCandidateModal());
  document.getElementById("openElectionButton").addEventListener("click", () => {
    appState.hasElectionStarted = true;
    refreshDemo();
  });
  document.getElementById("closeElectionButton").addEventListener("click", () => {
    appState.hasElectionStarted = false;
    refreshDemo();
  });
  refreshDemo();
});

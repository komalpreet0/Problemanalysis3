const apiBaseUrl = "/api/quotes";

// For DOM elements
const form = document.getElementById("addQuoteForm");
const quoteList = document.getElementById("quoteList");
const contentInput = document.getElementById("quoteContent");
const authorInput = document.getElementById("quoteAuthor");
const tagsInput = document.getElementById("quoteTags");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

let editingQuoteId = null;

// For fetching all quotes
async function getAllQuotes() {
    try {
        const response = await fetch(apiBaseUrl);
        const quotes = await response.json();
        quoteList.innerHTML = "";

        quotes.forEach(q => {
            const tags = (q.quoteTags?.$values || []).map(t => t.tag?.name).join(", ");
            const div = document.createElement("div");
            div.className = "quote-card";
            div.innerHTML = `
                <p>"${q.content}" - ${q.author || "Unknown"} (Likes: ${q.likes})</p>
                <p><small>Tags: ${tags}</small></p>
                <button onclick="likeQuote(${q.id})">❤️ Like</button>
                <button onclick="editQuote(${q.id}, \`${q.content}\`, \`${q.author}\`, \`${tags}\`)">Edit</button>
                <button onclick="deleteQuote(${q.id})">Delete</button>
                <hr />
            `;
            quoteList.appendChild(div);
        });
    } catch (err) {
        console.error("Error loading quotes:", err);
        alert("Failed to load quotes.");
    }
}

// For loading  most liked quotes
async function getMostLikedQuotes() {
    try {
        const response = await fetch(`${apiBaseUrl}/mostliked?count=10`);
        const quotes = await response.json();
        quoteList.innerHTML = "";

        quotes.forEach(q => {
            const tags = (q.quoteTags?.$values || []).map(t => t.tag?.name).join(", ");
            const div = document.createElement("div");
            div.className = "quote-card";
            div.innerHTML = `
                <p>"${q.content}" - ${q.author || "Unknown"} (Likes: ${q.likes})</p>
                <p><small>Tags: ${tags}</small></p>
                <button onclick="likeQuote(${q.id})">❤️ Like</button>
                <button onclick="editQuote(${q.id}, \`${q.content}\`, \`${q.author}\`, \`${tags}\`)">Edit</button>
                <button onclick="deleteQuote(${q.id})">Delete</button>
                <hr />
            `;
            quoteList.appendChild(div);
        });
    } catch (err) {
        console.error("Error loading most liked quotes:", err);
        alert("Failed to load top quotes.");
    }
}

// for adding or updating quote
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = contentInput.value.trim();
    const author = authorInput.value.trim();
    const tags = tagsInput.value.split(",").map(tag => tag.trim()).filter(Boolean);
    const quoteTags = tags.map(tag => ({ tag: { name: tag } }));

    const quote = {
        content,
        author,
        likes: 0,
        quoteTags
    };

    try {
        let response;
        if (editingQuoteId) {
            quote.id = editingQuoteId;
            response = await fetch(`${apiBaseUrl}/${editingQuoteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quote)
            });
        } else {
            response = await fetch(apiBaseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quote)
            });
        }

        if (response.ok) {
            alert(editingQuoteId ? "Quote updated!" : "Quote added!");
            resetForm();
            getAllQuotes();
        } else {
            alert("Failed to save quote.");
        }
    } catch (err) {
        console.error("Error saving quote:", err);
        alert("Error saving quote.");
    }
});

// For edit a quote
function editQuote(id, content, author, tags) {
    contentInput.value = content;
    authorInput.value = author;
    tagsInput.value = tags;
    editingQuoteId = id;
    saveBtn.textContent = "Update";
    cancelBtn.style.display = "inline-block";
}

// For canceling edit
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
});

// FOr deleting quote
async function deleteQuote(id) {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
        const response = await fetch(`${apiBaseUrl}/${id}`, { method: "DELETE" });
        if (response.ok) {
            alert("Quote deleted.");
            getAllQuotes();
        } else {
            alert("Failed to delete quote.");
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting quote.");
    }
}

// For like quote
async function likeQuote(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/${id}/like`, { method: "POST" });
        if (response.ok) {
            getAllQuotes();
        } else {
            alert("Failed to like quote.");
        }
    } catch (err) {
        console.error("Error liking quote:", err);
        alert("Error liking quote.");
    }
}

// For loading quotes from Gist
async function loadGistQuotes() {
    try {
        const response = await fetch("https://gist.githubusercontent.com/robatron/a66acc0eed3835119817/raw");
        const text = await response.text();
        const lines = text.split("\n").filter(Boolean).slice(0, 10);

        for (const line of lines) {
            const [quote, author] = line.split(" - ");
            await fetch(apiBaseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: quote.trim(), author: author?.trim(), likes: 0, quoteTags: [] })
            });
        }

        alert("Sample quotes loaded.");
        getAllQuotes();
    } catch (err) {
        console.error("Error loading gist quotes:", err);
        alert("Failed to load from gist.");
    }
}

// For reseting form
function resetForm() {
    form.reset();
    editingQuoteId = null;
    saveBtn.textContent = "Save Quote";
    cancelBtn.style.display = "none";
}

// For connecting buttons
document.getElementById("btnLoadAll").addEventListener("click", getAllQuotes);
document.getElementById("btnLoadGist").addEventListener("click", loadGistQuotes);
document.getElementById("btnTop10")?.addEventListener("click", getMostLikedQuotes);

// For initial load
getAllQuotes();

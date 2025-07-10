const form = document.getElementById("registrationForm");
const shareBtn = document.getElementById("shareBtn");
const shareCountText = document.getElementById("shareCount");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

const ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID_HERE/exec";

let shareCount = localStorage.getItem("shareCount") || 0;
shareCount = parseInt(shareCount);
updateShareUI();

function updateShareUI() {
  shareCountText.textContent = `Click count: ${shareCount}/5`;
  if (shareCount >= 5) {
    shareBtn.disabled = true;
    shareCountText.textContent = "Sharing complete. Please continue.";
  }
}

shareBtn.addEventListener("click", () => {
  if (shareCount < 5) {
    const message = encodeURIComponent("Hey buddy, join Tech For Girls Community!");
    const link = `https://wa.me/?text=${message}`;
    window.open(link, "_blank");
    shareCount++;
    localStorage.setItem("shareCount", shareCount);
    updateShareUI();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (shareCount < 5) {
    alert("Please share on WhatsApp at least 5 times before submitting.");
    return;
  }

  const formData = new FormData(form);

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      body: formData
    });

    const text = await res.text();
    if (text === "OK") {
      message.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
      form.querySelectorAll("input, button").forEach(el => el.disabled = true);
      localStorage.setItem("submitted", "true");
    } else {
      throw new Error(text);
    }
  } catch (err) {
    console.error("🚨 Submit failed:", err);
    alert("Something went wrong. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Registration";
  }
});

// Disable form if already submitted
if (localStorage.getItem("submitted")) {
  form.querySelectorAll("input, button").forEach(el => el.disabled = true);
  message.textContent = "🎉 Your submission has already been recorded.";
}


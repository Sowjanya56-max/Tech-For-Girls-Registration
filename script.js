document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const shareBtn = document.getElementById("shareBtn");
  const submitBtn = document.getElementById("submitBtn");
  const shareCountDisplay = document.getElementById("shareCount");
  const message = document.getElementById("message");

  let shareCount = parseInt(localStorage.getItem("shareCount")) || 0;
  const hasSubmitted = localStorage.getItem("hasSubmitted") === "true";

  // Disable form if already submitted
  if (hasSubmitted) {
    form.querySelectorAll("input, button").forEach(el => el.disabled = true);
    message.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
    return;
  }

  // Show share count and message
  function updateShareUI() {
    shareCountDisplay.textContent = `Click count: ${shareCount}/5`;

    if (shareCount >= 5) {
      shareBtn.disabled = true;
      shareBtn.textContent = "✅ Shared";
      message.textContent = "Sharing complete. Please continue.";
    }
  }

  updateShareUI();

  // ✅ WhatsApp Share Button
  shareBtn.addEventListener("click", () => {
    if (shareCount < 5) {
      const text = "Hey buddy, join Tech For Girls Community! 💖 https://sowjanya56-max.github.io/";
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappURL, "_blank");

      shareCount++;
      localStorage.setItem("shareCount", shareCount);
      updateShareUI();
    }
  });

  // ✅ Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (shareCount < 5) {
      alert("Please share on WhatsApp 5 times before submitting.");
      return;
    }

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const college = form.college.value.trim();
    const screenshot = form.screenshot.files[0];

    if (!name || !phone || !email || !college || !screenshot) {
      alert("Please fill all fields and upload the screenshot.");
      return;
    }

    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("college", college);
    formData.append("screenshot", screenshot);

    // Debug: show all formData in console
    console.log([...formData.entries()]);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxL4yK2ttlG2Pk9-dr342LTOVBGZqCqiM1MykVbXFw3xgb9b19B32Y9Un0pcJ9yFLJh/exec", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        localStorage.setItem("hasSubmitted", "true");
        form.querySelectorAll("input, button").forEach(el => el.disabled = true);
        message.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
      } else {
        throw new Error("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("🚨 Submit failed:", err);
      alert("Submit failed: " + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Registration";
    }
  });
});




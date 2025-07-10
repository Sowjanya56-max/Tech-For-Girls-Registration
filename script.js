
/* -----------------------------------------------------------
   Tech‑for‑Girls – script.js  (v1.1)
   -----------------------------------------------------------
   – Counts WhatsApp shares (5×) with localStorage
   – Sends form data + file to Google Apps Script Web App
   – Prevents duplicate submissions
   – Shows success banner or error alert
----------------------------------------------------------- */

// ---------- 1.  DOM  Handles ----------
const shareBtn   = document.getElementById('shareBtn');
const counterTxt = document.getElementById('counterText');
const submitBtn  = document.getElementById('submitBtn');
const formEl     = document.getElementById('regForm');
const thanksMsg  = document.getElementById('thanksMsg');

// ---------- 2.  Config ----------
/*  << Paste YOUR live Web App URL between the quotes >>  */
const ENDPOINT = "https://script.google.com/macros/s/AKfycbwBtp1om1KD5sChoXsQLWdTkcYY7mwJ0fCIEZj8R4zVZT2_3UHE-BdQpeEKmbo1Wy8H/exec";

// ---------- 3.  State from localStorage ----------
let shareCount   = +localStorage.getItem('tfg-share')     || 0;
let alreadySent  =  localStorage.getItem('tfg-submitted') === 'yes';

// ---------- 4.  Init ----------
updateCounter();
if (alreadySent) freezeForm();      // Disable everything if already submitted

// ---------- 5.  WhatsApp Share Button ----------
shareBtn.addEventListener('click', () => {
  if (shareCount >= 5) return;      // Guard if already done
  const text = encodeURIComponent("Hey Buddy, join the Tech For Girls Community 💖");
  window.open(`https://wa.me/?text=${text}`, '_blank');

  shareCount++;
  localStorage.setItem('tfg-share', shareCount);
  updateCounter();
});

function updateCounter() {
  counterTxt.textContent = `Click count: ${shareCount}/5`;
  if (shareCount >= 5) {
    counterTxt.textContent += ' ✅';
    submitBtn.disabled = false;
    shareBtn.classList.add('disabled');
  }
}

// ---------- 6.  Submit Handler ----------
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (shareCount < 5) {
    alert("Please share on WhatsApp 5 times before submitting.");
    return;
  }

  // Build multipart/form‑data
  const fd = new FormData(formEl);

  // UI feedback
  submitBtn.textContent = "Submitting…";
  submitBtn.disabled = true;

  try {
    /* --- 6.1  Send to Google Apps Script --- */
    const res = await fetch(ENDPOINT, { method: 'POST', body: fd });

    /* --- 6.2  Handle response --- */
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Server responded ${res.status}: ${txt}`);
    }

    // Success!
    localStorage.setItem('tfg-submitted', 'yes');
    freezeForm();
    console.log("✅ Form submitted successfully");

  } catch (err) {
    console.error("🚨 Submit failed:", err);
    alert("Submit failed: " + err.message);
    submitBtn.textContent = "Submit Registration";
    submitBtn.disabled  = false;
  }
});

/* ---------- 7.  Utility: Freeze Form After Submit ---------- */
function freezeForm() {
  // Hide interactive elements
  formEl.reset();
  formEl.classList.add('disabled');
  shareBtn.style.display   = 'none';
  counterTxt.style.display = 'none';
  submitBtn.style.display  = 'none';
  // Show thank‑you banner
  thanksMsg.style.display  = 'block';
}

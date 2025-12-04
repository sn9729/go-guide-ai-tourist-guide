document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tripForm = document.getElementById("tripForm");
  const outputDiv = document.getElementById("output");
  const actionButtons = document.getElementById("actionButtons");
  const copyBtn = document.getElementById("copyBtn");
  const printBtn = document.getElementById("printBtn");

  // Load API Key logic
  function getApiKey() {
    // 1. Check Config (Primary & Only source now)
    if (typeof CONFIG !== 'undefined' && CONFIG.API_KEY && CONFIG.API_KEY !== "YOUR_API_KEY_HERE") {
      return CONFIG.API_KEY;
    }
    return null;
  }

  // Form Submission
  tripForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const apiKey = getApiKey();
    if (!apiKey) {
      alert("⚠️ API Key missing! Please configure config.js with your Together API Key.");
      return;
    }

    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const days = document.getElementById("days").value.trim();
    const budget = document.getElementById("budget").value.trim();
    const interests = document.getElementById("interests").value.trim();

    // Reset output
    outputDiv.innerHTML = '<div class="output-box"><div class="loading">🧠 AI is crafting your perfect itinerary</div></div>';
    actionButtons.classList.add("hidden");

    const prompt = `
You are a smart AI travel planner with expertise in creating detailed, personalized travel experiences.

Plan a comprehensive ${days}-day trip from ${source} to ${destination}.
Budget: ₹${budget}
Interests: ${interests}

Please provide:
- A detailed daily itinerary with specific activities and timings
- Budget breakdown for each day
- Local cuisine recommendations
- Transportation suggestions
- Cultural tips and must-see attractions
- Estimated costs for activities, meals, and accommodation

Format the response in Markdown. Use bolding for key terms, lists for activities, and headers for days. Make it visually appealing.
`;

    try {
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 6000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const markdownContent = data.choices[0].message.content.trim();
        const htmlContent = marked.parse(markdownContent);

        outputDiv.innerHTML = `<div class="output-box">${htmlContent}</div>`;
        actionButtons.classList.remove("hidden");
      } else {
        outputDiv.innerHTML = '<div class="output-box">⚠️ Unable to generate your travel plan. Please try again with different details.</div>';
      }
    } catch (error) {
      console.error("Error:", error);
      outputDiv.innerHTML = `<div class="output-box">❌ Error: ${error.message}. Please check your API key in config.js.</div>`;
    }
  });

  // Input Animation
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
      this.parentElement.style.transform = 'scale(1)';
    });
  });

  // Copy Functionality
  copyBtn.addEventListener("click", () => {
    const content = outputDiv.innerText;
    navigator.clipboard.writeText(content).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  });

  // Print Functionality
  printBtn.addEventListener("click", () => {
    window.print();
  });
});

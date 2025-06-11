document.getElementById("tripForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const source = document.getElementById("source").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const days = document.getElementById("days").value.trim();
  const budget = document.getElementById("budget").value.trim();
  const interests = document.getElementById("interests").value.trim();
  const outputDiv = document.getElementById("output");


  outputDiv.innerHTML = '<div class="output-box"><div class="loading">🧠 AI is crafting your perfect itinerary</div></div>';

  const apiKey = "tgp_v1_b9KWNtGAZjAWI4dI8RnlQA5eyCKMKyMDQVbXPiYzvNQ"; // 🔑 Replace with your real API key
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

Format the response in a clear, organized manner with emojis to make it visually appealing within 6000 tokens.
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

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      outputDiv.innerHTML = `<div class="output-box">${data.choices[0].message.content.trim()}</div>`;
    } else {
      outputDiv.innerHTML = '<div class="output-box">⚠️ Unable to generate your travel plan. Please try again with different details.</div>';
    }
  } catch (error) {
    console.error("Error:", error);
    outputDiv.innerHTML = '<div class="output-box">❌ Something went wrong while planning your trip. Please check your connection and try again.</div>';
  }
});


document.querySelectorAll('input').forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
  });
  
  input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
  });
});
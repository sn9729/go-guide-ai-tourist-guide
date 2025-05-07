document.getElementById("tripForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const source = document.getElementById("source").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const days = document.getElementById("days").value.trim();
  const budget = document.getElementById("budget").value.trim();
  const interests = document.getElementById("interests").value.trim();
  const outputDiv = document.getElementById("output");

  outputDiv.innerHTML = "⏳ Generating";

  const apiKey = "tgp_v1_b9KWNtGAZjAWI4dI8RnlQA5eyCKMKyMDQVbXPiYzvNQ"; // 🔑 Replace with your real API key
  const prompt = `
You are a smart AI travel planner.

Plan a ${days}-day trip from ${source} to ${destination}.
Budget: Rupees ${budget}. Interests: ${interests}.
Provide a daily travel itinerary with recommendations and approximate costs.
`;

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo", // 🦙 Changed model here
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      outputDiv.innerHTML = `<pre>${data.choices[0].message.content.trim()}</pre>`;
    } else {
      outputDiv.innerHTML = "⚠️ No valid response from AI.";
    }
  } catch (error) {
    console.error("Error:", error);
    outputDiv.innerHTML = "❌ Error generating. Please try again.";
  }
});

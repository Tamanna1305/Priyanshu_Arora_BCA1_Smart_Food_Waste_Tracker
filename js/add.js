
    const statusText = document.getElementById("voice-status");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    function speakFeedback(text) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    }

    function startRecognition(targetInput, label, micBtn) {
      if (!SpeechRecognition) {
        alert("Sorry, your browser doesn't support speech recognition.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      statusText.textContent = `🎙 Listening for ${label}...`;
      micBtn.classList.add("listening");
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        targetInput.value = transcript;

        const feedback = label === "food name"
          ? `Tracking ${transcript}. Got it!`
          : `Quantity set to ${transcript}!`;

        statusText.textContent = `✅ ${feedback}`;
        speakFeedback(feedback);
      };

      recognition.onerror = () => {
        statusText.textContent = "❌ Oops! Didn't catch that. Try again.";
        speakFeedback("Sorry, I didn't catch that.");
      };

      recognition.onend = () => {
        micBtn.classList.remove("listening");
      };
    }

    document.getElementById("voiceFoodBtn").addEventListener("click", function () {
      startRecognition(document.getElementById("food"), "food name", this);
    });

    document.getElementById("voiceQtyBtn").addEventListener("click", function () {
      startRecognition(document.getElementById("quantity"), "quantity", this);
    });

    // Save to localStorage on form submit
    document.querySelector(".food-form").addEventListener("submit", function (e) {
      e.preventDefault();

      const food = document.getElementById("food").value.trim();
      const quantity = document.getElementById("quantity").value.trim();
      const purchase = document.getElementById("purchase").value;
      const expiry = document.getElementById("expiry").value;

      if (!food || !quantity || !purchase || !expiry) {
        alert("Please fill in all fields.");
        return;
      }

      const newItem = { food, quantity, purchase, expiry };
      const existingItems = JSON.parse(localStorage.getItem("foodItems")) || [];
      existingItems.push(newItem);
      localStorage.setItem("foodItems", JSON.stringify(existingItems));

      alert("Food item tracked successfully!");
      this.reset();
    });
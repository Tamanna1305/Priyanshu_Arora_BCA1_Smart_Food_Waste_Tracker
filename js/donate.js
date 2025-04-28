document.addEventListener("DOMContentLoaded", () => {
    const donationForm = document.getElementById("donationForm");
    const thankYouMessage = document.getElementById("thankYouMessage");
    const historyTableBody = document.querySelector("#historyTable tbody");
    const totalDonations = document.getElementById("totalDonations");
  
    loadDonationHistory();
  
    donationForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const food = document.getElementById("food").value.trim();
      const quantity = document.getElementById("quantity").value.trim();
      const location = document.getElementById("location").value.trim();
      const datetime = document.getElementById("datetime").value;
  
      const donation = { food, quantity, location, datetime };
  
      const existing = JSON.parse(localStorage.getItem("donations")) || [];
      existing.push(donation);
      localStorage.setItem("donations", JSON.stringify(existing));
  
      donationForm.reset();
      thankYouMessage.classList.remove("hidden");
      thankYouMessage.classList.add("show");
  
      loadDonationHistory();
      runConfetti();
  
      setTimeout(() => {
        thankYouMessage.classList.remove("show");
        thankYouMessage.classList.add("hidden");
      }, 4000);
    });
  
    function loadDonationHistory() {
      let donations = JSON.parse(localStorage.getItem("donations")) || [];
  
      const today = new Date();
      donations = donations.filter(donation => {
        const donationDate = new Date(donation.datetime);
        const daysDiff = (today - donationDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      });
  
      localStorage.setItem("donations", JSON.stringify(donations));
  
      historyTableBody.innerHTML = "";
  
      donations.forEach((donation, index) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${donation.food}</td>
          <td>${donation.quantity}</td>
          <td>${donation.location}</td>
          <td>${new Date(donation.datetime).toLocaleString()}</td>
          <td><button class="delete-btn" onclick="deleteDonation(${index})">Delete</button></td>
        `;
  
        historyTableBody.appendChild(row);
      });
  
      totalDonations.textContent = `Total Donations: ${donations.length}`;
    }
  
    window.deleteDonation = function(index) {
      let donations = JSON.parse(localStorage.getItem("donations")) || [];
      donations.splice(index, 1);
      localStorage.setItem("donations", JSON.stringify(donations));
      loadDonationHistory();
    }
  
    function runConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  });
  
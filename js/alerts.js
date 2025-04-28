function loadFoodAlerts() {
  const foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
  const today = new Date();

  const expiredList = document.getElementById("expiredList");
  const expiringSoonList = document.getElementById("expiringSoonList");
  const freshList = document.getElementById("freshList");

  expiredList.innerHTML = "";
  expiringSoonList.innerHTML = "";
  freshList.innerHTML = "";

  foodItems.forEach((item, index) => {
    const expiryDate = new Date(item.expiry);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    const card = document.createElement("div");
    card.className = "alert-card";

    card.innerHTML = `
      <strong>${item.food}</strong><br>
      Quantity: ${item.quantity}<br>
      Expiry: ${expiryDate.toISOString().split("T")[0]}<br>
      <span class="badge ${getBadgeClass(daysLeft)}">
        ${daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} day(s) ago` :
          daysLeft <= 3 ? `${daysLeft} day(s) left` : "Fresh"}
      </span><br>
      <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
    `;

    if (daysLeft < 0) {
      expiredList.appendChild(card);
    } else if (daysLeft <= 3) {
      expiringSoonList.appendChild(card);
    } else {
      freshList.appendChild(card);
    }
  });
}

function getBadgeClass(daysLeft) {
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 3) return "soon";
  return "fresh";
}

function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    const foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    foodItems.splice(index, 1);
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
    loadFoodAlerts();
    showToast("Item deleted successfully!"); // We'll add showToast next
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast"; 
  }, 3000);
}

loadFoodAlerts();

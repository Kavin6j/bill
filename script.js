// Prices of menu items
const prices = {
    "pani-puri": 40,
    "rose-milk": 40,
    "badam-milk": 40,
    "kuzhi-paniyaram": 40,
    "paal-sarbath": 50,
    "halwa": 40,
    "milk-pudding": 30,
    "thattu-vadai": 40,
  };
  
  // Function to calculate the total amount
  function calculateTotal() {
    let total = 0;
    for (const item in prices) {
      const qty = parseInt(document.getElementById(item).value) || 0;
      total += qty * prices[item];
    }
    document.getElementById("total-amount").textContent = total;
  }
  
  // Function to generate the bill and send it to the backend
  async function generateBill() {
    const bill = {};
    let total = 0;
  
    // Loop through each item and capture quantities
    for (const item in prices) {
      const qty = parseInt(document.getElementById(item).value) || 0;
      if (qty > 0) {
        bill[item] = {
          qty,
          price: prices[item],
          total: qty * prices[item],
        };
        total += qty * prices[item];
      }
    }
  
    // Add total amount to the bill
    bill.totalAmount = total;
  
    try {
      // Send the bill to the backend
      const response = await fetch("http://localhost:3000/save-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill),
      });
  
      const result = await response.json();
      alert(result.message); // Show success message
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save bill. Please try again.");
    }
  }
  
  // Attach event listeners to input fields
  document.querySelectorAll("#menu input").forEach((input) => {
    input.addEventListener("input", calculateTotal);
  });
  
  // Attach event listener to the "Generate Bill" button
  document.querySelector("button").addEventListener("click", generateBill);
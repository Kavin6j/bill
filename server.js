const express = require("express");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Directory to store bills
const billsDir = path.join(__dirname, "bills");
if (!fs.existsSync(billsDir)) {
  fs.mkdirSync(billsDir);
}

// Endpoint to save bills
app.post("/save-bill", (req, res) => {
  const bill = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const billFilePath = path.join(billsDir, `bill-${timestamp}.json`);

  // Save bill as JSON
  fs.writeFileSync(billFilePath, JSON.stringify(bill, null, 2));

  // Update Excel file
  updateExcelFile(bill);

  res.send({ success: true, message: "Bill saved successfully!" });
});

// Function to update Excel file
function updateExcelFile(bill) {
  const excelFilePath = path.join(__dirname, "sales-report.xlsx");
  let workbook;
  let worksheet;

  if (fs.existsSync(excelFilePath)) {
    workbook = xlsx.readFile(excelFilePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = xlsx.utils.book_new();
    worksheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sales");
  }

  // Add new row to Excel
  const newRow = { ...bill, Date: new Date().toLocaleString() };
  xlsx.utils.sheet_add_json(worksheet, [newRow], { skipHeader: true, origin: -1 });
  xlsx.writeFile(workbook, excelFilePath);
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
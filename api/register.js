
const { google } = require("googleapis");
const sheets = google.sheets("v4");

async function appendToGoogleSheet(data) {
  // Load the credentials from the JSON file you downloaded
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_API_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_API_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // Your Google Sheet ID
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID_EVENT_REGISTRATION;

  // The range where you want to append the data (e.g., "Sheet1!A2:F2")
  const range = "Sheet1!A2:F2";

  // Construct the values to be appended
  const values = [
    [
      data.dateTime,
      data.name,
      data.regNo,
      data.year,
      data.dept,
      data.email,
      data.phone,
    ],
  ];

  // Append data to the Google Sheet
  await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    resource: { values },
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const formData = req.body;
      

      // Call the function to append data to Google Sheet
      await appendToGoogleSheet(formData);

      // Return success response
      res.status(200).json({ status: "true" });
    } catch (error) {
      console.error("Error:", error);
      // Return error response
      res.status(500).json({ status: "false" });
    }
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

const express = require('express');
const { google } = require('googleapis');
const app = express();


const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const spreadsheetId = 'SPREADSHEET_ID';
const range = ''; 
app.use(express.json());



app.post('/submit-registration', async (req, res) => {
    try {
        const auth = await authorize(); 

        const values = [Object.values(req.body)];

        const response = await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values,
            },
        });

        res.json({ message: 'Registration successful', response: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

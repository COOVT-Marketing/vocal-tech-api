const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); 

// The API Route for EDM Lead Network
app.post('/api/generate-did', async (req, res) => {
    const { phoneNumber, zipCode } = req.body;
    
    // Clean phone to 10 digits for the CRM
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

    const details = new URLSearchParams();
    details.append('lp_campaign_id', '69df65857cdd2'); 
    details.append('lp_campaign_key', 'X83NDRQtKjBqdHZLVwYv'); 
    details.append('caller_id', cleanPhone);
    details.append('zip_code', zipCode);

    try {
        const response = await fetch('https://track.edmleadnetwork.com/call-preping.do', {
            method: 'POST',
            body: details,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const resultText = await response.text();
        console.log("CRM Response:", resultText);

        // Safety check for HTML error pages
        if (resultText.includes('<!DOCTYPE') || resultText.includes('<html')) {
            return res.json({ success: false, message: "CRM Error: Received HTML instead of data." });
        }

        const data = JSON.parse(resultText);
        if (data.success) {
            res.json({ success: true, did: data.number });
        } else {
            res.json({ success: false, message: data.message || "Lead Rejected" });
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: "Server connection failed" });
    }
});

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Vocal Tech Portal is live on port ${PORT}`);
});
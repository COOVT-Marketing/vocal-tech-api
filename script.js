async function getDynamicDID() {
    const phoneInput = document.getElementById('phone');
    const zipInput = document.getElementById('zip');
    const displayBox = document.getElementById('displayDID');
    const statusMsg = document.getElementById('statusMessage');

    if (!phoneInput.value || !zipInput.value) {
        alert("Enter Phone and Zip.");
        return;
    }

    displayBox.innerText = "PENDING...";
    displayBox.style.color = "#548888";

    try {
        const response = await fetch('/api/generate-did', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: phoneInput.value,
                zipCode: zipInput.value
            })
        });

        const result = await response.json();

        if (result.success) {
            displayBox.innerText = result.did;
            displayBox.style.color = "#ffffff";
            statusMsg.innerText = "DID Generated!";
            statusMsg.style.color = "#4CAF50";
        } else {
            displayBox.innerText = "FAILED";
            displayBox.style.color = "#ff4d4d";
            statusMsg.innerText = result.message;
        }
    } catch (error) {
        displayBox.innerText = "OFFLINE";
        statusMsg.innerText = "Error: Check if CMD server is running.";
    }
}
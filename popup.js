document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const label = document.querySelector('label[for="toggleButton"]');
    const statusText = document.getElementById('statusText'); // The new element

    function updateButtonState() {
        if (toggleButton.checked) {
            label.textContent = 'Turn OFF';
            statusText.textContent = 'Extension is on'; // Update status text
            chrome.runtime.sendMessage({ extensionEnabled: true });
        } else {
            label.textContent = 'Turn ON';
            statusText.textContent = 'Extension is off'; // Update status text
            chrome.runtime.sendMessage({ extensionEnabled: false });
        }
    }

    chrome.storage.sync.get('isToggledOn', function(data) {
        toggleButton.checked = data.isToggledOn || false;
        updateButtonState();
    });

    toggleButton.addEventListener('change', function() {
        chrome.storage.sync.set({ isToggledOn: toggleButton.checked });
        updateButtonState();
    });
});
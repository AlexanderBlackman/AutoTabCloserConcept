document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const label = document.querySelector('label[for="toggleButton"]');
    const statusText = document.getElementById('statusText');

    const whitelistSiteBtn = document.getElementById('whitelistSite');
    const whitelistPageBtn = document.getElementById('whitelistPage');
    const allowedBtn = document.getElementById('allowed');
    const whitelistedUrlsDiv = document.getElementById('whitelistedUrls');

    function updateButtonState() {
        if (toggleButton.checked) {
            label.textContent = 'Turn OFF';
            statusText.textContent = 'Extension is on';
            chrome.runtime.sendMessage({ extensionEnabled: true });
        } else {
            label.textContent = 'Turn ON';
            statusText.textContent = 'Extension is off';
            chrome.runtime.sendMessage({ extensionEnabled: false });
        }
    }

    whitelistSiteBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const site = new URL(tabs[0].url).hostname;
            addToWhitelist(`site:${site}`);
        });
    });

    whitelistPageBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            addToWhitelist(`page:${tabs[0].url}`);
        });
    });

    allowedBtn.addEventListener('click', function() {
        if (whitelistedUrlsDiv.style.display === 'none') {
            whitelistedUrlsDiv.style.display = 'block';
        } else {
            whitelistedUrlsDiv.style.display = 'none';
        }
    });

    function addToWhitelist(entry) {
        chrome.storage.sync.get('whitelist', function(data) {
            let whitelist = data.whitelist || [];
            if (!whitelist.includes(entry)) {
                whitelist.push(entry);
                chrome.storage.sync.set({ 'whitelist': whitelist }, function() {
                    displayWhitelistedEntry(entry);
                });
            }
        });
    }

    function displayWhitelistedEntry(entry) {
        const div = document.createElement('div');
        div.textContent = entry.split(':')[1];
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', function() {
            div.remove();
            removeFromWhitelist(entry);
        });

        div.appendChild(removeButton);
        whitelistedUrlsDiv.appendChild(div);
    }

    function removeFromWhitelist(entry) {
        chrome.storage.sync.get('whitelist', function(data) {
            let whitelist = data.whitelist || [];
            const index = whitelist.indexOf(entry);
            if (index > -1) {
                whitelist.splice(index, 1);
                chrome.storage.sync.set({ 'whitelist': whitelist });
            }
        });
    }

    // Initial load
    chrome.storage.sync.get('isToggledOn', function(data) {
        toggleButton.checked = data.isToggledOn || false;
        updateButtonState();
    });

    chrome.storage.sync.get('whitelist', function(data) {
        (data.whitelist || []).forEach(entry => displayWhitelistedEntry(entry));
    });

    toggleButton.addEventListener('change', function() {
        chrome.storage.sync.set({ isToggledOn: toggleButton.checked });
        updateButtonState();
    });
});
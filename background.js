let isExtensionEnabled = false;
let lastActiveTabId = null;
let whitelist = [];

// Retrieve the whitelist from storage on startup
chrome.storage.sync.get('whitelist', function(data) {
    whitelist = data.whitelist || [];
    console.log('Retrieved whitelist:', whitelist);

});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.hasOwnProperty('extensionEnabled')) {
        isExtensionEnabled = message.extensionEnabled;
        console.log("Extension state updated: ", isExtensionEnabled);
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    const previouslyActiveTabId = lastActiveTabId;
    lastActiveTabId = activeInfo.tabId;  // First, update the last active tab to the currently active one.
    console.log("Newly activated tab ID:", lastActiveTabId);

    if (!isExtensionEnabled || previouslyActiveTabId === null) {
        return;  // Exit if extension is disabled or if there's no previously recorded tab.
    }

    // Check if the old tab is on the whitelist
    chrome.tabs.get(previouslyActiveTabId, function(tab) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }

        const tabUrl = tab.url;
        const tabDomain = new URL(tabUrl).hostname;

            // Debug logs:
    console.log('Checking tab with URL:', tabUrl);
    console.log('Derived domain:', tabDomain);

        // Check if the tab's URL or domain is on the whitelist
        if (whitelist.includes(`page:${tabUrl}`) || whitelist.includes(`site:${tabDomain}`)) {
            console.log(`Tab with URL ${tabUrl} is whitelisted. Not closing.`);
            return;
        }

        setTimeout(() => {
            console.log("Attempting to close tab:", previouslyActiveTabId);
            chrome.tabs.remove(previouslyActiveTabId, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else {
                    console.log("Successfully closed tab:", previouslyActiveTabId);
                }
            });
        }, 500);
    });
});
let isExtensionEnabled = false;
let lastActiveTabId = null;
let currentlyActiveTabId = null;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.hasOwnProperty('extensionEnabled')) {
        isExtensionEnabled = message.extensionEnabled;
        console.log("Extension state updated: ", isExtensionEnabled);
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    currentlyActiveTabId = activeInfo.tabId;
    console.log("Newly activated tab ID:", currentlyActiveTabId);

    // This timeout solves the "Tab is being resized" error.
    setTimeout(() => {
        // If extension is enabled and there's a previously recorded tab to close
        if (isExtensionEnabled && lastActiveTabId !== null && lastActiveTabId !== currentlyActiveTabId) {
            console.log("Attempting to close tab:", lastActiveTabId);
            chrome.tabs.remove(lastActiveTabId, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else {
                    console.log("Successfully closed tab:", lastActiveTabId);
                }
            });
        }

        // After potentially closing the old tab, update the lastActiveTabId
        lastActiveTabId = currentlyActiveTabId;
    }, 500);
});
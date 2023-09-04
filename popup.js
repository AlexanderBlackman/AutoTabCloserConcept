document.addEventListener('DOMContentLoaded', function() {
    const toggleExtension = document.getElementById('toggleExtension');
    const toggleConfirmation = document.getElementById('toggleConfirmation');

    chrome.storage.local.get(['extensionState', 'confirmationState'], function(data) {
        toggleExtension.checked = data.extensionState || false;
        toggleConfirmation.checked = data.confirmationState || false;

    });

    toggleExtension.addEventListener('change', function() {
        chrome.storage.local.set({ extensionState: toggleExtension.checked });
    });

    toggleConfirmation.addEventListener('change', function() {
        chrome.storage.local.set({ confirmationState: toggleConfirmation.checked });
    });
});
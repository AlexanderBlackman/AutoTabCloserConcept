document.getElementById('confirm').addEventListener('click', () => {
    chrome.runtime.sendMessage('confirm');
  });
  
  document.getElementById('cancel').addEventListener('click', () => {
    window.close();
  });
  
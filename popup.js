document.getElementById('start').addEventListener('click', () => {
   chrome.tabs.query({active: true, currntWindow: true}, (tabs) => {
      if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "spawn"});
      }
   });
});

document.getElementById('kill').addEventListener('click', () => {
   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "kill"});
      }
   });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'joinURL') {
    chrome.tabs.update(sender.tab.id, { url: message.url });
  }
});

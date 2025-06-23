chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateUrl' && message.url) {
    chrome.tabs.update(sender.tab.id, { url: message.url });
  }
});

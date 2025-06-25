chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'joinURL' && message.url && message.button) {
    const button = message.button

    try {
      const url = new URL(message.url);
      const gameId = url.pathname.match(/\/games\/(\d+)/)?.[1];
      const linkCode = url.searchParams.get('privateServerLinkCode');

      if (gameId && linkCode) {
        const robloxProtocolLink = `roblox://placeID=${gameId}&LinkCode=${linkCode}`;
        chrome.tabs.update(sender.tab.id, { url: robloxProtocolLink });
      } else {
        throw new Error();
      }
    } catch {
      const originalColor = window.getComputedStyle(button).backgroundColor;
      const originalText = button.textContent;

      button.style.backgroundColor = 'red';
      button.textContent = "!!";

      setTimeout(() => {
        button.style.backgroundColor = originalColor;
        button.textContent = originalText;
      }, 1000);
    }
  }
});

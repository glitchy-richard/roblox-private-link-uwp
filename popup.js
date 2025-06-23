document.addEventListener('DOMContentLoaded', function () {
  const serverLinkInput = document.getElementById('vipLinkInput');
  const playBtn = document.getElementById('joinBtn');
  const clearBtn = document.getElementById('clearBtn');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url) return;

    const currentPageURL = new URL(activeTab.url);
    
    if (currentPageURL.searchParams.get("privateServerLinkCode") && serverLinkInput) {
      const originalBtnTxt = playBtn.textContent
      
      serverLinkInput.value = activeTab.url;
      playBtn.textContent = "Join current server on Roblox UWP"

      serverLinkInput.addEventListener("input", () => {
        playBtn.textContent = originalBtnTxt
      }, { once: true })
    }
  });

  playBtn.addEventListener('click', function () {
    const vipLink = serverLinkInput.value.trim();

    try {
      const url = new URL(vipLink);
      const gameIdMatch = url.pathname.match(/\/games\/(\d+)/);
      const gameId = gameIdMatch ? gameIdMatch[1] : null;
      const linkCode = url.searchParams.get('privateServerLinkCode');

      if (gameId && linkCode) {
        const robloxProtocolLink = `roblox://placeID=${gameId}&LinkCode=${linkCode}`;

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const tab = tabs[0];
          chrome.tabs.update(tab.id, { url: robloxProtocolLink });
        });
      } else {
        alert('Invalid Roblox VIP link.');
      }
    } catch (e) {
      alert('Invalid URL format.');
    }
  });

  clearBtn.addEventListener("click", () => {
    serverLinkInput.value = "";
  });
});

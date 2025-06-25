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
    if (!serverLinkInput.value) return;

    const vipLink = serverLinkInput.value.trim();
    chrome.runtime.sendMessage({ action: 'joinURL', url: vipLink, button: playBtn});
  });

  clearBtn.addEventListener("click", () => {
    serverLinkInput.value = "";
  });
});

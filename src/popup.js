function joinServer(rawURL, btn) {
  try {
    const url = new URL(rawURL);
    const gameId = url.pathname.match(/\/games\/(\d+)/)?.[1];
    const linkCode = url.searchParams.get('privateServerLinkCode');

    if (gameId && linkCode) {
      const robloxProtocolLink = `roblox://placeID=${gameId}&LinkCode=${linkCode}`;
      chrome.runtime.sendMessage({ action: "joinURL", url: robloxProtocolLink });
    } else {
      throw new Error();
    }
  } catch {
    const originalColor = window.getComputedStyle(btn).backgroundColor;
    const originalText = btn.textContent;

    btn.style.backgroundColor = 'red';
    btn.textContent = "!!";

    setTimeout(() => {
      btn.style.backgroundColor = originalColor;
      btn.textContent = originalText;
    }, 1000);
  }
}

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
    joinServer(vipLink, playBtn)
  });

  clearBtn.addEventListener("click", () => {
    serverLinkInput.value = "";
  });
});

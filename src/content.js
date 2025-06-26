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

function addCustomButton() {
  if (document.getElementById('improved-game-actions')) return
  const container = document.getElementById('game-details-play-button-container');
  const defaultJoinBtn = container?.querySelector('button[data-testid="play-button"]');

  if (container && defaultJoinBtn) {
    const actionsGroup = document.createElement('div');
    actionsGroup.id = 'improved-game-actions';
    actionsGroup.style.display = 'flex';
    actionsGroup.style.gap = '2px';
    actionsGroup.style.alignItems = 'center';
    actionsGroup.style.justifyContent = 'center';
    actionsGroup.style.width = '100%';
    actionsGroup.appendChild(defaultJoinBtn);

    const joinUWPBtn = document.createElement('button');
    joinUWPBtn.id = 'join-uwp-button';
    joinUWPBtn.className = 'btn-common-play-game-lg btn-primary-md btn-min-width random-server-button';

    Object.assign(joinUWPBtn.style, {
      width: '66px',
      minWidth: '66px',
      position: 'relative',
    });

    // JoinUWPButton Tooltip: Join on UWP
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Join on UWP';
    Object.assign(tooltip.style, {
      position: 'absolute',
      width: '115px',
      backgroundColor: '#191B1D',
      color: 'white',
      top: '-30px',
      right: '-25px',
      fontSize: '13px',
      padding: '5px',
      borderRadius: '5px',
      zIndex: '10000',
      display: 'none',
      pointerEvents: 'none',
      userSelect: 'none',
      textAlign: 'center',
    });

    // Windows UWP icon
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('icons/uwp.svg')
    icon.alt = "UWP"
    Object.assign(icon.style, {
      width: '44px',
      height: '38px',
      objectFit: 'contain',
      display: 'block',
    });
    icon.onerror = () => {
      icon.remove()
      joinUWPBtn.textContent = "UWP"
    }

    // Click on Join UWP Button
    joinUWPBtn.addEventListener('click', () => {
      joinServer(window.location.href, joinUWPBtn)
    });

    // Tooltip: Join on UWP
    joinUWPBtn.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
    });
    joinUWPBtn.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    joinUWPBtn.appendChild(icon);
    joinUWPBtn.appendChild(tooltip);
    actionsGroup.appendChild(joinUWPBtn);
    container.appendChild(actionsGroup);
  }
}

function addInsertLinkButton() {
  if (document.getElementById("toggleInsertLinkBtn")) return;

  const container = document.getElementsByClassName('rbx-private-server-create')[1];
  if (!container) return;

  const originalBtn = container.querySelector('button.rbx-private-server-create-button');
  if (!originalBtn) return;

  const toggleInsertLinkBtn = document.createElement("button");
  toggleInsertLinkBtn.id = "toggleInsertLinkBtn";
  toggleInsertLinkBtn.className = "btn-more btn-secondary-md btn-min-width";
  toggleInsertLinkBtn.textContent = "Join private server on UWP";
  toggleInsertLinkBtn.style.marginBottom = "0px";
  toggleInsertLinkBtn.style.marginTop = "5px";

  // if (toggleInsertLinkBtn.hasAttribute("disabled")) {
  //   toggleInsertLinkBtn.removeAttribute("disabled")
  // }

  const insertLinkDiv = document.createElement("div");
  insertLinkDiv.id = "linkInsertDiv";
  insertLinkDiv.style.display = "none";
  insertLinkDiv.style.marginTop = "8px";
  insertLinkDiv.style.display = "none"

  const linkInputBox = document.createElement("input");
  linkInputBox.id = "linkInputBox";
  linkInputBox.type = "text";
  linkInputBox.placeholder = "Paste VIP server link";
  linkInputBox.style.marginRight = "6px";
  linkInputBox.style.borderRadius = "8px"
  linkInputBox.style.marginBottom = "3px"
  linkInputBox.style.height = "30px"
  linkInputBox.style.width = "90%"
  linkInputBox.style.border = "none"
  linkInputBox.style.textAlign = "center"

  const joinLinkBtn = document.createElement("button");
  joinLinkBtn.id = "joinLinkBtn";
  joinLinkBtn.textContent = "Join";
  joinLinkBtn.style.borderRadius = "8px"
  joinLinkBtn.style.borderColor = ""
  joinLinkBtn.style.width = "50px"
  joinLinkBtn.style.height = "30px"
  joinLinkBtn.style.border = "none"
  joinLinkBtn.style.backgroundColor = "white"
  joinLinkBtn.style.color = "black"
  insertLinkDiv.appendChild(linkInputBox);
  insertLinkDiv.appendChild(joinLinkBtn);

  toggleInsertLinkBtn.addEventListener('click', () => {
    insertLinkDiv.style.display = insertLinkDiv.style.display === "none" ? "flex" : "none";
  });

  joinLinkBtn.addEventListener('click', () => {
    if (!linkInputBox.value) return;
    joinServer(linkInputBox.value.trim(), joinLinkBtn)
  });

  container.appendChild(toggleInsertLinkBtn);
  container.appendChild(insertLinkDiv);
}

function addJoinUWPButton() {
  const url = new URL(window.location.href);
  if (!url.searchParams.get("privateServerLinkCode")) return false

  addCustomButton();
  return true
}

const observer = new MutationObserver(() => {
  let canbeAdded = addJoinUWPButton()

  if (document.getElementById("improved-game-actions") || !canbeAdded) {
    // console.log("No longer observing for pages changes to add Join UWP Button.")
    observer.disconnect()
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

var psInterval1 = setInterval(function () {
  if (document.getElementsByClassName('rbx-private-server-create').length > 1) {
    clearInterval(psInterval1);
    addInsertLinkButton();

    function refresh() {
      var existingBtn = document.getElementById('toggleInsertLinkBtn');
      if (existingBtn) existingBtn.remove();
      var existingDiv = document.getElementById('linkInsertDiv');
      if (existingDiv) existingDiv.remove();

      var retryInterval = setInterval(function () {
        if (document.getElementsByClassName('rbx-private-server-create').length > 1) {
          clearInterval(retryInterval);
          addInsertLinkButton();
        }
      }, 100);
    }

    var refreshBtn = document.querySelector('.rbx-refresh.refresh-link-icon');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', refresh);
    }
  }
}, 100);
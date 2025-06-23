function fitTextInto(element, options = {}) {
  const {
    minSizePx = 8,
    stepPx = 1
  } = options;

  const { clientWidth, clientHeight, scrollWidth, scrollHeight } = element;
  let style = window.getComputedStyle(element);
  let fontSize = parseFloat(style.fontSize);

  while (
    (element.scrollWidth > clientWidth || element.scrollHeight > clientHeight)
    && fontSize > minSizePx
  ) {
    fontSize -= stepPx;
    element.style.fontSize = fontSize + 'px';
  }
}

function queryServer(robloxProtocolLink) {
  chrome.runtime.sendMessage({ action: 'updateUrl', url: robloxProtocolLink });
}

function addCustomButton() {
  const container = document.getElementById('game-details-play-button-container');
  const playButton = container?.querySelector('button[data-testid="play-button"]');

  if (container && playButton && !document.getElementById('my-button-group')) {
    const group = document.createElement('div');
    group.id = 'my-button-group';
    group.style.display = 'flex';
    group.style.gap = '2px';
    group.style.alignItems = 'center';
    group.style.justifyContent = 'center';
    group.style.width = '100%';
    group.appendChild(playButton);

    const button = document.createElement('button');
    button.id = 'my-hop-button';
    button.className = 'btn-common-play-game-lg btn-primary-md btn-min-width random-server-button';

    Object.assign(button.style, {
      width: '66px',
      minWidth: '66px',
      position: 'relative',
    });

    const tooltip = document.createElement('div');
    tooltip.className = 'random-server-tooltip';
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

    tooltip.textContent = 'Join on UWP';
    const icon = document.createElement('img');
    Object.assign(icon, {
      src: chrome.runtime.getURL('icons/uwp.svg'),
      alt: 'UWP',
    });
    Object.assign(icon.style, {
      width: '44px',   
      height: '38px',
      objectFit: 'contain', 
      display: 'block',
    });

    const text = document.createElement('span');
    text.textContent = 'UWP';
    Object.assign(text.style, {
      fontSize: 'max(0.9vw, 14px)',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      lineHeight: '1',
      overflow: 'hidden'
    });

    fitTextInto(text, { minSizePx: 10, stepPx: 0.5 });
    button.appendChild(tooltip);

    icon.onerror = () => {
      icon.remove()
      button.appendChild(text);
    }

    button.appendChild(icon);

    button.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
    });

    button.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    button.addEventListener('click', () => {
      const url = new URL(window.location.href);
      const gameId = url.pathname.match(/\/games\/(\d+)/)[1];
      const linkCode = url.searchParams.get('privateServerLinkCode');

      if (gameId && linkCode) {
        const robloxProtocolLink = `roblox://placeID=${gameId}&LinkCode=${linkCode}`;
        queryServer(robloxProtocolLink);
      } else {
        const originalButtonColor = window.getComputedStyle(button).backgroundColor;
        const originalTextContent = button.textContent

        button.style.backgroundColor = 'red';
        button.textContent = "!!"

        setTimeout(() => {
          button.style.backgroundColor = originalButtonColor;
          button.textContent = originalTextContent
        }, 1000);
      }
    });

    group.appendChild(button);
    container.innerHTML = '';
    container.appendChild(group);
  }
}

const observer = new MutationObserver(() => {
  const url = new URL(window.location.href);
  if (!url.searchParams.get("privateServerLinkCode")) return

  addCustomButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
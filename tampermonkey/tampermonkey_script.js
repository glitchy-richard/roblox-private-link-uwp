// ==UserScript==
// @name         Private Server Link to Roblox UWP
// @namespace    https://www.roblox.com/
// @version      1.2
// @description  Join private server links on Roblox UWP, even if you also have Roblox Web.
// @author       Richard
// @match        *://www.roblox.com/games/*
// @match        *://www.roblox.com/*/games/*
// @icon         https://tr.rbxcdn.com/180DAY-a7dfc13043c75d100d3485b59701c27e/150/150/Decal/Webp/noFilter
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function joinServer(robloxProtocolLink, button) {
        try {
            const url = new URL(robloxProtocolLink);
            const gameId = url.pathname.match(/\/games\/(\d+)/)?.[1];
            const linkCode = url.searchParams.get('privateServerLinkCode');

            if (gameId && linkCode) {
                const finalLink = `roblox://placeID=${gameId}&LinkCode=${linkCode}`;
                window.location.href = finalLink;
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

    function addCustomButton() {
        if (document.getElementById('improved-game-actions')) return;

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
                position: 'relative'
            });

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
                textAlign: 'center'
            });

            const icon = document.createElement('img');
            icon.src = 'https://tr.rbxcdn.com/180DAY-8ab348b14e4876f5f0ac0f5681db857d/150/150/Decal/Webp/noFilter';
            icon.alt = "UWP";
            Object.assign(icon.style, {
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '8px',
                filter: 'brightness(0) invert(1)'
            });
            icon.onerror = () => {
                icon.remove();
            };

            joinUWPBtn.addEventListener('click', () => {
                joinServer(window.location.href, joinUWPBtn);
            });

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

        const insertLinkDiv = document.createElement("div");
        insertLinkDiv.id = "linkInsertDiv";
        insertLinkDiv.style.display = "none";
        insertLinkDiv.style.marginTop = "8px";
        insertLinkDiv.style.display = "none";

        const linkInputBox = document.createElement("input");
        linkInputBox.id = "linkInputBox";
        linkInputBox.type = "text";
        linkInputBox.placeholder = "Paste VIP server link";
        linkInputBox.style.marginRight = "6px";
        linkInputBox.style.borderRadius = "8px";
        linkInputBox.style.marginBottom = "3px";
        linkInputBox.style.height = "30px";
        linkInputBox.style.width = "90%";
        linkInputBox.style.border = "none";
        linkInputBox.style.textAlign = "center";

        const joinLinkBtn = document.createElement("button");
        joinLinkBtn.id = "joinLinkBtn";
        joinLinkBtn.textContent = "Join";
        joinLinkBtn.style.borderRadius = "8px";
        joinLinkBtn.style.height = "30px";
        joinLinkBtn.style.width = "50px"
        joinLinkBtn.style.border = "none";
        joinLinkBtn.style.backgroundColor = "white";
        joinLinkBtn.style.color = "black";

        insertLinkDiv.appendChild(linkInputBox);
        insertLinkDiv.appendChild(joinLinkBtn);

        toggleInsertLinkBtn.addEventListener('click', () => {
            insertLinkDiv.style.display = insertLinkDiv.style.display === "none" ? "flex" : "none";
        });

        joinLinkBtn.addEventListener('click', () => {
            if (!linkInputBox.value) return;
            joinServer(linkInputBox.value, joinLinkBtn);
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

    const psInterval1 = setInterval(() => {
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

            const refreshBtn = document.querySelector('.rbx-refresh.refresh-link-icon');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', refresh);
            }
        }
    }, 100);
})();

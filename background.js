chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "DESC",
    });
});
const url = 'https://elakolije.rs/';
const action = 'akcija';

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.includes(action)) {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        // Next state will always be the opposite
        const nextState = prevState === 'DESC' ? 'ASC' : 'DESC'

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        // send message to content script
        await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // send message to content script to sort the products
            chrome.tabs.sendMessage(tabs[0].id, {
                direction: nextState === 'DESC' ? 'desc' : 'asc',
            }, function (response) {
                console.log(response.message);
            });
        }
        );
    }
});

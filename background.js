chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, async () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: OODIURLS.map(
                    hostEquals =>
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: { hostEquals },
                        })
                ),
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});

let queue = [];
const moveQueue = async () => {
    const url =
        queue.length > 0
            ? queue[0] + '#onExport'
            : await getStorage('registrationPage');
    chrome.tabs.query({ active: true, currentWindow: true }, t => {
        chrome.tabs.update(t.id, { url });
    });
};

chrome.storage.onChanged.addListener(changes =>
    Object.keys(changes).forEach(key => {
        const storageChange = changes[key].newValue;
        if (key === 'initQueue') {
            queue = storageChange;
        } else if (key === 'queue') {
            queue = storageChange;
            moveQueue();
        }
    })
);

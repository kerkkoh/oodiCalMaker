/* This function gets events that are fetched by contentScript.js on each page
 *  and then uses the ics.js library to switch from JSON format to ICS and then download it
 */
const download = async () => {
    const events = await getStorage('events');
    if (events && events.length > 0) {
        $('#status')[0].innerText = 'WORKING';
        const cal = ics();
        events.forEach(e => {
            const recursiveRule = e.jatkuva
                ? {
                      freq: 'WEEKLY',
                      until: e.loppuDate + ' 23:59',
                      interval: 1,
                  }
                : null;
            cal.addEvent(
                `${e.tunniste} ${e.nimi} (${e.id})`,
                `${e.tunniste} ${e.nimi} (${e.id}), ${e.alku}-${e.loppu},${e.paikka}`,
                e.paikka,
                `${e.alkuDate} ${e.alku}`,
                `${e.alkuDate} ${e.loppu}`,
                recursiveRule
            );
        });
        cal.download();
        $('#status')[0].innerText = 'READY';
        $('#warning').css('display', 'none');
    }
};

// Here we listen for changes in the storage and when the queue for courses to scan is empty,
// we will assume that the export is finished and we can download it
chrome.storage.onChanged.addListener(changes =>
    Object.keys(changes).forEach(key => {
        if (
            key === 'queue' &&
            changes[key].newValue &&
            changes[key].newValue.length === 0
        )
            download();
    })
);

// When the button is clicked, we start the queue which is managed by background.js
// wich listens for changes in the 'queue' entry in the local storage.

const startQueue = async () => {
    chrome.storage.local.remove('events');
    const queue = await getStorage('initQueue');
    await setStorage({ queue });
    $('#status')[0].innerText = 'WORKING';
    $('#warning').css('display', 'block');
};

$('#startQueue').click(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async t => {
        const url = t[0].url;
        const registrationUrl = getRegistrationFromUrl(url);
        if (url === registrationUrl) startQueue();
        else
            chrome.tabs.update(t[0].id, { url: registrationUrl }, t =>
                startQueue()
            );
    });
});

//iphone tutorial button handles
$('#iphone').click(() => {
    window.location = 'iphone.html';
});
$('#back').click(() => {
    window.location = 'popup.html';
});

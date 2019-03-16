/* This function gets events that are fetched by contentScript.js on each page
*  and then uses the ics.js library to switch from JSON format to ICS and then download it
*/
const download = () => {
	chrome.storage.local.get(['events'], (result) => {
		if (typeof result.events != 'undefined' && result.events != null && result.events.length > 0) {
			$("#status")[0].innerText = "WORKING";
			let cal = ics();
			result.events.forEach((e, indeksi) => {
				let rRule = null;
				if (e.jatkuva) {
					rRule = {
						freq: "WEEKLY",
						until: e.loppuDate+" 23:59",
						interval: 1
					};
				}
				cal.addEvent(`${e.tunniste} ${e.nimi} (${e.id})`,
										 `${e.tunniste} ${e.nimi} (${e.id}), ${e.alku}-${e.loppu},${e.paikka}`,
										 e.paikka,
										 `${e.alkuDate} ${e.alku}`,
										 `${e.alkuDate} ${e.loppu}`,
										 rRule
				);
			});
			cal.download();
			$("#status")[0].innerText = "READY";
			$("#warning").css("display","none");
		}
	});
}

// Here we listen for changes in the storage and when the queue for courses to scan is empty,
// we will assume that the export is finished and we can download it
chrome.storage.onChanged.addListener((changes, namespace) => {
	for (key in changes) {
		if (key === "queue" && typeof changes[key].newValue != "undefined" && changes[key].newValue != null) {
			if (changes[key].newValue.length === 0)
				download();
		}
	}
});

let registrationUrl;
chrome.storage.local.get(['oodiUrl'], function(result) {
	registrationUrl = "https://"+result.oodiUrl+"/a/omatopinn.jsp?NaytIlm=1";
	$("#oodi")[0].innerHTML = "Log in to <a target='_blank' href='"+registrationUrl+"'>WebOodi</a>.";
});

// When the button is clicked, we start the queue which is managed by background.js
// wich listens for changes in the 'queue' entry in the local storage.

const startQueue = () => {
	chrome.storage.local.remove("events");
	chrome.storage.local.get(['initQueue'], (result) => {
		chrome.storage.local.set({queue: result.initQueue}, () => {
			$("#status")[0].innerText = "WORKING";
			$("#warning").css("display","block");
		});
	});
}

$("#startQueue").click(() => {
	chrome.tabs.query({active: true, currentWindow: true}, (t) => {
		if (t[0].url === registrationUrl) {
			startQueue();
		} else {
			chrome.tabs.update(t[0].id,{url:registrationUrl},(t) => {
				startQueue();
			});
		}
	});
});

//iphone tutorial button handles
$("#iphone").click(() => {window.location = "iphone.html"});
$("#back").click(() => {window.location = "popup.html"});

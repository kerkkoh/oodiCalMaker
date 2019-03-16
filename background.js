let oodiUrl;
chrome.storage.local.get(['oodiUrl'], function(result) {
	oodiUrl = result.oodiUrl;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
	chrome.storage.local.get(['oodiUrl'], function(result) {
	  chrome.declarativeContent.onPageChanged.addRules([{
		conditions: [
		  new chrome.declarativeContent.PageStateMatcher({
			pageUrl: {hostEquals: result.oodiUrl},
		  })
		],
		actions: [new chrome.declarativeContent.ShowPageAction()]
	  }]);
	});
  });
});

let queue = [];
const moveQueue = () => {
	let urli = "https://"+oodiUrl+"/a/omatopinn.jsp?NaytIlm=1";
	if (queue.length > 0) {
		urli = queue[0]+"#onExport";
	}
	chrome.tabs.query({active: true, currentWindow: true}, (t) => {
		chrome.tabs.update(t.id,{url:urli});
	});
}

chrome.storage.onChanged.addListener((changes, namespace) => {
	for (key in changes) {
		let storageChange = changes[key].newValue;
	if (key === "initQueue") {
	  queue = storageChange;
	} else if (key === "queue") {
	  queue = storageChange;
	  moveQueue();
	}
	}
});
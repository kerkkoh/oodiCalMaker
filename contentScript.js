// This novel of javascript brought to you by Kerkko - "As long as it runs, it's good code, right?"

// Takes in a date like 10.09.2018 or 10.09.
// And returns a date like YYYY-MM-DD
// There must be a better way to do this
const dateParse = (a) => {
  let split = a.trim().split(".");
  let d;
  if (split[2] != "") {
    let yr = split[2];
    if (split[2].length === 2) {
      yr = "20"+yr;
    }
    d = yr;
  } else {
    d = "2019";
  }
  d += `-${split[1]}-${split[0]}`;
  return d;
}

chrome.storage.local.get(['oodiUrl'], function(result) {
	if (window.location.href.includes("https://"+result.oodiUrl+"/a/omatopinn.jsp?NaytIlm=1")) {
	  const url = window.location.href;
	  const lapset = $('table.eisei tbody tr');
	  let kurssit = [];
	  for(let i=2;i<lapset.length;i++) {
		kurssit.push(lapset[i].children[1].firstElementChild.href);
	  }
		chrome.storage.local.set({initQueue: kurssit});
	} else if (window.location.href.includes("#onExport") && $('table.OK_OT').length > 0) {
	  let kurssi = $('.tauluotsikko:first')[0].innerText.trim().split(", ");
	  let tunniste = kurssi[0];
	  let nimi = kurssi[1];

	  let eventit = [];

	  const trs = $('table.kll > tbody > tr');
	  for(let a=1;a<trs.length;a++) {
		let courseTd = trs[a].children[1];
		if (courseTd.className === 'OK_OT') {
		  let info = $(courseTd).find("tr")[0].children;
		  let id = info[0].innerText.trim();
		  let opettaja = info[1].innerText.trim();

		  let tds = $(info[2]).find("tr > td.OK_OT");
		  let places = $(courseTd).find("input.submit2");

		  for (let b=0;b<tds.length;b++) {
			let tekstiArray = tds[b].innerText.split("\n");
			let pv = tekstiArray[0].split("-");
			let aika = tekstiArray[1].trim().split(String.fromCharCode(160))[1].split("-");

			let alkuDate = dateParse(pv[0]);
			let jatkuva = false;
			let loppuDate = null;
			if (pv.length > 1) {
			  jatkuva = true;
			  let ldate = new Date(dateParse(pv[1]));
			  ldate.setDate(ldate.getDate() + 1);
			  loppuDate = `${ldate.getFullYear()}-${ldate.getMonth()+1}-${ldate.getDate()}`;
			}

			let paikka = "Check Oodi/MyCo";

			if (b < places.length && places[b].defaultValue != "")
			  paikka = places[b].defaultValue;

			eventit.push({
			  "tunniste": tunniste,
			  "nimi": nimi,
			  "id": id,
			  "paikka": paikka,
			  "alkuDate": alkuDate,
			  "loppuDate": loppuDate,
			  "jatkuva": jatkuva,
			  "alku": aika[0].replace(".",":"),
			  "loppu": aika[1].replace(".",":")
			});
		  }
		}
	  }
	  console.log(eventit);
	  chrome.storage.local.get(['events'], (result) => {
		if (typeof result.events != 'undefined' && result.events != null) {
		  let newEvents = result.events.concat(eventit);
		  chrome.storage.local.set({events: newEvents});
		} else {
		  chrome.storage.local.set({events: eventit});
		}
	  });
	  chrome.storage.local.get(['queue'], (result) => {
		if (typeof result.queue != 'undefined' && result.queue != null) {
		  let newQueue = result.queue;
		  newQueue.shift();
		  chrome.storage.local.set({queue: newQueue});
		}
	  });
	}
});

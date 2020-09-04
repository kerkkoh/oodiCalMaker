// This novel of javascript brought to you by Kerkko - "As long as it runs, it's good code, right?"

// Takes in a date like 10.09.2018 or 10.09. or 10.09.18
// And returns a date like YYYY-MM-DD
// This can break if the year isn't explicitly defined: i.e. xx.yy.2018 vs implicit xx.yy. / xx.yy.zz
const dateParse = str => {
    const split = str.trim().split('.');
    const currentYear = String(new Date().getFullYear());
    const yr = split[2];
    const parsedYear =
        yr.length > 0
            ? yr.length === 2
                ? currentYear.slice(0, 2) + yr
                : yr
            : currentYear;
    return `${parsedYear}-${split[1]}-${split[0]}`;
};

const parser = async () => {
    const url = window.location.href;
    if (url.includes(getRegistrationUrl(window.location.origin))) {
        const courses = $('table.eisei tbody tr')
            .toArray()
            .map((child, i) =>
                i > 1 ? child.children[1].firstElementChild.href : undefined
            )
            .filter(nonEmpty);
        setStorage({ initQueue: courses });
        setStorage({ registrationPage: url });
    } else if (url.includes('#onExport') && $('table.OK_OT').length > 0) {
        const [identifier, name] = $('.tauluotsikko:first')[0]
            .innerText.trim()
            .split(', ');

        const events = $('table.kll > tbody > tr')
            .toArray()
            .flatMap(tr => {
                const courseTd = tr.children[tr.children.length - 1];
                if (courseTd.className !== 'OK_OT') return undefined;

                const info = $(courseTd).find('tr')[0].children;
                const id = info[0].innerText.trim();
                const tds = $(info[2]).find('tr > td.OK_OT').toArray();
                const places = $(courseTd).find('input.submit2');

                return tds.map((td, b) => {
                    const tdArray = td.innerText.split('\n');
                    const dayRaw = tdArray[0].split('-');
                    const [startTime, endTime] = tdArray[1]
                        .trim()
                        .split(String.fromCharCode(160))[1]
                        .split('-');

                    const startDate = dateParse(dayRaw[0]);
                    const recurring = dayRaw.length > 1;
                    let endDate = null;
                    if (dayRaw.length > 1) {
                        const ldate = new Date(dateParse(dayRaw[1]));
                        ldate.setDate(ldate.getDate() + 1);
                        endDate = `${ldate.getFullYear()}-${
                            ldate.getMonth() + 1
                        }-${ldate.getDate()}`;
                    }

                    const place =
                        b < places.length && places[b].defaultValue.length > 0
                            ? places[b].defaultValue
                            : 'Check Oodi/MyCo';

                    return {
                        tunniste: identifier,
                        nimi: name,
                        id,
                        paikka: place,
                        alkuDate: startDate,
                        loppuDate: endDate,
                        jatkuva: recurring,
                        alku: startTime.replace('.', ':'),
                        loppu: (endTime.includes(',')
                            ? endTime.split(',')[0]
                            : endTime
                        ).replace('.', ':'),
                    };
                });
            })
            .filter(nonEmpty);

        const oldEvents = await getStorage('events');
        setStorage({
            events: [...(oldEvents || []), ...events],
        });

        const queue = await getStorage('queue');
        if (queue) setStorage({ queue: tail(queue) });
    }
};

parser();

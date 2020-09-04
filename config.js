// Add your own oodi url here if not supported already
const OODIURLS = [
    'weboodi.helsinki.fi',
    'weboodi.oulu.fi',
    'weboodi.uef.fi',
    'weboodi.ulapland.fi',
    'weboodi.uwasa.fi',
    'weboodi.lut.fi',
    'oodi.aalto.fi',
    'weboodi.uniarts.fi',
];

const DEBUG = false;

// Random utils
const getStorage = async what =>
    new Promise(resolve =>
        chrome.storage.local.get([what], result => resolve(result[what]))
    );
const setStorage = async what =>
    new Promise(resolve => chrome.storage.local.set(what, () => resolve()));

const getRegistrationUrl = origin => `${origin}/a/omatopinn.jsp?NaytIlm=1`;

const getHostName = url =>
    url
        .split('/')
        [url.indexOf('//') !== -1 ? 2 : 0].split(':')[0]
        .split('?')[0];

const getRegistrationFromUrl = url =>
    `https://${getRegistrationUrl(getHostName(url))}`;

const nonEmpty = a => a != undefined;
const tail = ([, ...rest]) => rest;
const log = (...what) => {
    if (DEBUG) console.log(...what);
};

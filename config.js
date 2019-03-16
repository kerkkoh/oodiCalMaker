/*
*	Initialize some configuration
*
*	You should change the oodi url here to suit your own organization's WebOodi installation.
*/

// Edit this string to be your oodi url in format "oodi.organization.fi"
// Do _NOT_ include "https://" or a slash (/) after the url, this is rather a hostname than an url!
const url = "oodi.organization.fi";

chrome.storage.local.set({oodiUrl: url}, function() {});

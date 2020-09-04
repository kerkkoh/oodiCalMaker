# Oodi Calendar Maker

A solution to the WebOodi calendar problem (it doesn't have the option to export all your courses into an .ics file) thrown together in a few days. Works as a Google Chrome extension, but you can probably rip some of the scripts out and try to run them without the extension.

Basic functionality is that the extension once initiated, by pressing one button, will scan through your courses on Oodi and pick out the relevant information from the courses you are enrolled in. After this, the extension will do some conversion work with ics.js and generate a calendar.ics file that includes all the courses and exercises picked out before.

You can import this ics (ICAL) file into most modern calendar programs such as iCalendar, Google Calendar, etc.

The extension takes into account recurring events and single events in WebOodi and it seems to be fairly accurate from the tests I've ran.

Sadly this extension is quite invasive in that it takes over control from you while it scans through the courses. However, this is necessary for the extension to gather all the events from your current courses. The source code is available here for you to check that everything is in order.

## Changelog

-   **2.0.0**

    -   Fixed compatibility with latest WebOodi versions and very much so 2020 style missing locations from all events
    -   Fixed date parsing to take into account the current year and not a hardcoded one
    -   Refactored almost every line of code, rewrote multiple parts
    -   Added out of the box support for multiple weboodi installations

-   **1.0.0**
    -   Initial release

## License

Oodi Calendar Maker is licensed under the MIT License. Please see LICENSE.md

## Usage from source

1. Check the `config.js` file, and see if the `OODIURLS` array (list of strings) includes the url of your WebOodi installation, and if not, add it into the array, otherwise, you can skip this step
2. Enable chrome's developer mode as instructed here https://developer.chrome.com/extensions/faq#faq-dev-01
3. Install the extension in chrome://extensions/ by clicking "Load unpacked" and choosing the the folder this file is in
4. Open WebOodi and log in
5. Go to My courses > Registrations
6. Press the extension's "C" icon in the chrome toolbar on the right
7. Read the instructions shown on the popup window.
8. Press the "Start Export" button and **don't switch tabs on chrome or do anything else for that matter until you can see "Status: READY"**
9. You should now have a calendar.ics in your default Downloads folder
10. Import the calendar.ics file into your calendar of choice

## Usage in general

Currently supported WebOodi installations are:

```
weboodi.helsinki.fi
weboodi.oulu.fi
weboodi.uef.fi
weboodi.ulapland.fi
weboodi.uwasa.fi
weboodi.lut.fi
oodi.aalto.fi
weboodi.uniarts.fi
```

If the one you wish to use is included in this list, you can use the production version from the chrome extension library: TBD.

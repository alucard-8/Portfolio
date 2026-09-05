/**
 * grade-backend.gs — tiny Google Apps Script backend for the portfolio's
 * "rate my work" page (page 6). It stores every visitor rating in a Google
 * Sheet, blocks duplicate votes from the same device, and computes the
 * overall score the site shows (the "algorating").
 *
 * SETUP (about 3 minutes, free — needs a Google account):
 *   1. Go to https://script.google.com  →  New project  →  paste this whole
 *      file in, replacing the placeholder SHEET_ID below.
 *   2. To get a Sheet ID: go to https://sheets.new (creates an empty Google
 *      Sheet), then copy the long ID from its URL:
 *        https://docs.google.com/spreadsheets/d/<THIS-IS-THE-ID>/edit
 *   3. In the Apps Script editor:  Deploy  →  New deployment  →  ⚙ Web app:
 *        - Execute as      →  Me
 *        - Who has access  →  Anyone
 *      Click Deploy, then copy the "Web app URL" (ends in /exec).
 *   4. Open index.html and paste that URL into RATE_API at the top of the
 *      rating script (search for `var RATE_API = '';`).
 *   That's it — deploy a new version of the site and scores go live.
 *
 * PRIVACY / NOTES
 *   - Visitors never log in. Each browser is fingerprinted (canvas + UA +
 *     screen + locale + timezone) and that hash is used only to stop the
 *     same device voting twice.
 *   - Visitors type a screen name (any name) before rating. It's stored as-
 *     typed and shown to everyone on the board — so don't ask for real names.
 *   - The sheet automatically gets a "ratings" tab on its first vote.
 */

// TODO: paste your Google Sheet ID here (not the URL, just the ID).
var SHEET_ID = '11vX8b3-MWK9sVyEcpAsCzTf7AC_kB5YLAY7cvejfOZM';

// Secret key for the ?action=reset endpoint (see doGet). Pick your own long,
// random string — anyone with it can wipe the board, so don't publish it.
var ADMIN_KEY = 'your-long-secret-reset-key-here';

function sheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('ratings');
  if (!sh) {
    sh = ss.insertSheet('ratings');
    sh.appendRow(['timestamp', 'device', 'stars', 'name']);
  }
  return sh;
}

function rows(sh) {
  var last = sh.getLastRow() - 1; // minus header
  if (last < 1) return [];
  return sh.getRange(2, 1, last, 4).getValues();
}

function average(vals) {
  var sum = 0;
  for (var i = 0; i < vals.length; i++) sum += Number(vals[i][2]) || 0;
  return vals.length ? Math.round((sum / vals.length) * 10) / 10 : 0;
}

// newest raters first, name + stars, for the board's "recent" line
function recentList(vals) {
  var out = [];
  for (var i = Math.max(0, vals.length - 5); i < vals.length; i++) {
    out.push({ s: Number(vals[i][2]) || 0, n: String(vals[i][3] || '').slice(0, 24) });
  }
  return out.reverse();
}

function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var q = (e.parameter && e.parameter.action) || '';
    if (q === 'reset') {
      if (!ADMIN_KEY || ADMIN_KEY.indexOf('your-long') !== -1 || String(e.parameter.key || '') !== ADMIN_KEY) {
        return reply({ ok: false, err: 'bad key' });
      }
      var sh = sheet();
      var last = sh.getLastRow();
      if (last > 1) sh.deleteRows(2, last - 1);
      sh.appendRow([new Date(), 'seed-v1', 5, 'wassim']);
      var vals = rows(sh);
      return reply({ ok: true, reset: true, avg: average(vals), count: vals.length, recent: recentList(vals) });
    }
    vals = rows(sheet());
    return reply({ ok: true, avg: average(vals), count: vals.length, recent: recentList(vals) });
  } catch (err) {
    return reply({ ok: false, err: String(err) });
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var stars = parseInt(data.v, 10);
    if (!(stars >= 1 && stars <= 5)) return reply({ ok: false, err: 'bad value' });
    var fp = String(data.fp || '');
    var name = String(data.name || '').replace(/\s+/g, ' ').trim().slice(0, 24);

    var sh = sheet();
    var vals = rows(sh);

    // one vote per device — no logins, just a fingerprint
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][1]) === fp) {
        return reply({ ok: false, already: true, avg: average(vals), count: vals.length, recent: recentList(vals) });
      }
    }

    sh.appendRow([new Date(), fp, stars, name]);
    vals.push([new Date(), fp, stars, name]);
    return reply({ ok: true, avg: average(vals), count: vals.length, recent: recentList(vals) });
  } catch (err) {
    return reply({ ok: false, err: String(err) });
  }
}
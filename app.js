/* ==========================================================================
   AFF CUP 2026 INTERACTIVE WALLCHART — APPLICATION LOGIC
   Vanilla ES5 JavaScript — no build step, no external dependencies.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     0. CONSTANTS & CONFIG-DRIVEN DATA
     ------------------------------------------------------------------------ */

  var STORAGE_KEY = "affWallchart2026_v1";

  var TEAMS = {
    IDN: { name: "Indonesia", flag: "\uD83C\uDDEE\uD83C\uDDE9" },
    VIE: { name: "Vietnam", flag: "\uD83C\uDDFB\uD83C\uDDF3" },
    SGP: { name: "Singapore", flag: "\uD83C\uDDF8\uD83C\uDDEC" },
    CAM: { name: "Cambodia", flag: "\uD83C\uDDF0\uD83C\uDDED" },
    TLS: { name: "Timor-Leste", flag: "\uD83C\uDDF9\uD83C\uDDF1" },
    THA: { name: "Thailand", flag: "\uD83C\uDDF9\uD83C\uDDED" },
    MAS: { name: "Malaysia", flag: "\uD83C\uDDF2\uD83C\uDDFE" },
    PHI: { name: "Philippines", flag: "\uD83C\uDDF5\uD83C\uDDED" },
    MYA: { name: "Myanmar", flag: "\uD83C\uDDF2\uD83C\uDDF2" },
    LAO: { name: "Laos", flag: "\uD83C\uDDF1\uD83C\uDDE6" }
  };

  var GROUPS = {
    A: ["IDN", "VIE", "SGP", "CAM", "TLS"],
    B: ["THA", "MAS", "PHI", "MYA", "LAO"]
  };

  // TV badge label + css class
  var TV_META = {
    rcti: { label: "RCTI", css: "tv-rcti" },
    inews: { label: "iNews", css: "tv-inews" },
    gtv: { label: "GTV", css: "tv-gtv" }
  };

  // Original seed fixtures — used both as initial state and as the "Reset" target.
  var SEED_FIXTURES = [
    { id: "A1", group: "A", date: "24 Jul", home: "CAM", away: "SGP", homeScore: 1, awayScore: 2, tv: ["inews", "gtv"] },
    { id: "A2", group: "A", date: "24 Jul", home: "TLS", away: "VIE", homeScore: 0, awayScore: 7, tv: ["inews", "gtv"] },
    { id: "A3", group: "A", date: "27 Jul", home: "SGP", away: "TLS", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "A4", group: "A", date: "27 Jul", home: "IDN", away: "CAM", homeScore: null, awayScore: null, tv: ["rcti"] },
    { id: "A5", group: "A", date: "31 Jul", home: "TLS", away: "IDN", homeScore: null, awayScore: null, tv: ["rcti"] },
    { id: "A6", group: "A", date: "31 Jul", home: "VIE", away: "SGP", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "A7", group: "A", date: "03 Aug", home: "CAM", away: "TLS", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "A8", group: "A", date: "03 Aug", home: "IDN", away: "VIE", homeScore: null, awayScore: null, tv: ["rcti"] },
    { id: "A9", group: "A", date: "07 Aug", home: "SGP", away: "IDN", homeScore: null, awayScore: null, tv: ["rcti"] },
    { id: "A10", group: "A", date: "07 Aug", home: "VIE", away: "CAM", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },

    { id: "B1", group: "B", date: "25 Jul", home: "MYA", away: "MAS", homeScore: 1, awayScore: 2, tv: ["inews", "gtv"] },
    { id: "B2", group: "B", date: "25 Jul", home: "LAO", away: "THA", homeScore: 0, awayScore: 5, tv: ["inews", "gtv"] },
    { id: "B3", group: "B", date: "28 Jul", home: "PHI", away: "MYA", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "B4", group: "B", date: "28 Jul", home: "MAS", away: "LAO", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "B5", group: "B", date: "01 Aug", home: "LAO", away: "PHI", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "B6", group: "B", date: "01 Aug", home: "THA", away: "MAS", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "B7", group: "B", date: "04 Aug", home: "MYA", away: "LAO", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "B8", group: "B", date: "04 Aug", home: "PHI", away: "THA", homeScore: null, awayScore: null, tv: ["inews", "gtv"] },
    { id: "B9", group: "B", date: "08 Aug", home: "THA", away: "MYA", homeScore: null, awayScore: null, tv: ["gtv", "inews"] },
    { id: "B10", group: "B", date: "08 Aug", home: "MAS", away: "PHI", homeScore: null, awayScore: null, tv: ["gtv", "inews"] }
  ];

  var SEED_KNOCKOUT = {
    sf1: {
      id: "sf1",
      name: "Semifinal 1",
      homeSlot: "Winner Group A",
      awaySlot: "Runner-up Group B",
      homeTeam: null,
      awayTeam: null,
      leg1Date: "15 Aug",
      leg2Date: "18 Aug",
      leg1Home: null, leg1Away: null,
      leg2Home: null, leg2Away: null,
      etHome: null, etAway: null,
      penHome: null, penAway: null
    },
    sf2: {
      id: "sf2",
      name: "Semifinal 2",
      homeSlot: "Winner Group B",
      awaySlot: "Runner-up Group A",
      homeTeam: null,
      awayTeam: null,
      leg1Date: "16 Aug",
      leg2Date: "19 Aug",
      leg1Home: null, leg1Away: null,
      leg2Home: null, leg2Away: null,
      etHome: null, etAway: null,
      penHome: null, penAway: null
    },
    final: {
      id: "final",
      name: "Final",
      homeSlot: "Winner SF1",
      awaySlot: "Winner SF2",
      homeTeam: null,
      awayTeam: null,
      leg1Date: "22 Aug",
      leg2Date: "26 Aug",
      leg1Home: null, leg1Away: null,
      leg2Home: null, leg2Away: null,
      etHome: null, etAway: null,
      penHome: null, penAway: null
    }
  };

  /* ------------------------------------------------------------------------
     1. LIVE STATE
     ------------------------------------------------------------------------ */

  var state = {
    fixtures: [],
    knockout: {},
    theme: "light"
  };

  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadState() {
    state.fixtures = deepCopy(SEED_FIXTURES);
    state.knockout = deepCopy(SEED_KNOCKOUT);
    state.theme = "light";

    var raw = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      raw = null;
    }

    if (!raw) {
      return;
    }

    var saved;
    try {
      saved = JSON.parse(raw);
    } catch (e2) {
      return;
    }
    if (!saved) {
      return;
    }

    // Merge saved fixture scores into the seed structure (by id).
    if (saved.fixtures) {
      for (var i = 0; i < state.fixtures.length; i++) {
        var fx = state.fixtures[i];
        if (saved.fixtures.hasOwnProperty(fx.id)) {
          fx.homeScore = saved.fixtures[fx.id].homeScore;
          fx.awayScore = saved.fixtures[fx.id].awayScore;
        }
      }
    }

    // Merge saved knockout leg/ET/penalty scores (team assignments are always re-derived).
    if (saved.knockout) {
      var keys = ["sf1", "sf2", "final"];
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        if (saved.knockout[key]) {
          var s = saved.knockout[key];
          var t = state.knockout[key];
          t.leg1Home = s.leg1Home != null ? s.leg1Home : null;
          t.leg1Away = s.leg1Away != null ? s.leg1Away : null;
          t.leg2Home = s.leg2Home != null ? s.leg2Home : null;
          t.leg2Away = s.leg2Away != null ? s.leg2Away : null;
          t.etHome = s.etHome != null ? s.etHome : null;
          t.etAway = s.etAway != null ? s.etAway : null;
          t.penHome = s.penHome != null ? s.penHome : null;
          t.penAway = s.penAway != null ? s.penAway : null;
        }
      }
    }

    if (saved.theme === "dark" || saved.theme === "light") {
      state.theme = saved.theme;
    }
  }

  function persistState() {
    var payload = { fixtures: {}, knockout: {}, theme: state.theme };

    for (var i = 0; i < state.fixtures.length; i++) {
      var fx = state.fixtures[i];
      payload.fixtures[fx.id] = { homeScore: fx.homeScore, awayScore: fx.awayScore };
    }

    var keys = ["sf1", "sf2", "final"];
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      var t = state.knockout[key];
      payload.knockout[key] = {
        leg1Home: t.leg1Home, leg1Away: t.leg1Away,
        leg2Home: t.leg2Home, leg2Away: t.leg2Away,
        etHome: t.etHome, etAway: t.etAway,
        penHome: t.penHome, penAway: t.penAway
      };
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // localStorage unavailable (private mode / quota) — fail silently, app still works in-memory.
    }
  }

  /* ------------------------------------------------------------------------
     2. STANDINGS ENGINE
     ------------------------------------------------------------------------ */

  function findFixture(id) {
    for (var i = 0; i < state.fixtures.length; i++) {
      if (state.fixtures[i].id === id) {
        return state.fixtures[i];
      }
    }
    return null;
  }

  function computeStandings(group) {
    var codes = GROUPS[group];
    var table = {};
    var i;

    for (i = 0; i < codes.length; i++) {
      table[codes[i]] = {
        code: codes[i],
        played: 0, won: 0, drawn: 0, lost: 0,
        gf: 0, ga: 0, gd: 0, pts: 0
      };
    }

    for (i = 0; i < state.fixtures.length; i++) {
      var fx = state.fixtures[i];
      if (fx.group !== group) { continue; }
      if (fx.homeScore === null || fx.awayScore === null || fx.homeScore === "" || fx.awayScore === "") {
        continue;
      }

      var hs = parseInt(fx.homeScore, 10);
      var as = parseInt(fx.awayScore, 10);
      if (isNaN(hs) || isNaN(as)) { continue; }

      var home = table[fx.home];
      var away = table[fx.away];

      home.played += 1;
      away.played += 1;
      home.gf += hs;
      home.ga += as;
      away.gf += as;
      away.ga += hs;

      if (hs > as) {
        home.won += 1; home.pts += 3;
        away.lost += 1;
      } else if (hs < as) {
        away.won += 1; away.pts += 3;
        home.lost += 1;
      } else {
        home.drawn += 1; home.pts += 1;
        away.drawn += 1; away.pts += 1;
      }
    }

    var rows = [];
    for (i = 0; i < codes.length; i++) {
      var row = table[codes[i]];
      row.gd = row.gf - row.ga;
      rows.push(row);
    }

    rows.sort(function (a, b) {
      if (b.pts !== a.pts) { return b.pts - a.pts; }
      if (b.gd !== a.gd) { return b.gd - a.gd; }
      if (b.gf !== a.gf) { return b.gf - a.gf; }
      return TEAMS[a.code].name.localeCompare(TEAMS[b.code].name);
    });

    return rows;
  }

  function isGroupComplete(group) {
    for (var i = 0; i < state.fixtures.length; i++) {
      var fx = state.fixtures[i];
      if (fx.group !== group) { continue; }
      if (fx.homeScore === null || fx.awayScore === null || fx.homeScore === "" || fx.awayScore === "") {
        return false;
      }
    }
    return true;
  }

  /* ------------------------------------------------------------------------
     3. RENDER — STANDINGS TABLES
     ------------------------------------------------------------------------ */

  function formatGD(gd) {
    if (gd > 0) { return "+" + gd; }
    return String(gd);
  }

  function renderStandingsTable(group) {
    var rows = computeStandings(group);
    var complete = isGroupComplete(group);
    var tbody = document.getElementById("standings-body-" + group);
    var html = "";

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var team = TEAMS[r.code];
      var posClass = "";
      var posBadgeClass = "pos-badge";

      if (i === 0) {
        posClass = " qualified-row";
        posBadgeClass += " pos-1";
      } else if (i === 1) {
        posClass = " runnerup-row";
        posBadgeClass += " pos-2";
      }

      // Only visually mark qualification once the group is mathematically finished
      // (all fixtures played) — otherwise show plain position numbers.
      var rowClass = complete ? posClass : "";
      var badgeClass = complete ? posBadgeClass : "pos-badge";

      html += "<tr class=\"" + rowClass + "\">";
      html += "<td class=\"col-pos\"><span class=\"" + badgeClass + "\">" + (i + 1) + "</span></td>";
      html += "<td class=\"col-team\"><span class=\"team-cell\"><span>" + team.flag + "</span><span>" + team.name + "</span></span></td>";
      html += "<td>" + r.played + "</td>";
      html += "<td>" + r.won + "</td>";
      html += "<td>" + r.drawn + "</td>";
      html += "<td>" + r.lost + "</td>";
      html += "<td>" + r.gf + "</td>";
      html += "<td>" + r.ga + "</td>";
      html += "<td>" + formatGD(r.gd) + "</td>";
      html += "<td class=\"col-pts\">" + r.pts + "</td>";
      html += "</tr>";
    }

    tbody.innerHTML = html;
  }

  /* ------------------------------------------------------------------------
     4. RENDER — FIXTURES
     ------------------------------------------------------------------------ */

  function renderTvBadges(tvList) {
    var html = "<span class=\"tv-badge-group\">";
    for (var i = 0; i < tvList.length; i++) {
      var meta = TV_META[tvList[i]];
      if (!meta) { continue; }
      html += "<span class=\"tv-badge " + meta.css + "\">" + meta.label + "</span>";
    }
    html += "</span>";
    return html;
  }

  function scoreValue(v) {
    return (v === null || v === undefined) ? "" : v;
  }

  function renderFixturesList(group) {
    var container = document.getElementById("fixtures-list-" + group);
    var html = "";

    for (var i = 0; i < state.fixtures.length; i++) {
      var fx = state.fixtures[i];
      if (fx.group !== group) { continue; }

      var home = TEAMS[fx.home];
      var away = TEAMS[fx.away];

      html += "<div class=\"fixture-row\">";
      html += "<span class=\"fixture-date\">" + fx.date + "</span>";
      html += "<span class=\"fixture-teams\">";
      html += "<span>" + home.flag + "</span><span class=\"fixture-team-name\">" + home.name + "</span>";
      html += "<span class=\"fixture-vs\">vs</span>";
      html += "<span>" + away.flag + "</span><span class=\"fixture-team-name\">" + away.name + "</span>";
      html += "</span>";
      html += "<span class=\"score-input-group\">";
      html += "<input type=\"number\" min=\"0\" max=\"99\" inputmode=\"numeric\" class=\"score-input\" data-fixture=\"" + fx.id + "\" data-side=\"home\" value=\"" + scoreValue(fx.homeScore) + "\" aria-label=\"" + home.name + " score\">";
      html += "<span class=\"score-dash\">&ndash;</span>";
      html += "<input type=\"number\" min=\"0\" max=\"99\" inputmode=\"numeric\" class=\"score-input\" data-fixture=\"" + fx.id + "\" data-side=\"away\" value=\"" + scoreValue(fx.awayScore) + "\" aria-label=\"" + away.name + " score\">";
      html += "</span>";
      html += renderTvBadges(fx.tv);
      html += "</div>";
    }

    container.innerHTML = html;
  }

  function attachFixtureListeners() {
    var inputs = document.querySelectorAll(".score-input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", onFixtureScoreInput);
    }
  }

  function onFixtureScoreInput(evt) {
    var el = evt.target;
    var fixtureId = el.getAttribute("data-fixture");
    var side = el.getAttribute("data-side");
    var fx = findFixture(fixtureId);
    if (!fx) { return; }

    var raw = el.value;
    var val = raw === "" ? null : Math.max(0, Math.min(99, parseInt(raw, 10)));
    if (val !== null && isNaN(val)) { val = null; }

    if (side === "home") {
      fx.homeScore = val;
    } else {
      fx.awayScore = val;
    }

    renderStandingsTable(fx.group);
    updateKnockoutSeeding();
    renderBracket();
    persistState();
  }

  /* ------------------------------------------------------------------------
     5. KNOCKOUT SEEDING (auto-advance from groups)
     ------------------------------------------------------------------------ */

  function updateKnockoutSeeding() {
    var kA = isGroupComplete("A") ? computeStandings("A") : null;
    var kB = isGroupComplete("B") ? computeStandings("B") : null;

    var winnerA = kA ? kA[0].code : null;
    var runnerA = kA ? kA[1].code : null;
    var winnerB = kB ? kB[0].code : null;
    var runnerB = kB ? kB[1].code : null;

    state.knockout.sf1.homeTeam = winnerA;
    state.knockout.sf1.awayTeam = runnerB;
    state.knockout.sf2.homeTeam = winnerB;
    state.knockout.sf2.awayTeam = runnerA;

    // Final teams are derived from SF results (computed in renderBracket/computeTieWinner).
  }

  /* ------------------------------------------------------------------------
     6. KNOCKOUT TIE LOGIC
     ------------------------------------------------------------------------ */

  function bothEntered(a, b) {
    return a !== null && a !== undefined && a !== "" && b !== null && b !== undefined && b !== "";
  }

  // Returns: { stage: 'pending'|'regular'|'et'|'pen', winner: code|null,
  //            aggHome, aggAway, showET, showPen }
  function evaluateTie(tie) {
    var result = {
      stage: "pending",
      winner: null,
      aggHome: null,
      aggAway: null,
      showET: false,
      showPen: false
    };

    if (!tie.homeTeam || !tie.awayTeam) {
      return result;
    }

    if (!bothEntered(tie.leg1Home, tie.leg1Away) || !bothEntered(tie.leg2Home, tie.leg2Away)) {
      return result;
    }

    var aggHome = parseInt(tie.leg1Home, 10) + parseInt(tie.leg2Home, 10);
    var aggAway = parseInt(tie.leg1Away, 10) + parseInt(tie.leg2Away, 10);
    result.aggHome = aggHome;
    result.aggAway = aggAway;

    if (aggHome !== aggAway) {
      result.stage = "regular";
      result.winner = aggHome > aggAway ? tie.homeTeam : tie.awayTeam;
      return result;
    }

    // Aggregate level — Extra Time required.
    result.showET = true;

    if (!bothEntered(tie.etHome, tie.etAway)) {
      return result;
    }

    var totalHome = aggHome + parseInt(tie.etHome, 10);
    var totalAway = aggAway + parseInt(tie.etAway, 10);

    if (totalHome !== totalAway) {
      result.stage = "et";
      result.winner = totalHome > totalAway ? tie.homeTeam : tie.awayTeam;
      return result;
    }

    // Still level after Extra Time — Penalty Shootout required.
    result.showPen = true;

    if (!bothEntered(tie.penHome, tie.penAway)) {
      return result;
    }

    var penHome = parseInt(tie.penHome, 10);
    var penAway = parseInt(tie.penAway, 10);
    if (penHome === penAway) {
      return result; // invalid / incomplete shootout, no winner yet
    }

    result.stage = "pen";
    result.winner = penHome > penAway ? tie.homeTeam : tie.awayTeam;
    return result;
  }

  /* ------------------------------------------------------------------------
     7. RENDER — KNOCKOUT BRACKET
     ------------------------------------------------------------------------ */

  function teamLabel(code, slotText) {
    if (code && TEAMS[code]) {
      return "<span class=\"tie-team-name\">" + TEAMS[code].flag + " " + TEAMS[code].name + "</span>";
    }
    return "<span class=\"tie-team-name placeholder-team\">" + slotText + "</span>";
  }

  function legInput(tieId, field, value, label) {
    return "<span class=\"leg-input-wrap\">" +
      "<span class=\"leg-label\">" + label + "</span>" +
      "<input type=\"number\" min=\"0\" max=\"99\" inputmode=\"numeric\" class=\"score-input\" data-tie=\"" + tieId + "\" data-field=\"" + field + "\" value=\"" + scoreValue(value) + "\">" +
      "</span>";
  }

  function renderTieCard(tieKey) {
    var tie = state.knockout[tieKey];
    var el = document.getElementById("tie-" + tieKey);
    var evalResult = evaluateTie(tie);

    var aggBadgeText = "Leg 1 vs Leg 2";
    if (evalResult.aggHome !== null) {
      aggBadgeText = "Agg " + evalResult.aggHome + "-" + evalResult.aggAway;
    }

    var html = "";
    html += "<div class=\"tie-header\">";
    html += "<span class=\"tie-name\">" + tie.name + "</span>";
    html += "<span class=\"tie-agg-badge\">" + aggBadgeText + "</span>";
    html += "</div>";

    var canEnterScores = !!(tie.homeTeam && tie.awayTeam);

    // Home team row
    html += "<div class=\"tie-team-row\">";
    html += teamLabel(tie.homeTeam, tie.homeSlot);
    if (canEnterScores) {
      html += "<span class=\"tie-legs\">";
      html += legInput(tie.id, "leg1Home", tie.leg1Home, "L1 (" + tie.leg1Date + ")");
      html += legInput(tie.id, "leg2Home", tie.leg2Home, "L2 (" + tie.leg2Date + ")");
      html += "</span>";
    }
    html += "</div>";

    // Away team row
    html += "<div class=\"tie-team-row\">";
    html += teamLabel(tie.awayTeam, tie.awaySlot);
    if (canEnterScores) {
      html += "<span class=\"tie-legs\">";
      html += legInput(tie.id, "leg1Away", tie.leg1Away, "L1 (" + tie.leg1Date + ")");
      html += legInput(tie.id, "leg2Away", tie.leg2Away, "L2 (" + tie.leg2Date + ")");
      html += "</span>";
    }
    html += "</div>";

    // Extra Time block
    if (canEnterScores && evalResult.showET) {
      html += "<div class=\"extra-block\">";
      html += "<div class=\"extra-block-title\">Extra Time</div>";
      html += "<div class=\"tie-team-row\">";
      html += teamLabel(tie.homeTeam, tie.homeSlot);
      html += "<span class=\"tie-legs\">" + legInput(tie.id, "etHome", tie.etHome, "ET") + "</span>";
      html += "</div>";
      html += "<div class=\"tie-team-row\">";
      html += teamLabel(tie.awayTeam, tie.awaySlot);
      html += "<span class=\"tie-legs\">" + legInput(tie.id, "etAway", tie.etAway, "ET") + "</span>";
      html += "</div>";
      html += "</div>";
    }

    // Penalty Shootout block
    if (canEnterScores && evalResult.showPen) {
      html += "<div class=\"penalty-block\">";
      html += "<div class=\"penalty-block-title\">Penalty Shootout</div>";
      html += "<div class=\"tie-team-row\">";
      html += teamLabel(tie.homeTeam, tie.homeSlot);
      html += "<span class=\"tie-legs\">" + legInput(tie.id, "penHome", tie.penHome, "Pens") + "</span>";
      html += "</div>";
      html += "<div class=\"tie-team-row\">";
      html += teamLabel(tie.awayTeam, tie.awaySlot);
      html += "<span class=\"tie-legs\">" + legInput(tie.id, "penAway", tie.penAway, "Pens") + "</span>";
      html += "</div>";
      html += "</div>";
    }

    // Result / winner row
    html += "<div class=\"tie-agg-row\">";
    if (evalResult.winner) {
      var winMeta = TEAMS[evalResult.winner];
      var howText = evalResult.stage === "regular" ? "on aggregate" : (evalResult.stage === "et" ? "after extra time" : "on penalties");
      html += "<span class=\"tie-winner-tag\">" + winMeta.flag + " " + winMeta.name + " advance " + howText + "</span>";
    } else if (canEnterScores) {
      html += "<span>Tie in progress</span>";
    } else {
      html += "<span>Awaiting group stage result</span>";
    }
    html += "</div>";

    el.innerHTML = html;
    return evalResult;
  }

  function renderBracket() {
    // Semifinals first (their winners feed the Final).
    var sf1Result = renderTieCard("sf1");
    var sf2Result = renderTieCard("sf2");

    state.knockout.final.homeTeam = sf1Result.winner;
    state.knockout.final.awayTeam = sf2Result.winner;

    var finalResult = renderTieCard("final");

    var championEl = document.getElementById("champion-name");
    var slotEl = document.getElementById("champion-slot");
    if (finalResult.winner) {
      var champ = TEAMS[finalResult.winner];
      championEl.textContent = champ.flag + " " + champ.name;
      slotEl.style.borderColor = "";
    } else {
      championEl.textContent = "To be decided";
    }

    attachKnockoutListeners();
  }

  function attachKnockoutListeners() {
    var inputs = document.querySelectorAll(".bracket-section .score-input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", onKnockoutScoreInput);
    }
  }

  function onKnockoutScoreInput(evt) {
    var el = evt.target;
    var tieId = el.getAttribute("data-tie");
    var field = el.getAttribute("data-field");
    var tie = state.knockout[tieId];
    if (!tie) { return; }

    var raw = el.value;
    var val = raw === "" ? null : Math.max(0, Math.min(99, parseInt(raw, 10)));
    if (val !== null && isNaN(val)) { val = null; }

    tie[field] = val;

    renderBracket();
    persistState();

    // Restore focus to the field the user was typing in (re-render rebuilds the DOM).
    var refocus = document.querySelector("[data-tie=\"" + tieId + "\"][data-field=\"" + field + "\"]");
    if (refocus) {
      refocus.focus();
      var vlen = refocus.value.length;
      try { refocus.setSelectionRange(vlen, vlen); } catch (e) { /* ignore on unsupported input types */ }
    }
  }

  /* ------------------------------------------------------------------------
     8. THEME TOGGLE
     ------------------------------------------------------------------------ */

  function applyTheme() {
    if (state.theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.getElementById("theme-icon").textContent = "\u2600\uFE0F";
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.getElementById("theme-icon").textContent = "\uD83C\uDF19";
    }
  }

  function onThemeToggle() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    persistState();
  }

  /* ------------------------------------------------------------------------
     9. RESET
     ------------------------------------------------------------------------ */

  function onResetClick() {
    var confirmed = window.confirm("Reset all scores back to the original 2026 fixture list? This cannot be undone.");
    if (!confirmed) { return; }

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }

    state.fixtures = deepCopy(SEED_FIXTURES);
    state.knockout = deepCopy(SEED_KNOCKOUT);

    renderAll();
  }

  /* ------------------------------------------------------------------------
     10. INIT
     ------------------------------------------------------------------------ */

  function renderAll() {
    renderStandingsTable("A");
    renderStandingsTable("B");
    renderFixturesList("A");
    renderFixturesList("B");
    attachFixtureListeners();

    updateKnockoutSeeding();
    renderBracket();
  }

  function init() {
    loadState();
    applyTheme();
    renderAll();

    document.getElementById("reset-btn").addEventListener("click", onResetClick);
    document.getElementById("theme-toggle-btn").addEventListener("click", onThemeToggle);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

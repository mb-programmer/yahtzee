'use strict';

// ── Constants ──────────────────────────────────────────────────────────────
const NUM_DICE = 5;
const MAX_ROLLS = 3;
const UPPER_BONUS_THRESHOLD = 63;
const UPPER_BONUS_VALUE = 35;

// Score category keys
const CAT = {
  ONES:           'ones',
  TWOS:           'twos',
  THREES:         'threes',
  FOURS:          'fours',
  FIVES:          'fives',
  SIXES:          'sixes',
  THREE_OF_KIND:  'threeOfKind',
  FOUR_OF_KIND:   'fourOfKind',
  FULL_HOUSE:     'fullHouse',
  SM_STRAIGHT:    'smStraight',
  LG_STRAIGHT:    'lgStraight',
  YAHTZEE:        'yahtzee',
  CHANCE:         'chance',
};

const CATEGORY_LABELS = {
  [CAT.ONES]:          'Enen (Ones)',
  [CAT.TWOS]:          'Tweeën (Twos)',
  [CAT.THREES]:        'Drieën (Threes)',
  [CAT.FOURS]:         'Vieren (Fours)',
  [CAT.FIVES]:         'Vijven (Fives)',
  [CAT.SIXES]:         'Zessen (Sixes)',
  [CAT.THREE_OF_KIND]: 'Drie van een soort',
  [CAT.FOUR_OF_KIND]:  'Vier van een soort',
  [CAT.FULL_HOUSE]:    'Full House',
  [CAT.SM_STRAIGHT]:   'Kleine Straat (4)',
  [CAT.LG_STRAIGHT]:   'Grote Straat (5)',
  [CAT.YAHTZEE]:       'Yahtzee',
  [CAT.CHANCE]:        'Kans (Chance)',
};

// ── Scoring functions ──────────────────────────────────────────────────────
function countValues(dice) {
  const counts = Array(7).fill(0);
  dice.forEach(d => counts[d]++);
  return counts;
}

function sum(dice) {
  return dice.reduce((a, b) => a + b, 0);
}

function scoreForCategory(cat, dice) {
  const counts = countValues(dice);
  const total  = sum(dice);

  switch (cat) {
    case CAT.ONES:   return counts[1] * 1;
    case CAT.TWOS:   return counts[2] * 2;
    case CAT.THREES: return counts[3] * 3;
    case CAT.FOURS:  return counts[4] * 4;
    case CAT.FIVES:  return counts[5] * 5;
    case CAT.SIXES:  return counts[6] * 6;

    case CAT.THREE_OF_KIND:
      return counts.some(c => c >= 3) ? total : 0;

    case CAT.FOUR_OF_KIND:
      return counts.some(c => c >= 4) ? total : 0;

    case CAT.FULL_HOUSE: {
      const hasThree = counts.some(c => c === 3);
      const hasTwo   = counts.some(c => c === 2);
      return hasThree && hasTwo ? 25 : 0;
    }

    case CAT.SM_STRAIGHT: {
      const unique = [...new Set(dice)].sort((a, b) => a - b).join('');
      const smStraights = ['1234', '2345', '3456'];
      return smStraights.some(s => unique.includes(s)) ? 30 : 0;
    }

    case CAT.LG_STRAIGHT: {
      const sorted = [...new Set(dice)].sort((a, b) => a - b).join('');
      return (sorted === '12345' || sorted === '23456') ? 40 : 0;
    }

    case CAT.YAHTZEE:
      return counts.some(c => c === 5) ? 50 : 0;

    case CAT.CHANCE:
      return total;

    default:
      return 0;
  }
}

// ── Game state ─────────────────────────────────────────────────────────────
let dice      = [1, 1, 1, 1, 1];
let held      = [false, false, false, false, false];
let rollsLeft = MAX_ROLLS;
let scores    = {};  // cat -> number (only set when scored)

function hasRolled() {
  return rollsLeft < MAX_ROLLS;
}

function allCategoriesScored() {
  return Object.keys(CAT).length === Object.keys(scores).length;
}

// ── Dice rolling ───────────────────────────────────────────────────────────
function rollDice() {
  if (rollsLeft <= 0) return;
  dice = dice.map((d, i) => held[i] ? d : Math.ceil(Math.random() * 6));
  rollsLeft--;
}

// ── UI helpers ─────────────────────────────────────────────────────────────
const diceFaces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function updateDiceUI() {
  document.querySelectorAll('.die').forEach((el, i) => {
    el.textContent = diceFaces[dice[i]];
    el.classList.toggle('held', held[i]);
  });
}

function updateRollButton() {
  const btn = document.getElementById('btn-roll');
  btn.disabled = rollsLeft <= 0 || allCategoriesScored();
  document.getElementById('roll-info').textContent =
    rollsLeft === MAX_ROLLS
      ? 'Klik op "Gooi" om te beginnen'
      : `Beurten over: ${rollsLeft}`;
}

function updateStatus(msg) {
  document.getElementById('status-msg').textContent = msg;
}

function upperSubtotal() {
  const upper = [CAT.ONES, CAT.TWOS, CAT.THREES, CAT.FOURS, CAT.FIVES, CAT.SIXES];
  return upper.reduce((acc, c) => acc + (scores[c] || 0), 0);
}

function totalScore() {
  const sub = upperSubtotal();
  const bonus = sub >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_VALUE : 0;
  return Object.values(scores).reduce((a, b) => a + b, 0) + bonus;
}

function updateScorecardUI() {
  const rolledOnce = hasRolled();

  Object.values(CAT).forEach(cat => {
    const row = document.getElementById('row-' + cat);
    if (!row) return;
    const scoreCell = row.querySelector('.category-score');

    if (scores[cat] !== undefined) {
      // Already scored
      scoreCell.textContent = scores[cat];
      scoreCell.classList.remove('score-preview');
      row.classList.add('scored');
    } else if (rolledOnce) {
      // Show preview
      const preview = scoreForCategory(cat, dice);
      scoreCell.textContent = preview;
      scoreCell.classList.add('score-preview');
      row.classList.remove('scored');
    } else {
      scoreCell.textContent = '';
      scoreCell.classList.remove('score-preview');
    }
  });

  // Bonus display
  const sub = upperSubtotal();
  const bonusNeeded = Math.max(0, UPPER_BONUS_THRESHOLD - sub);
  const bonusEl = document.getElementById('upper-bonus');
  if (bonusEl) {
    if (sub >= UPPER_BONUS_THRESHOLD) {
      bonusEl.textContent = '+35';
    } else {
      bonusEl.textContent = bonusNeeded > 0 ? `Nog ${bonusNeeded} nodig` : '+35';
    }
  }

  const totalEl = document.getElementById('total-score');
  if (totalEl) totalEl.textContent = totalScore();
}

// ── Category click handler ─────────────────────────────────────────────────
function scoreCategory(cat) {
  if (!hasRolled()) {
    updateStatus('Gooi eerst de dobbelstenen!');
    return;
  }
  if (scores[cat] !== undefined) {
    updateStatus('Die categorie is al ingevuld.');
    return;
  }

  scores[cat] = scoreForCategory(cat, dice);

  // Reset for next turn
  held      = [false, false, false, false, false];
  rollsLeft = MAX_ROLLS;
  dice      = [1, 1, 1, 1, 1];

  updateDiceUI();
  updateRollButton();
  updateScorecardUI();

  if (allCategoriesScored()) {
    showGameOver();
  } else {
    updateStatus('Goed gespeeld! Gooi opnieuw.');
  }
}

// ── Game over ──────────────────────────────────────────────────────────────
function showGameOver() {
  document.getElementById('final-score').textContent = totalScore();
  document.getElementById('game-over').classList.add('visible');
}

function newGame() {
  scores    = {};
  dice      = [1, 1, 1, 1, 1];
  held      = [false, false, false, false, false];
  rollsLeft = MAX_ROLLS;

  document.getElementById('game-over').classList.remove('visible');
  updateDiceUI();
  updateRollButton();
  updateScorecardUI();
  updateStatus('Nieuw spel gestart! Gooi de dobbelstenen.');
}

// ── Bootstrap ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Wire up dice clicks (hold/release)
  document.querySelectorAll('.die').forEach((el, i) => {
    el.addEventListener('click', () => {
      if (!hasRolled()) {
        updateStatus('Gooi eerst de dobbelstenen!');
        return;
      }
      held[i] = !held[i];
      updateDiceUI();
    });
  });

  // Wire up roll button
  document.getElementById('btn-roll').addEventListener('click', () => {
    if (rollsLeft <= 0) return;

    // Animate
    document.querySelectorAll('.die').forEach((el, i) => {
      if (!held[i]) el.classList.add('rolling');
    });

    setTimeout(() => {
      rollDice();
      document.querySelectorAll('.die').forEach(el => el.classList.remove('rolling'));
      updateDiceUI();
      updateRollButton();
      updateScorecardUI();
      if (rollsLeft === 0) {
        updateStatus('Geen beurten meer. Kies een categorie.');
      } else {
        updateStatus('Klik op dobbelstenen om ze vast te houden.');
      }
    }, 400);
  });

  // Wire up scorecard rows
  Object.values(CAT).forEach(cat => {
    const row = document.getElementById('row-' + cat);
    if (row) {
      row.addEventListener('click', () => scoreCategory(cat));
    }
  });

  // New game button
  document.getElementById('btn-new-game').addEventListener('click', newGame);

  // Initial render
  updateDiceUI();
  updateRollButton();
  updateScorecardUI();
  updateStatus('Klik op "Gooi" om te beginnen!');
});

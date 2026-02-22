<template>
    <div id="root">
        <header>
            <h1>Yahtzee</h1>
        </header>

        <div class="fiveDice">
            <die-btn @lock-die="lockDieHandler" :die_id = 1 :die_locked = dice[1].locked :eyes = eyes[dice[1].value]></die-btn>
            <die-btn @lock-die="lockDieHandler" :die_id = 2 :die_locked = dice[2].locked :eyes = eyes[dice[2].value]></die-btn>
            <die-btn @lock-die="lockDieHandler" :die_id = 3 :die_locked = dice[3].locked :eyes = eyes[dice[3].value]></die-btn>
            <die-btn @lock-die="lockDieHandler" :die_id = 4 :die_locked = dice[4].locked :eyes = eyes[dice[4].value]></die-btn>
            <die-btn @lock-die="lockDieHandler" :die_id = 5 :die_locked = dice[5].locked :eyes = eyes[dice[5].value]></die-btn>
        </div>

        <game-btn @startOrResetGame="startOrResetHandler" :gameStarted = !gameStarted :selectedPlayers = !selectedPlayers :startOrReset="'Nieuw Spel'"></game-btn>
        <game-btn @startOrResetGame="startOrResetHandler" :gameStarted = gameStarted :selectedPlayers = selectedPlayers :startOrReset="'Restart Spel'"></game-btn>

        <player-btn @create-players="createPlayersHandler" :player_id="1" :gameStarted="gameStarted" :selectedPlayers="selectedPlayers"></player-btn>
        <player-btn @create-players="createPlayersHandler" :player_id="2" :gameStarted="gameStarted" :selectedPlayers="selectedPlayers"></player-btn>
        <player-btn @create-players="createPlayersHandler" :player_id="3" :gameStarted="gameStarted" :selectedPlayers="selectedPlayers"></player-btn>
        <player-btn @create-players="createPlayersHandler" :player_id="4" :gameStarted="gameStarted" :selectedPlayers="selectedPlayers"></player-btn>

        <div v-show="gameStarted && selectedPlayers" class="button">
            <button @click="throwDice" class="btn wHover" :disabled="mustFillScore || game.gameEnded">
                <span>Gooien</span>
            </button>
        </div>

        <div class="round">
            <p id="rounds">Je hebt nog {{ turns }} worp(en).</p>
        </div>

        <div class="howTo">
            <p>
                Klik <span class="borderBtn">Gooien</span> om de dobbelstenen te gooien,
                klik op een dobbelsteen om de waarde vast te houden.
            </p>
            <p>
                Na drie worpen klik je op <span class="borderBtn">Vul score in</span> om
                de score in te vullen.
            </p>
            <p>Kies welke score je wil vastleggen op het scoreblok.</p>
        </div>

        <div class="paper">
            <table>
                <tr>
                    <td class="noBorder"></td>
                </tr>
                <tr>
                    <th class="title noBorder" colspan="7" style="text-align: center;">scoreblok</th>
                </tr>
                <tr>
                    <td class="noBorder"></td>
                </tr>
                <tr>
                    <th class="h1 noBorder" colspan="2">deel 1</th>
                    <th class="h1 noBorder">hoe te scoren</th>
                    <th class="h2 noBorder" :class="{ 'text-danger': currentPlayer === 1 }">Speler 1</th>
                    <th class="h2 noBorder" :class="{ 'text-danger': currentPlayer === 2 }">Speler 2</th>
                    <th class="h2 noBorder" :class="{ 'text-danger': currentPlayer === 3 }">Speler 3</th>
                    <th class="h2 noBorder" :class="{ 'text-danger': currentPlayer === 4 }">Speler 4</th>
                </tr>
                <tr>
                    <td class="dicePreview noBorderRight">⚀</td>
                    <td class="noBorderLeft"></td>
                    <td class="howToScore">waarde van alle enen</td>
                    <td @click="fillScore(1, 'ones')" class="fillFont player-1 keepScore" id="player-1-ones">

                    </td>
                    <td @click="fillScore(2, 'ones')" class="fillFont player-2 keepScore" id="player-2-ones"></td>
                    <td @click="fillScore(3, 'ones')" class="fillFont player-3 keepScore" id="player-3-ones"></td>
                    <td @click="fillScore(4, 'ones')" class="fillFont player-4 keepScore" id="player-4-ones"></td>
                </tr>
                <tr>
                    <td class="dicePreview noBorderRight">⚁</td>
                    <td class="noBorderLeft"></td>
                    <td class="howToScore">waarde van alle tweeen</td>
                    <td @click="fillScore(1, 'twos')" class="fillFont player-1 keepScore" id="player-1-twos"></td>
                    <td @click="fillScore(2, 'twos')" class="fillFont player-2 keepScore" id="player-2-twos"></td>
                    <td @click="fillScore(3, 'twos')" class="fillFont player-3 keepScore" id="player-3-twos"></td>
                    <td @click="fillScore(4, 'twos')" class="fillFont player-4 keepScore" id="player-4-twos"></td>
                </tr>
                <tr>
                    <td class="dicePreview noBorderRight">⚂</td>
                    <td class="noBorderLeft"></td>
                    <td class="howToScore">waarde van alle drieen</td>
                    <td @click="fillScore(1, 'threes')" class="fillFont player-1 keepScore" id="player-1-threes"></td>
                    <td @click="fillScore(2, 'threes')" class="fillFont player-2 keepScore" id="player-2-threes"></td>
                    <td @click="fillScore(3, 'threes')" class="fillFont player-3 keepScore" id="player-3-threes"></td>
                    <td @click="fillScore(4, 'threes')" class="fillFont player-4 keepScore" id="player-4-threes"></td>
                </tr>
                <tr>
                    <td class="dicePreview noBorderRight">⚃</td>
                    <td class="noBorderLeft"></td>
                    <td class="howToScore">waarde van alle vieren</td>
                    <td @click="fillScore(1, 'fours')" class="fillFont player-1 keepScore" id="player-1-fours"></td>
                    <td @click="fillScore(2, 'fours')" class="fillFont player-2 keepScore" id="player-2-fours"></td>
                    <td @click="fillScore(3, 'fours')" class="fillFont player-3 keepScore" id="player-3-fours"></td>
                    <td @click="fillScore(4, 'fours')" class="fillFont player-4 keepScore" id="player-4-fours"></td>
                </tr>
                <tr>
                    <td class="dicePreview noBorderRight">⚄</td>
                    <td class="noBorderLeft"></td>
                    <td class="howToScore">waarde van alle vijfen</td>
                    <td @click="fillScore(1, 'fives')" class="fillFont player-1 keepScore" id="player-1-fives"></td>
                    <td @click="fillScore(2, 'fives')" class="fillFont player-2 keepScore" id="player-2-fives"></td>
                    <td @click="fillScore(3, 'fives')" class="fillFont player-3 keepScore" id="player-3-fives"></td>
                    <td @click="fillScore(4, 'fives')" class="fillFont player-4 keepScore" id="player-4-fives"></td>
                </tr>
                <tr>
                    <td class="dicePreview noBorderRight">⚅</td>
                    <td class="noBorderLeft"></td>
                    <td class="howToScore">waarde van alle zessen</td>
                    <td @click="fillScore(1, 'sixes')" class="fillFont player-1 keepScore" id="player-1-sixes"></td>
                    <td @click="fillScore(2, 'sixes')" class="fillFont player-2 keepScore" id="player-2-sixes"></td>
                    <td @click="fillScore(3, 'sixes')" class="fillFont player-3 keepScore" id="player-3-sixes"></td>
                    <td @click="fillScore(4, 'sixes')" class="fillFont player-4 keepScore" id="player-4-sixes"></td>
                </tr>
                <tr id="total">
                    <td class="uppercase" colspan="2">totaal</td>
                    <td class="arrow">&#10132;</td>
                    <td id="player-1-upperScore" class="fillFont">

                    </td>
                    <td id="player-2-upperScore" class="fillFont">

                    </td>
                    <td id="player-3-upperScore" class="fillFont">

                    </td>
                    <td id="player-4-upperScore" class="fillFont">

                    </td>
                </tr>
                <tr>
                    <td class="noBorderRight">bonus</td>
                    <td class="alt noBorderLeft">als totaal 63<br />of meer is</td>
                    <td class="howToScore">35 punten</td>
                    <td id="player-1-bonus" class="fillFont">

                    </td>
                    <td id="player-2-bonus" class="fillFont">

                    </td>
                    <td id="player-3-bonus" class="fillFont">

                    </td>
                    <td id="player-4-bonus" class="fillFont">

                    </td>
                </tr>
                <tr id="upperTotal">
                    <td class="uppercase noBorderRight">totaal</td>
                    <td class="alt uppercase noBorderLeft">
                        van de<br />bovenste<br />helft
                    </td>
                    <td class="arrow">&#10132;</td>
                    <td id="player-1-totalUpperScore" class="fillFont">

                    </td>
                    <td id="player-2-totalUpperScore" class="fillFont">

                    </td>
                    <td id="player-3-totalUpperScore" class="fillFont">

                    </td>
                    <td id="player-4-totalUpperScore" class="fillFont">

                    </td>
                </tr>
                <tr>
                    <th class="h1 noBorder" colspan="2">deel 2</th>
                </tr>
                <tr>
                    <td colspan="2">three of a kind</td>
                    <td class="howToScore">totaal van alle dobbelstenen</td>
                    <td @click="fillScore(1, 'threeOfKind')" class="fillFont player-1 keepScore" id="player-1-threeOfKind">

                    </td>
                    <td @click="fillScore(2, 'threeOfKind')" class="fillFont player-2 keepScore" id="player-2-threeOfKind">

                    </td>
                    <td @click="fillScore(3, 'threeOfKind')" class="fillFont player-3 keepScore" id="player-3-threeOfKind">

                    </td>
                    <td @click="fillScore(4, 'threeOfKind')" class="fillFont player-4 keepScore" id="player-4-threeOfKind">

                    </td>
                </tr>
                <tr>
                    <td colspan="2">carré</td>
                    <td class="howToScore">totaal van alle dobbelstenen</td>
                    <td @click="fillScore(1, 'fourOfKind')" class="fillFont player-1 keepScore" id="player-1-fourOfKind">

                    </td>
                    <td @click="fillScore(2, 'fourOfKind')" class="fillFont player-2 keepScore" id="player-2-fourOfKind">

                    </td>
                    <td @click="fillScore(3, 'fourOfKind')" class="fillFont player-3 keepScore" id="player-3-fourOfKind">

                    </td>
                    <td @click="fillScore(4, 'fourOfKind')" class="fillFont player-4 keepScore" id="player-4-fourOfKind">

                    </td>
                </tr>
                <tr>
                    <td colspan="2">full house</td>
                    <td class="howToScore">25 punten</td>
                    <td @click="fillScore(1, 'fullHouse')" class="fillFont player-1 keepScore" id="player-1-fullHouse">

                    </td>
                    <td @click="fillScore(2, 'fullHouse')" class="fillFont player-2 keepScore" id="player-2-fullHouse">

                    </td>
                    <td @click="fillScore(3, 'fullHouse')" class="fillFont player-3 keepScore" id="player-3-fullHouse">

                    </td>
                    <td @click="fillScore(4, 'fullHouse')" class="fillFont player-4 keepScore" id="player-4-fullHouse">

                    </td>
                </tr>
                <tr>
                    <td class="noBorderRight">kleine straat</td>
                    <td class="alt noBorderLeft">4<br />opeenvolgende nummers</td>
                    <td class="howToScore">30 punten</td>
                    <td @click="fillScore(1, 'littleStreet')" class="fillFont player-1 keepScore" id="player-1-littleStreet">

                    </td>
                    <td @click="fillScore(2, 'littleStreet')" class="fillFont player-2 keepScore" id="player-2-littleStreet">

                    </td>
                    <td @click="fillScore(3, 'littleStreet')" class="fillFont player-3 keepScore" id="player-3-littleStreet">

                    </td>
                    <td @click="fillScore(4, 'littleStreet')" class="fillFont player-4 keepScore" id="player-4-littleStreet">

                    </td>
                </tr>
                <tr>
                    <td class="noBorderRight">grote straat</td>
                    <td class="alt noBorderLeft">5<br />opeenvolgende nummers</td>
                    <td class="howToScore">40 punten</td>
                    <td @click="fillScore(1, 'largeStreet')" class="fillFont player-1 keepScore" id="player-1-largeStreet">

                    </td>
                    <td @click="fillScore(2, 'largeStreet')" class="fillFont player-2 keepScore" id="player-2-largeStreet">

                    </td>
                    <td @click="fillScore(3, 'largeStreet')" class="fillFont player-3 keepScore" id="player-3-largeStreet">

                    </td>
                    <td @click="fillScore(4, 'largeStreet')" class="fillFont player-4 keepScore" id="player-4-largeStreet">

                    </td>
                </tr>
                <tr>
                    <td class="noBorderRight">yahtzee</td>
                    <td class="alt noBorderLeft">5<br />dezelfde<br />nummers</td>
                    <td class="howToScore">50 punten</td>
                    <td @click="fillScore(1, 'yahtzee')" class="fillFont player-1 keepScore" id="player-1-yahtzee">

                    </td>
                    <td @click="fillScore(2, 'yahtzee')" class="fillFont player-2 keepScore" id="player-2-yahtzee">

                    </td>
                    <td @click="fillScore(3, 'yahtzee')" class="fillFont player-3 keepScore" id="player-3-yahtzee">

                    </td>
                    <td @click="fillScore(4, 'yahtzee')" class="fillFont player-4 keepScore" id="player-4-yahtzee">

                    </td>
                </tr>
                <tr>
                    <td colspan="2">chance</td>
                    <td class="howToScore">totaal van alle dobbelstenen</td>
                    <td @click="fillScore(1, 'chance')" class="fillFont player-1 keepScore" id="player-1-chance">

                    </td>
                    <td @click="fillScore(2, 'chance')" class="fillFont player-2 keepScore" id="player-2-chance">

                    </td>
                    <td @click="fillScore(3, 'chance')" class="fillFont player-3 keepScore" id="player-3-chance">

                    </td>
                    <td @click="fillScore(4, 'chance')" class="fillFont player-4 keepScore" id="player-4-chance">

                    </td>
                </tr>
                <tr id="lowerTotal">
                    <td class="uppercase noBorderRight">totaal</td>
                    <td class="alt uppercase noBorderLeft">
                        van de<br />onderste<br />helft
                    </td>
                    <td class="arrow">&#10132;</td>
                    <td id="player-1-lowerScore" class="fillFont">

                    </td>
                    <td id="player-2-lowerScore" class="fillFont">

                    </td>
                    <td id="player-3-lowerScore" class="fillFont">

                    </td>
                    <td id="player-4-lowerScore" class="fillFont">

                    </td>
                </tr>
                <tr id="lowUpperTotal">
                    <td class="uppercase noBorderRight">totaal</td>
                    <td class="alt uppercase noBorderLeft">
                        van de<br />bovenste<br />helft
                    </td>
                    <td class="arrow">&#10132;</td>
                    <td id="player-1-upperScore-general" class="fillFont">

                    </td>
                    <td id="player-2-upperScore-general" class="fillFont">

                    </td>
                    <td id="player-3-upperScore-general" class="fillFont">

                    </td>
                    <td id="player-4-upperScore-general" class="fillFont">

                    </td>
                </tr>
                <tr>
                    <td class="bold" colspan="2">totaal generaal</td>
                    <td class="arrow">&#10132;</td>
                    <td id="player-1-grandTotal" class="fillFont">

                    </td>
                    <td id="player-2-grandTotal" class="fillFont">

                    </td>
                    <td id="player-3-grandTotal" class="fillFont">

                    </td>
                    <td id="player-4-grandTotal" class="fillFont">

                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script setup>
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {YahtzeeStore} from "@/store/yahtzee.js";
import PlayerBtn from "@/components/buttons/playerBtn.vue";
import DieBtn from "@/components/buttons/dieBtn.vue";
import GameBtn from "@/components/buttons/gameBtn.vue";

/* VARIABLES */
let { gameStarted, selectedPlayers, currentPlayer, dice, eyes, turns, selectScore } = storeToRefs(YahtzeeStore());

/* FUNCTIONS */
const { startGame, resetGame, setSelectedPlayers, resetDice, randomDice, keepDie, countDie, threeOrFourOfKind, fullHouse, littleStreet, largeStreet, yahtzeeBonus, chance } = YahtzeeStore();
let game = {};

/*----------------------------------------------------------------------------------------------------------------------------------------------*/
function lockDieHandler(die_id) {
    lockDie(die_id);
}
function lockDie(die_id) {
    if (turns.value !== 0) {
        keepDie(die_id);
    }
}
function throwDice() {
    if (turns.value === 1) {
        mustFillScore = true;
    }

    if (gameStarted.value === false || turns.value === 0) {
    } else {
        randomDice();

        const has_yahtzee_bonus = yahtzeeBonus_count();

        scoreDie_count(1, "ones");
        scoreDie_count(2, "twos");
        scoreDie_count(3, "threes");
        scoreDie_count(4, "fours");
        scoreDie_count(5, "fives");
        scoreDie_count(6, "sixes");

        threeOfKind_count(has_yahtzee_bonus);
        fourOfKind_count(has_yahtzee_bonus);
        fullHouse_count(has_yahtzee_bonus);
        littleStreet_count();
        largeStreet_count();
        yahtzee_count();
        chance_count();

        function scoreDie_count(eyes, name) {
            calculateScore(name, countDie(eyes));
        }
        function threeOfKind_count() {
            calculateScore("threeOfKind", threeOrFourOfKind("threeOfKind"));
        }
        function fourOfKind_count() {
            calculateScore("fourOfKind", threeOrFourOfKind("fourOfKind"));
        }
        function fullHouse_count(has_yahtzee_bonus) {
            calculateScore("fullHouse", fullHouse(has_yahtzee_bonus));
        }
        function littleStreet_count() {
            calculateScore("littleStreet", littleStreet(has_yahtzee_bonus));
        }
        function largeStreet_count() {
            calculateScore("largeStreet", largeStreet(has_yahtzee_bonus));
        }
        function yahtzeeBonus_count() {
            const has_yahtzee = yahtzeeBonus();
            const yahtzee_filled = players[currentPlayer.value].value.yahtzee.filled;

            return !!(has_yahtzee && yahtzee_filled);
        }
        function yahtzee_count() {
            calculateScore("yahtzee", threeOrFourOfKind("yahtzee"));
        }
        function chance_count() {
            calculateScore("chance", chance());
        }
        function calculateScore(name, function_name) {
            let current_player = getCurrentPlayer(name);

            if (current_player.filled !== true) {
                const score = function_name;
                let player_class = 'player-';

                player_class += currentPlayer.value + '-' + name;

                document.getElementById(player_class).innerHTML = score;

                current_player.points = score;
            }
            isFilled(name);
        }
    }
}
/*----------------------------------------------------------------------------------------------------------------------------------------------*/
let canFillScore = false;
let mustFillScore = false;

function fillScore(player_id, name) {
    const yahtzee_bonus = yahtzeeBonus_count();

    function yahtzeeBonus_count() {
        const has_yahtzee = yahtzeeBonus();
        const yahtzee_filled = players[currentPlayer.value].value.yahtzee.filled;

        return !!(has_yahtzee && yahtzee_filled);
    }

    if (canFillScore === true && (player_id === currentPlayer.value)) {
        const current_player = getCurrentPlayer(name);

        if (current_player.filled !== true) {
            current_player.filled = true;

            let player = document.getElementsByClassName('player-' + currentPlayer.value);

            if (yahtzee_bonus) {
                let yahtzee_points = players[currentPlayer.value].value.yahtzee.points;
                players[currentPlayer.value].value.yahtzee.points += 100;

                yahtzee_points += 100;

                player[11].innerHTML = yahtzee_points;
            }

            for (const p of player) {
                const current_player = getCurrentPlayer(p.id.substring(9));

                p.style.backgroundColor = '';

                if (current_player.filled !== true) {
                    p.innerHTML = '';
                }
            }

            players[currentPlayer.value].value.scoresFilled++;
            mustFillScore = false;

            resetDice();
            scoreUpper_count();
            scoreLower_count();
            generalScore_count();
            gameOverCheck();
            changePlayerTurn();
            canFillScore = false;
        }
    }
}
function scoreUpper_count() {
    const eyes = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    let score = 0;
    let current_player = players[currentPlayer.value].value;

    if (
        current_player.ones.filled === true && current_player.twos.filled === true
        && current_player.threes.filled === true && current_player.fours.filled === true
        && current_player.fives.filled === true && current_player.sixes.filled === true
    ) {
        let upper_score = countUpScore(0);
        countBonus(upper_score);
    }
    function countUpScore(index) {
        if (index <= 5) {
            const current_player = getCurrentPlayer(eyes[index]);

            score += current_player.points;
            index = index + 1;

            countUpScore(index);
        }
        document.getElementById('player-' + currentPlayer.value + '-upperScore').innerHTML = score;
        document.getElementById('player-' + currentPlayer.value + '-upperScore-general').innerHTML = score;

        return score;
    }
    function countBonus(score) {
        if (score >= 63) {
            score = score + 35;
            document.getElementById('player-' + currentPlayer.value + '-bonus').innerHTML = '35';
        } else {
            document.getElementById('player-' + currentPlayer.value + '-bonus').innerHTML = '-';
        }

        current_player.upperScore = score;
        document.getElementById('player-' + currentPlayer.value + '-totalUpperScore').innerHTML = score;
    }
}

function scoreLower_count() {
    let current_player = players[currentPlayer.value].value;

    if (
        current_player.threeOfKind.filled === true && current_player.fourOfKind.filled === true
        && current_player.littleStreet.filled === true && current_player.largeStreet.filled === true
        && current_player.fullHouse.filled === true && current_player.yahtzee.filled === true
        && current_player.chance.filled === true) {

        const score = current_player.threeOfKind.points + current_player.fourOfKind.points +
                           current_player.fullHouse.points + current_player.littleStreet.points +
                           current_player.largeStreet.points + current_player.yahtzee.points +
                           current_player.chance.points;

        current_player.lowerScore = score;

        document.getElementById('player-' + currentPlayer.value + '-lowerScore').innerHTML = score;
    }
}

function generalScore_count() {
    let current_player = players[currentPlayer.value].value;

    if (current_player.scoresFilled === 13) {
        const score = current_player.lowerScore + current_player.upperScore;

        document.getElementById('player-' + currentPlayer.value + '-grandTotal').innerHTML = score;
    }
}
function isFilled(name) {
    canFillScore = true;

    let player = document.getElementById('player-' + currentPlayer.value + '-' + name)
    const current_player = getCurrentPlayer(name);

    if (current_player.filled !== true) {
        player.style.backgroundColor = '#FFFFCC'
    } else {
        player.style.backgroundColor = '';
    }
}
/*----------------------------------------------------------------------------------------------------------------------------------------------*/
let players = {
    1: { name: 'player_one', value: false },
    2: { name: 'player_one', value: false },
    3: { name: 'player_one', value: false },
    4: { name: 'player_one', value: false }
}
class Player {
    constructor() {
        this.scoresFilled = 0;
        this.upperScore = 0;
        this.lowerScore = 0;

        this.ones = { points: "", fillable: false, filled: false };
        this.twos = { points: "", fillable: false, filled: false };
        this.threes = { points: "", fillable: false, filled: false };
        this.fours = { points: "", fillable: false, filled: false };
        this.fives = { points: "", fillable: false, filled: false };
        this.sixes = { points: "", fillable: false, filled: false };

        this.threeOfKind = { points: "", fillable: false, filled: false };
        this.fourOfKind = { points: "", fillable: false, filled: false };
        this.fullHouse = { points: "", fillable: false, filled: false };
        this.littleStreet = { points: "", fillable: false, filled: false };
        this.largeStreet = { points: "", fillable: false, filled: false };
        this.yahtzee = { points: "", fillable: false, filled: false };
        this.chance = { points: "", fillable: false, filled: false };
    }
}
function changePlayerTurn() {
    if (currentPlayer.value === 1) {
        if (players[2].value === false) {
            currentPlayer.value = 1;
        } else {
            currentPlayer.value = 2;
        }
    }
    else if (currentPlayer.value === 2) {
        if (players[3].value === false) {
            currentPlayer.value = 1;
        } else {
            currentPlayer.value = 3;
        }
    }
    else if (currentPlayer.value === 3) {
        if (players[4].value === false) {
            currentPlayer.value = 1;
        } else {
            currentPlayer.value = 4;
        }
    }
    else if (currentPlayer.value === 4) {
        currentPlayer.value = 1;
    }
}
function getCurrentPlayer(name) {
    let current_player = players[currentPlayer.value].value;

    switch (name) {
        case "ones":
            current_player = current_player.ones;
            break;
        case "twos":
            current_player = current_player.twos;
            break;
        case "threes":
            current_player = current_player.threes;
            break;
        case "fours":
            current_player = current_player.fours;
            break;
        case "fives":
            current_player = current_player.fives;
            break;
        case "sixes":
            current_player = current_player.sixes;
            break;
        case "threeOfKind":
            current_player = current_player.threeOfKind;
            break;
        case "fourOfKind":
            current_player = current_player.fourOfKind;
            break;
        case "fullHouse":
            current_player = current_player.fullHouse;
            break;
        case "littleStreet":
            current_player = current_player.littleStreet;
            break;
        case "largeStreet":
            current_player = current_player.largeStreet;
            break;
        case "yahtzee":
            current_player = current_player.yahtzee;
            break;
        case "chance":
            current_player = current_player.chance;
            break;
    }
    return current_player;
}
function createPlayersHandler(player_id) {
    createGame(player_id);
    createPlayers(player_id);
}
function createPlayers(players_amount) {
    players[players_amount].value = new Player;

    players_amount = players_amount - 1;

    if (players_amount > 0) {
        createPlayers(players_amount);
    } else {
        setSelectedPlayers();
    }
}
/*----------------------------------------------------------------------------------------------------------------------------------------------*/
class Game {
    constructor(maxPlayers) {
        this.maxPlayers = maxPlayers;
        this.maxScoresFilled = 13;
        this.gameEnded = false;
        this.playersFinished = 0;
    }
}
function startOrResetHandler(option) {
    startOrResetGame(option);
}
function startOrResetGame(option) {
    switch (option) {
        case 'Nieuw Spel':
            startGame();
            break;
        case 'Restart Spel':
            const restart = confirm('Weet u zeker dat u het spel wilt herstarten?');
            if (restart) {
                resetGame();
            }
            break;
        default:
            alert('Ongeldige Keuze!');
            break;
    }
}
function createGame(maxPlayers) {
    game = new Game(maxPlayers);
}
function gameOverCheck() {
    let player = players[currentPlayer.value].value.scoresFilled;

    if (player === 13) {
        game.playersFinished++;
    }

    if (game.playersFinished === game.maxPlayers) {
        game.gameEnded = true;
    }
}
/*----------------------------------------------------------------------------------------------------------------------------------------------*/

onMounted(() => {

});
</script>
<style>
.fillFont {
    cursor: pointer;

}
</style>

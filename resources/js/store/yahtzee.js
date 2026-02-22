import axios from "axios";
import { defineStore } from "pinia";
import router from "@/router/index.js";
export const YahtzeeStore = defineStore({
    id: "post",
    state: () => ({
        gameStarted: false,
        selectedPlayers: false,
        currentPlayer: 1,
        dice: {
          1: {
            value: 1,
            locked: false,
          },
          2: {
            value: 2,
            locked: false,
          },
          3: {
            value: 3,
            locked: false,
          },
          4: {
            value: 4,
            locked: false,
          },
          5: {
            value: 5,
            locked: false,
          },
        },
        eyes: {
          1: "⚀",
          2: "⚁",
          3: "⚂",
          4: "⚃",
          5: "⚄",
          6: "⚅",
        },
        diceThrown: false,
        selectScore: false,
        turns: 3,
    }),
    getters: {
        gameStatus(state) {
            return state.gameStarted;
        },
    },
    actions: {
        async startGame() {
            this.gameStarted = true;

            return null;
        },
        async resetGame() {
            router.go('/')
        },
        async setSelectedPlayers(){
            this.selectedPlayers = true;

            this.currentPlayer = 1;
        },
        async resetDice() {
            this.diceThrown = false;
            this.turns = 3;
            this.dice = {
                1: {
                    value: 1,
                    locked: false,
                },
                2: {
                    value: 2,
                    locked: false,
                },
                3: {
                    value: 3,
                    locked: false,
                },
                4: {
                    value: 4,
                    locked: false,
                },
                5: {
                    value: 5,
                    locked: false,
                },
            }
        },
        async randomDice() {
            // DEFAULT: 6, SET TO 1 OR 2 FOR TESTING
            const index = 6;

            if (this.diceThrown === false) {
                this.diceThrown = true;
            }

            if (this.turns > 0) {
                for(let die in this.dice) {
                    const isLocked = this.dice[die].locked;

                    if (isLocked !== true) {
                        this.dice[die].value = Math.floor(Math.random() * index) + 1;
                    }
                }
                this.turns --;
            } else {
                await this.resetDice();
            }
        },
        async keepDie(number) {
            if (this.diceThrown === true & this.gameStarted === true || this.turns === 0) {
                const isLocked = this.dice[number].locked
                this.dice[number].locked = isLocked !== true;
            }
        },
        countNumbers() {
            let counts = [];
            let numbers = [];

            Object.keys(this.dice).forEach(k => {
                const v = this.dice[k];
                numbers.push(v.value);
            });

            for (let i = 1; i <= 6; i++) {
                let counter = 0;
                numbers.forEach((x) => {
                    if (x === i) {
                        counter++;
                    }
                });
                counts.push(counter);
            }

            return [numbers, counts];
        },
        countDie(eyes) {
            const counts = this.countNumbers()[1];
            let scoreDie = 0;
            let bonus = 0;

            for (let i = 1; i <= 5 ; i++) {
                if (this.dice[i].value === eyes) {
                    scoreDie = scoreDie + eyes;
                }
            }
            return scoreDie + bonus;
        },
        yahtzeeBonus() {
            const counts = this.countNumbers()[1];

            return counts.includes(5);
        },
        threeOrFourOfKind(name) {
            const data = this.countNumbers();
            const counts = data[1];
            const number = data[0];

            if (name === "threeOfKind") {
                if (counts.includes(3) || counts.includes(4)) {
                    return number[0] + number[1] + number[2] + number[3] + number[4];
                } else {
                    return 0
                }
            } else if (name === "fourOfKind") {
                if (counts.includes(4) || counts.includes(5)) {
                    return number[0] + number[1] + number[2] + number[3] + number[4];
                } else {
                    return 0
                }
            } else if (name === "yahtzee") {
                if (counts.includes(5)) {
                    return 50;
                } else {
                    return 0
                }
            } else {
                return 0;
            }
        },
        fullHouse(has_yahtzee_bonus) {
            const data = this.countNumbers();
            const counts = data[1];

            if ((counts.includes(3) && counts.includes(2)) || has_yahtzee_bonus) {
                return 25;
            } else {
                return 0;
            }
        },
        littleStreet(has_yahtzee_bonus) {
            const data = this.countNumbers();
            const counts = data[1];

            if (
                (counts[0] >= 1 &&
                    counts[1] >= 1 &&
                    counts[2] >= 1 &&
                    counts[3] >= 1) ||
                (counts[1] >= 1 &&
                    counts[2] >= 1 &&
                    counts[3] >= 1 &&
                    counts[4] >= 1) ||
                (counts[2] >= 1 &&
                    counts[3] >= 1 &&
                    counts[4] >= 1 &&
                    counts[5] >= 1)
            ) {
                return 30;
            } else if (has_yahtzee_bonus) {
                return 30;
            } else {
                return 0;
            }
        },
        largeStreet(has_yahtzee_bonus) {
            const data = this.countNumbers();
            const counts = data[1];

            if (
                (counts[0] >= 1 &&
                    counts[1] >= 1 &&
                    counts[2] >= 1 &&
                    counts[3] >= 1 &&
                    counts[4] >= 1) ||
                (counts[1] >= 1 &&
                    counts[2] >= 1 &&
                    counts[3] >= 1 &&
                    counts[4] >= 1 &&
                    counts[5] >= 1)
            ) {
                return 40;
            } else if (has_yahtzee_bonus) {
                return 40;
            } else {
                return 0;
            }
        },
        chance() {
            return this.dice[1].value + this.dice[2].value + this.dice[3].value + this.dice[4].value + this.dice[5].value;
        }
    },
});

// --------------------------------------------------------------------------------------------------------------------#

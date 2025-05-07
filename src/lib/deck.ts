import cards from "@younestouati/playing-cards-standard-deck";
import type { CardValue } from "./Card.svelte";
import {writable, type Writable} from "svelte/store";


export class Game {

    activeColumn: number = -1;
    gameState: Writable<CardValue[][]> = writable([]);
    activeCards: Writable<CardValue[]> = writable([]);
    #activeCards: CardValue[] = [];
    #gameState: CardValue[][] = [];
    #deck: CardValue[] = [];
    readonly #maxColumns: number = 0;

    constructor(maxColumns: number) {
        this.#maxColumns = maxColumns;
        this.resetGame();
        for (let i = 10; i < this.#maxColumns; i -= 1) {
            this.draw();
        }
    }

    #render = () => {
        this.gameState.set(this.#gameState);
        this.activeCards.set(this.#activeCards);
    }

    resetGame = async () => {
        this.activeColumn = -1;
        this.#deck = Object.keys(cards).filter(card => card !== "joker") as CardValue[];
        this.#shuffleDeck();
        this.#gameState = [];
        for (let i = 0; i < this.#maxColumns; i += 1) {
            this.#gameState.push([]);
        }
        this.#render();
        for (let i = 0; i < this.#maxColumns * 2; i += 1) {
            setTimeout(this.draw, 50*i);
        }
    }

    draw = () => {
        this.#activeCards = [];
        this.activeColumn += 1;
        if (this.activeColumn === this.#maxColumns) {
            this.activeColumn = 0;
        }

        if (this.#deck.length === 0) {
            throw new Error("Deck is empty");
        }

        let card = this.#deck.pop();

        if (card == null) {
            throw new Error("Error while drawing");
        }
        this.#gameState[this.activeColumn].push(card);
        this.#render();
    }

    pick = (card: CardValue, columnIndex: number)=> {
        if (this.#activeCards.includes(card)) {
            this.#activeCards = this.#activeCards.filter(c => c !== card);
        } else {
            if (this.#activeCards.length < 3 && columnIndex === this.activeColumn) {
                this.#activeCards.push(card);
            }
        }
        this.#render();
    }

    play = (fromFront: number, fromBack: number) => {
        if (
            (fromFront < 1 || fromFront > 3) ||
            (fromBack < 0 || fromBack > 2) ||
            (fromFront + fromBack !== 3) ||
            (this.#gameState[this.activeColumn].length < 3)
        ) {
            throw new Error("Not a valid move");
        }

        let cardsFromFront = this.#gameState[this.activeColumn].slice(fromFront);
        let cardsFromBack = this.#gameState[this.activeColumn].slice(0, fromBack);

        let sum = [...cardsFromFront, ...cardsFromBack].reduce((acc, curr) => acc + this.#getValue(curr), 0);

        if (![10, 20, 30].includes(sum)) {
            throw new Error("Not a valid move");
        }

        this.#deck = [...cardsFromBack, ...cardsFromFront, ...this.#deck];
        this.#gameState[this.activeColumn] = this.#gameState[this.activeColumn].slice(fromBack, -fromFront);
        this.#render();
    }

    #getValue = (value: CardValue): number => {
        let numberValue = Number.parseInt(value.slice(0, -1));
        return Math.min(numberValue, 10);
    }


    #shuffleDeck = () => {
        let currentIndex = this.#deck.length;
        while (currentIndex > 0) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [this.#deck[currentIndex], this.#deck[randomIndex]] = [
                this.#deck[randomIndex], this.#deck[currentIndex]];
        }
    }

}
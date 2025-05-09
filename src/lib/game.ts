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

    pick = (card: CardValue)=> {
        if (this.#activeCards.includes(card) && this.#isValidSubtraction(card)) {
            this.#activeCards = this.#activeCards.filter(c => c !== card);
        }
        else if (this.#activeCards.length < 3 && this.#isValidAddition(card)) {
            this.#activeCards.push(card);
        }

        this.#render();

        if (this.#activeCards.length === 3) {
            this.play();
        }

        this.#render();
    }

    #pickedIsOnEdge(card: CardValue): boolean {
        const stack = this.#gameState[this.activeColumn];
        const cardIndex = stack.findIndex(c => c === card);
        const pickedIndexes = this.#activeCards.map(activeCard => stack.findIndex(c => c === activeCard));
        if (cardIndex === 1) return true;
        if (cardIndex === 0 && pickedIndexes.includes(1)) return false;
        return (!pickedIndexes.includes(cardIndex - 1))
    }

    #unpickedIsOnEdge(card: CardValue): boolean {
        const stack = this.#gameState[this.activeColumn];
        const unpickedStack = stack.filter(c => !this.#activeCards.includes(c));
        const cardIndex = unpickedStack.findIndex(c => c === card);
        return cardIndex === 0 || cardIndex === unpickedStack.length - 1;
    }

    #isOnEdge = (card: CardValue) => {
        if (this.#activeCards.includes(card)) {
            return this.#pickedIsOnEdge(card);
        }
        return this.#unpickedIsOnEdge(card);
    }

    #isValidSubtraction = (card: CardValue): boolean => {
        if (!this.#activeCards.includes(card)) return false;
        return this.#pickedIsOnEdge(card);
    }

    #isValidAddition = (card: CardValue): boolean => {
        if (this.#activeCards.includes(card)) return false;
        return this.#unpickedIsOnEdge(card);
    }

    play = () => {
        let sum = this.#activeCards.reduce((acc, curr) => acc + this.#getValue(curr), 0);

        if (![10, 20, 30].includes(sum)) {
            console.log("Not a valid move");
            this.#activeCards = [];
            this.#render();
            return
        }

        this.#deck = [...this.#activeCards, ...this.#deck];
        this.#gameState[this.activeColumn] = this.#gameState[this.activeColumn].filter(c => !this.#activeCards.includes(c));
        this.#activeCards = [];
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
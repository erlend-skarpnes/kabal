import cards from "@younestouati/playing-cards-standard-deck";
import type { CardValue } from "./Card.svelte";
import {writable, get, type Writable} from "svelte/store";

type GameState = "playing" | "won" | "lost" | "dealing";

interface State {
    activeColumn: number;
    board: CardValue[][]
    deck: CardValue[]
    gameState: GameState;
    activeCards: CardValue[];
    cardBackImage: string;
}

export class Game {
    readonly #allCardBacks = [
        "abstract.svg",
        "abstract_clouds.svg",
        "abstract_scene.svg",
        "astronaut.svg",
        "blue.svg",
        "blue2.svg",
        "cars.svg",
        "castle.svg",
        "fish.svg",
        "frog.svg",
        "red.svg",
        "red2.svg"
    ];
    
    state: Writable<State> = writable({
        activeColumn: 0,
        board: [],
        deck: [],
        gameState: "playing",
        activeCards: [],
        cardBackImage: this.#getRandomCardBack()
    });
    #activeColumn: number = -1;
    #activeCards: CardValue[] = [];
    #board: CardValue[][] = [];
    #deck: CardValue[] = [];
    #gameState: GameState = "playing";
    #cardBackImage: string = "";
    readonly #maxColumns: number = 0;
    #isResetting: boolean = false;

    constructor(maxColumns: number) {
        this.#maxColumns = maxColumns;
        this.#cardBackImage = this.#getRandomCardBack();
        if (!this.#loadGame()) {
            this.resetGame();
        }
    }
    
    #getRandomCardBack(): string {
        return this.#allCardBacks[Math.floor(Math.random() * this.#allCardBacks.length)];
    }

    #loadGame = () => {
        const jsonString = localStorage.getItem("state");
        if (jsonString == null) return false;
        const loadedState: State = JSON.parse(jsonString);
        this.state.set(loadedState);
        localStorage.setItem("state", JSON.stringify(loadedState))
        this.#activeColumn = loadedState.activeColumn;
        this.#activeCards = loadedState.activeCards;
        this.#board = loadedState.board;
        this.#deck = loadedState.deck;
        this.#gameState = loadedState.gameState;
        this.#cardBackImage = loadedState.cardBackImage || this.#getRandomCardBack();
        return true;
    }
    
    #render = () => {
        this.state.set({
            activeColumn: this.#activeColumn,
            board: this.#board,
            deck: this.#deck,
            gameState: this.#gameState,
            activeCards: this.#activeCards,
            cardBackImage: this.#cardBackImage
        });

        localStorage.setItem("state", JSON.stringify(get(this.state)));
    }

    resetGame = async () => {
        this.#isResetting = true;
        this.#gameState = "dealing";
        this.#activeColumn = -1;
        this.#activeCards = [];
        this.#deck = Object.keys(cards).filter(card => card !== "joker") as CardValue[];
        this.#shuffleDeck();
        
        // Get a new random card back
        this.#cardBackImage = this.#getRandomCardBack();
        
        // Clear the board
        this.#board = [];
        for (let i = 0; i < this.#maxColumns; i += 1) {
            this.#board.push([]);
        }
        this.#render();

        // Give the old cards time to resolve their animation
        await new Promise(resolve => setTimeout(resolve, 200));

        // Deal cards with animation
        const totalCards = this.#maxColumns * 2;
        await this.#dealCards(totalCards);
        
        this.#isResetting = false;
        this.#gameState = "playing";
        this.#render();
    }
    
    #dealCards = async (count: number): Promise<void> => {
        for (let i = 0; i < count; i++) {
            this.draw();
            // Wait for animation to complete before dealing next card
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    draw = (): void => {
        this.#activeCards = [];
        this.#activeColumn += 1;
        if (this.#activeColumn === this.#maxColumns) {
            this.#activeColumn = 0;
        }

        if (this.#board[this.#activeColumn].length === 0 && !this.#isResetting) {
            return this.draw();
        }

        if (this.#deck.length === 0) {
            this.#gameState = "lost";
            this.#render();
        }

        let card = this.#deck.pop();

        if (card == null) {
            throw new Error("Error while drawing");
        }

        this.#board[this.#activeColumn].push(card);
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
        const stack = this.#board[this.#activeColumn];
        const cardIndex = stack.findIndex(c => c === card);
        const pickedIndexes = this.#activeCards.map(activeCard => stack.findIndex(c => c === activeCard)).sort();

        if (pickedIndexes.length === stack.length) return true;

        let splitIndex = 0;

        for (let i = 0; i <= pickedIndexes.length; i++) {
            if (!pickedIndexes.includes(i)) {
                splitIndex = i;
                break;
            }
        }

        let startStack = pickedIndexes.slice(0, splitIndex).sort();
        let endStack = pickedIndexes.slice(splitIndex).sort();

        return [startStack[startStack.length - 1], endStack[0]].includes(cardIndex);
    }

    #unpickedIsOnEdge(card: CardValue): boolean {
        const stack = this.#board[this.#activeColumn];
        const unpickedStack = stack.filter(c => !this.#activeCards.includes(c));
        const cardIndex = unpickedStack.findIndex(c => c === card);
        return cardIndex === 0 || cardIndex === unpickedStack.length - 1;
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
        this.#board[this.#activeColumn] = this.#board[this.#activeColumn].filter(c => !this.#activeCards.includes(c));
        if (this.#board.every(c => c.length === 0)) this.#gameState ="won";
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
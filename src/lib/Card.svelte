<script lang="ts">
    import cards from "@younestouati/playing-cards-standard-deck";
    import {flyFromAnchor} from "./transition";

    export type CardValue = Exclude<keyof typeof cards, "joker">;

    const props: { value: CardValue; stackIndex: number, active: boolean, onClick: () => void, transitionStartElement: HTMLElement } = $props();
</script>

<div class="card-container {props.stackIndex === 0 ? 'first-card' : 'non-first-card'}"
     transition:flyFromAnchor={{anchor: props.transitionStartElement}}>
        <button onclick={props.onClick} class={ props.active ? "active" : "not-active" }>
            <img src={`data:image/svg+xml;base64,${cards[props.value]}`} alt={props.value} />
        </button>
</div>

<style>
    img {
        box-sizing: border-box;
        width: 100px;
        display: block;
    }

    .card-container {
        box-shadow: 0 -3px 3px #1a1a1a;
    }

    .active {
        box-shadow: 0 0 0 3px orange;
    }

    .non-first-card {
        margin-top: -100px;
    }

    button {
        all: unset;
        padding: 0;
        display: block;
        cursor: pointer;
        transition: box-shadow 0.1s;
    }
    button:hover {
        box-shadow: 0 0 0 3px #646cff;
    }
</style>
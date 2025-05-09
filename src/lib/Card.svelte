<script lang="ts">
    import cards from "@younestouati/playing-cards-standard-deck";

    export type CardValue = Exclude<keyof typeof cards, "joker">;

    const props: { value: CardValue; stackIndex: number, active: boolean, onClick: () => void } = $props();
</script>
<div class="{props.stackIndex === 0 ? 'first-card' : 'non-first-card'}">
    <button onclick={props.onClick}>
        <img src={`data:image/svg+xml;base64,${cards[props.value]}`} alt={props.value} class={ props.active ? "active" : "not-active" }/>
    </button>
</div>

<style>
    img {
        box-sizing: border-box;
        width: 100px;
        box-shadow: 0 -3px 3px #1a1a1a;
    }

    .active {
        box-shadow: 0 0 10px orange;
        border: solid 1px orange;
    }

    .not-active {
        border: solid 1px transparent;
    }

    .non-first-card {
        margin-top: -100px;
    }

    button {
        border-radius: 0;
        padding: 0;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: border-color 0.25s;
    }

</style>
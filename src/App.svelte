<script lang="ts">
    import Card, {type CardValue} from "./lib/Card.svelte";
    import {Game} from "./lib/game";

    const game = new Game(8);

    const toggleActiveCard = (card: CardValue) => {
        game.pick(card)
    }

    let anchorEl: HTMLElement;

    let deck = game.deck;
    let board = game.board;
    let activeCards = game.activeCards;
    let gameState = game.gameState;
</script>

<main>
    <div class="actions">
        <button onclick={game.draw}>Draw</button>
        <button onclick={game.resetGame}>Reset</button>
    </div>
    <div class="play-area">
        <div class="column" bind:this={anchorEl}>
            {#if $deck.length > 0}
                <img src="cardback.jpg" width="100px" class="deck" alt="cardback" />
            {/if}
        </div>
        {#each $board as column}
            <div class="column">
                {#each column as card, stackIndex}
                    <Card value={card} stackIndex={stackIndex} active={$activeCards.includes(card)}
                          onClick={() => {
                          toggleActiveCard(card)
                          }}
                          transitionStartElement={anchorEl}
                    />
                {/each}
            </div>
        {/each}
    </div>
    {#if $gameState === "won"}
        <p>Du vant!</p>
    {/if}
    {#if $gameState === "lost"}
        <p>Du tapte!</p>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .actions {
        padding: 2rem;
    }

    .play-area {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 1rem;
    }

    .column {
        display: flex;
        flex-direction: column;
    }

    .deck {
        z-index: 9;
    }

</style>

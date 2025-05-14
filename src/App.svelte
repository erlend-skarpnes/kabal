<script lang="ts">
    import Card, {type CardValue} from "./lib/Card.svelte";
    import {Game} from "./lib/game";
    import Cardback from "./lib/Cardback.svelte";

    const game = new Game(8);

    const toggleActiveCard = (card: CardValue) => {
        game.pick(card)
    }

    let anchorEl: HTMLElement;

    let gameState = game.state;
</script>

<main>
    <div class="play-area">
        <div class="column" bind:this={anchorEl}>
            {#if $gameState.deck.length > 0}
                <div class="deck">
                    <Cardback onClick={game.draw} />
                </div>
                <div class="actions">
                    <button onclick={game.resetGame}>Nytt spill</button>
                </div>
            {/if}
        </div>
        {#each $gameState.board as column}
            <div class="column">
                {#each column as card, stackIndex}
                    <Card value={card} stackIndex={stackIndex} active={$gameState.activeCards.includes(card)}
                          onClick={() => {
                          toggleActiveCard(card)
                          }}
                          transitionStartElement={anchorEl}
                    />
                {/each}
            </div>
        {/each}
    </div>
    {#if $gameState.gameState === "won"}
        <p>Du vant!</p>
    {/if}
    {#if $gameState.gameState === "lost"}
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
        padding: 1rem 0;
        max-width: 100px;
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

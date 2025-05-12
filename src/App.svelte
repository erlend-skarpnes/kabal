<script lang="ts">
    import Card, {type CardValue} from "./lib/Card.svelte";
    import {Game} from "./lib/game";

    const game = new Game(8);

    const toggleActiveCard = (card: CardValue) => {
        game.pick(card)
    }

    let deck = game.deck;
    let gameState = game.gameState;
    let activeCards = game.activeCards;
</script>

<main>
    <div class="actions">
        <button onclick={game.draw}>Draw</button>
        <button onclick={game.resetGame}>Reset</button>
    </div>
    <div class="play-area">
        <div class="column">
            {#if $deck.length > 0}
                <img src="public/cardback.jpg" width="100px" alt="cardback"/>
            {/if}
        </div>
        {#each $gameState as column}
            <div class="column">
                {#each column as card, stackIndex}
                    <Card value={card} stackIndex={stackIndex} active={$activeCards.includes(card)}
                          onClick={() => {
                          toggleActiveCard(card)
                          }}/>
                {/each}
            </div>
        {/each}
    </div>
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

</style>

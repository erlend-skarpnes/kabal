<script lang="ts">
    import Card, {type CardValue} from "./lib/Card.svelte";
    import {Game} from "./lib/deck";

    const game = new Game(8);
    // let activeCards: CardValue[] = $state([]);

    const toggleActiveCard = (card: CardValue, columnIndex: number, stackIndex: number) => {
        game.pick(card, columnIndex)
    }

    let gameState = game.gameState;
    let activeCards = game.activeCards;
</script>

<main>
    <div class="actions">
        <button onclick={game.draw}>Draw</button>
        <button onclick={game.resetGame}>Reset</button>
    </div>
    <div class="play-area">
        {#each $gameState as column, columnIndex}
            <div class="column">
                {#each column as card, stackIndex}
                    <Card value={card} stackIndex={stackIndex} active={$activeCards.includes(card)}
                          onClick={() => {
                          toggleActiveCard(card, columnIndex, stackIndex)
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
        grid-template-columns: repeat(8, 1fr);
        gap: 1rem;
    }

    .column {
        display: flex;
        flex-direction: column;
    }

</style>

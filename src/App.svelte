<script lang="ts">
    import Card, {type CardValue} from "./lib/Card.svelte";
    import {Game} from "./lib/game";
    import Cardback from "./lib/Cardback.svelte";

    const game = new Game(8);

    const toggleActiveCard = (card: CardValue) => {
        game.pick(card)
    }

    let screenWidth: number = window.innerWidth;

    let anchorEl: HTMLElement;

    let gameState = game.state;
</script>

<svelte:window bind:innerWidth={screenWidth}/>
<main>
    {#if screenWidth < 700}
        For smal skjerm til å spille kabal! Legg telefonen på siden eller gjør vinduet bredere.
    {:else}
    <div class="play-area">
        <div class="column" bind:this={anchorEl}>
            {#if $gameState.deck.length > 0}
                <div class="deck">
                    <Cardback onClick={game.draw} />
                </div>
            {/if}
                <div class="actions">
                    <button onclick={game.resetGame} disabled={$gameState.isResetting}>Nytt spill</button>
                </div>

        </div>
        {#each $gameState.board as column, columnIndex}
            <div class="column {$gameState.activeColumn === columnIndex ? 'active' : ''}">
                {#each column as card, stackIndex}
                    <Card value={card} stackIndex={stackIndex} picked={$gameState.activeCards.includes(card)}
                          onClick={() => {
                          toggleActiveCard(card)
                          }}
                          transitionStartElement={anchorEl}
                          active={$gameState.activeColumn === columnIndex}
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
        max-width: 100%;
    }

    .play-area {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
    }

    .column {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        height: fit-content;
        transition: background-color 1s ease;
    }

    .active {
        background-color: #72746F;
    }

    .deck {
        z-index: 9;
    }

</style>

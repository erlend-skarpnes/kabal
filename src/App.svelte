<script lang="ts">
    import Card, {type CardValue} from "./lib/Card.svelte";
    import {Game} from "./lib/game";
    import Cardback from "./lib/Cardback.svelte";

    const game = new Game(8);

    const toggleActiveCard = (card: CardValue) => {
        game.pick(card)
    }

    const scrollIntoView = (columnIndex: number) => {
        const el = document.getElementById(`column-${columnIndex}`);
        if (!el) return;
        el.scrollIntoView({
            behavior: 'smooth',
            inline: "center"
        });
    }

    $effect(() => {
        scrollIntoView($gameState.activeColumn);
    })

    let screenWidth: number = $state(window.innerWidth);

    let anchorEl: HTMLElement | undefined = $state(undefined);

    let gameState = game.state;
</script>

<svelte:window bind:innerWidth={screenWidth}/>
    <main>
        <div class="actions" bind:this={anchorEl}>
            {#if $gameState.deck.length > 0}
                <div class="deck">
                    <Cardback onClick={game.draw} />
                </div>
            {/if}
            <div>
                <button onclick={game.resetGame} disabled={$gameState.isResetting}>Nytt spill</button>
            </div>
        </div>
        <div class="play-area">
            {#each $gameState.board as column, columnIndex}
                <div class="column {($gameState.activeColumn === columnIndex) && !$gameState.isResetting ? 'active' : ''}" id="column-{columnIndex}">
                    {#each column as card, stackIndex (card)}
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
    </main>

<style>
    :global(:root) {
        --card-width: clamp(120px, 8vw, 180px);
        --card-aspect-ratio: 2.5 / 3.5; /* Standard playing card ratio */
    }

    main {
        display: flex;
        flex-direction: row;
        width: fit-content;
        max-width: 100%;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 0.5rem;
        width: var(--card-width);
        flex-shrink: 0; /* Prevent shrinking */
    }

    .play-area {
        display: grid;
        grid-template-columns: repeat(8, var(--card-width));
        overflow-x: scroll;
        scrollbar-width: none;
    }

    .play-area::-webkit-scrollbar {
        display: none;
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
        width: 100%;
        flex-shrink: 0; /* Prevent shrinking */
    }
</style>
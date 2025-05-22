<script lang="ts">
    const {onClick, imagePath}: {onClick: () => void, imagePath: string} = $props();
</script>

<div class="cardback-container">
    <button onclick={onClick}>
        <img src="cardbacks/{imagePath}" alt="card back" />
    </button>
</div>

<style>
    .cardback-container {
        flex-shrink: 0; /* Prevent shrinking */
        width: 100%;
    }
    
    img {
        box-sizing: border-box;
        width: 100%;
        display: block;
        aspect-ratio: var(--card-aspect-ratio);
    }

    button {
        all: unset;
        width: 100%;
        padding: 0;
        display: block;
        cursor: pointer;
        transition: box-shadow 0.1s;
        flex-shrink: 0; /* Prevent shrinking */
    }

    button:hover {
        box-shadow: 0 0 0 3px #646cff;
    }
</style>
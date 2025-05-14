<script lang="ts">
    const allCardBacks = [
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
    ]

    const randomCardBack = allCardBacks[Math.floor(Math.random() * allCardBacks.length)];

    const {onClick}: {onClick: () => void} = $props();
</script>

<button onclick={onClick}>
    <img src="cardbacks/{randomCardBack}" alt="card back" />
</button>

<style>
    img {
        width: 100px;
        display: block;
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

import type { TransitionConfig } from 'svelte/transition';

interface FlyFromAnchorParams {
    anchor: HTMLElement;
    duration?: number;
}

export function flyFromAnchor(
    node: Element,
    { anchor, duration = 200 }: FlyFromAnchorParams
): TransitionConfig {
    const nodeRect = node.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();

    const dx = anchorRect.left - nodeRect.left;
    const dy = anchorRect.top - nodeRect.top;

    return {
        duration,
        css: (t: number) => {
            const x = dx * (1 - t);
            const y = dy * (1 - t);
            return `
               transform: translate(${x}px, ${y}px);
      `;
        }
    };
}
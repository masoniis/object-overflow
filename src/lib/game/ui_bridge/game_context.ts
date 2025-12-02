import { getContext, setContext } from 'svelte';
import { GameState, type GameStateDependencies } from '../core/state/game_state.svelte';

/**
 * Unique symbol key for the GameState context.
 */
const GAME_KEY = Symbol('OBJECT_OVERFLOW_GAME_STATE');

/**
 * Creates a GameState and injects it into the component tree.
 */
export function initGameContext(deps?: GameStateDependencies): GameState {
	// creates game state
	const state = new GameState(deps);

	// injects it into component tree
	setContext(GAME_KEY, state);

	return state;
}

/**
 * Returns the game state from the component tree.
 * @throws {Error} If called outside a component where setGameState() was run.
 */
export function getGameState(): GameState {
	const state = getContext<GameState>(GAME_KEY);
	if (!state) {
		throw new Error('Component is trying to access GameState but is not inside a Game Provider!');
	}
	return state;
}

# Object overflow

Incremental object game

## Running project

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Design patterns

1. `GameState` Singleton pattern
   The state of the game for tracking currency uses the singleton pattern to ensure that there is only one global state that represents progress.

2. `Tickable` Strategy pattern
   The game engine manages ticks, and calls a set of Tickables based on it's internal state. Any class can implement the Tickable strategy in order to add logic that reacts to a game "tick."

3. TODO: builder pattern on engine probably

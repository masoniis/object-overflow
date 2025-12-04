# Object overflow

Incremental object game

## Running project

Requires installing `bun`:

```sh
bun dev
```

## Design patterns

1. `GameState` Singleton pattern
   The state of the game for tracking currency uses the singleton pattern to ensure that there is only one global state that represents progress.

2. `Tickable` Strategy pattern
   The game engine manages ticks, and calls a set of Tickables based on it's internal state. Any class can implement the Tickable strategy in order to add logic that reacts to a game "tick."

3. Factory method on effects. Effects and construction is managed by the random factory.

4. `Upgrade` Template Method pattern
   The `Upgrade` abstract class defines a `purchase` method that acts as a template for purchasing an upgrade. It handles the common logic of checking the cost and deducting it from the game state. It then calls an abstract `onPurchase` method, which is implemented by each concrete upgrade subclass to apply its specific effect. This allows for code reuse while letting subclasses define their unique behavior.

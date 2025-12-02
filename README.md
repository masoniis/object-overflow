# Object overflow

Incremental object game made by **Mason Bott** and **Calvin Schaller**.

- Deployed online at [object-overflow.vercel.app](https://object-overflow.vercel.app/)

## Building project

To build and run the project locally, you must have `bun` installed. Then, simply execute

```sh
bun dev
```

The terminal will give you information regarding the port that the website can be accessed from via localhost.

## Design patterns

### 1. **Facade pattern** for `GameState`

The GameState class implements the Facade pattern to provide a simplified, unified interface to a complex subsystem of domain managers (e.g., PlayerStatsManager, ProducerManager, UpgradeManager). Instead of UI components or game systems interacting directly with many internal data structures, they communicate with the GameState facade. This decoupling allows the facade to orchestrate complex operations while keeping the calling code clean and unaware of the underlying structural complexity.

### 2. **Strategy pattern** on `Tickable`

The game engine manages ticks which are simply an interval of time since the previous frame. It also holds a set of objects that implement the Tickable strategy, and when a new tick comes, it calls the `tick` method on all classes loaded as systems in the engine. This is useful for things like updating currency/resources based on the time passed.

### 3. **Factory method pattern** on `Effect`s

Effects and construction is managed by the random effect factory.

### 4. **Template Method pattern** on `Upgrade`s

The `Upgrade` abstract class defines a `purchase` method that acts as a template for purchasing an upgrade. It handles the common logic of checking the cost and deducting it from the game state. It then calls an abstract `onPurchase` method, which is implemented by each concrete upgrade subclass to apply its specific effect. This allows for code reuse while letting subclasses define their unique behavior.

### 5. **Command pattern** for `ScreenObject`s

The `ScreenObject` abstract class defines an `onClick` method that concrete implementations like `GoldenObject` and `NefariousObject` must implement. This `onClick` method encapsulates the specific action to be performed when the object is clicked, effectively acting as a command. The `ClickableObjectLayer` invokes this command without needing to know the details of each object's action, thus decoupling the invoker from the specific operation.

- The **command** is the `onClick` method of the command object (`ScreenObject` subclasses).
- The **receiver** is `GameState` (while typically receiver is a part of the command object set during construction, we pass it in.
- The **invoker** is the UI button that calls `onClick` with no knowledge of the logic contained.
- The **client** is one of the systems that spawn `ScreenObject` instances, such as seen in `spawn_golden_objects.ts`.

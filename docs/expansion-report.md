# Uberman Simulation Expansion Report

## Snapshot of the current simulation
- **Needs-driven pedestrians**: Civilians store Maslow-style needs with weights that drift over time, pick a top need, and assign a simple intent toward a building door, sometimes diverting to work when low on money or during assigned shift hours.
- **Lightweight routines**: Brains generate a single workplace, shift window, and home X position, and increase or reset wallet balances based on intent resolution without longer-term commitments.
- **One-step intents**: Pedestrians display intent messages, walk in a straight line to the goal, wait briefly, resolve the intent (earn/spend), and then immediately pick a new goal.

## Recommendations to make civilians feel more alive
### Economy and money flow
- Add **household budgets** (rent, utilities, savings goals) and recurring costs so wallets matter across days; model debt or eviction if budgets fail.
- Track **workplace finances** (payroll, revenue from visitors) and allow businesses to open/close, adjust prices, or lay off workers based on profitability.
- Layer **supply/stock systems** for shops (food, art, books) so civilians sometimes face scarcity, queue, or reroute; let prices move with demand.
- Introduce **banking instruments** (withdrawals, savings interest, loans) to deepen the MONEY need and provide alternative ways to fund higher-order needs.

### Employment, homes, and schedules
- Give each civilian a **home address** (building + door) and commute times; enforce sleep/curfew windows and a rest need that rises with fatigue.
- Support **job search and switching**: if fired, broke, or dissatisfied, civilians can apply to workplaces, attend interviews, and accept offers based on wages/commute.
- Make **shift adherence** matter: late arrivals reduce pay or reputation; overtime boosts income but drains rest and social needs.
- Add **housemates/families** that share budgets, coordinate chores, and prefer spending time together, influencing travel patterns.

### Needs, routines, and memory
- Replace single-step intents with a **state machine** (commute → work → eat → socialize → sleep) that reacts to time-of-day, hunger thresholds, and wallet checks.
- Give needs **cooldowns and decay curves** so satisfaction lasts; consecutive repeats should cause boredom and push variety.
- Add **short-term memory** (last venue visited, last conversation) and **preferences** (favorite cafe) to bias choices, allowing emerging habits and neighborhood loyalty.
- Track **health/stress** as meta-needs that rise when basics are neglected, slowing movement or reducing earnings until addressed.

### Social and civic life
- Model **relationships** with affinity scores; proximity chats or shared activities can satisfy social/intimacy needs, spread news, or create conflicts.
- Provide **events** (concerts, protests, sales) that draw crowds at specific hours, altering routes and demand patterns.
- Introduce **reputation** for civilians and businesses, affecting hiring, prices, and social outcomes; allow gossip to propagate reputation changes.

### City simulation and navigation
- Give buildings **capacity, hours, and queues** so civilians can be turned away, wait, or reroute; display visible lines to show crowding.
- Implement **stocked interiors** (e.g., tables, counters) and **entrance/exit points** to drive richer pathfinding than a straight line.
- Add **transport options** (bus stops, taxis, bikes) that trade money for travel time, influencing where civilians choose to live or work.
- Simulate **zoning and scarcity** (limited housing, higher downtown rent) so players feel city-scale trade-offs and pressure.

### Feedback and UX
- Surface **HUD panels** showing civilian profiles (job, wallet, home, mood) and business dashboards (cashflow, foot traffic, stock levels).
- Add **activity logs** or speech bubbles that explain reroutes ("Cafe closed" / "Queue too long") to make AI decisions legible.
- Provide **time controls** (pause/fast-forward) and overlays for needs heatmaps, rent maps, and transit coverage to aid tuning.

### Technical and content pipeline
- Move civilian and building stats to **data-driven configs** (JSON/CSV) to iterate quickly on economy parameters.
- Encapsulate behaviors in **finite-state machines** with unit tests for transitions (work → lunch → return → home) to reduce regressions.
- Extract **path planning** and **door/venue services** into dedicated modules, enabling future AI reuse for vehicles or delivery missions.
- Add **save/load** of world state (wallets, needs, inventory) to support longer play sessions and progression.

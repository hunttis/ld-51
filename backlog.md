# LD-51 stuff to work on

## Must-haves

- [x] Game name
- [x] Sounds
- [ ] Music
- [x] Possibility to turn the sounds off
- [x] Return to main menu once all collectibles have been collected
- [ ] Three levels, selectable from the main menu
- [x] Have several layers for a level
- [x] Finalize player movement
- [x] Add collectible item
- [x] Player animation (i.e. add frame logic)
- [x] Load collectible locations from the map file (make one collectible "object layers" for each platform layer)
- [x] Remove (and remember) uncollected collectibles when the layer changes
- [x] Start Screen
- [x] Graphics for level and player
- [x] Game over screen
- [x] Game completed screen
- [x] Player death (when falling out of screen)
- [?] Player dies if on a square that is in the incoming level
- [x] Score or time
- [x] Player location from the map data

## Bugs/improvements

- [x] Player's velocity goes to zero when they hit the collectible (change collision to overlap)

## Nice to have

- [ ] Menu screen better text looks
- [x] Update `package.json` to have the real description etc.
  - [ ] Can be improved still
- [ ] "Interactive" collectible items, e.g. key and lock on different layers
- [ ] More levels
- [ ] (Rotating levels? :-D)
- [ ] Particle effects!
- [ ] Visual hints that the layer you are on is about to vanish/explode
- [ ] Curve function to bring the new level "over the horizon"
- [ ] Pausing the game? (might ruin the idea - unless the next level is hidden while paused)
- [ ] Score gets stored to the start screen?
- [ ] See also the gems from the incoming layers

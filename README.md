# [MZ Tactics System][![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]
RMMVMZ Tactics System is a tactical battle system plugin for RPG Maker MV and MZ. 
It's ported from a tactical battle system plugin for RPG Maker MV (https://github.com/belmoussaoui/Tactics-System version 1.3)

* **Easy to use:** Tactics System has been designed to be easy to use. Just create a map with events defining the position of actors and enemies and use default battle processing event command to launch a battle!
* **Expandable by add-on:** The plugin has been developed based on what already existed in RPG Maker MZ by following the predefined rules. Thus it is easy to extend the Tactics System with add-ons. A list of add-ons bringing features to the system is already available.
* **Event-driven:** The management of a battle is done with the event system of RPG Maker MZ. Call enemy reinforcements, write dialogs, add chests, and more.

![Preview Image](MZ%20Tactics%20System.gif?raw=true)

## Installation
Download TacticsSystem.js and put it in the plugin folder of your project. Activate the plugin via the plugin manager of RPG Maker MZ. Add-ons is currently not working and untested.

You must also add a Selector.png image to your project's img/system folder.

## Documentation


## License
Tactics System is [MIT licensed](./LICENSE).

## Version Roadmap

0.3 **[Current]**
  - Partially working destructibles (Wall like objects)
  - To setup a destructibles use <<Destructible:xx>> where xx is the enemy id to base the stats.
  - Destructibles are objects with hp and can be destroyed or used to an advantage (cover, environmental effects, etc)
  - Enemies can also use it to their advantage. (No AI setup for these yet)

0.2  
  - Working Tactics-Mouse addons
  - Random EnemyId setup on event tag. Use <<Enemy:[id1,id2,etc]>>

0.1 Working Tactics-Battle based on tactical battle system plugin for RPG Maker MV version 1.2
  
## Planned Features/Addons
  
~~**Random Enemy**~~
  ~~- Ability to setup random enemies on Enemy Tag <<Enemy:[id1,id2,id3,etc]>>~~ **Implemented on version 0.2**
  
**Destructible** Partially implemented on 0.3
  ~~- Destructible objects like wall.~~
  - Trap tiles
  - Straight line skills

**Custom Movement**
  - Instead of relying on path finding to move, you can specify where to walk.
  
**Weighted Region addon**
  - Movement types per region (Flying, Water, Amphibious, Land)
  - Capability to have specific tiles with higher move point cost
  
**Fog of War**

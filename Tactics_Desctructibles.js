//=============================================================================
//  MZ Tactics Desctructibles
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Add desctructible features
 * Requires: TacticsSystem.js.
 * @author jmoresca
 * 
 * @help Tactics_Destructibles.js
 *
 * This plugin is for implementing destructible on Tactical Battle System
 * Destructibles are objects with hp and can be destroyed or used to an advantage (cover, environmental effects, etc)
 *
 * To setup a destructibles add <Destructible:xx> to the event
 * Where xx is the enemyId where to base the stats of the destructible
 * 
 */

(() => {

    const TacticsDestructibles_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        $gameSelector = new Game_Selector();
        $gameTroopTs = new Game_TroopTs();
        $gamePartyTs = new Game_PartyTs();
        $gameDestructibles = new Game_DestructibleTs();

        TacticsDestructibles_createGameObjects.call(this);
    };

    Scene_Battle.prototype.loadFaceset = function () {
        this._statusWindow.refresh();
        this.loadFacesetActor();
        this.loadFacesetEnemy();
        this.loadDestructible();
    };

    Scene_Battle.prototype.loadDestructible = function () {
        $gameDestructibles.members().forEach(function (member) {
            ImageManager.loadEnemy(member.battlerName());
        });
    };

    BattleManager.allBattlerMembers = function () {
        return $gamePartyTs.members().concat($gameTroopTs.members(), $gameDestructibles.members());
    };

    BattleManager.setupTarget = function () {
        this.setupCombat(this._action);
        var subject = this._subject;
        var targets = this._action.makeTargets();
        var gameFriends = this._action.friendsUnit();
        var gameOpponents = this._action.opponentsUnit();
        if (this._action.isForFriend()) {
            gameFriends.setupTactics([this._subject].concat(targets));
            gameOpponents.setupTactics([]);
        } else {
            gameFriends.setupTactics([this._subject]);
            gameOpponents.setupTactics(targets.concat($gameDestructibles.aliveMembers()));
        }
        this._targetIndex = -1;
        this._targets = targets;
        this.setDirectionTargets();
    };

    Game_Actor.prototype.opponentsUnitTS = function () {
        return $gameTroopTs;
    };

    Game_Enemy.prototype.opponentsUnitTS = function () {
        return $gamePartyTs;
    };

    Game_Selector.prototype.battlers = function () {
        return $gamePartyTs.members().concat($gameTroopTs.members(), $gameDestructibles.members());
    };

    //-----------------------------------------------------------------------------
    // Game_DestructibleTs
    //
    // The game object class for a troop tactic.

    function Game_DestructibleTs() {
        this.initialize.apply(this, arguments);
    }

    Game_DestructibleTs.prototype = Object.create(Game_UnitTs.prototype);
    Game_DestructibleTs.prototype.constructor = Game_DestructibleTs;

    Game_DestructibleTs.prototype.initialize = function () {
        Game_UnitTs.prototype.initialize.call(this);
        this.clear();
    };

    Game_DestructibleTs.prototype.clear = function () {
        this._destructibles = [];
    };

    Game_DestructibleTs.prototype.addDestructible = function (enemyId, event) {
        var enemy = new Game_Enemy(enemyId);
        var eventId = event.eventId();
        this._destructibles.push(enemy);
        enemy.setupEvent(eventId);
    };

    Game_DestructibleTs.prototype.onBattleStart = function () {
        $gameTroop.onBattleStart();
    };

    Game_DestructibleTs.prototype.members = function () {
        return this._destructibles.slice(0);
    };

    Game_DestructibleTs.prototype.battleMembers = function () {
        return this.members().filter(function (destructible) {
            return destructible.isAlive();
        });
    };

    Game_DestructibleTs.prototype.onBattleEnd = function () {
        $gameTroop.onBattleEnd();
    };

    Game_DestructibleTs.prototype.onClear = function () {
        Game_UnitTs.prototype.onClear.call(this);
        this._destructibles = [];
    };

    Game_Action.prototype.combatOpponentsUnit = function (battler) {
        var units = battler.opponentsUnitTS().aliveMembers().concat($gameDestructibles.aliveMembers());
        var battlers = this.searchBattlers(battler, units);
        return battlers;
    };

    Game_Action.prototype.makeTargets = function() {
        const targets = [];
        if (!this._forcing && this.subject().isConfused()) {
            targets.push(this.confusionTarget());
        } else if (this.isForEveryone()) {
            targets.push(...this.targetsForEveryone());
        } else if (this.isForOpponent()) {
            targets.push(...this.targetsForOpponents());
            targets.push(...$gameDestructibles.aliveMembers());
        } else if (this.isForFriend()) {
            targets.push(...this.targetsForFriends());
        }
        return this.repeatTargets(targets);
    };

    //This is for fixing desctructibles
    Game_Party.prototype.setupTactics = function (actors) {
        var actorsId = [];
        for (var i = 0; i < actors.length; i++) {
            if (actors[i].actorId == undefined) {
                //actorsId.push(actors[i]._enemyId);
            }
            else if(actorsId.indexOf(actors[i].actorId()) < 0) {
                actorsId.push(actors[i].actorId());
            }
        }
        this._maxBattleMembers = actorsId.length;
        actorsId.forEach(function (actorId) {
            if (this._actors.contains(actorId)) {
                this.removeActor(actorId);
            }
        }, this);
        this._actors = actorsId;
    };

    Spriteset_Tactics.prototype.createCharacters = function () {
        this._characters = [];
        this._characterSprites = [];
        this._actorSprites = [];
        this._enemySprites = [];

        $gameMap.events().forEach(function (event) {
            var sprite = null;
            if (event.isDestructible()) {
                sprite = new Sprite_BattlerTs(event);
            }
            else if (event.isActor() || event.isEnemy()) {
                sprite = new Sprite_BattlerTs(event);
            }
            else {
                sprite = new Sprite_Character(event);
            }
            this._characters.push(event);
            this._characterSprites.push(sprite);
            if (event.isActor()) {
                this._actorSprites.push(sprite);
            }
            if (event.isEnemy()) {
                this._enemySprites.push(sprite);
            }
        }, this);

        for (var i = 0; i < this._characterSprites.length; i++) {
            this._tilemap.addChild(this._characterSprites[i]);
        }
    };

    Game_Event.prototype.isDestructible = function () {
        return this.tparam('Destructible') && this.tparam('Destructible').length > 0;
    };

    BattleManager.createGameObjects = function () {
        for (var i = 0; i < $gameMap.events().length; i++) {
            var event = $gameMap.events()[i];
            if (event.tparam('Actor') > 0) {
                this.addGameActor(event);
            } else if (event.tparam('Party') > 0) {
                this.addGameParty(event)
            } else if (event.tparam('Enemy') && event.tparam('Enemy').length > 0) {
                this.addGameEnemy(event);
            } else if (event.tparam('Troop') > 0) {
                this.addGameTroop(event);
            } else if (event.tparam('Destructible') > 0) {
                this.addDestructible(event);
            } else {
                continue;
            }
        }
    };

    BattleManager.addDestructible = function (event) {
        const destructibleId = Number(event.tparam('Destructible'));
        $gameDestructibles.addDestructible(destructibleId, event);
    };

})();
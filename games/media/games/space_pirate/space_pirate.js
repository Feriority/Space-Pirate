// ---------------------------------------------------------------------------
// Edit this file to define your game. It should have at least four
// sets of content: undum.game.situations, undum.game.start,
// undum.game.qualities, and undum.game.init.
// ---------------------------------------------------------------------------

/* A unique id for your game. This is never displayed. I use a UUID,
 * but you can use anything that is guaranteed unique (a URL you own,
 * or a variation on your email address, for example). */
undum.game.id = "spess-mahreen"

/* A string indicating what version of the game this is. Versions are
 * used to control saved-games. If you change the content of a game,
 * the saved games are unlikely to work. Changing this version number
 * prevents Undum from trying to load the saved-game and crashing. */
undum.game.version = "0.1";

/* The situations that the game can be in. Each has a unique ID. */
undum.game.situations = {
    'dreams-1': new undum.Situation({
        enter: function(character, system, from) {
            system.write($("#dreams-1").html());
        }
    }),
    'dreams-2': new undum.Situation({
        enter: function(character, system, from) {
            system.write($("#dreams-2").html());
        }
    }),
    'wake-up': new undum.Situation({
        enter: function(character, system, from) {
            system.setCharacterText("<p>Enough about dreams, you've got work to do.</p>")
            system.write($("#wake-up").html());
        }
    }),
    'get-gun': new undum.Situation({
        enter: function(character, system, from) {
            system.setQuality('vim', character.qualities.vim + 4);
            system.setQuality('vigor', character.qualities.vigor + 1);
            system.write($("#get-gun").html());
            system.write($("#leave-ship").html());
        }
    }),
    'get-tools': new undum.Situation({
        enter: function(character, system, from) {
            system.setQuality('verve', character.qualities.verve + 4);
            system.setQuality('vigor', character.qualities.vigor + 1);
            system.write($("#get-tools").html());
            system.write($("#leave-ship").html());
        }
    }),
    'board-station': new undum.SimpleSituation("<p>You put on your helmet, and your HUD springs to life.</p>",
        {
            enter: function(character, system, from) {
                system.setQuality('armor', 100);
                system.write($("#board-station").html());
                system.doLink('station-entrance');
            }
        }
    ),
    'station-entrance': new undum.Situation({
        enter: function(character, system, from) {
            if (from !== 'board-station') {
                system.write($('#station-entrance-desc').html());
            }
            system.write($('#station-entrance').html());
        }
    })
};

// ---------------------------------------------------------------------------
/* The Id of the starting situation. */
undum.game.start = "dreams-1";

// ---------------------------------------------------------------------------
/* Here we define all the qualities that our characters could
 * possess. We don't have to be exhaustive, but if we miss one out then
 * that quality will never show up in the character bar in the UI. */
undum.game.qualities = {
    vim: new undum.IntegerQuality(
        "Vim", {priority:"0001", group:'stats'}
    ),
    verve: new undum.IntegerQuality(
        "Verve", {priority:"0002", group:'stats'}
    ),
    vigor: new undum.IntegerQuality(
        "Vigor", {priority:"0003", group:'stats'}
    ),
    armor: new undum.NonZeroIntegerQuality(
        "Suit Condition", {priority:"0004", group:'stats'}
    ),
};

// ---------------------------------------------------------------------------
/* The qualities are displayed in groups in the character bar. This
 * determines the groups, their heading (which can be null for no
 * heading) and ordering. QualityDefinitions without a group appear at
 * the end. It is an error to have a quality definition belong to a
 * non-existent group. */
undum.game.qualityGroups = {
    stats: new undum.QualityGroup(null, {priority:"0001"}),
    inventory: new undum.QualityGroup('Inventory', {priority:"0002"}),
};

// ---------------------------------------------------------------------------
/* This function gets run before the game begins. It is normally used
 * to configure the character at the start of play. */
undum.game.init = function(character, system) {
    character.qualities.vim = 1;
    character.qualities.verve = 1;
    character.qualities.vigor = 1;
    character.qualities.armor = 0;
    system.setCharacterText("<p>???</p>");
};

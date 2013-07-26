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
                system.setCharacterText("<p>Welcome to Artosis Station.</p>")
            }
        }
    ),
    'station-entrance': new undum.Situation({
        enter: function(character, system, from) {
            if (from !== 'board-station') {
                system.write($('#station-entrance-desc').html());
            }
            if (character.qualities.macguffin) {
                system.write("<p><a href='escape'>There's no time to explore, get out of here!</a></p>");
            } else {
                system.write($('#station-entrance').html());
            }
        }
    }),
    //TODO actually write this
    'station-work': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-work').html());
        },
        act: function(character, system, action) {
            if (action === 'spire') {
                system.write("<p>The path to the spire is blocked by rubble.  You'll need to find another way.</p>");
            } else if (action === 'command') {
                if (character.sandbox.rec_to_command) {
                    system.doLink('station-command');
                } else {
                    system.write("<p>Placeholder for problem blocking this path.</p>");
                    if (character.qualities.verve >= 5) {
                        system.write("<p>Placeholder for <a href='./solving'>solving</a> problem with verve.</p>");
                    } else {
                        system.write("<p>Placeholder for being unable to solve the problem.</p>");
                    }
                }
            } else if (action === 'solving') {
                system.write("<p>Placeholder for the actual solution.</p>");
                character.sandbox.work_to_command = True;
            } else if (action === 'security') {
                system.write("<p>Placeholder for you can't go there yet.</p>");
            }
    }),
    'station-medbay': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-medbay').html());
        }
    }),
    'station-security': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-security').html());
        }
    }),
    'station-offduty': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-offduty').html());
        },
        act: function(character, system, action) {
            if (action === 'spire') {
                system.write("<p>The path to the spire is blocked by rubble.  You'll need to find another way.</p>");
            } else if (action === 'command') {
                if (character.sandbox.rec_to_command) {
                    system.doLink('station-command');
                } else {
                    system.write("<p>The bulkhead to the command deck is partially closed,\
                        but a repair drone seems to be jammed in the door, preventing it\
                        from shutting all the way.  The drone has been smashed beyond\
                        your ability to fix by the closing door.</p>"
                    );
                    if (character.qualities.vim >= 5) {
                        system.write("<p>You think you can <a href='./blast' class='once'>blast</a>\
                            the broken drone out of the way and open a path through.</p>"
                        );
                    } else {
                        system.write("<p>You don't see any way through the gap.</p>");
                    }
                }
            } else if (action === 'blast') {
                system.write("<p>You blow away enough pieces of the drone that you think you can\
                        <a href='station-command'>fit through the gap.</p>");
                character.sandbox.rec_to_command = true;
            }
        }
    }),
    'station-rec': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-rec').html());
        }
    }),
    'station-command': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-command').html());
        }
    }),
    'station-spire': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-command').html());
        }
    }),
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
    macguffin: new undum.OnOffQuality(
        "MacGuffin", {priority:"0001", group:'inventory'}
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
    character.qualities.macguffin = 0;

    character.sandbox.rec_to_command = false;
    character.sandbox.work_to_command = false;
    character.sandbox.security_disabled = false;
    character.sandbox.has_security_badge = false;

    system.setCharacterText("<p>???</p>");
};

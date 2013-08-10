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
                    system.write("<p>The bulkhead to the command deck appears to have never closed.  However,\
                        there is still a security door with a hardened lock blocking your path.</p>"
                    );
                    if (character.qualities.verve >= 5) {
                        system.write("<p>With your tools, you believe you can\
                            <a href='./pick' class='once'>disable the lock</a>.\
                            It's a difficult one, but nothing outside your abilities.</p>"
                        );
                    } else {
                        system.write("<p>You don't see any way to get through the door.\
                           Maybe with the right tools, it would be possible.</p>"
                        );
                    }
                }
            } else if (action === 'pick') {
                system.write("<p>It takes a little while, but you finally get the lock open and can\
                    access <a href='station-command'>the command deck</a>.</p>"
                );
                character.sandbox.work_to_command = true;
            }
        }
    }),
    'station-medbay': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-medbay').html());
            if (!character.sandbox.medbay_explored) {
                character.sandbox.medbay_explored = true;
                system.write("<p>You take what medical supplies you can - some will\
                    be useful to keep, others will sell well once you leave.</p>"
                );
            }
            if (!character.sandbox.medbay_looted) {
                system.write("<p>There's a lockbox with what looks like replacement\
                    parts for your suit.</p>"
                );
                if (character.qualities.vim >= 2) {
                    system.write("<p>You think you can <a href='./break' class='once'>break it open</a>.</p>");
                } else {
                    system.write("<p>Maybe if you could find a way to break it open...</p>");
                }
            }
            system.write("<p>You can <a href='station-work'>go back</a>.</p>");
        },
        act: function(character, system, action) {
            if (action === 'break') {
                system.setQuality('vigor', character.qualities.vigor + 1);
                system.write("<p>The upgrades make your suit a little tougher.  You also find some compatible tools.</p>");
                if (character.qualities.verve < 5) {
                    system.setQuality('verve', character.qualities.verve + 1);
                    system.write("<p>You take them along - they might be useful.</p>");
                } else {
                    system.write("<p>You leave them behind - your existing equipment is better.</p>");
                }
                character.sandbox.medbay_looted = true;
            }
        }
    }),
    'station-security': new undum.Situation({
        enter: function(character, system, from) {
            if (!character.sandbox.security_disabled) {
                system.write("<p>Despite the overall loss of power, the security\
                    office's automated defenses are still partially active.  It\
                    would be too dangerous to try to enter the offices without\
                    doing something about it first.<p>"
                );
                if (character.qualities.grenades > 0) {
                    system.write("<p>You think you could clear the turret at the door with\
                        <a href='./grenade' class='once'>the EMP grenade you found</a>.</p>"
                    );
                }
                system.write("<p>You can <a href='station-work'>go back</a>.</p>");
            } else {
                system.doLink('station-security-inside');
            }
        },
        act: function(character, system, action) {
            if (action === 'grenade') {
                system.setQuality('grenades', character.qualities.grenades - 1);
                character.sandbox.security_disabled = true;
                system.write("<p>You lob the grenade at the automated defenses, and\
                    hope it actually works as you duck back around a corner.\
                    You hear the crackling blast of the grenade, and look back\
                    to see the turret disabled.  You can now\
                    <a href='station-security-inside'>go inside</a>.</p>"
                );
            }
        }
    }),
    'station-security-inside': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-security-inside').html());
            if (!character.qualities.security_card) {
                system.write("<p>Looking around the offices for anything still\
                    left, you find a security card, and grab it.  It could come\
                    in handy.</p>"
                );
                system.setQuality('security_card', 1);
            }
            system.write("<p>You can <a href='station-work'>go back</a>.</p>");
        },
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
                        system.write("<p>You don't see any way through the gap.  If you had some way to\
                            clear the bot out, maybe?</p>"
                        );
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
            if (!character.sandbox.rec_looted) {
                system.write("<p>Your HUD flickers as you enter the room.  It's\
                    probably nothing, but you feel nervous anyway.</p>"
                );
                if (character.qualities.verve >= 2) {
                    system.write("<p>You think you can <a href='./improvise' class='once'>improvise some gear</a> from the parts here.</p>");
                } else {
                    system.write("<p>Maybe with some tools, you could get something useful from the parts here.</p>");
                }
            }
            system.write("<p>You can <a href='station-offduty'>go back</a>.</p>");
        },
        act: function(character, system, action) {
            if (action === 'improvise') {
                system.setQuality('vigor', character.qualities.vigor + 1);
                system.write("<p>You can use some of the equipment to patch up your suit's defenses.</p>");
                if (character.qualities.vim < 5) {
                    system.setQuality('vim', character.qualities.vim + 1);
                    system.write("<p>You also improvise a weapon from the parts you find.</p>");
                } else {
                    system.write("<p>You consider creating a weapon, but your gun\
                        is better than anything you could make here.</p>"
                    );
                }
                character.sandbox.rec_looted = true;
            }
        }
    }),
    'station-command': new undum.Situation({
        enter: function(character, system, from) {
            character.sandbox.rec_to_command = true;
            character.sandbox.work_to_command = true;
            system.write($('#station-command').html());
            system.write($('#station-command-nav').html());
        },
        act: function(character, system, action) {
            if (action === 'spire') {
                system.write($('#station-spire-security'));
                if (character.qualities.security_card) {
                    system.write("<p>Your security card opens the gate, and you are free\
                        to travel to <a href='station-spire'>the spire</a>.</p>"
                    );
                } else {
                    system.write("<p>You'll need to find some way through the security system.</p>");
                    if (character.qualities.grenades === 0 && character.sandbox.security_disabled === false) {
                        system.write("<p>Searching the security checkpoint, you find an EMP grenade\
                            that must have been left behind when the crew abandoned the station.</p>"
                        );
                        system.setQuality('grenades', 1);
                    }
                    system.write("<p>You go back to the command area.</p>")
                    system.write($('#station-command-nav').html());
                }
            }
        }
    }),
    'station-spire': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#station-spire').html());
            system.setCharacterText('<p>Go Back</p>');
        },
        act: function(character, system, action) {
            if (action === 'stop') {
                if (character.sandbox.orb_count < character.sandbox.orb_lines.length) {
                    system.write(character.sandbox.orb_lines[character.sandbox.orb_count]);
                    character.sandbox.orb_count += 1;
                } else {
                    system.setQuality('macguffin', 1);
                    system.setCharacterText('<p>Well done.</p>');
                    system.write('<p>"-listening to me?  The Euryphaessa is already in the system, we need to leave NOW!"</p>');
                    system.doLink('station-entrance');
                }
            }
        }
    }),
    'escape': new undum.Situation({
        enter: function(character, system, from) {
            system.write($('#escape').html());
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
        "???", {priority:"0001", group:'inventory'}
    ),
    security_card: new undum.OnOffQuality(
        "Security Card", {priority:"0002", group:'inventory'}
    ),
    grenades: new undum.NonZeroIntegerQuality(
        "EMP Grenades", {priority:"0003", group:'inventory'}
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
    character.qualities.security_card = 0;
    character.qualities.grenades = 0;

    character.sandbox.medbay_explored = false;
    character.sandbox.medbay_looted = false;
    character.sandbox.rec_looted = false;

    character.sandbox.rec_to_command = false;
    character.sandbox.work_to_command = false;
    character.sandbox.security_disabled = false;

    character.sandbox.orb_count = 0;
    character.sandbox.orb_lines = [
        "<p>You reach for the orb, and hesitate.  That wasn't what you meant to do, was it? <a href='./stop'>Go back</a>.</p>",
        "<p>You reach out again.  No.  This is wrong. <a href='./stop'>Go back</a>.</p>",
        "<p>It seemed so close, but you're stretching and can't quite reach it.  Give up and <a href='./stop'>go back</a>.</p>",
        "<p>Just a little closer and it's yours... You shouldn't just <a href='./stop'>go back</a>.</p>",
        "<p><a href='./stop'>GO BACK</a></p>",
    ];

    system.setCharacterText("<p>???</p>");
};

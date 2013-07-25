# Space-Pirate

## Undum

Undum is a game framework for building a sophisticated form of
hypertext interactive fiction.

Check out https://github.com/idmillington/undum for more about Undum -
this project uses it, but is probably not what you're looking for if
you want to make a game.

## Compatibility

From the Undum docs:

    Undum is designed for HTML5 and CSS3 browsers. It has been tested on
    Firefox 3.6, Chrome 5, and Safari 5. Older browsers may work okay too,
    but some of the animation won't work, the styles may render poorly,
    and saving and loading of games is unlikely to work. Anyone who wants
    to hack around with it and make it work more widely is welcome. Just
    fork this project on Github.

Space Pirate should run on any browser that Undum supports.

## Running the server

Pretty much anything that can serve static content can serve this. There's
no work being done server-side; save states are handled locally using
browser storage. I've been using `python -m SimpleHTTPServer` (python 2.x)
or `python -m http.server` (python 3).

There's a ruby server in the repo I inherited from Undum; if you want to
figure it out, go ahead.  I'm not using it.

## License

The code is distributed under the MIT license. This permits you to
modify and use it, even for commercial use. The only stipulation is
that you keep the original copyright message associated with the
code. This appears as the bottom line in the HTML file. A copy of the
MIT license is found in the LICENSE file.

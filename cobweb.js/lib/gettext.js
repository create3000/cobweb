
define ([
	"text!locale/de.po",
	"text!locale/fr.po",
],
function (de, fr)
{
"use strict";

	function execAll (regex, string)
	{
		var
			match   = null,
			matches = [ ];

		while (match = regex .exec (string))
			matches .push (match);
	
		return matches;
	}

	function getLanguage ()
	{
		for (var i = 0; i < navigator .languages; ++ i)
		{
			var language = navigator .languages [i] .split ("-") [0];
	
			if (locales [language])
				return language;
		}

		return (navigator .language || navigator .userLanguage) .split ("-") [0];
	}

	function setLocale (language)
	{
		if (locales [language])
		{
			var
				matches = execAll (msg, locales [language]),
				locale  = locales [language] = { };
	
			for (var i = 0, length = matches .length; i < length; ++ i)
			{
				if (matches [i] [2] .length)
					locale [matches [i] [1]] = matches [i] [2];
			}
		}
	}

	var locales =
	{
		de: de,
		fr: fr,
	};

	var
		msg      = /msgid\s+"(.*?)"\nmsgstr\s+"(.*?)"\n/g,
		language = getLanguage ();

	setLocale (language);

	function gettext (string)
	{
		var ĺocale = locales [language];

		if (ĺocale === undefined)
			return string;

		var translation = ĺocale [string];

		if (translation === undefined)
			return string;

		return translation;
	}

	return gettext;
});
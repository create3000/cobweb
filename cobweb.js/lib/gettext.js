
define ([
	"text!locale/de.po",
	"text!locale/fr.po",
],
function (de, fr)
{
"use strict";

	var locales =
	{
		de: de,
		fr: fr,
	};

	function execAll (regex, string)
	{
		var
			match   = null,
			matches = [ ];

		while (match = regex .exec (string))
			matches .push (match);
	
		return matches;
	}

	var msg = /msgid\s+"(.*?)"\nmsgstr\s+"(.*?)"\n/g;

	for (var lang in locales)
	{
		var
			matches = execAll (msg, locales [lang]),
			locale  = locales [lang] = { };

		for (var i = 0, length = matches .length; i < length; ++ i)
			locale [matches [i] [1]] = matches [i] [2];
	}

	function gettext (string)
	{
		var
			language = (navigator .language || navigator .userLanguage) .split ("-") [0],
			ĺocale   = locales [language];

		if (ĺocale === undefined)
			return string;

		var translation = ĺocale [string];

		if (translation === undefined)
			return string;

		return translation;
	}

	return gettext;
});
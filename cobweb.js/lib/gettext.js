
define ([
	"locale/de",
	"locale/fr",
],
function (de, fr)
{
"use strict";

	var ĺocales =
	{
		de: de,
		fr: fr,
	};

	function gettext (string)
	{
		var
			language = (navigator .language || navigator .userLanguage) .split ("-") [0],
			ĺocale   = ĺocales [language];

		if (ĺocale === undefined)
			return string;

		var translation = ĺocale [string];

		if (translation === undefined)
			return string;

		return translation;
	}

	gettext .count = function (count, singular, plural)
	{
	   return count == 1 ? gettext (singular) : gettext (plural);
	};

	return gettext;
});
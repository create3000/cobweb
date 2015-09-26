
define ([
	"locale/de",
	"locale/fr",
],
function (de, fr)
{
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

	return gettext;
});
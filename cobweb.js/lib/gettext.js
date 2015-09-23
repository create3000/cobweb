
define ([
	"locale/de",
],
function (de)
{
	var ĺocales =
	{
	   de: de,
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
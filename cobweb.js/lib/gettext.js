
define ([
	"locale/de",
],
function (de)
{
	var translations =
	{
	   de: de,
	};

	function gettext (string)
	{
		var
			language    = (navigator .language || navigator .userLanguage) .split ('-') [0],
			translation = translations [language] [string];

	   if (translation === undefined)
			return string;

		return translation;
	}

	return gettext;
});

define ([
	"jquery",
],
function ($)
{
	var translations =
	{
	   de: {
			"Viewpoints": "Ansichtspunkte",
			"Available Viewers": "Verfügbare Navigatoren",
			"Examine Viewer": "Untersuchen",
			"Walk Viewer": "Laufen",
			"Fly Viewer": "Fliegen",
			"Plane Viewer": "Ebenen Werkzeug",
			"None Viewer": "Kein Navigator",
			"Look At": "Auf Objekte zielen",
			"Primitive Quality": "Qualität der einfachen Objekte",
			"Texture Quality": "Textur Qualität",
			"Display Rubberband": "Gummiband anzeigen",
			"Browser Timings": "Zeitberechnung",
			"Mute Browser": "Browser stumm schalten",
			"About Cobweb": "Über Cobweb",
			"High": "Hoch",
			"Medium": "Mittel",
			"Low": "Niedrig",
			"Loading": "Lade",
			"Loading done": "Fertig mit Laden",
			"More Properties": "Mehr Eigenschaften",
			"Less Properties": "Weniger Eigenschaften",
			"Frame rate": "Bildrate",
			"Speed": "Geschwindigkeit",
	   },
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
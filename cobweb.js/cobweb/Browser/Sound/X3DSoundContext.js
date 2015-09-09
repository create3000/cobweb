
define ([
	"cobweb/Fields",
],
function (Fields)
{
	var
		SFBool = Fields .SFBool,
		SFFloat = Fields .SFFloat;

	function X3DSoundContext () { }

	X3DSoundContext .prototype =
	{
		initialize: function ()
		{
			this .addChildren ("volume", new SFFloat (1));
			this .addChildren ("mute",   new SFBool ());
		},
		getVolume: function ()
		{
		   return this .volume_ .getValue ();
		},
		setVolume: function (value)
		{
		   this .volume_ .setValue (value);
		},
		getMute: function ()
		{
		   return this .mute_ .getValue ();
		},
		setMute: function (value)
		{
		   this .mute_ .setValue (value);
		},
	};

	return X3DSoundContext;
});

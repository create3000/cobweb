
define ([
	"cobweb/Fields",
	"lib/dataStorage",
	"lib/gettext",
],
function (Fields,
          dataStorage,
          _)
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

			this .volume_ .addInterest (this, "set_volume__");
			this .mute_   .addInterest (this, "set_mute__");

			var
				volume = dataStorage ["X3DSoundContext.volume"],
				mute   = dataStorage ["X3DSoundContext.mute"];

			if (volume !== undefined) this .volume_ = volume;
			if (mute   !== undefined) this .mute_   = mute;
		},
		set_volume__: function (volume)
		{
			dataStorage ["X3DSoundContext.volume"] = volume .getValue ();
		},
		set_mute__: function (mute)
		{
			dataStorage ["X3DSoundContext.mute"] = mute .getValue ();
			this .getNotification () .string_ = mute .getValue () ? _("Browser muted") : _("Browser unmuted");
		},
	};

	return X3DSoundContext;
});

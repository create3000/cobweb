
define ([
	"cobweb/Fields",
	"lib/dataStorage",
],
function (Fields,
          dataStorage)
{
"use strict";

	function X3DSoundContext () { }

	X3DSoundContext .prototype =
	{
		initialize: function ()
		{
			this .addChildren ("volume", new Fields .SFFloat (1));
			this .addChildren ("mute",   new Fields .SFBool ());

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
		},
	};

	return X3DSoundContext;
});

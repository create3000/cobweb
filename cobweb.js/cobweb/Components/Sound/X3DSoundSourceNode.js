
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Time/X3DTimeDependentNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode,
          X3DTimeDependentNode,
          X3DConstants)
{
"use strict";

	function X3DSoundSourceNode (browser, executionContext)
	{
		X3DChildNode         .call (this, browser, executionContext);
		X3DTimeDependentNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DSoundSourceNode);

		this .volume = 0;
		this .media  = null;
	}

	X3DSoundSourceNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
		X3DTimeDependentNode .prototype,
	{
		constructor: X3DSoundSourceNode,
		initialize: function ()
		{
		   X3DChildNode         .prototype .initialize .call (this);
			X3DTimeDependentNode .prototype .initialize .call (this);

		},
		set_browser_live__: function ()
		{
		   X3DTimeDependentNode .prototype .set_browser_live__ .call (this);

			if (this .getDisabled ())
			{
			   this .getBrowser () .volume_ .removeInterest (this, "set_volume__");
			   this .getBrowser () .mute_   .removeInterest (this, "set_volume__");
			}
			else
			{
			   this .getBrowser () .volume_ .addInterest (this, "set_volume__");
			   this .getBrowser () .mute_   .addInterest (this, "set_volume__");
				this .set_volume__ ();
			}
		},
		setMedia: function (value)
		{
		   if (this .media)
		   {
		      this .media [0] .volume = 0;
		      this .media [0] .pause ();
		      this .media .unbind ("ended");
		   }

		   this .media = value;

		   if (value)
		   {
				var media = value [0];

		      media .volume           = 0;
		      this .duration_changed_ = media .duration;

			   if (this .isActive_ .getValue ())
			   {
					if (this .loop_ .getValue ())
						media .currentTime = this .getElapsedTime () % media .duration;
					else
						media .currentTime = this .getElapsedTime ();

					if (! this .isPaused_ .getValue ())
					{							
						if (this .speed_ .getValue ())
							media .play ();
					}
				}
			}
		},
		getMedia: function ()
		{
		   return this .media;
		},
		setVolume: function (volume)
		{
			this .volume = volume;

			this .set_volume__ ();
		},
		set_volume__: function ()
		{
			if (this .media)
				this .media [0] .volume = (! this .getBrowser () .mute_ .getValue ()) * this .getBrowser () .volume_ .getValue () * this .volume;
		},
		set_speed: function ()
		{ },
		set_pitch: function ()
		{ },
		set_start: function ()
		{
		   if (this .media)
		   {
				if (this .speed_ .getValue ())
				{
				   this .media [0] .currentTime = 0;
					this .media [0] .play ();
				}
			}
		},
		set_pause: function ()
		{
		   if (this .media)
		   {
		      this .media .unbind ("ended");
				this .media [0] .pause ();
			}
		},
		set_resume: function ()
		{
		   if (this .media)
		   {
				if (this .speed_ .getValue ())
					this .media [0] .play ();
			}
		},
		set_stop: function ()
		{
		   if (this .media)
			{
		      this .media .unbind ("ended");
				this .media [0] .pause ();
			}
		},
		set_ended: function ()
		{
		   if (this .media)
		   {
				var media = this .media [0];

				if (media .currentTime < media .duration)
					return;

				if (this .loop_ .getValue ())
				{
					if (this .speed_ .getValue ())
						media .play ();

					// The event order below is very important.

					this .elapsedTime_ = this .getElapsedTime ();
					this .cycleTime_   = this .getBrowser () .getCurrentTime ();
				}
				else
					this .stop ();
			}
		},
		prepareEvents: function ()
		{
			this .set_ended ();

			this .elapsedTime_ = this .getElapsedTime ();
		},
	});

	return X3DSoundSourceNode;
});


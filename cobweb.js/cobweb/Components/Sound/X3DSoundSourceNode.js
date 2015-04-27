
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
	function X3DSoundSourceNode (browser, executionContext)
	{
		X3DChildNode         .call (this, browser, executionContext);
		X3DTimeDependentNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DSoundSourceNode);

		this .media = null;
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
		setMedia: function (value)
		{
		   if (this .media)
		   {
		      this .media .volume = 0;
		      this .media .pause ();
		   }

		   this .media = value;

		   if (this .media)
		   {
		      this .media .volume     = 0;
		      this .media .onended    = this .set_ended .bind (this);
		      this .duration_changed_ = this .media .duration;

			   if (this .isActive_ .getValue ())
			   {
					this .media .currentTime = this .getElapsedTime () % this .media .duration;

					if (! this .isPaused_ .getValue ())
					{							
						if (this .speed_ .getValue ())
						{
						   this .media .currentTime = this .getElapsedTime ();
							this .media .play ();
						}
					}
				}
			}
		},
		getMedia: function (value)
		{
		   return this .media;
		},
		setVolume: function (value)
		{
		   if (this .media)
			   this .media .volume = value;
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
				   this .media .currentTime = 0;
					this .media .play ();
				}
			}
		},
		set_pause: function ()
		{
		   if (this .media)
				this .media .pause ();
		},
		set_resume: function ()
		{
		   if (this .media)
		   {
				if (this .speed_ .getValue ())
					this .media .play ();
			}
		},
		set_stop: function ()
		{
		   if (this .media)
				this .media .pause ();
		},
		set_ended: function ()
		{
		   if (this .media)
		   {
				if (this .loop_ .getValue ())
				{
					if (this .speed_ .getValue ())
						this .media .play ();

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
			this .elapsedTime_ = this .getElapsedTime ();
		},
	});

	return X3DSoundSourceNode;
});

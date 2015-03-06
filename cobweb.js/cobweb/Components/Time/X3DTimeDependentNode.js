
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function X3DTimeDependentNode (browser, executionContext)
		{
			this .addType (X3DConstants .X3DTimeDependentNode);

			this .addChildren ("initialized", new SFTime (),
			                   "isEvenLive",  new SFBool ());

			this .startTimeValue  = 0;
			this .pauseTimeValue  = 0;
			this .resumeTimeValue = 0;
			this .stopTimeValue   = 0;
			this .start           = 0;
			this .pause           = 0;
			this .pauseInterval   = 0;
			this .startTimeout    = null;
			this .pauseTimeout    = null;
			this .resumeTimeout   = null;
			this .stopTimeout     = null;
			this .disabled        = false;
		}

		X3DTimeDependentNode .prototype = $.extend (new X3DChildNode (),
		{
			constructor: X3DTimeDependentNode,
			initialize: function ()
			{
				this .getExecutionContext () .isLive_ .addInterest (this, "set_live_");
				this .isEvenLive_                     .addInterest (this, "set_live_");
				this .isLive_                         .addInterest (this, "set_live_");

				this .initialized_ .addInterest (this, "set_loop_");
				this .enabled_     .addInterest (this, "set_enabled_");
				this .loop_        .addInterest (this, "set_loop_");
				this .startTime_   .addInterest (this, "set_startTime_");
				this .pauseTime_   .addInterest (this, "set_pauseTime_");
				this .resumeTime_  .addInterest (this, "set_resumeTime_");
				this .stopTime_    .addInterest (this, "set_stopTime_");

				this .startTimeValue  = this .startTime_  .getValue ();
				this .pauseTimeValue  = this .pauseTime_  .getValue ();
				this .resumeTimeValue = this .resumeTime_ .getValue ();
				this .stopTimeValue   = this .stopTime_   .getValue ();

				this .initialized_ = this .getBrowser () .getCurrentTime ();
			},
			getElapsedTime: function ()
			{
				return this .getBrowser () .getCurrentTime () - this .start - this .pauseInterval;
			},
			getLive: function ()
			{
				return (this .getExecutionContext () .isLive_ .getValue () || this .isEvenLive_ .getValue ()) && this .isLive_ .getValue ();
			},
			set_live_: function ()
			{
				if (this .getLive ())
				{
					if (this .disabled)
					{
						this .disabled = false;

						if (this .isActive_ .getValue () && ! this .isPaused_ .getValue ())
							this .real_resume ();
					}
				}
				else
				{
					if (! this .disabled && this .isActive_ .getValue () && ! this .isPaused_ .getValue ())
					{
						// Only disable if needed, ie. if running!
						this .disabled = true;
						this .real_pause ();
					}
				}
			},
			set_enabled_: function ()
			{
				if (this .enabled_ .getValue ())
					this .set_loop ();

				else
					this .stop ();
			},
			set_loop_: function ()
			{
				if (this .enabled_ .getValue ())
				{
					if (this .loop_ .getValue ())
					{
						if (this .stopTimeValue <= this .startTimeValue)
						{
							if (this .startTimeValue <= this .getBrowser () .getCurrentTime ())
								this .do_start ();
						}
					}
				}
			},
			set_startTime_: function ()
			{
				this .startTimeValue = this .startTime .getValue ();

				if (this .enabled_ .getValue ())
				{
					this .removeTimeout ("startTimeout");

					if (this .startTimeValue <= this .getBrowser () .getCurrentTime ())
						this .do_start ();

					else
						this .addTimeout ("startTimeout", "do_start", startTimeValue);
				}
			},
			set_pauseTime_: function ()
			{
				this .pauseTimeValue = this .pauseTime_ .getValue ();

				if (this .enabled_ .getValue ())
				{
					this .removeTimeout ("pauseTimeout");

					if (this .pauseTimeValue <= this .resumeTimeValue)
						return;

					if (this .pauseTimeValue <= this .getBrowser () .getCurrentTime ())
						this .do_pause ();

					else
						this .addTimeout ("pauseTimeout", "do_pause", this .pauseTimeValue);
				}
			},
			set_resumeTime_: function ()
			{
				this .resumeTimeValue = this .resumeTime_ .getValue ();

				if (this .enabled_ .getValue ())
				{
					this .removeTimeout ("resumeTimeout");

					if (this .resumeTimeValue <= this .pauseTimeValue)
						return;

					if (this .resumeTimeValue <= this .getBrowser () .getCurrentTime ())
						this .do_resume ();

					else
						this .addTimeout ("resumeTimeout", "do_resume", this .resumeTimeValue);
				}
			},
			set_stopTime_: function ()
			{
				this .stopTimeValue = this .stopTime_ .getValue ();

				if (this .enabled_ .getValue ())
				{
					this .removeTimeout ("stopTimeout");

					if (this .stopTimeValue <= this .startTimeValue)
						return;

					if (this .stopTimeValue <= this .getBrowser () .getCurrentTime ())
						this .do_stop ();

					else
						this .addTimeout ("stopTimeout","do_stop", this .stopTimeValue);
				}
			},
			do_start: function ()
			{
				if (! this .isActive_ .getValue ())
				{
					this .start         = this .getBrowser () .getCurrentTime ();
					this .pauseInterval = 0;

					// The event order below is very important.

					this .isActive_ = true;

					this .set_start ();

					if (this .getLive ())
					{
						this .getBrowser () .prepareEvents_ .addInterest (this, "prepareEvents");
					}
					else if (! this .disabled)
					{
						this .disabled = true;
						this .real_pause ();
					}

					this .elapsedTime_ = 0;
					this .cycleTime_   = this .getBrowser () .getCurrentTime ();
				}
			},
			do_pause: function ()
			{
				if (this .isActive_ .getValue () && ! this .isPaused_ .getValue ())
				{
					this .isPaused_ = true;

					if (this .pauseTimeValue !== this .getBrowser () .getCurrentTime ())
						this .pauseTimeValue = this .getBrowser () .getCurrentTime ();

					if (this .getLive ())
						this .real_pause ();
				}
			},
			real_pause: function ()
			{
				this .pause = this .getBrowser () .getCurrentTime ();

				this .set_pause ();

				this .getBrowser () .prepareEvents_ .removeInterest (this, "prepareEvents");
			},
			do_resume: function ()
			{
				if (this .isActive_ .getValue () && this .isPaused_ .getValue ())
				{
					this .isPaused_ = false;

					if (this .resumeTimeValue !== this .getBrowser () .getCurrentTime ())
						this .resumeTimeValue = this .getBrowser () .getCurrentTime ();

					if (this .getLive ())
						this .real_resume ();
				}
			},
			real_resume: function ()
			{
				var interval = this .getBrowser () .getCurrentTime () - this .pause;

				this .pauseInterval += interval;

				this .set_resume (interval);

				this .getBrowser () .prepareEvents_ .addInterest (this, "prepareEvents");
				this .getBrowser () .addBrowserEvent ();
			},
			do_stop: function ()
			{
				this .stop ();
			},
			stop: function ()
			{
				if (this .isActive_ .getValue ())
				{
					// The event order below is very important.

					this .set_stop ();

					this .elapsedTime_ = this .getElapsedTime ();

					if (this .isPaused_ .getValue ())
						this .isPaused_ = false;

					this .isActive_ = false;

					if (this .getLive ())
						this .getBrowser () .prepareEvents_ .removeInterest (this, "prepareEvents");
				}
			},
			timeout: function (callback)
			{
				if (this .enabled_ .getValue ())
				{
					this .getBrowser () .advance ();

					this [callback] ();
				}
			},
			addTimeout: function (name, callback, time)
			{
				this .removeTimeout (name);
				this [name] = setTimeout (this .timeout .bind (this, callback), (time - this .getBrowser () .getCurrentTime ()) * 1000); // GDK_PRIORITY_REDRAW is very important, see Capone
			},
			removeTimeout: function (name)
			{
				clearTimeout (this [name]);
				this [name] = null;
			},
			prepareEvents: function () { },
			set_start: function () { },
			set_pause: function () { },
			set_resume: function () { },
			set_stop: function () { },
		});

		return X3DTimeDependentNode;
	}
});


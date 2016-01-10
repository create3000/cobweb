
define ("cobweb/Components/Followers/X3DChaserNode",
[
	"jquery",
	"cobweb/Components/Followers/X3DFollowerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DFollowerNode, 
          X3DConstants)
{
"use strict";

	function X3DChaserNode (executionContext)
	{
		X3DFollowerNode .call (this, executionContext);

		this .addType (X3DConstants .X3DChaserNode);

		this .destination   = null;
		this .previousValue = null;
		this .bufferEndTime = 0;
		this .stepTime      = 0;

		// Auxillary variables
		this .deltaOut = this .getArray ();
	}

	X3DChaserNode .prototype = $.extend (Object .create (X3DFollowerNode .prototype),
	{
		constructor: X3DChaserNode,
		initialize: function ()
		{
			X3DFollowerNode .prototype .initialize .call (this);
		
			this .set_value_       .addInterest (this, "set_value__");
			this .set_destination_ .addInterest (this, "set_destination__");
			this .duration_        .addInterest (this, "set_duration__");

			this .set_duration__ ();

			var
				buffer             = this .getBuffer (),
				initialValue       = this .getInitialValue (),
				initialDestination = this .getInitialDestination (),
				numBuffers         = this .getNumBuffers ();

			this .bufferEndTime = this .getBrowser () .getCurrentTime ();
			this .previousValue = this .duplicate (initialValue);
	
			buffer [0] = this .duplicate (initialDestination);

			for (var i = 1; i < numBuffers; ++ i)
				buffer [i] = this .duplicate (initialValue);

			this .destination = this .duplicate (initialDestination);

			if (this .equals (initialDestination, initialValue, this .getTolerance ()))
				this .setValue (initialDestination);

			else
				this .set_active (true);
		},
		getNumBuffers: function ()
		{
			return 60;
		},
		getTolerance: function ()
		{
			return 1e-8;
		},
		getArray: function ()
		{
			return this .getVector ();
		},
		setPreviousValue: function (value)
		{
			this .previousValue .assign (value);
		},
		step: function (value1, value2, t)
		{
			this .output .add (this .deltaOut .assign (value1) .subtract (value2) .multiply (t));
		},
		stepResponse: function (t)
		{
			if (t <= 0)
				return 0;

			var duration = this .duration_ .getValue ();
		
			if (t >= duration)
				return 1;
	
			return 0.5 - 0.5 * Math .cos ((t / duration) * Math .PI);
		},
		set_value__: function ()
		{
			if (! this .isActive_ .getValue ())
				this .bufferEndTime = this .getBrowser () .getCurrentTime ();

			var
				buffer = this .getBuffer (),
				value  = this .getValue ();

			for (var i = 1, length = buffer .length; i < length; ++ i)
				this .assign (buffer, i, value);

			this .setPreviousValue (value);
			this .setValue (value);

			this .set_active (true);
		},
		set_destination__: function ()
		{
			this .destination = this .duplicate (this .getDestination ());

			if (! this .isActive_ .getValue ())
				this .bufferEndTime = this .getBrowser () .getCurrentTime ();
		
			this .set_active (true);
		},
		set_duration__: function ()
		{
			this .stepTime = this .duration_ .getValue () / this .getNumBuffers ();
		},
		prepareEvents: function ()
		{
			try
			{
				var
					buffer     = this .getBuffer (),
					numBuffers = buffer .length,
					fraction   = this .updateBuffer ();
			
				this .output = this .interpolate (this .previousValue,
				                                  buffer [numBuffers - 1],
				                                  this .stepResponse ((numBuffers - 1 + fraction) * this .stepTime));
	
				for (var i = numBuffers - 2; i >= 0; -- i)
				{
					this .step (buffer [i], buffer [i + 1], this .stepResponse ((i + fraction) * this .stepTime));
				}
	
				this .setValue (this .output);
		
				if (this .equals (this .output, this .destination, this .getTolerance ()))
					this .set_active (false);
			}
			catch (error)
			{ }
		},
		updateBuffer: function ()
		{
			var
				buffer     = this .getBuffer (),
				numBuffers = buffer .length,
				fraction   = (this .getBrowser () .getCurrentTime () - this .bufferEndTime) / this .stepTime;
		
			if (fraction >= 1)
			{
				var seconds = Math .floor (fraction);

				fraction -= seconds;
		
				if (seconds < numBuffers)
				{
					this .setPreviousValue (buffer [numBuffers - seconds]);
		
					for (var i = numBuffers - 1; i >= seconds; -- i)
					{
						this .assign (buffer, i, buffer [i - seconds])
					}
		
					for (var i = 0; i < seconds; ++ i)
					{
						try
						{
							var alpha = i / seconds;

							this .assign (buffer, i, this .interpolate (this .destination, buffer [seconds], alpha))
						}
						catch (error)
						{ }
		 			}
				}
				else
				{
					this .setPreviousValue (seconds == numBuffers ? buffer [0] : this .destination);

					for (var i = 0; i < numBuffers; ++ i)
						this .assign (buffer, i, this .destination);
				}
		
				this .bufferEndTime += seconds * this .stepTime;
			}

			return fraction;
		},
	});

	return X3DChaserNode;
});



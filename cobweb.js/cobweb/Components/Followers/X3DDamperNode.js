
define ([
	"jquery",
	"cobweb/Components/Followers/X3DFollowerNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          X3DFollowerNode, 
          X3DConstants,
          Algorithm)
{
"use strict";

	function X3DDamperNode (executionContext)
	{
		X3DFollowerNode .call (this, executionContext);

		this .addType (X3DConstants .X3DDamperNode);
	}

	X3DDamperNode .prototype = $.extend (Object .create (X3DFollowerNode .prototype),
	{
		constructor: X3DDamperNode,
		initialize: function ()
		{
			X3DFollowerNode .prototype .initialize .call (this);
		
			this .order_           .addInterest (this, "set_order__");
			this .set_value_       .addInterest (this, "set_value__");
			this .set_destination_ .addInterest (this, "set_destination__");

			var
				buffer             = this .getBuffer (),
				initialValue       = this .getInitialValue (),
				initialDestination = this .getInitialDestination ();

			buffer [0] = this .duplicate (initialDestination);
		
			for (var i = 1, length = this .getOrder () + 1; i < length; ++ i)
				buffer [i] = this .duplicate (initialValue);
	
			if (this .equals (initialDestination, initialValue, this .getTolerance ()))
				this .setValue (initialDestination);

			else
				this .set_active (true);
		},
		getOrder: function ()
		{
			return Algorithm .clamp (this .order_ .getValue (), 0, 5);
		},
		getTolerance: function ()
		{
			if (this .tolerance_ .getValue () < 0)
				return 1e-4;

			return this .tolerance_ .getValue ();
		},
		prepareEvents: function ()
		{
			var
				buffer = this .getBuffer (),
				order  = buffer .length - 1;

			if (this .tau_ .getValue ())
			{
				var
					delta = 1 / this .getBrowser () .currentFrameRate,
					alpha = Math .exp (-delta / this .tau_ .getValue ());

				for (var i = 0; i < order; ++ i)
				{
					try
					{
						this .assign (buffer, i + 1, this .interpolate (buffer [i], buffer [i + 1], alpha));
					}
					catch (error)
					{ }
				}

				this .setValue (buffer [order]);

				if (! this .equals (buffer [order], buffer [0], this .getTolerance ()))
					return;
			}
			else
			{
				this .setValue (buffer [0]);

				order = 0;
			}

			for (var i = 1, length = buffer .length; i < length; ++ i)
				this .assign (buffer, i, buffer [order]);

			this .set_active (false);
		},
		set_value__: function ()
		{
			var
				buffer = this .getBuffer (),
				value  = this .getValue ();

			for (var i = 1, length = buffer .length; i < length; ++ i)
				this .assign (buffer, i, value);

			this .setValue (value);
		
			this .set_active (true);
		},
		set_destination__: function ()
		{
			this .assign (this .getBuffer (), 0, this .getDestination ());

			this .set_active (true);
		},
		set_order__: function ()
		{
			var
				buffer = this .getBuffer (),
				value  = buffer [buffer .length - 1];

			for (var i = buffer .length, length = this .getOrder () + 1; i < length; ++ i)
				buffer [i] = this .duplicate (value);

			buffer .length = length;
		},
	});

	return X3DDamperNode;
});



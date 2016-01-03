
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

	function X3DDamperNode (browser, executionContext)
	{
		X3DFollowerNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DDamperNode);

		this .buffer = [ ];
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
				buffer             = this .buffer,
				initialValue       = this .getInitialValue (),
				initialDestination = this .getInitialDestination ();

			buffer [0] = this .copy (initialDestination);
		
			for (var i = 1, length = this .getOrder () + 1; i < length; ++ i)
				buffer [i] = this .copy (initialValue);
	
			if (this .equals (initialDestination, initialValue, this .getTolerance ()))
				this .setValue (initialDestination);

			else
				this .set_active (true);
		},
		getBuffer: function ()
		{
			return this .buffer;
		},
		getValue: function ()
		{
			return this .set_value_ .getValue ();
		},
		getDestination: function ()
		{
			return this .set_destination_ .getValue ();
		},
		getInitialValue: function ()
		{
			return this .initialValue_ .getValue ();
		},
		getInitialDestination: function ()
		{
			return this .initialDestination_ .getValue ();
		},
		setValue: function (value)
		{
			this .value_changed_ = value;
		},
		getOrder: function ()
		{
			return Algorithm .clamp (this .order_ .getValue (), 0, 5);
		},
		getTolerance: function ()
		{
			if (this .tolerance_ .getValue () < 0)
				return 1e-8;

			return this .tolerance_ .getValue ();
		},
		copy: function (value)
		{
			return value .copy ();
		},
		assign: function (buffer, i, value)
		{
			buffer [i] .assign (value);
		},
		prepareEvents: function ()
		{
			var
				buffer = this .buffer,
				order  = buffer .length - 1;

			if (this .tau_ .getValue ())
			{
				var
					delta = 1 / this .getBrowser () .currentFrameRate,
					alpha = Math .exp (-delta / this .tau_ .getValue ());

				for (var i = 0; i < order; ++ i)
				{
					this .assign (buffer, i + 1, this .interpolate (buffer [i], buffer [i + 1], alpha));
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
				buffer = this .buffer,
				value  = this .getValue ();

			for (var i = 1, length = buffer .length; i < length; ++ i)
				this .assign (buffer, i, value);

			this .setValue (value);
		
			this .set_active (true);
		},
		set_destination__: function ()
		{
			this .assign (this .buffer, 0, this .getDestination ());

			this .set_active (true);
		},
		set_order__: function ()
		{
			var
				buffer = this .buffer,
				value  = buffer [buffer .length - 1];

			for (var i = buffer .length, length = this .getOrder () + 1; i < length; ++ i)
				buffer [i] = this .copy (value);

			buffer .length = length;
		},
	});

	return X3DDamperNode;
});




define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
"use strict";

	function X3DFollowerNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DFollowerNode);

		this .buffer = [ ];

		// Auxillary variables
		this .a      = this .getVector ();
		this .vector = this .getVector ();
	}

	X3DFollowerNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DFollowerNode,
		duplicate: function (value)
		{
			return value .copy ();
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
		assign: function (buffer, i, value)
		{
			buffer [i] .assign (value);
		},
		equals: function (lhs, rhs, tolerance)
		{
			return this .a .assign (lhs) .subtract (rhs) .abs () < tolerance;
		},
		interpolate: function (source, destination, weight)
		{
			return this .vector .assign (source) .lerp (destination, weight);
		},
		set_active: function (value)
		{
			if (value !== this .isActive_ .getValue ())
			{
				this .isActive_ = value;
		
				if (this .isActive_ .getValue ())
				{
					this .getBrowser () .prepareEvents () .addInterest (this, "prepareEvents");
					this .getBrowser () .addBrowserEvent ();
				}
				else
					this .getBrowser () .prepareEvents () .removeInterest (this, "prepareEvents");
			}
		},
	});

	return X3DFollowerNode;
});




define ("cobweb/Components/EventUtilities/X3DSequencerNode",
[
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          X3DChildNode, 
          X3DConstants,
          Algorithm)
{
"use strict";

	function X3DSequencerNode (executionContext)
	{
		X3DChildNode .call (this, executionContext);

		this .addType (X3DConstants .X3DSequencerNode);

		this .index = -1;
	}

	X3DSequencerNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DSequencerNode,
		initialize: function ()
		{
			X3DChildNode .prototype .initialize .call (this);
		
			this .set_fraction_ .addInterest (this, "set_fraction__");
			this .previous_     .addInterest (this, "set_previous__");
			this .next_         .addInterest (this, "set_next__");
			this .key_          .addInterest (this, "set_index__");
		},
		set_fraction__: function ()
		{
			var
				fraction = this .set_fraction_ .getValue (),
				key      = this .key_,
				length   = key .length;

			if (length === 0)
				return;
		
			var i = 0;
		
			if (length === 1 || fraction <= key [0])
				i = 0;
		
			else if (fraction >= key [length - 1])
				i = this .getSize () - 1;
		
			else
			{
				var index = Algorithm .upperBound (key, 0, length, fraction, Algorithm .less);

				i = index - 1;
			}
		
			if (i !== this .index)
			{
				if (i < this .getSize ())
				{
					this .sequence (this .index = i);
				}
			}
		},
		set_previous__: function ()
		{
			if (this .previous_ .getValue ())
			{
				if (this .index <= 0)
					this .index = this .getSize () - 1;

				else
					-- this .index;

				if (this .index < this .getSize ())
					this .sequence (this .index);
			}
		},
		set_next__: function ()
		{
			if (this .next_ .getValue ())
			{
				if (this .index >= this .getSize () - 1)
					this .index = 0;
		
				else
					++ this .index;
		
				if (this .index < this .getSize ())
					this .sequence (this .index);
			}
		},
		set_index__: function ()
		{
			this .index = -1;
		},
	});

	return X3DSequencerNode;
});



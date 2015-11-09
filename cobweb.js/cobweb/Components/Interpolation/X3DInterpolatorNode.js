
define ([
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

	function X3DInterpolatorNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DInterpolatorNode);
	}

	X3DInterpolatorNode .prototype = $.extend (Object .create (X3DChildNode .prototype),
	{
		constructor: X3DInterpolatorNode,
		setup: function ()
		{
			// If an X3DInterpolatorNode value_changed outputOnly field is read before it receives any inputs,
			// keyValue[0] is returned if keyValue is not empty. If keyValue is empty (i.e., [ ]), the initial
			// value for the respective field type is returned (EXAMPLE  (0, 0, 0) for Fields .SFVec3f);

			this .set_key__ ();

			if (this .key_ .length)
				this .interpolate (0, 0, 0);

			X3DChildNode .prototype .setup .call (this);
		},
		initialize: function ()
		{
			X3DChildNode .prototype .initialize .call (this);
			
			this .set_fraction_ .addInterest (this, "set_fraction__");
			this .key_          .addInterest (this, "set_key__");
		},
		set_fraction__: function ()
		{
			var
				key      = this .key_,
				length   = key .length,
				fraction = this .set_fraction_ .getValue ();

			switch (length)
			{
				case 0:
					// Interpolator nodes containing no keys in the key field shall not produce any events.
					return;
				case 1:
					return this .interpolate (0, 0, 0);
				default:
				{
					if (fraction <= key [0])
						return this .interpolate (0, 1, 0);

					var index1 = Algorithm .upperBound (key, 0, length, fraction, Algorithm .less);

					if (index1 !== length)
					{
						var
							index0 = index1 - 1,
							weight = (fraction - key [index0]) / (key [index1] - key [index0]);

						this .interpolate (index0, index1, Algorithm .clamp (weight, 0, 1));
					}
					else
						this .interpolate (length - 2, length - 1, 1);
				}
			}
		},
		set_key__: function ()
		{
			this .set_keyValue__ ();
		},
		set_keyValue__: function () { },
		interpolate: function () { },
	});

	return X3DInterpolatorNode;
});



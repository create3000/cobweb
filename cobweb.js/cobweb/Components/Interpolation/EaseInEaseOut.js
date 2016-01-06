
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants)
{
"use strict";

	function EaseInEaseOut (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext);

		this .addType (X3DConstants .EaseInEaseOut);
	}

	EaseInEaseOut .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
	{
		constructor: EaseInEaseOut,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                 new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",             new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",                      new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "easeInEaseOut",            new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "modifiedFraction_changed", new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "EaseInEaseOut";
		},
		getComponentName: function ()
		{
			return "Interpolation";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DInterpolatorNode .prototype .initialize .call (this);

			this .easeInEaseOut_ .addInterest (this, "set_keyValue__");
		},
		set_keyValue__: function ()
		{
			if (this .easeInEaseOut_ .length < this .key_ .length)
				this .easeInEaseOut_ .resize (this .key_ .length, this .easeInEaseOut_ .length ? this .easeInEaseOut_ [this .easeInEaseOut_ .length - 1] : new Fields .SFVec2f ());
		},
		interpolate: function (index0, index1, weight)
		{
			var easeOut = this .easeInEaseOut_ [index0] .y;
			var easeIn  = this .easeInEaseOut_ [index1] .x;
			var sum     = easeOut + easeIn;

			if (sum < 0)
				this .modifiedFraction_changed_ = weight;

			else
			{
				if (sum > 1)
				{
					easeIn  /= sum;
					easeOut /= sum;
				}

				var t = 1 / (2 - easeOut - easeIn);

				if (weight < easeOut)
				{
					this .modifiedFraction_changed_ = (t / easeOut) * weight * weight;
				}
				else if (weight <= 1 - easeIn) // Spec says (weight < 1 - easeIn), but then we get a NaN below if easeIn == 0.
				{
					this .modifiedFraction_changed_ = t * (2 * weight - easeOut);
				}
				else
				{
					var w = 1 - weight;

					this .modifiedFraction_changed_ = 1 - ((t * w * w) / easeIn);
				}
			}
		},
	});

	return EaseInEaseOut;
});



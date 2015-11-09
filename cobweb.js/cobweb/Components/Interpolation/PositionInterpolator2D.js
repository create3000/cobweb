
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants,
          Vector2)
{
"use strict";

	function PositionInterpolator2D (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .PositionInterpolator2D);
	}

	PositionInterpolator2D .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
	{
		constructor: PositionInterpolator2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new Fields .SFVec2f ()),
		]),
		keyValue: new Vector2 (0, 0),
		getTypeName: function ()
		{
			return "PositionInterpolator2D";
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

			this .keyValue_ .addInterest (this, "set_keyValue__");
		},
		set_keyValue__: function ()
		{
			var
				key      = this .key_,
				keyValue = this .keyValue_;

			if (keyValue .length < key .length)
				keyValue .resize (key .length, keyValue .length ? keyValue [keyValue .length - 1] : new Fields .SFVec2f ());
		},
		interpolate: function (index0, index1, weight)
		{
			this .value_changed_ = this .keyValue .assign (this .keyValue_ [index0] .getValue ()) .lerp (this .keyValue_ [index1] .getValue (), weight);
		},
	});

	return PositionInterpolator2D;
});



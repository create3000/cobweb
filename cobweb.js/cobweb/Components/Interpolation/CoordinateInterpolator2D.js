
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

	function CoordinateInterpolator2D (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .CoordinateInterpolator2D);
	}

	CoordinateInterpolator2D .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
	{
		constructor: CoordinateInterpolator2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new Fields .MFVec2f ()),
		]),
		keyValue: new Vector2 (0, 0),
		getTypeName: function ()
		{
			return "CoordinateInterpolator2D";
		},
		getComponentName: function ()
		{
			return "Interpolation";
		},
		getContainerField: function ()
		{
			return "children";
		},
		set_keyValue__: function () { },
		interpolate: function (index0, index1, weight)
		{
			var
				keyValue      = this .keyValue_ .getValue (),
				value_changed = this .value_changed_ .getValue (),
				size          = this .key_ .length > 1 ? Math .floor (this .keyValue_ .length / this .key_ .length) : 0;

			index0 *= size;
			index1  = index0 + size;

			this .value_changed_ .length = size;

			for (var i = 0; i < size; ++ i)
			{
				value_changed [i] .set (this .keyValue .assign (keyValue [index0 + i] .getValue ())
				                                       .lerp (keyValue [index1 + i] .getValue (),
				                                              weight));
			}

			this .value_changed_ .addEvent ();
		},
	});

	return CoordinateInterpolator2D;
});



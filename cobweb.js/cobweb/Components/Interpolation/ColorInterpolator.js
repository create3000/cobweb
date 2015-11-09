
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Interpolation/X3DInterpolatorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInterpolatorNode, 
          X3DConstants,
          Color3)
{
"use strict";

	function ColorInterpolator (executionContext)
	{
		X3DInterpolatorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ColorInterpolator);

		this .hsv = [ ];
	}

	ColorInterpolator .prototype = $.extend (Object .create (X3DInterpolatorNode .prototype),
	{
		constructor: ColorInterpolator,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_fraction",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "key",           new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "keyValue",      new Fields .MFColor ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "value_changed", new Fields .SFColor ()),
		]),
		value: [ ],
		getTypeName: function ()
		{
			return "ColorInterpolator";
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
			var keyValue = this .keyValue_ .getValue ();
		
			if (keyValue .length < this .key_ .length)
				this .keyValue_ .resize (this .key_ .length, keyValue .length ? keyValue [this .keyValue_ .length - 1] : new Fields .SFColor ());

			this .hsv .length = 0;

			for (var i = 0, length = keyValue .length; i < length; ++ i)
				this .hsv .push (keyValue [i] .getHSV ());
		},
		interpolate: function (index0, index1, weight)
		{
			var value = Color3 .lerp (this .hsv [index0], this .hsv [index1], weight, this .value);

			this .value_changed_ .setHSV (value [0], value [1], value [2]);
		},
	});

	return ColorInterpolator;
});



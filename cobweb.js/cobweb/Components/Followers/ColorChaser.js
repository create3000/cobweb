
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DChaserNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color3",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChaserNode, 
          X3DConstants,
          Color3,
          Vector3,
          Algorithm)
{
"use strict";

	var
		initialValue       = new Vector3 (0, 0, 0),
		initialDestination = new Vector3 (0, 0, 0),
		deltaOut           = new Vector3 (0, 0, 0),
		vector             = new Vector3 (0, 0, 0);

	function ColorChaser (executionContext)
	{
		X3DChaserNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .ColorChaser);
	}

	ColorChaser .prototype = $.extend (Object .create (X3DChaserNode .prototype),
	{
		constructor: ColorChaser,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .SFColor (0.8, 0.8, 0.8)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .SFColor (0.8, 0.8, 0.8)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new Fields .SFTime (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .SFColor ()),
		]),
		getTypeName: function ()
		{
			return "ColorChaser";
		},
		getComponentName: function ()
		{
			return "Followers";
		},
		getContainerField: function ()
		{
			return "children";
		},
		getVector: function ()
		{
			return new Vector3 (0, 0, 0);
		},
		getValue: function ()
		{
			return this .set_value_ .getValue () .getHSV (vector);
		},
		getDestination: function ()
		{
			return this .set_destination_ .getValue () .getHSV (vector);
		},
		getInitialValue: function ()
		{
			return this .initialValue_ .getValue () .getHSV (initialValue);
		},
		getInitialDestination: function ()
		{
			return this .initialDestination_ .getValue () .getHSV (initialDestination);
		},
		setValue: function (value)
		{
			this .value_changed_ .setHSV (value .x, value .y, value .z);
		},
		interpolate: function (source, destination, weight)
		{
			return Color3 .lerp (source, destination, weight, vector);
		},
		step: function (value1, value2, t)
		{
			deltaOut .assign (this .output) .add (value1) .subtract (value2);

			//step .x = Algorithm .interval (step .x, 0, 2 * Math .PI);

			Color3 .lerp (this .output, deltaOut, t, this .output);
		},
	});

	return ColorChaser;
});



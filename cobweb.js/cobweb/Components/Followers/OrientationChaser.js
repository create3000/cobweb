
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DChaserNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Rotation4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChaserNode, 
          X3DConstants,
          Rotation4)
{
"use strict";

	var
		a        = new Rotation4 (0, 0, 1, 0),
		rotation = new Rotation4 (0, 0, 1, 0);

	function OrientationChaser (executionContext)
	{
		X3DChaserNode .call (this, executionContext);

		this .addType (X3DConstants .OrientationChaser);
	}

	OrientationChaser .prototype = $.extend (Object .create (X3DChaserNode .prototype),
	{
		constructor: OrientationChaser,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new Fields .SFTime (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .SFRotation ()),
		]),
		getTypeName: function ()
		{
			return "OrientationChaser";
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
			return new Rotation4 (0, 0, 1, 0);
		},
		equals: function (lhs, rhs, tolerance)
		{
			a .assign (lhs) .inverse () .multRight (rhs);

			return Math .abs (a .angle) < tolerance;
		},
		interpolate: function (source, destination, weight)
		{
			return rotation .assign (source) .slerp (destination, weight);
		},
		step: function (value1, value2, t)
		{
			this .deltaOut .assign (value2) .inverse () .multRight (value1) .multLeft (this .output);

			this .output .slerp (this .deltaOut, t);
		},
	});

	return OrientationChaser;
});



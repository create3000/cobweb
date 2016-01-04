
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DChaserNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChaserNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	var
		a        = new Vector3 (0, 0, 0),
		vector   = new Vector3 (0, 0, 0),
		deltaOut = new Vector3 (0, 0, 0);

	function PositionChaser (executionContext)
	{
		X3DChaserNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .PositionChaser);
	}

	PositionChaser .prototype = $.extend (Object .create (X3DChaserNode .prototype),
	{
		constructor: PositionChaser,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new Fields .SFTime (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .SFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "PositionChaser";
		},
		getComponentName: function ()
		{
			return "Followers";
		},
		getContainerField: function ()
		{
			return "children";
		},
		equals: function (lhs, rhs, tolerance)
		{
			a .assign (lhs);

			return a .subtract (rhs) .abs () < tolerance;
		},
		interpolate: function (source, destination, weight)
		{
			return vector .assign (source) .lerp (destination, weight);
		},
		step: function (value1, value2, t)
		{
			deltaOut .assign (value1) .subtract (value2) .multiply (t);

			this .output .add (deltaOut);
		},
	});

	return PositionChaser;
});



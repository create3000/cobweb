
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Rotation4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants,
          Rotation4)
{
"use strict";

	var
		a        = new Rotation4 (0, 0, 1, 0),
		rotation = new Rotation4 (0, 0, 1, 0);

	function OrientationDamper (executionContext)
	{
		X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .OrientationDamper);
	}

	OrientationDamper .prototype = $.extend (Object .create (X3DDamperNode .prototype),
	{
		constructor: OrientationDamper,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new Fields .SFTime (0.3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new Fields .SFFloat (-1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .SFRotation ()),
		]),
		getTypeName: function ()
		{
			return "OrientationDamper";
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
	});

	return OrientationDamper;
});



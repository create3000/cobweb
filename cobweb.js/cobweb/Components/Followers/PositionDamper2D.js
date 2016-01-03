
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants,
          Vector2)
{
"use strict";

	var
		a      = new Vector2 (0, 0),
		vector = new Vector2 (0, 0);

	function PositionDamper2D (executionContext)
	{
		X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .PositionDamper2D);
	}

	PositionDamper2D .prototype = $.extend (Object .create (X3DDamperNode .prototype),
	{
		constructor: PositionDamper2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new Fields .SFTime (0.3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new Fields .SFFloat (-1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .SFVec2f ()),
		]),
		getTypeName: function ()
		{
			return "PositionDamper2D";
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
	});

	return PositionDamper2D;
});




define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants,
          Algorithm)
{
"use strict";

	function ScalarDamper (executionContext)
	{
		X3DDamperNode .call (this, executionContext);

		this .addType (X3DConstants .ScalarDamper);
	}

	ScalarDamper .prototype = $.extend (Object .create (X3DDamperNode .prototype),
	{
		constructor: ScalarDamper,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new Fields .SFTime (0.3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new Fields .SFFloat (-1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "ScalarDamper";
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
			return 0;
		},
		duplicate: function (value)
		{
			return value;
		},
		assign: function (buffer, i, value)
		{
			buffer [i] = value;
		},
		equals: function (lhs, rhs, tolerance)
		{
			return Math .abs (lhs - rhs) < tolerance;
		},
		interpolate: function (source, destination, weight)
		{
			return Algorithm .lerp (source, destination, weight);
		},
	});

	return ScalarDamper;
});



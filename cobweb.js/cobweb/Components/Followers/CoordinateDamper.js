
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Browser/Followers/X3DArrayFollowerTemplate",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode,
          X3DArrayFollowerTemplate,
          X3DConstants,
          Vector3)
{
"use strict";

	var X3DArrayFollowerObject = X3DArrayFollowerTemplate (X3DDamperNode);

	function CoordinateDamper (executionContext)
	{
		X3DDamperNode          .call (this, executionContext);
		X3DArrayFollowerObject .call (this, executionContext);

		this .addType (X3DConstants .CoordinateDamper);
	}

	CoordinateDamper .prototype = $.extend (Object .create (X3DDamperNode .prototype),
		X3DArrayFollowerObject .prototype,
	{
		constructor: CoordinateDamper,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .MFVec3f (new Vector3 (0, 0, 0))),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .MFVec3f (new Vector3 (0, 0, 0))),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new Fields .SFInt32 (3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new Fields .SFTime (0.3)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new Fields .SFFloat (-1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .MFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "CoordinateDamper";
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
		getArray: function ()
		{
			return new Fields .MFVec3f ();
		},
	});

	return CoordinateDamper;
});



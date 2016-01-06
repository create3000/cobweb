
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DChaserNode",
	"cobweb/Browser/Followers/X3DArrayChaserTemplate",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChaserNode, 
          X3DArrayChaserTemplate,
          X3DConstants,
          Vector3)
{
"use strict";

	var X3DArrayChaserObject = X3DArrayChaserTemplate (X3DChaserNode);

	function CoordinateChaser (executionContext)
	{
		X3DChaserNode        .call (this, executionContext);
		X3DArrayChaserObject .call (this, executionContext);

		this .addType (X3DConstants .CoordinateChaser);
	}

	CoordinateChaser .prototype = $.extend (Object .create (X3DChaserNode .prototype),
		X3DArrayChaserObject .prototype,
	{
		constructor: CoordinateChaser,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .MFVec3f (new Vector3 (0, 0, 0))),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .MFVec3f (new Vector3 (0, 0, 0))),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new Fields .SFTime (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .MFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "CoordinateChaser";
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

	return CoordinateChaser;
});



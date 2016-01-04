
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DChaserNode",
	"cobweb/Browser/Followers/X3DArrayChaserTemplate",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChaserNode, 
          X3DArrayChaserTemplate,
          X3DConstants,
          Vector2)
{
"use strict";

	var X3DArrayChaserObject = X3DArrayChaserTemplate (X3DChaserNode);

	function TexCoordChaser2D (executionContext)
	{
		X3DChaserNode        .call (this, executionContext .getBrowser (), executionContext);
		X3DArrayChaserObject .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .TexCoordChaser2D);
	}

	TexCoordChaser2D .prototype = $.extend (Object .create (X3DChaserNode .prototype),
		X3DArrayChaserObject .prototype,
	{
		constructor: TexCoordChaser2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new Fields .SFTime (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .MFVec2f ()),
		]),
		getTypeName: function ()
		{
			return "TexCoordChaser2D";
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
			return new Vector2 (0, 0);
		},
		getArray: function ()
		{
			return new Fields .MFVec2f ();
		},
	});

	return TexCoordChaser2D;
});




define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shaders/X3DVertexAttributeNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DVertexAttributeNode, 
          X3DConstants)
{
"use strict";

	function Matrix4VertexAttribute (executionContext)
	{
		X3DVertexAttributeNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Matrix4VertexAttribute);
	}

	Matrix4VertexAttribute .prototype = $.extend (Object .create (X3DVertexAttributeNode .prototype),
	{
		constructor: Matrix4VertexAttribute,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "name",     new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "value",    new Fields .MFMatrix4f ()),
		]),
		getTypeName: function ()
		{
			return "Matrix4VertexAttribute";
		},
		getComponentName: function ()
		{
			return "Shaders";
		},
		getContainerField: function ()
		{
			return "attrib";
		},
	});

	return Matrix4VertexAttribute;
});



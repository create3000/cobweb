
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

	function FloatVertexAttribute (executionContext)
	{
		X3DVertexAttributeNode .call (this, executionContext);

		this .addType (X3DConstants .FloatVertexAttribute);
	}

	FloatVertexAttribute .prototype = $.extend (Object .create (X3DVertexAttributeNode .prototype),
	{
		constructor: FloatVertexAttribute,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "name",          new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "numComponents", new Fields .SFInt32 (4)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "value",         new Fields .MFFloat ()),
		]),
		getTypeName: function ()
		{
			return "FloatVertexAttribute";
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

	return FloatVertexAttribute;
});



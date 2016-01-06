
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DInfoNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DInfoNode, 
          X3DConstants)
{
"use strict";

	function WorldInfo (executionContext)
	{
		X3DInfoNode .call (this, executionContext);

		this .addType (X3DConstants .WorldInfo);
	}

	WorldInfo .prototype = $.extend (Object .create (X3DInfoNode .prototype),
	{
		constructor: WorldInfo,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "title",    new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "info",     new Fields .MFString ()),
		]),
		getTypeName: function ()
		{
			return "WorldInfo";
		},
		getComponentName: function ()
		{
			return "Core";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return WorldInfo;
});



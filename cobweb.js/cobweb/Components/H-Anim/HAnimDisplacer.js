
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometricPropertyNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometricPropertyNode, 
          X3DConstants)
{
"use strict";

	function HAnimDisplacer (executionContext)
	{
		X3DGeometricPropertyNode .call (this, executionContext);

		this .addType (X3DConstants .HAnimDisplacer);
	}

	HAnimDisplacer .prototype = $.extend (Object .create (X3DGeometricPropertyNode .prototype),
	{
		constructor: HAnimDisplacer,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "coordIndex",    new Fields .MFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "displacements", new Fields .MFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "name",          new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "weight",        new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "HAnimDisplacer";
		},
		getComponentName: function ()
		{
			return "H-Anim";
		},
		getContainerField: function ()
		{
			return "displacers";
		},
	});

	return HAnimDisplacer;
});



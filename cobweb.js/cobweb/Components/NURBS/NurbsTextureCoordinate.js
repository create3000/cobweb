
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DConstants)
{
	with (Fields)
	{
		function NurbsTextureCoordinate (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsTextureCoordinate);
		}

		NurbsTextureCoordinate .prototype = $.extend (new X3DNode (),
		{
			constructor: NurbsTextureCoordinate,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint", new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",       new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uDimension",   new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uKnot",        new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "uOrder",       new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vDimension",   new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vKnot",        new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "vOrder",       new SFInt32 (3)),
			]),
			getTypeName: function ()
			{
				return "NurbsTextureCoordinate";
			},
			getComponentName: function ()
			{
				return "NURBS";
			},
			getContainerField: function ()
			{
				return "texCoord";
			},
		});

		return NurbsTextureCoordinate;
	}
});



define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureTransformNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureTransformNode, 
          X3DConstants)
{
	with (Fields)
	{
		function TextureTransform (executionContext)
		{
			X3DTextureTransformNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureTransform);
		}

		TextureTransform .prototype = $.extend (new X3DTextureTransformNode (),
		{
			constructor: TextureTransform,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "translation", new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "rotation",    new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "scale",       new SFVec2f (1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "center",      new SFVec2f (0, 0)),
			]),
			getTypeName: function ()
			{
				return "TextureTransform";
			},
			getComponentName: function ()
			{
				return "Texturing";
			},
			getContainerField: function ()
			{
				return "textureTransform";
			},
		});

		return TextureTransform;
	}
});



define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureNode, 
          X3DConstants)
{
	with (Fields)
	{
		function MultiTexture (executionContext)
		{
			X3DTextureNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .MultiTexture);
		}

		MultiTexture .prototype = $.extend (new X3DTextureNode (),
		{
			constructor: MultiTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "color",    new SFColor (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "alpha",    new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "mode",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "source",   new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "function", new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "texture",  new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "MultiTexture";
			},
			getComponentName: function ()
			{
				return "Texturing";
			},
			getContainerField: function ()
			{
				return "texture";
			},
		});

		return MultiTexture;
	}
});


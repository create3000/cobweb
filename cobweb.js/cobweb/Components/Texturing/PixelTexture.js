
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTexture2DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture2DNode, 
          X3DConstants)
{
	with (Fields)
	{
		function PixelTexture (executionContext)
		{
			X3DTexture2DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PixelTexture);
		}

		PixelTexture .prototype = $.extend (new X3DTexture2DNode (),
		{
			constructor: PixelTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "image",             new SFImage (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "PixelTexture";
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

		return PixelTexture;
	}
});


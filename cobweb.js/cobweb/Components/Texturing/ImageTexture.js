
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTexture2DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture2DNode, 
          X3DUrlObject, 
          X3DConstants)
{
	with (Fields)
	{
		function ImageTexture (executionContext)
		{
			X3DTexture2DNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ImageTexture);
		}

		ImageTexture .prototype = $.extend (new X3DTexture2DNode (),new X3DUrlObject (),
		{
			constructor: ImageTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",               new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "ImageTexture";
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

		return ImageTexture;
	}
});


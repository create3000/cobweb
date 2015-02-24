
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing3D/X3DTexture3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture3DNode, 
          X3DConstants)
{
	with (Fields)
	{
		function PixelTexture3D (executionContext)
		{
			X3DTexture3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PixelTexture3D);
		}

		PixelTexture3D .prototype = $.extend (new X3DTexture3DNode (),
		{
			constructor: PixelTexture3D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatR",           new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "image",             new MFInt32 ([, 0,, 0,, 0,, 0, ])),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "PixelTexture3D";
			},
			getComponentName: function ()
			{
				return "Texturing3D";
			},
			getContainerField: function ()
			{
				return "texture";
			},
		});

		return PixelTexture3D;
	}
});


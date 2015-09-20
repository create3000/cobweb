
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing3D/X3DTexture3DNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture3DNode, 
          X3DUrlObject, 
          X3DConstants)
{
	with (Fields)
	{
		function ImageTexture3D (executionContext)
		{
			X3DTexture3DNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ImageTexture3D);
		}

		ImageTexture3D .prototype = $.extend (Object .create (X3DTexture3DNode .prototype),new X3DUrlObject (),
		{
			constructor: ImageTexture3D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",               new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatR",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "ImageTexture3D";
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

		return ImageTexture3D;
	}
});


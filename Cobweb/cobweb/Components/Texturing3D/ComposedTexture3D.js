
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
		function ComposedTexture3D (executionContext)
		{
			X3DTexture3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ComposedTexture3D);
		}

		ComposedTexture3D .prototype = $.extend (new X3DTexture3DNode (),
		{
			constructor: ComposedTexture3D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatR",           new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texture",           new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "ComposedTexture3D";
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

		return ComposedTexture3D;
	}
});


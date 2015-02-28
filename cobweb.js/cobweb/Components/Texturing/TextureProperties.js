
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
		function TextureProperties (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureProperties);
		}

		TextureProperties .prototype = $.extend (new X3DNode (),
		{
			constructor: TextureProperties,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",            new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "borderColor",         new SFColorRGBA (0, 0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "borderWidth",         new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "anisotropicDegree",   new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "generateMipMaps",     new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "minificationFilter",  new SFString ("FASTEST")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "magnificationFilter", new SFString ("FASTEST")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "boundaryModeS",       new SFString ("REPEAT")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "boundaryModeT",       new SFString ("REPEAT")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "boundaryModeR",       new SFString ("REPEAT")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "textureCompression",  new SFString ("FASTEST")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "texturePriority",     new SFFloat ()),
			]),
			getTypeName: function ()
			{
				return "TextureProperties";
			},
			getComponentName: function ()
			{
				return "Texturing";
			},
			getContainerField: function ()
			{
				return "textureProperties";
			},
		});

		return TextureProperties;
	}
});


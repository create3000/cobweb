
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
		/*
		 *  Static members
		 */

		var boundaryModes = 
		{
			CLAMP:             "CLAMP_TO_EDGE", // "CLAMP"
			CLAMP_TO_EDGE:     "CLAMP_TO_EDGE", 
			CLAMP_TO_BOUNDARY: "CLAMP_TO_EDGE", // "CLAMP_TO_BORDER"
			MIRRORED_REPEAT:   "MIRRORED_REPEAT",
			REPEAT:            "REPEAT",
		};

		var minificationFilters =
		{
			AVG_PIXEL_AVG_MIPMAP:         "LINEAR_MIPMAP_LINEAR",
			AVG_PIXEL:                    "LINEAR",
			AVG_PIXEL_NEAREST_MIPMAP:     "LINEAR_MIPMAP_NEAREST",
			NEAREST_PIXEL_AVG_MIPMAP:     "NEAREST_MIPMAP_LINEAR",
			NEAREST_PIXEL_NEAREST_MIPMAP: "NEAREST_MIPMAP_NEAREST",
			NEAREST_PIXEL:                "NEAREST",
			NICEST:                       "LINEAR_MIPMAP_LINEAR",
			FASTEST:                      "NEAREST",
		};

		var magnificationFilters =
		{
			AVG_PIXEL:     "LINEAR",
			NEAREST_PIXEL: "NEAREST",
			NICEST:        "LINEAR",
			FASTEST:       "NEAREST",
		};

		/*
		 *  TextureProperties
		 */

		function TextureProperties (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureProperties);
		}

		TextureProperties .prototype = $.extend (Object .create (X3DNode .prototype),
		{
			constructor: TextureProperties,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",            new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "borderColor",         new SFColorRGBA ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "borderWidth",         new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "anisotropicDegree",   new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "generateMipMaps",     new SFBool ()),
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
			getBoundaryMode: function (string)
			{
				var boundaryMode = boundaryModes [string];
				
				if (boundaryMode !== undefined)
					return boundaryMode;

				return "REPEAT";
			},
			getBoundaryModeS: function ()
			{
				return this .getBoundaryMode (this .boundaryModeS_ .getValue ());
			},
			getBoundaryModeT: function ()
			{
				return this .getBoundaryMode (this .boundaryModeT_ .getValue ());
			},
			getBoundaryModeR: function ()
			{
				return this .getBoundaryMode (this .boundaryModeR_ .getValue ());
			},
			getMinificationFilter: function ()
			{
				if (this .generateMipMaps_ .getValue ())
				{
					var minificationFilter = minificationFilters [this .minificationFilter_ .getValue ()];
				
					if (minificationFilter !== undefined)
						return minificationFilter;
				
					return this .getBrowser () .getDefaultTextureProperties () .getMinificationFilter ();
				}

				return "LINEAR";
			},
			getMagnificationFilter: function ()
			{
				var magnificationFilter = magnificationFilters [this .magnificationFilter_ .getValue ()];
			
				if (magnificationFilter !== undefined)
					return magnificationFilter;

				// DEFAULT
				return this .getBrowser () .getDefaultTextureProperties () .getMagnificationFilter ();
			},
		});

		return TextureProperties;
	}
});


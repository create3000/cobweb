
define ([
	"cobweb/Components/Texturing/TextureCoordinate",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Utility/MatrixStack",
],
function (TextureCoordinate, Matrix4, MatrixStack)
{
	function X3DTexturingContext ()
	{
		this .texture                  = null;
		this .textureMatrix            = new MatrixStack (Matrix4);
		this .defaultTextureCoordinate = new TextureCoordinate (this);
	}

	X3DTexturingContext .prototype =
	{
		initialize: function ()
		{
			var gl = this .getBrowser () .getContext ();

			this .maxTextureSize          = gl .getParameter (gl .MAX_TEXTURE_SIZE);
			this .maxTextureUnits         = gl .getParameter (gl .MAX_TEXTURE_IMAGE_UNITS);
			this .maxCombinedTextureUnits = gl .getParameter (gl .MAX_COMBINED_TEXTURE_IMAGE_UNITS);

			this .defaultTextureCoordinate .setup ();
		},
		getMaxTextureSize: function ()
		{
			return this .maxTextureSize;
		},
		getMaxTextureUnits: function ()
		{
			return this .maxTextureUnits;
		},
		getMaxCombinedTextureUnits: function ()
		{
			return this .maxCombinedTextureUnits;
		},
		setTexture: function (value)
		{
			this .texture = value;
		},
		getTexture: function ()
		{
			return this .texture;
		},
		getTextureMatrix: function ()
		{
			return this .textureMatrix;
		},
		getDefaultTextureCoordinate: function ()
		{
			return this .defaultTextureCoordinate;
		},
	};

	return X3DTexturingContext;
});


define ([
	"cobweb/Components/Shape/Material",
	"cobweb/Components/Shape/Appearance",
	"standard/Math/Numbers/Color3",
],
function (Material, Appearance, Color3)
{
	function X3DShapeContext ()
	{
		this .defaultMaterial   = new Material (this);
		this .defaultAppearance = new Appearance (this);
	}

	X3DShapeContext .prototype =
	{
		initialize: function ()
		{
			this .defaultMaterial .ambientIntensity_ = 0;
			this .defaultMaterial .diffuseColor_     = new Color3 (0, 0, 0);
			this .defaultMaterial .emissiveColor_    = new Color3 (1, 1, 1);
			this .defaultMaterial .shininess_        = 0;
			this .defaultMaterial .setup ();
			
			this .defaultAppearance .setup ();
		},
		getDefaultAppearance: function ()
		{
			return this .defaultAppearance;
		},
		getDefaultMaterial: function ()
		{
			return this .defaultMaterial;
		},
		setMaterial: function (value)
		{
			this .material = value;
		},
		getMaterial: function ()
		{
			return this .material;
		},
	};

	return X3DShapeContext;
});

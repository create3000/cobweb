
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DAppearanceNode",
	"cobweb/Bits/x3d_cast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DAppearanceNode,
          x3d_cast,
          X3DConstants)
{
	with (Fields)
	{
		function Appearance (executionContext)
		{
			X3DAppearanceNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Appearance);
		}

		Appearance .prototype = $.extend (new X3DAppearanceNode (),
		{
			constructor: Appearance,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "fillProperties",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "lineProperties",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "material",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "texture",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "textureTransform", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "shaders",          new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Appearance";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "appearance";
			},
			initialize: function ()
			{
				X3DAppearanceNode .prototype .initialize .call (this);
				
				this .material_ .addInterest (this, "set_material__");
				
				this .set_material__ ();
			},
			isTransparent: function ()
			{
				return this .materialNode && this .materialNode .isTransparent ();
			},
			set_material__: function ()
			{
				this .materialNode = x3d_cast (X3DConstants .X3DMaterialNode, this .material_);
			},
			traverse: function ()
			{
				var browser = this .getBrowser ();

				browser .setMaterial (this .materialNode);
			},
		});

		return Appearance;
	}
});


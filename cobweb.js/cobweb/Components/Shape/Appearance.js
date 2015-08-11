
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DAppearanceNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DAppearanceNode,
          X3DCast,
          X3DConstants)
{
	with (Fields)
	{
		function Appearance (executionContext)
		{
			X3DAppearanceNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Appearance);
		}

		Appearance .prototype = $.extend (Object .create (X3DAppearanceNode .prototype),
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

				this .material_         .addInterest (this, "set_material__");
				this .texture_          .addInterest (this, "set_texture__");
				this .textureTransform_ .addInterest (this, "set_textureTransform__");
				this .shaders_          .addInterest (this, "set_shaders__");

				this .set_material__ ();
				this .set_texture__ ();
				this .set_textureTransform__ ();
				this .set_shaders__ ();
				this .set_transparent__ ()
			},
			set_material__: function ()
			{
				if (this .materialNode)
					this .materialNode .transparent_ .removeInterest (this, "set_transparent__");

				this .materialNode = X3DCast (X3DConstants .X3DMaterialNode, this .material_);

				if (this .materialNode)
					this .materialNode .transparent_ .addInterest (this, "set_transparent__");
			},
			set_transparent__: function ()
			{
				this .transparent_ = (this .materialNode && this .materialNode .transparent_ .getValue ()) ||
				                     (this .textureNode && this .textureNode .transparent_ .getValue ());
			},
			set_texture__: function ()
			{
				if (this .textureNode)
					this .textureNode .transparent_ .removeInterest (this, "set_transparent__");

				this .textureNode = X3DCast (X3DConstants .X3DTextureNode, this .texture_);

				if (this .textureNode)
					this .textureNode .transparent_ .addInterest (this, "set_transparent__");
			},
			set_textureTransform__: function ()
			{
				this .textureTransformNode = X3DCast (X3DConstants .X3DTextureTransformNode, this .textureTransform_);
				
				if (this .textureTransformNode)
					return;

				this .textureTransformNode = this .getBrowser () .getDefaultTextureTransform ();
			},
			set_shaders__: function ()
			{
			},
			traverse: function ()
			{
				var browser = this .getBrowser ();

				browser .setMaterial (this .materialNode);
				browser .setTexture (this .textureNode);
				browser .setShader (browser .getDefaultShader ());

				this .textureTransformNode .traverse ();
			},
		});

		return Appearance;
	}
});


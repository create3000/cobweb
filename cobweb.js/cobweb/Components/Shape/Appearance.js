
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
"use strict";

	function Appearance (executionContext)
	{
		X3DAppearanceNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Appearance);

		this .linePropertiesNode   = null;
		this .materialNode         = null;
		this .textureNode          = null;
		this .textureTransformNode = null;
		this .shaderNodes          = [ ];
		this .shaderNode           = null;
	}

	Appearance .prototype = $.extend (Object .create (X3DAppearanceNode .prototype),
	{
		constructor: Appearance,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "fillProperties",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "lineProperties",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "material",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "texture",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "textureTransform", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "shaders",          new Fields .MFNode ()),
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

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .lineProperties_   .addInterest (this, "set_lineProperties__");
			this .material_         .addInterest (this, "set_material__");
			this .texture_          .addInterest (this, "set_texture__");
			this .textureTransform_ .addInterest (this, "set_textureTransform__");
			this .shaders_          .addInterest (this, "set_shaders__");

			this .set_lineProperties__ ();
			this .set_material__ ();
			this .set_texture__ ();
			this .set_textureTransform__ ();
			this .set_shaders__ ();
		},
		getLineProperties: function ()
		{
			return this .linePropertiesNode;
		},
		getMaterial: function ()
		{
			return this .materialNode;
		},
		getTexture: function ()
		{
			return this .textureNode;
		},
		getTextureTransform: function ()
		{
			return this .textureTransformNode;
		},
		set_lineProperties__: function ()
		{
			this .linePropertiesNode = X3DCast (X3DConstants .LineProperties, this .lineProperties_);
		},
		set_live__: function ()
		{
			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
			{
				if (this .shaderNode)
					this .getBrowser () .addShader (this .shaderNode);
			}
			else
			{
				if (this .shaderNode)
				this .getBrowser () .removeShader (this .shaderNode);
			}
		},
		set_material__: function ()
		{
			if (this .materialNode)
				this .materialNode .transparent_ .removeInterest (this, "set_transparent__");

			this .materialNode = X3DCast (X3DConstants .X3DMaterialNode, this .material_);

			if (this .materialNode)
				this .materialNode .transparent_ .addInterest (this, "set_transparent__");
			
			this .set_transparent__ ();
		},
		set_texture__: function ()
		{
			if (this .textureNode)
				this .textureNode .transparent_ .removeInterest (this, "set_transparent__");

			this .textureNode = X3DCast (X3DConstants .X3DTextureNode, this .texture_);

			if (this .textureNode)
				this .textureNode .transparent_ .addInterest (this, "set_transparent__");
			
			this .set_transparent__ ();
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
			var
				shaders     = this .shaders_ .getValue (),
				shaderNodes = this .shaderNodes;

			for (var i = 0, length = shaderNodes .length; i < length; ++ i)
				shaderNodes [i] .isValid_ .removeInterest (this, "set_shader__");
		
			shaderNodes .length = 0;
		
			for (var i = 0, length = shaders .length; i < length; ++ i)
			{
				var shaderNode = X3DCast (X3DConstants .X3DShaderNode, shaders [i]);
		
				if (shaderNode)
				{
					shaderNodes .push (shaderNode);
					shaderNode .isValid_ .addInterest (this, "set_shader__");
				}
			}

			this .set_shader__ ();
		},
		set_shader__: function ()
		{
			var shaderNodes = this .shaderNodes;

			if (this .shaderNode)
				this .getBrowser () .removeShader (this .shaderNode);

			this .shaderNode = null;

			for (var i = 0, length = shaderNodes .length; i < length; ++ i)
			{
				if (shaderNodes [i] .isValid_ .getValue ())
				{
					this .shaderNode = shaderNodes [i];
					break;
				}
			}

			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
			{
				if (this .shaderNode)
					this .getBrowser () .addShader (this .shaderNode);
			}

			this .set_transparent__ ();
		},
		set_transparent__: function ()
		{
			this .transparent_ = (this .materialNode && this .materialNode .transparent_ .getValue ()) ||
			                     (this .textureNode && this .textureNode .transparent_ .getValue ());
		},
		traverse: function ()
		{
			var browser = this .getBrowser ();

			browser .setAppearance (this);
			browser .setShader (this .shaderNode || browser .getDefaultShader ());
		},
	});

	return Appearance;
});



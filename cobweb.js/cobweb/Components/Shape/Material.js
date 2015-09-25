
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DMaterialNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DMaterialNode, 
          X3DConstants,
          Algorithm)
{
	with (Fields)
	{
		function Material (executionContext)
		{
			X3DMaterialNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Material);
				
			this .diffuseColor  = new Float32Array (3);
			this .specularColor = new Float32Array (3);
			this .emissiveColor = new Float32Array (3);
		}

		Material .prototype = $.extend (Object .create (X3DMaterialNode .prototype),
		{
			constructor: Material,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new SFFloat (0.2)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseColor",     new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "specularColor",    new SFColor ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",    new SFColor ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "shininess",        new SFFloat (0.2)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",     new SFFloat ()),
			]),
			getTypeName: function ()
			{
				return "Material";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "material";
			},
			initialize: function ()
			{
				X3DMaterialNode .prototype .initialize .call (this);

				this .addChildren ("transparent", new SFBool ());

				this .ambientIntensity_ .addInterest (this, "set_ambientIntensity__");
				this .diffuseColor_     .addInterest (this, "set_diffuseColor__");
				this .specularColor_    .addInterest (this, "set_specularColor__");
				this .emissiveColor_    .addInterest (this, "set_emissiveColor__");
				this .shininess_        .addInterest (this, "set_shininess__");
				this .transparency_     .addInterest (this, "set_transparency__");
		
				this .set_ambientIntensity__ ();
				this .set_diffuseColor__ ();
				this .set_specularColor__ ();
				this .set_emissiveColor__ ();
				this .set_shininess__ ();
				this .set_transparency__ ();
			},
			getSeparateBackColor: function ()
			{
			   return false;
			},
			set_ambientIntensity__: function ()
			{
				this .ambientIntensity = Math .max (this .ambientIntensity_ .getValue (), 0);
			},
			set_diffuseColor__: function ()
			{
				this .diffuseColor .set (this .diffuseColor_ .getValue ());
			},
			set_specularColor__: function ()
			{
				this .specularColor .set (this .specularColor_ .getValue ());
			},
			set_emissiveColor__: function ()
			{
				this .emissiveColor .set (this .emissiveColor_ .getValue ());
			},
			set_shininess__: function ()
			{
				this .shininess = Algorithm .clamp (this .shininess_ .getValue (), 0, 1) * 128;
			},
			set_transparency__: function ()
			{
				var transparency = Algorithm .clamp (this .transparency_ .getValue (), 0, 1);

				this .transparency = transparency;

				if (transparency != this .transparent_ .getValue ())
					this .transparent_ = transparency;
			},
		});

		return Material;
	}
});


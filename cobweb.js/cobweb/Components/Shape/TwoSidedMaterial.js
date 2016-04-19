
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
"use strict";

	function TwoSidedMaterial (executionContext)
	{
		X3DMaterialNode .call (this, executionContext);

		this .addType (X3DConstants .TwoSidedMaterial);
			
		this .diffuseColor  = new Float32Array (3);
		this .specularColor = new Float32Array (3);
		this .emissiveColor = new Float32Array (3);
			
		this .backDiffuseColor  = new Float32Array (3);
		this .backSpecularColor = new Float32Array (3);
		this .backEmissiveColor = new Float32Array (3);
	}

	TwoSidedMaterial .prototype = $.extend (Object .create (X3DMaterialNode .prototype),
	{
		constructor: TwoSidedMaterial,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",             new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "separateBackColor",    new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity",     new Fields .SFFloat (0.2)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseColor",         new Fields .SFColor (0.8, 0.8, 0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "specularColor",        new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",        new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "shininess",            new Fields .SFFloat (0.2)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",         new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "backAmbientIntensity", new Fields .SFFloat (0.2)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "backDiffuseColor",     new Fields .SFColor (0.8, 0.8, 0.8)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "backSpecularColor",    new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "backEmissiveColor",    new Fields .SFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "backShininess",        new Fields .SFFloat (0.2)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "backTransparency",     new Fields .SFFloat ()),
		]),
		getTypeName: function ()
		{
			return "TwoSidedMaterial";
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
			X3DMaterialNode . prototype .initialize .call (this);
			
			this .addChildren ("transparent", new Fields .SFBool ());

			this .ambientIntensity_ .addInterest (this, "set_ambientIntensity__");
			this .diffuseColor_     .addInterest (this, "set_diffuseColor__");
			this .specularColor_    .addInterest (this, "set_specularColor__");
			this .emissiveColor_    .addInterest (this, "set_emissiveColor__");
			this .shininess_        .addInterest (this, "set_shininess__");
			this .transparency_     .addInterest (this, "set_transparency__");
	
			this .backAmbientIntensity_ .addInterest (this, "set_backAmbientIntensity__");
			this .backDiffuseColor_     .addInterest (this, "set_backDiffuseColor__");
			this .backSpecularColor_    .addInterest (this, "set_backSpecularColor__");
			this .backEmissiveColor_    .addInterest (this, "set_backEmissiveColor__");
			this .backShininess_        .addInterest (this, "set_backShininess__");
			this .backTransparency_     .addInterest (this, "set_backTransparency__");
	
			this .set_ambientIntensity__ ();
			this .set_diffuseColor__ ();
			this .set_specularColor__ ();
			this .set_emissiveColor__ ();
			this .set_shininess__ ();
			this .set_transparency__ ();

			this .set_backAmbientIntensity__ ();
			this .set_backDiffuseColor__ ();
			this .set_backSpecularColor__ ();
			this .set_backEmissiveColor__ ();
			this .set_backShininess__ ();
			this .set_backTransparency__ ();
		},
		getSeparateBackColor: function ()
		{
		   return this .separateBackColor_ .getValue ();
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
			this .transparency = Algorithm .clamp (this .transparency_ .getValue (), 0, 1);

			this .set_transparent__ ();
		},
		/*
		 * Back Material
		 */
		set_backAmbientIntensity__: function ()
		{
			this .backAmbientIntensity = Math .max (this .backAmbientIntensity_ .getValue (), 0);
		},
		set_backDiffuseColor__: function ()
		{
			this .backDiffuseColor .set (this .backDiffuseColor_ .getValue ());
		},
		set_backSpecularColor__: function ()
		{
			this .backSpecularColor .set (this .backSpecularColor_ .getValue ());
		},
		set_backEmissiveColor__: function ()
		{
			this .backEmissiveColor .set (this .backEmissiveColor_ .getValue ());
		},
		set_backShininess__: function ()
		{
			this .backShininess = Algorithm .clamp (this .backShininess_ .getValue (), 0, 1) * 128;
		},
		set_backTransparency__: function ()
		{
			this .backTransparency = Algorithm .clamp (this .backTransparency_ .getValue (), 0, 1);

			this .set_transparent__ ();
		},
		set_transparent__: function ()
		{
			var transparent = (this .transparency_ .getValue () || this .backTransparency_ .getValue ()) > 0;

			if (transparent != this .transparent_ .getValue ())
				this .transparent_ = transparent;
		},
	});

	return TwoSidedMaterial;
});



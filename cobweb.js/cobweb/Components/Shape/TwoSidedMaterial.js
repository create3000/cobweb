
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DMaterialNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DMaterialNode, 
          X3DConstants)
{
	with (Fields)
	{
		function TwoSidedMaterial (executionContext)
		{
			X3DMaterialNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TwoSidedMaterial);
		}

		TwoSidedMaterial .prototype = $.extend (new X3DMaterialNode (),
		{
			constructor: TwoSidedMaterial,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",             new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "separateBackColor",    new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity",     new SFFloat (0.2)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseColor",         new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "specularColor",        new SFColor (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",        new SFColor (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "shininess",            new SFFloat (0.2)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",         new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backAmbientIntensity", new SFFloat (0.2)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backDiffuseColor",     new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backSpecularColor",    new SFColor (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backEmissiveColor",    new SFColor (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backShininess",        new SFFloat (0.2)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backTransparency",     new SFFloat ()),
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
				
				this .addChildren ("transparent", new SFBool (false));

				this .transparency_     .addInterest (this, "set_transparent__");
				this .backTransparency_ .addInterest (this, "set_transparent__");

				this .set_transparent__ ();
			},
			set_transparent__: function ()
			{
				this .transparent_ = this .transparency_ .getValue () || this .backTransparency_ .getValue ();
			},
		});

		return TwoSidedMaterial;
	}
});


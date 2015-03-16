
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
		}

		Material .prototype = $.extend (new X3DMaterialNode (),
		{
			constructor: Material,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity", new SFFloat (0.2)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseColor",     new SFColor (0.8, 0.8, 0.8)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "specularColor",    new SFColor (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",    new SFColor (0, 0, 0)),
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

				this .addInterest (this, "update");
	
				this .update ();
			},
			isTransparent: function ()
			{
				return this .transparency_ .getValue ();
			},
			update: function ()
			{
				this .ambientIntensity = Math .max (this .ambientIntensity_ .getValue (), 0);
				this .diffuseColor     = this .diffuseColor_  .getValue ();
				this .specularColor    = this .specularColor_ .getValue ();
				this .emissiveColor    = this .emissiveColor_ .getValue ();
				this .shininess        = Algorithm .clamp (this .shininess_    .getValue (), 0, 1);
				this .transparency     = Algorithm .clamp (this .transparency_ .getValue (), 0, 1);
			},
		});

		return Material;
	}
});


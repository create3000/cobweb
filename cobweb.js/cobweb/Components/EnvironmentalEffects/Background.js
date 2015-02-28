
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalEffects/X3DBackgroundNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBackgroundNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Background (executionContext)
		{
			X3DBackgroundNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Background);
		}

		Background .prototype = $.extend (new X3DBackgroundNode (),
		{
			constructor: Background,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",     new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "frontUrl",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backUrl",      new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "leftUrl",      new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "rightUrl",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "topUrl",       new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "bottomUrl",    new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "skyAngle",     new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "skyColor",     new MFColor (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "groundAngle",  new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "groundColor",  new MFColor ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "transparency", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",      new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",     new SFTime ()),
			]),
			getTypeName: function ()
			{
				return "Background";
			},
			getComponentName: function ()
			{
				return "EnvironmentalEffects";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return Background;
	}
});


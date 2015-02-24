
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
		function TextureBackground (executionContext)
		{
			X3DBackgroundNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureBackground);
		}

		TextureBackground .prototype = $.extend (new X3DBackgroundNode (),
		{
			constructor: TextureBackground,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",      new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "skyAngle",      new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "skyColor",      new MFColor (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "groundAngle",   new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "groundColor",   new MFColor ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",       new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",      new SFTime ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "frontTexture",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "backTexture",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "leftTexture",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "rightTexture",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "topTexture",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "bottomTexture", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "TextureBackground";
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

		return TextureBackground;
	}
});


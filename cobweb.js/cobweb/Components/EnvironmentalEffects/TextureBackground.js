
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
"use strict";

	function TextureBackground (executionContext)
	{
		X3DBackgroundNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .TextureBackground);
	}

	TextureBackground .prototype = $.extend (Object .create (X3DBackgroundNode .prototype),
	{
		constructor: TextureBackground,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",      new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "skyAngle",      new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "skyColor",      new Fields .MFColor (0, 0, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "groundAngle",   new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "groundColor",   new Fields .MFColor ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",       new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",      new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "frontTexture",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "backTexture",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "leftTexture",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "rightTexture",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "topTexture",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "bottomTexture", new Fields .SFNode ()),
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
});



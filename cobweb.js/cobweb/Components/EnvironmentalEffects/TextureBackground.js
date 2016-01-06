
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalEffects/X3DBackgroundNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBackgroundNode, 
          X3DCast,
          X3DConstants)
{
"use strict";

	function TextureBackground (executionContext)
	{
		X3DBackgroundNode .call (this, executionContext);

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
		initialize: function ()
		{
			X3DBackgroundNode .prototype .initialize .call (this);

			this .frontTexture_  .addInterest (this, "set_frontTexture__");
			this .backTexture_   .addInterest (this, "set_backTexture__");
			this .leftTexture_   .addInterest (this, "set_leftTexture__");
			this .rightTexture_  .addInterest (this, "set_rightTexture__");
			this .topTexture_    .addInterest (this, "set_topTexture__");
			this .bottomTexture_ .addInterest (this, "set_bottomTexture__");

			this .set_frontTexture__  (this .frontTexture_);
			this .set_backTexture__   (this .backTexture_);
			this .set_leftTexture__   (this .leftTexture_);
			this .set_rightTexture__  (this .rightTexture_);
			this .set_topTexture__    (this .topTexture_);
			this .set_bottomTexture__ (this .bottomTexture_);
		},
		set_frontTexture__: function ()
		{
			X3DBackgroundNode .prototype .set_frontTexture__ .call (this, X3DCast (X3DConstants .X3DTextureNode, this .frontTexture_));
		},
		set_backTexture__: function ()
		{
			X3DBackgroundNode .prototype .set_backTexture__ .call (this, X3DCast (X3DConstants .X3DTextureNode, this .backTexture_));
		},
		set_leftTexture__: function ()
		{
			X3DBackgroundNode .prototype .set_leftTexture__ .call (this, X3DCast (X3DConstants .X3DTextureNode, this .leftTexture_));
		},
		set_rightTexture__: function ()
		{
			X3DBackgroundNode .prototype .set_rightTexture__ .call (this, X3DCast (X3DConstants .X3DTextureNode, this .rightTexture_));
		},
		set_topTexture__: function ()
		{
			X3DBackgroundNode .prototype .set_topTexture__ .call (this, X3DCast (X3DConstants .X3DTextureNode, this .topTexture_));
		},
		set_bottomTexture__: function ()
		{
			X3DBackgroundNode .prototype .set_bottomTexture__ .call (this, X3DCast (X3DConstants .X3DTextureNode, this .bottomTexture_));
		},
	});

	return TextureBackground;
});



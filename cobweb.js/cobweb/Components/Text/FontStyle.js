
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Text/X3DFontStyleNode",
	"cobweb/Browser/Text/PolygonText",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DFontStyleNode,
          PolygonText,
          X3DConstants)
{
"use strict";

	function FontStyle (executionContext)
	{
		X3DFontStyleNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .FontStyle);
	}

	FontStyle .prototype = $.extend (Object .create (X3DFontStyleNode .prototype),
	{
		constructor: FontStyle,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "language",    new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "family",      new Fields .MFString ("SERIF")),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "style",       new Fields .SFString ("PLAIN")),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "size",        new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "spacing",     new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "horizontal",  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "leftToRight", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "topToBottom", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "justify",     new Fields .MFString ("BEGIN")),
		]),
		getTypeName: function ()
		{
			return "FontStyle";
		},
		getComponentName: function ()
		{
			return "Text";
		},
		getContainerField: function ()
		{
			return "fontStyle";
		},
		getTextGeometry: function (text)
		{
			return new PolygonText (text, this);
		},
		getScale: function ()
		{
			return this .size_ .getValue ();
		},
	});

	return FontStyle;
});



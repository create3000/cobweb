
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Text/X3DFontStyleNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DFontStyleNode, 
          X3DConstants)
{
	with (Fields)
	{
		function ScreenFontStyle (executionContext)
		{
			X3DFontStyleNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ScreenFontStyle);
		}

		ScreenFontStyle .prototype = $.extend (Object .create (X3DFontStyleNode .prototype),
		{
			constructor: ScreenFontStyle,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "language",    new SFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "family",      new MFString ("SERIF")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "style",       new SFString ("PLAIN")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "pointSize",   new SFFloat (12)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "spacing",     new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "horizontal",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "leftToRight", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "topToBottom", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "justify",     new MFString ("BEGIN")),
			]),
			getTypeName: function ()
			{
				return "ScreenFontStyle";
			},
			getComponentName: function ()
			{
				return "Layout";
			},
			getContainerField: function ()
			{
				return "fontStyle";
			},
		});

		return ScreenFontStyle;
	}
});


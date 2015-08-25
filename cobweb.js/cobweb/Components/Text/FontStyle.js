
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Text/X3DFontStyleNode",
	"cobweb/Bits/X3DConstants",
	"opentype",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DFontStyleNode, 
          X3DConstants,
          opentype)
{
	with (Fields)
	{
		function FontStyle (executionContext)
		{
			X3DFontStyleNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .FontStyle);
		}

		FontStyle .prototype = $.extend (Object .create (X3DFontStyleNode .prototype),
		{
			constructor: FontStyle,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "language",    new SFString ("")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "family",      new MFString ("SERIF")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "style",       new SFString ("PLAIN")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "size",        new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "spacing",     new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "horizontal",  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "leftToRight", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "topToBottom", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "justify",     new MFString ("BEGIN")),
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
			initialize: function ()
			{
			   X3DFontStyleNode .prototype .initialize .call (this);
				
				this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
				this .isLive ()                         .addInterest (this, "set_live__");

				this .font = null;

				this .set_live__ ();
			   this .requestAsyncLoad ();
			},
			getFont: function ()
			{
			   return this .font;
			},
			set_live__: function ()
			{
			   if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
			   {
			      this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .addInterest (this, "addNodeEvent");

			      var primitiveQuality = this .getBrowser () .getBrowserOptions () .getPrimitiveQuality ();

			      if (this .primitiveQuality !== undefined && primitiveQuality !== this .primitiveQuality)
			         this .addNodeEvent ();
			      
					this .primitiveQuality = primitiveQuality;
			   }
			   else
			      this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .removeInterest (this, "addNodeEvent");
			},
			requestAsyncLoad: function ()
			{
				try
				{
					opentype .load ("fonts/Ubuntu-R.ttf", this .setFont .bind (this));
				}
				catch (error)
				{
					this .setError (error .message);
				}
			},
			setFont: function (error, font)
			{
				if (error)
				{
				   this .setError (error);
				}
				else
				{
					console .log ('Font loaded fine.');

					this .font = font;
			   
			      // Workaround to initialize composite glyphs.
			      for (var i = 0; i < this .font .numGlyphs; ++ i)
						this .font .glyphs .get (i) .getPath (0, 0, 1);

					this .addNodeEvent ();
					this .getBrowser () .addBrowserEvent ();
				}
			},
			setError: function (error)
			{
				this .font = null;

				console .warn ('Font could not be loaded: ' + error);			   
			},
		});

		return FontStyle;
	}
});


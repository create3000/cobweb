
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Core/PrimitiveQuality",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBaseNode,
          X3DConstants,
          PrimitiveQuality)
{
	with (Fields)
	{
		function BrowserOptions (executionContext)
		{
			X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

			this .addAlias ("AntiAliased", this .Antialiased_);
		}

		BrowserOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
		{
			constructor: BrowserOptions,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "SplashScreen",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "Dashboard",              new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "Rubberband",             new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "EnableInlineViewpoints", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "Antialiased",            new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "TextureQuality",         new SFString ("MEDIUM")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "PrimitiveQuality",       new SFString ("MEDIUM")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "QualityWhenMoving",      new SFString ("MEDIUM")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "Shading",                new SFString ("GOURAUD")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "MotionBlur",             new SFBool (false)),
			]),
			initialize: function ()
			{
				X3DBaseNode .prototype .initialize .call (this);
				
				this .PrimitiveQuality_ .addInterest (this, "set_primitiveQuality__");
				this .Shading_          .addInterest (this, "set_shading__");

				this .set_primitiveQuality__ ();
			},
			getPrimitiveQuality: function ()
			{
			   return this .primitiveQuality;
			},
			set_primitiveQuality__: function ()
			{
				switch (this .PrimitiveQuality_ .getValue ())
				{
				   case "LOW":
				      this .primitiveQuality = PrimitiveQuality .LOW;
				      break;
				   case "HIGH":
				      this .primitiveQuality = PrimitiveQuality .HIGH;
				      break;
				   default:
				      this .primitiveQuality = PrimitiveQuality .MEDIUM;
				      break;
				}
			},
			set_shading__: function ()
			{
				this .getBrowser () .setDefaultShader (this .Shading_ .getValue ());
			},
		});

		return BrowserOptions;
	}
});

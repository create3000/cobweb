
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Core/PrimitiveQuality",
	"cobweb/Browser/Core/TextureQuality",
	"lib/gettext",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBaseNode,
          X3DConstants,
          PrimitiveQuality,
          TextureQuality,
          _)
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
				new X3DFieldDefinition (X3DConstants .inputOutput, "MotionBlur",             new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "Gravity",                new SFFloat (9.80665)),
			]),
			getTypeName: function ()
			{
				return "BrowserOptions";
			},
			getComponentName: function ()
			{
				return "Cobweb";
			},
			getContainerField: function ()
			{
				return "browserOptions";
			},
			initialize: function ()
			{
				X3DBaseNode .prototype .initialize .call (this);
				
				this .Rubberband_                .addInterest (this, "set_rubberband__");
				this .PrimitiveQuality_          .addInterest (this, "set_primitiveQuality__");
				this .TextureQuality_            .addInterest (this, "set_textureQuality__");
				this .Shading_                   .addInterest (this, "set_shading__");
				this .getBrowser () .shutdown () .addInterest (this, "set_shutdown__");

				this .set_primitiveQuality__ ();
				this .set_textureQuality__ ();
			},
			getPrimitiveQuality: function ()
			{
				return this .primitiveQuality;
			},
			getTextureQuality: function ()
			{
				return this .textureQuality;
			},
			set_shutdown__: function ()
			{
				var fieldDefinitions = this .getFieldDefinitions ();

				for (var i = 0; i < fieldDefinitions .length; ++ i)
				{
					var
						fieldDefinition = fieldDefinitions [i],
						field           = this .getField (fieldDefinition .name);

					if (! field .equals (fieldDefinition .value))
						field .setValue (fieldDefinition .value);
				}
			},
			set_rubberband__: function ()
			{
			   if (this .Rubberband_ .getValue ())
			      this .getBrowser () .getNotification () .string_ = _("Rubberband: on");
			   else
					this .getBrowser () .getNotification () .string_ = _("Rubberband: off");
			},
			set_primitiveQuality__: function ()
			{
				switch (this .PrimitiveQuality_ .getValue ())
				{
					case "LOW":
						this .primitiveQuality = PrimitiveQuality .LOW;
						this .getBrowser () .getNotification () .string_ = _("Primitive Quality: low");
						break;
					case "HIGH":
						this .primitiveQuality = PrimitiveQuality .HIGH;
						this .getBrowser () .getNotification () .string_ = _("Primitive Quality: high");
						break;
					default:
						this .primitiveQuality = PrimitiveQuality .MEDIUM;
						this .getBrowser () .getNotification () .string_ = _("Primitive Quality: medium");
						break;
				}
			},
			set_textureQuality__: function ()
			{
				switch (this .TextureQuality_ .getValue ())
				{
					case "LOW":
						this .textureQuality = PrimitiveQuality .LOW;
						this .getBrowser () .getNotification () .string_ = _("Texture Quality: low");
						break;
					case "HIGH":
						this .textureQuality = PrimitiveQuality .HIGH;
						this .getBrowser () .getNotification () .string_ = _("Texture Quality: high");
						break;
					default:
						this .textureQuality = PrimitiveQuality .MEDIUM;
						this .getBrowser () .getNotification () .string_ = _("Texture Quality: medium");
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

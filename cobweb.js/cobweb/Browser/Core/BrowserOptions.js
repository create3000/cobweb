
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Core/PrimitiveQuality",
	"cobweb/Browser/Core/TextureQuality",
	"lib/dataStorage",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBaseNode,
          X3DConstants,
          PrimitiveQuality,
          TextureQuality,
          dataStorage)
{
"use strict";
	
	function BrowserOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .addAlias ("AntiAliased", this .Antialiased_);

		this .primitiveQuality = PrimitiveQuality .MEDIUM;
		this .textureQuality   = TextureQuality   .MEDIUM;
	}

	BrowserOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: BrowserOptions,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "SplashScreen",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "Dashboard",              new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "Rubberband",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "EnableInlineViewpoints", new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "Antialiased",            new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "TextureQuality",         new Fields .SFString ("MEDIUM")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "PrimitiveQuality",       new Fields .SFString ("MEDIUM")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "QualityWhenMoving",      new Fields .SFString ("MEDIUM")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "Shading",                new Fields .SFString ("GOURAUD")),
			new X3DFieldDefinition (X3DConstants .inputOutput, "MotionBlur",             new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "Gravity",                new Fields .SFFloat (9.80665)),
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

			this .configure ();
		},
		configure: function ()
		{
			var
				rubberband       = dataStorage ["BrowserOptions.Rubberband"],
				primitiveQuality = dataStorage ["BrowserOptions.PrimitiveQuality"],
				textureQuality   = dataStorage ["BrowserOptions.TextureQuality"];
				
			if (rubberband       !== undefined && rubberband       !== this .Rubberband_       .getValue ()) this .Rubberband_       = rubberband;
			if (primitiveQuality !== undefined && primitiveQuality !== this .PrimitiveQuality_ .getValue ()) this .PrimitiveQuality_ = primitiveQuality;
			if (textureQuality   !== undefined && textureQuality   !== this .TextureQuality_   .getValue ()) this .TextureQuality_   = textureQuality;
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

			this .configure ();
		},
		set_rubberband__: function (rubberband)
		{
			dataStorage ["BrowserOptions.Rubberband"] = rubberband .getValue ();
		},
		set_primitiveQuality__: function (primitiveQuality)
		{
			dataStorage ["BrowserOptions.PrimitiveQuality"] = primitiveQuality .getValue ();

			var
				arc2D    = this .getBrowser () .getArc2DOptions (),
				cone     = this .getBrowser () .getConeOptions (),
				cylinder = this .getBrowser () .getCylinderOptions (),
				sphere   = this .getBrowser () .getSphereOptions ();

			switch (primitiveQuality .getValue ())
			{
				case "LOW":
				{
					this .primitiveQuality = PrimitiveQuality .LOW;
				
					arc2D .minAngle_ = Math .PI / 10;

					cone     .vDimension_ = 16;
					cylinder .vDimension_ = 16;

					sphere .uDimension_ = 24;
					sphere .vDimension_ = 12;
					break;
				}
				case "HIGH":
				{
					this .primitiveQuality = PrimitiveQuality .HIGH;

					arc2D .minAngle_ = Math .PI / 40;

					cone     .vDimension_ = 32;
					cylinder .vDimension_ = 32;

					sphere .uDimension_ = 40;
					sphere .vDimension_ = 20;
					break;
				}
				default:
				{
					this .primitiveQuality = PrimitiveQuality .MEDIUM;

					arc2D .minAngle_ = Math .PI / 20;

					cone     .vDimension_ = 20;
					cylinder .vDimension_ = 20;

					sphere .uDimension_ = 32;
					sphere .vDimension_ = 16;
					break;
				}
			}
		},
		set_textureQuality__: function (textureQuality)
		{
			dataStorage ["BrowserOptions.TextureQuality"] = textureQuality .getValue ();

			switch (textureQuality .getValue ())
			{
				case "LOW":
					this .textureQuality = TextureQuality .LOW;
					break;
				case "HIGH":
					this .textureQuality = TextureQuality .HIGH;
					break;
				default:
					this .textureQuality = TextureQuality .MEDIUM;
					break;
			}
		},
		set_shading__: function (shading)
		{
			this .getBrowser () .setDefaultShader (shading .getValue ());
		},
	});

	return BrowserOptions;
});

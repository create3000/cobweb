
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTexture2DNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTexture2DNode, 
          X3DConstants,
          Algorithm)
{
	with (Fields)
	{
		function PixelTexture (executionContext)
		{
			X3DTexture2DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PixelTexture);
		}

		PixelTexture .prototype = $.extend (Object .create (X3DTexture2DNode .prototype),
		{
			constructor: PixelTexture,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "image",             new SFImage (0, 0, 0, [ ])),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatS",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "repeatT",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "textureProperties", new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "PixelTexture";
			},
			getComponentName: function ()
			{
				return "Texturing";
			},
			getContainerField: function ()
			{
				return "texture";
			},
			initialize: function ()
			{
				X3DTexture2DNode .prototype .initialize .call (this);

				this .addChildren ("loadState", new SFInt32 (X3DConstants .NOT_STARTED_STATE));

				this .image_ .addInterest (this, "set_image__");

				this .set_image__ ();
			},
			checkLoadState: function ()
			{
				return this .loadState_ .getValue ();
			},
			getData (data, comp, array)
			{
				switch (comp)
				{
					case 1:
					{
						for (var i = 0, index = 0, length = array .length; i < length; ++ i, index += 4)
						{
							var pixel = array [i] .getValue ();

							data [index] =
							data [index + 1] =
							data [index + 2] = pixel & 255;
							data [index + 3] = 255;
						}

						break;
					}
					case 2:
					{
						for (var i = 0, index = 0, length = array .length; i < length; ++ i, index += 4)
						{
							var pixel = array [i] .getValue ();

							data [index] =
							data [index + 1] =
							data [index + 2] = (pixel >>> 8) & 255;
							data [index + 3] = pixel & 255;
						}

						break;
					}
					case 3:
					{
						for (var i = 0, index = 0, length = array .length; i < length; ++ i, index += 4)
						{
							var pixel = array [i] .getValue ();

							data [index]     = (pixel >>> 16) & 255;
							data [index + 1] = (pixel >>>  8) & 255;
							data [index + 2] = pixel & 255;
							data [index + 3] = 255;
						}

						break;
					}
					case 4:
					{
						for (var i = 0, index = 0, length = array .length; i < length; ++ i, index += 4)
						{
							var pixel = array [i] .getValue ();

							data [index]     = (pixel >>> 24);
							data [index + 1] = (pixel >>> 16) & 255;
							data [index + 2] = (pixel >>>  8) & 255;
							data [index + 3] = pixel & 255;
						}

						break;
					}
				}
			},
			set_image__: function ()
			{
				var
					width       = this .image_ .width,
					height      = this .image_ .height,
					comp        = this .image_ .comp,
					array       = this .image_ .array .getValue (),
					transparent = ! (comp % 2),
					data        = null;
			
				if (width > 0 && height > 0 && comp > 0 && comp < 5)
				{
					if (Algorithm .isPowerOfTwo (width) && Algorithm .isPowerOfTwo (height))
					{
						data = new Uint8Array (width * height * 4);

						this .getData (data, comp, array);
					}
					else
					{
						var
							canvas1   = $("<canvas/>") [0],
							canvas2   = $("<canvas/>") [0],
							cx1       = canvas1 .getContext("2d"),
							cx2       = canvas2 .getContext("2d"),
							imageData = cx1 .createImageData (width, height);

						canvas1 .width  = width;
						canvas1 .height = height;

						this .getData (imageData .data, comp, array);
						cx1 .putImageData (imageData, 0, 0);

						width  = Algorithm .nextPowerOfTwo (width);
						height = Algorithm .nextPowerOfTwo (height);

						canvas2 .width  = width;
						canvas2 .height = height;
						
						cx2 .drawImage (canvas1, 0, 0, canvas1 .width, canvas1 .height, 0, 0, width, height);
		
						data = cx2 .getImageData (0, 0, width, height) .data;
					}

					this .setTexture (width, height, transparent, new Uint8Array (data), false);
					this .loadState_ = X3DConstants .COMPLETE_STATE;
				}
				else
				{
					this .clear ();
					this .loadState_ = X3DConstants .FAILED_STATE;
				}
			},
		});

		return PixelTexture;
	}
});


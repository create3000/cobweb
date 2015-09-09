
define ([
	"jquery",
],
function ($)
{
	function X3DKeyDeviceSensorContext ()
	{
		this .shiftKey = false;
		this .ctrlKey  = false;
		this .altKey   = false;
		this .altGrKey = false;
	}

	X3DKeyDeviceSensorContext .prototype =
	{
		initialize: function ()
		{
			this .getCanvas () .bind ("keydown.X3DKeyDeviceSensorContext", this .keydown .bind (this));
			this .getCanvas () .bind ("keyup.X3DKeyDeviceSensorContext",   this .keyup   .bind (this));
		},
		hasShiftKey: function ()
		{
			return this .shiftKey;
		},
		hasCtrlKey: function ()
		{
			return this .ctrlKey;
		},
		hasAltKey: function ()
		{
			return this .altKey;
		},
		hasAltGrKey: function ()
		{
			return this .altGrKey;
		},
		keydown: function (event)
		{
			event .preventDefault ();

			//console .log (event .which);

			switch (event .which)
			{
				case 16: // Shift
				{
					this .shiftKey = true;
					break;
				}
				case 17: // Ctrl
				{
					this .ctrlKey = true;
					break;
				}
				case 18: // Alt
				{
					this .altKey = true;
					break;
				}
				case 49: // 1
				{
					if (this .ctrlKey)
					{
						this .setBrowserOption ("Shading", "POINTSET");
						this .getNotification () .string_ = "Shading: Pointset";
					}
					break;
				}
				case 50: // 2
				{
					if (this .ctrlKey)
					{
						this .setBrowserOption ("Shading", "WIREFRAME");
						this .getNotification () .string_ = "Shading: Wireframe";
					}
				break;
				}
				case 51: // 3
				{
					if (this .ctrlKey)
					{
						this .setBrowserOption ("Shading", "FLAT");
						this .getNotification () .string_ = "Shading: Flat";
					}
					break;
				}
				case 52: // 4
				{
					if (this .ctrlKey)
					{
						this .setBrowserOption ("Shading", "GOURAUD");
						this .getNotification () .string_ = "Shading: Gouraud";
					}
					break;
				}
				case 53: // 5
				{
					if (this .ctrlKey)
					{
						this .setBrowserOption ("Shading", "PHONG");
						this .getNotification () .string_ = "Shading: Phong";
					}
					break;
				}
				case 77: // s
				{
					if (this .ctrlKey)
					{
						this .setMute (! this .getMute ());
						
						this .getNotification () .string_ = this .getMute () ? "Mute" : "Normal Volume";
					}

					break;
				}
				case 83: // s
				{
					if (this .ctrlKey)
					{
						if (this .isLive () .getValue ())
							this .endUpdate ();
						else
							this .beginUpdate ();
						
						this .getNotification () .string_ = this .isLive () .getValue () ? "Begin Update" : "End Update";
					}

					break;
				}
				case 112: // F1
				{
					this .setBrowserOption ("PrimitiveQuality", "LOW");
					this .getNotification () .string_ = "Primitive Quality: low";
					break;
				}
				case 113: // F2
				{
					this .setBrowserOption ("PrimitiveQuality", "MEDIUM");
					this .getNotification () .string_ = "Primitive Quality: medium";
					break;
				}
				case 114: // F3
				{
					this .setBrowserOption ("PrimitiveQuality", "HIGH");
					this .getNotification () .string_ = "Primitive Quality: high";
					break;
				}
				case 225: // Alt Gr
				{
					this .altGrKey = true;
					break;
				}
				case 171: // Plus
				{
					if (this .ctrlKey)
						this .getRenderingProperties () .setEnabled (!this .getRenderingProperties () .getEnabled ());
					break;
				}
				case 36: // Pos 1
				{
					this .firstViewpoint ();
					break;
				}
				case 35: // End
				{
					this .lastViewpoint ();
					break;
				}
				case 33: // Page Up
				{
					this .previousViewpoint ();
					break;
				}
				case 34: // Page Down
				{
					this .nextViewpoint ();
					break;
				}
			}
		},
		keyup: function (event)
		{
			event .preventDefault ();

			//console .log (event .which);

			switch (event .which)
			{
				case 16: // Shift
				{
					this .shiftKey = false;
					break;
				}
				case 17: // Ctrl
				{
					this .ctrlKey = false;
					break;
				}
				case 18: // Alt
				{
					this .altKey = false;
					break;
				}
				case 225: // Alt Gr
				{
					this .altGrKey = false;
					break;
				}
			}
		},
	};

	return X3DKeyDeviceSensorContext;
});

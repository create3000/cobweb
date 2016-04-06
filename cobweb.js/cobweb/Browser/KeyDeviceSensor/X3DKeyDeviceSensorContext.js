
define ([
	"jquery",
],
function ($)
{
"use strict";
	
	function X3DKeyDeviceSensorContext ()
	{
		this .keyDeviceSensorNode = null;

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
		setKeyDeviceSensorNode: function (value)
		{
			this .keyDeviceSensorNode = value;
		},
		getKeyDeviceSensorNode: function ()
		{
			return this .keyDeviceSensorNode;
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
			//console .log (event .which);

			event .preventDefault ();

			if (this .keyDeviceSensorNode)
			   this .keyDeviceSensorNode .keydown (event);
	
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
				case 225: // Alt Gr
				{
					this .altGrKey = true;
					break;
				}
				case 171: // Plus // Firefox
				case 187: // Plus // Opera
				{
					if (this .ctrlKey)
						this .getBrowserTimings () .enabled_ = ! this .getBrowserTimings () .enabled_ .getValue ();
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
			//console .log (event .which);

			event .preventDefault ();

			if (this .keyDeviceSensorNode)
			   this .keyDeviceSensorNode .keyup (event);

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

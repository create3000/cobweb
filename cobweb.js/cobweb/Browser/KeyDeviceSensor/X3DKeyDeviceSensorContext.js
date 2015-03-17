
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
						this .setBrowserOption ("Shading", "POINTSET");
					break;
				}
				case 50: // 2
				{
					if (this .ctrlKey)
						this .setBrowserOption ("Shading", "WIREFRAME");
				break;
				}
				case 51: // 3
				{
					if (this .ctrlKey)
						this .setBrowserOption ("Shading", "FLAT");
					break;
				}
				case 52: // 4
				{
					if (this .ctrlKey)
						this .setBrowserOption ("Shading", "GOURAUD");
					break;
				}
				case 53: // 5
				{
					if (this .ctrlKey)
						this .setBrowserOption ("Shading", "PHONG");
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

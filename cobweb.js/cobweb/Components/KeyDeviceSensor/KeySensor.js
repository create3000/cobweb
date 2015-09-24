
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/KeyDeviceSensor/X3DKeyDeviceSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DKeyDeviceSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
	   var
			KEY_F1  = 1,
			KEY_F2  = 2,
			KEY_F3  = 3,
			KEY_F4  = 4,
			KEY_F5  = 5,
			KEY_F6  = 6,
			KEY_F7  = 7,
			KEY_F8  = 8,
			KEY_F9  = 9,
			KEY_F10 = 10,
			KEY_F11 = 11,
			KEY_F12 = 12,

			KEY_HOME  = 13,
			KEY_END   = 14,
			KEY_PGUP  = 15,
			KEY_PGDN  = 16,
			KEY_UP    = 17,
			KEY_DOWN  = 18,
			KEY_LEFT  = 19,
			KEY_RIGHT = 20,

			Control_R = 1,
			Control_L = 2,
			Shift_R   = 1,
			Shift_L   = 2;

		function KeySensor (executionContext)
		{
			X3DKeyDeviceSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .KeySensor);
		}

		KeySensor .prototype = $.extend (Object .create (X3DKeyDeviceSensorNode .prototype),
		{
			constructor: KeySensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "controlKey",       new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "shiftKey",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "altKey",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "actionKeyPress",   new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "actionKeyRelease", new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "keyPress",         new SFString ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "keyRelease",       new SFString ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",         new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "KeySensor";
			},
			getComponentName: function ()
			{
				return "KeyDeviceSensor";
			},
			getContainerField: function ()
			{
				return "children";
			},
			keydown: function (event)
			{
				switch (event .which)
				{
					case 16: // Shift
						this .shiftKey_ = true;
						break;
					case 17: // Ctrl
						this .controlKey_ = true;
						break;
					case 18: // Alt
						this .altKey_ = true;
						break;
					//////////////////////////////////
					case 112:
						this .actionKeyPress_ = KEY_F1;
						break;
					case 113:
						this .actionKeyPress_ = KEY_F2;
						break;
					case 114:
						this .actionKeyPress_ = KEY_F3;
						break;
					case 115:
						this .actionKeyPress_ = KEY_F4;
						break;
					case 116:
						this .actionKeyPress_ = KEY_F5;
						break;
					case 117:
						this .actionKeyPress_ = KEY_F6;
						break;
					case 118:
						this .actionKeyPress_ = KEY_F7;
						break;
					case 119:
						this .actionKeyPress_ = KEY_F8;
						break;
					case 120:
						this .actionKeyPress_ = KEY_F9;
						break;
					case 121:
						this .actionKeyPress_ = KEY_F10;
						break;
					case 122:
						this .actionKeyPress_ = KEY_F11;
						break;
					case 123:
						this .actionKeyPress_ = KEY_F12;
						break;
					////////////////////////////////////
					case 36:
						this .actionKeyPress_ = KEY_HOME;
						break;
					case 35:
						this .actionKeyPress_ = KEY_END;
						break;
					case 33:
						this .actionKeyPress_ = KEY_PGUP;
						break;
					case 34:
						this .actionKeyPress_ = KEY_PGDN;
						break;
					case 38:
						this .actionKeyPress_ = KEY_UP;
						break;
					case 40:
						this .actionKeyPress_ = KEY_DOWN;
						break;
					case 37:
						this .actionKeyPress_ = KEY_LEFT;
						break;
					case 39:
						this .actionKeyPress_ = KEY_RIGHT;
						break;
					////////////////////////////////////
					default:
					{
					   if (event .charCode)
					      this .keyPress_ = event .key;
					   break;
					}
				}
			},
			keyup: function (event)
			{
				switch (event .which)
				{
					case 16: // Shift
					{
						this .shiftKey_ = false;
						break;
					}
					case 17: // Ctrl
					{
						this .controlKey_ = false;
						break;
					}
					case 18: // Alt
					{
						this .altKey_ = false;
						break;
					}
					//////////////////////////////////
					case 112:
						this .actionKeyRelease_ = KEY_F1;
						break;
					case 113:
						this .actionKeyRelease_ = KEY_F2;
						break;
					case 114:
						this .actionKeyRelease_ = KEY_F3;
						break;
					case 115:
						this .actionKeyRelease_ = KEY_F4;
						break;
					case 116:
						this .actionKeyRelease_ = KEY_F5;
						break;
					case 117:
						this .actionKeyRelease_ = KEY_F6;
						break;
					case 118:
						this .actionKeyRelease_ = KEY_F7;
						break;
					case 119:
						this .actionKeyRelease_ = KEY_F8;
						break;
					case 120:
						this .actionKeyRelease_ = KEY_F9;
						break;
					case 121:
						this .actionKeyRelease_ = KEY_F10;
						break;
					case 122:
						this .actionKeyRelease_ = KEY_F11;
						break;
					case 123:
						this .actionKeyRelease_ = KEY_F12;
						break;
					////////////////////////////////////
					case 36:
						this .actionKeyRelease_ = KEY_HOME;
						break;
					case 35:
						this .actionKeyRelease_ = KEY_END;
						break;
					case 33:
						this .actionKeyRelease_ = KEY_PGUP;
						break;
					case 34:
						this .actionKeyRelease_ = KEY_PGDN;
						break;
					case 38:
						this .actionKeyRelease_ = KEY_UP;
						break;
					case 40:
						this .actionKeyRelease_ = KEY_DOWN;
						break;
					case 37:
						this .actionKeyRelease_ = KEY_LEFT;
						break;
					case 39:
						this .actionKeyRelease_ = KEY_RIGHT;
						break;
					////////////////////////////////////
					default:
					{
					   if (event .charCode)
					      this .keyRelease_ = event .key;
					   break;
					}
				}
			},
			release: function ()
			{
				if (this .shiftKey_ .getValue ())
					this .shiftKey_ = false;

				if (this .controlKey_ .getValue ())
					this .controlKey_ = false;

				if (this .altKey_ .getValue ())
					this .altKey_ = false;
			},
		});

		return KeySensor;
	}
});


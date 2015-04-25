
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Geometry/Box3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentalSensorNode,
          TraverseType,
          X3DConstants,
          Vector3,
          Box3)
{
	with (Fields)
	{
		var unlimited = new Vector3 (-1, -1, -1);
	
		function VisibilitySensor (executionContext)
		{
			X3DEnvironmentalSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .VisibilitySensor);

			this .visible = false;
		}

		VisibilitySensor .prototype = $.extend (Object .create (X3DEnvironmentalSensorNode .prototype),
		{
			constructor: VisibilitySensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",   new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "size",      new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "center",    new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "enterTime", new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "exitTime",  new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",  new SFBool ()),
			]),
			size: new Vector3 (0, 0, 0),
			center: new Vector3 (0, 0, 0),
			getTypeName: function ()
			{
				return "VisibilitySensor";
			},
			getComponentName: function ()
			{
				return "EnvironmentalSensor";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DEnvironmentalSensorNode .prototype .initialize .call (this);
			},
			update: function ()
			{
				this .setTraversed (false);

				if (this .visible)
				{
					if (! this .isActive_ .getValue ())
					{
						this .isActive_  = true;
						this .enterTime_ = this .getBrowser () .getCurrentTime ();
					}

					this .visible = false;
				}
				else
				{
					if (this .isActive_ .getValue ())
					{
						this .isActive_ = false;
						this .exitTime_ = this .getBrowser () .getCurrentTime ();
					}
				}
			},
			traverse: function (type)
			{
			   switch (type)
			   {
					case TraverseType .CAMERA:
					{
						if (! this .enabled_ .getValue () || this .visible)
							return;

						if (this .size_ .getValue () .equals (unlimited))
							this .visible = true;

						else
						{
							var
								viewVolumes     = this .getCurrentLayer () .getViewVolumeStack (),
								modelViewMatrix = this .getModelViewMatrix (type),
								size            = modelViewMatrix .multDirMatrix (this .size .assign (this .size_ .getValue ())),
								center          = modelViewMatrix .multVecMatrix (this .center .assign (this .center_ .getValue ()));

							this .visible = viewVolumes [viewVolumes .length - 1] .intersectsSphere (size .abs () / 2, center);
						}

						break;
					}
					case TraverseType .DISPLAY:
						this .setTraversed (true);
						break;
				}
			},
		});

		return VisibilitySensor;
	}
});


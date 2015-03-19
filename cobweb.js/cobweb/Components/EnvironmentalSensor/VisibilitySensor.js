
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

		VisibilitySensor .prototype = $.extend (new X3DEnvironmentalSensorNode (),
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

				this .size_   .addInterest (this, "set_bbox__");
				this .center_ .addInterest (this, "set_bbox__");

				this .set_bbox__ ();
			},
			set_bbox__: function ()
			{
				this .bbox = new Box3 (this .size_ .getValue (), this .center_ .getValue ());
			},
			update: function ()
			{
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
				if (TraverseType .CAMERA)
				{
					if (! this .enabled_ .getValue () || this .visible)
						return;

					if (this .size_ .getValue () .equals (unlimited))
						this .visible = true;

					else
					{
						var
							viewVolumes = this .getCurrentLayer () .getViewVolumeStack (),
							bbox        = this .bbox .copy () .multRight (this .getModelViewMatrix (type));

						this .visible = viewVolumes [viewVolumes .length - 1] .intersects (bbox .size, bbox .center);
					}
				}
			},
		});

		return VisibilitySensor;
	}
});



define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
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
          Rotation4,
          Matrix4,
          Box3)
{
	with (Fields)
	{
		var unlimited = new Vector3 (-1, -1, -1);
	
		function ProximitySensor (executionContext)
		{
			X3DEnvironmentalSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ProximitySensor);

			this .viewpoint          = null;
			this .modelViewMatrix    = new Matrix4 ();
			this .invModelViewMatrix = new Matrix4 ();
			this .rotation           = new Rotation4 ();
			this .inside             = false;
		}

		ProximitySensor .prototype = $.extend (new X3DEnvironmentalSensorNode (),
		{
			constructor: ProximitySensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                 new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",                  new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "size",                     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "center",                   new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "enterTime",                new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "exitTime",                 new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",                 new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "position_changed",         new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "orientation_changed",      new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "centerOfRotation_changed", new SFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "ProximitySensor";
			},
			getComponentName: function ()
			{
				return "EnvironmentalSensor";
			},
			getContainerField: function ()
			{
				return "children";
			},
			update: function ()
			{
				try
				{
					if (this .inside)
					{
						var centerOfRotationMatrix = this .viewpoint .getParentMatrix ();
						centerOfRotationMatrix .translate (this .viewpoint .getUserCenterOfRotation ());
						centerOfRotationMatrix .multRight (this .invModelViewMatrix .assign (this .modelViewMatrix) .inverse ());

						this .modelViewMatrix .multRight (this .viewpoint .getInverseCameraSpaceMatrix ());
						this .modelViewMatrix .get (null, this .rotation);

						var position         = this .modelViewMatrix .inverse () .origin;
						var orientation      = this .rotation .inverse ();
						var centerOfRotation = centerOfRotationMatrix .origin;

						if (this .isActive_ .getValue ())
						{
							if (! this .position_changed_ .getValue () .equals (position))
								this .position_changed_ = position;

							if (! this .orientation_changed_ .getValue () .equals (orientation))
								this .orientation_changed_ = orientation;

							if (! this .centerOfRotation_changed_ .getValue () .equals (centerOfRotation))
								this .centerOfRotation_changed_ = centerOfRotation;
						}
						else
						{
							this .isActive_  = true;
							this .enterTime_ = this .getBrowser () .getCurrentTime ();

							this .position_changed_         = position;
							this .orientation_changed_      = orientation;
							this .centerOfRotation_changed_ = centerOfRotation;
						}

						this .inside = false;
					}
					else
					{
						if (this .isActive_ .getValue ())
						{
							this .isActive_ = false;
							this .exitTime_ = this .getBrowser () .getCurrentTime ();
						}
					}
				}
				catch (error)
				{
					//console .log (error .message);
				}
			},
			traverse: function (type)
			{
				try
				{
					switch (type)
					{
						case TraverseType .CAMERA:
						{
							this .viewpoint = this .getCurrentViewpoint ();
							this .modelViewMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());
							return;
						}
						case TraverseType .DISPLAY:
						{
							if (this .inside)
								return;

							if (this .size_ .getValue () .equals (unlimited))
								this .inside = true;

							else
							{
								var box    = new Box3 (this .size_ .getValue (), this .center_ .getValue ());
								var viewer = this .invModelViewMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ()) .inverse () .origin;

								this .inside = box .intersectsPoint (viewer);
							}

							return;
						}
					}
				}
				catch (error)
				{
					//console .log (error);
				}
			},
		});

		return ProximitySensor;
	}
});


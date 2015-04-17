
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/PointingDeviceSensor/X3DDragSensorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Line3",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Geometry/Cylinder3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDragSensorNode, 
          X3DConstants,
          Vector3,
          Rotation4,
          Matrix4,
          Line3,
          Plane3,
          Cylinder3,
          Algorithm)
{
	with (Fields)
	{
		function CylinderSensor (executionContext)
		{
			X3DDragSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CylinderSensor);
		}

		CylinderSensor .prototype = $.extend (new X3DDragSensorNode (),
		{
			constructor: CylinderSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",            new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",        new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "axisRotation",       new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "diskAngle",          new SFFloat (0.261799)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "minAngle",           new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "maxAngle",           new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "offset",             new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "autoOffset",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "trackPoint_changed", new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "rotation_changed",   new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isOver",             new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",           new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "CylinderSensor";
			},
			getComponentName: function ()
			{
				return "PointingDeviceSensor";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DDragSensorNode .prototype .initialize .call (this);

				this .modelViewMatrix    = new Matrix4 ();
				this .invModelViewMatrix = new Matrix4 ();

				this .cylinder    = new Cylinder3 (new Line3 (new Vector3 (0, 0, 0), new Vector3 (0, 0, 0)), 0);
				this .disk        = false;
				this .yPlane      = null;
				this .zPlane      = null;
				this .sxPlane     = null;
				this .szNormal    = null;
				this .behind      = false;
				this .fromVector  = new Vector3 (0, 0, 0);
				this .startOffset = new Rotation4 (0, 0, 1, 0);
			},
			isBehind: function (hitRay, hitPoint)
			{
				var
					enter = new Vector3 (0, 0 ,0),
					exit  = new Vector3 (0, 0, 0);

				this .cylinder .intersectsLine (hitRay, enter, exit);

				return Vector3 .subtract (hitPoint, enter) .abs () > Vector3 .subtract (hitPoint, exit) .abs ();
			},
			getTrackPoint: function (hitRay, trackPoint)
			{
				var zPoint = new Vector3 (0, 0, 0);

				this .zPlane .intersectsLine (hitRay, zPoint);

				var
					axisPoint = Vector3 .add (zPoint, this .cylinder .axis .getPerpendicularVector (zPoint)),
					distance  = this .sxPlane .getDistanceToPoint (zPoint) / this .cylinder .radius,
					section   = Math .floor ((distance + 1) / 2);

				// Use asin on the cylinder and outside linear angle.
				var
					sinp  = Algorithm .interval (distance, -1, 1),
					phi   = section === 0 ? Math .asin (sinp) : sinp * Math .PI / 2,
					angle = phi + section * Math .PI;

				var rotation = new Rotation4 (this .cylinder .axis .direction, angle);

				rotation .multVecRot (trackPoint .assign (this .szNormal) .multiply (this .cylinder .radius));
				trackPoint .add (axisPoint);
			},
			getAngle: function (rotation)
			{
				if (Vector3 .dot (rotation .getAxis (), this .cylinder .axis .direction) > 0)
					return rotation .angle;

				else
					return -rotation .angle;
			},
			set_active__: function (hit, active)
			{
				X3DDragSensorNode .prototype .set_active__ .call (this, hit, active);

				try
				{
					if (this .isActive_ .getValue ())
					{
						var matrices = this .getMatrices () [hit .layer .getId ()];

						this .modelViewMatrix .assign (matrices .modelViewMatrix);
						this .invModelViewMatrix .assign (this .modelViewMatrix) .inverse ();

						var
							hitRay   = hit .hitRay .copy () .multLineMatrix (this .invModelViewMatrix),
							hitPoint = this .invModelViewMatrix .multVecMatrix (hit .intersection .point .copy ());

						var
							yAxis      = this .axisRotation_ .getValue () .multVecRot (new Vector3 (0, 1, 0)),
							cameraBack = this .invModelViewMatrix .multDirMatrix (new Vector3 (0, 0, 1)) .normalize ();

						var
							axis   = new Line3 (new Vector3 (0, 0, 0), yAxis),
							radius = axis .getPerpendicularVector (hitPoint) .abs ();

						this .cylinder = new Cylinder3 (axis, radius);

						this .disk   = Math .abs (Vector3 .dot (cameraBack, yAxis)) > Math .cos (this .diskAngle_ .getValue ());
						this .behind = this .isBehind (hitRay, hitPoint);

						this .yPlane = new Plane3 (hitPoint, yAxis);             // Sensor aligned y-plane
						this .zPlane = new Plane3 (hitPoint, cameraBack);        // Screen aligned z-plane

						// Compute normal like in Billboard with yAxis as axis of rotation.
						var
							billboardToViewer = this .invModelViewMatrix .origin .normalize (),
							sxNormal          = Vector3 .cross (yAxis, billboardToViewer) .normalize ();

						this .sxPlane  = new Plane3 (new Vector3 (0, 0, 0), sxNormal);   // Billboarded special x-plane made parallel to sensors axis.
						this .szNormal = Vector3 .cross (sxNormal, yAxis) .normalize (); // Billboarded special z-normal made parallel to sensors axis.

						var trackPoint = new Vector3 (0, 0, 0);

						if (this .disk)
							this .yPlane .intersectsLine (hitRay, trackPoint);
						else
							this .getTrackPoint (hitRay, trackPoint);

						this .fromVector  = this .cylinder .axis .getPerpendicularVector (trackPoint) .negate ();
						this .startOffset = new Rotation4 (yAxis, this .offset_ .getValue ());
					}
					else
					{
						if (this .autoOffset_ .getValue ())
							this .offset_ = this .getAngle (this .rotation_changed_ .getValue ());
					}
				}
				catch (error)
				{
					//console .log (error);
				}
			},
			set_motion__: function (hit)
			{
				try
				{
					var
						hitRay     = hit .hitRay .copy () .multLineMatrix (this .invModelViewMatrix),
						trackPoint = new Vector3 (0, 0, 0);

					if (this .disk)
						this .yPlane .intersectsLine (hitRay, trackPoint);
					else
						this .getTrackPoint (hitRay, trackPoint);

					this .trackPoint_changed_ = trackPoint;

					var
						toVector = this .cylinder .axis .getPerpendicularVector (trackPoint) .negate (),
						rotation = new Rotation4 (this .fromVector, toVector);

					if (this .disk)
					{
						// The trackpoint can swap behind the viewpoint if viewpoint is a Viewpoint node
						// as the viewing volume is not a cube where the picking ray goes straight up.
						// This phenomenon is very clear on the viewport corners.

						var trackPoint_ = this .modelViewMatrix .multVecMatrix (trackPoint .copy ());

						if (trackPoint_ .z > 0)
							rotation .multRight (new Rotation4 (this .yPlane .normal, Math .PI));
					}
					else
					{
						if (this .behind)
							rotation .inverse ();
					}

					rotation .multLeft (this .startOffset);

					if (this .minAngle_ .getValue () > this .maxAngle_ .getValue ())
						this .rotation_changed_ = rotation;

					else
					{
						var
							angle = Algorithm .interval (this .getAngle (rotation),    -Math .PI, Math .PI),
							min   = Algorithm .interval (this .minAngle_ .getValue (), -Math .PI, Math .PI),
							max   = Algorithm .interval (this .maxAngle_ .getValue (), -Math .PI, Math .PI);

						if (angle > min && angle < max)
							this .rotation_change_ = rotation;
					}
				}
				catch (error)
				{
					//console .log (error);

					this .trackPoint_changed_ .addEvent ();
					this .rotation_changed_   .addEvent ();
				}
			},
		});

		return CylinderSensor;
	}
});


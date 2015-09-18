
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
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Geometry/Line3",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Geometry/Sphere3",
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
          Triangle3,
          Line3,
          Plane3,
          Sphere3)
{
	with (Fields)
	{
		function SphereSensor (executionContext)
		{
			X3DDragSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .SphereSensor);
		}

		SphereSensor .prototype = $.extend (Object .create (X3DDragSensorNode .prototype),
		{
			constructor: SphereSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",            new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",        new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "autoOffset",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "offset",             new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "trackPoint_changed", new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "rotation_changed",   new SFRotation ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isOver",             new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",           new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "SphereSensor";
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

				this .sphere      = null;
				this .zPlane      = null;
				this .behind      = false;
				this .fromVector  = new Vector3 (0, 0, 0);
				this .startPoint  = new Vector3 (0, 0, 0);
				this .startOffset = new Rotation4 (0, 0, 1, 0);
			},
			getTrackPoint: function (hitRay, trackPoint, behind)
			{
				var exit = new Vector3 (0, 0, 0);

				if (this .sphere .intersectsLine (hitRay, trackPoint, exit))
				{
					if ((Vector3 .subtract (hitRay .point, exit) .abs () < Vector3 .subtract (hitRay .point, trackPoint) .abs ()) - behind)
						trackPoint .assign (exit);

					return true;
				}

				return false;
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
							hitPoint = this .invModelViewMatrix .multVecMatrix (hit .intersection .point .copy ()),
							center   = new Vector3 (0, 0, 0);

						this .zPlane = new Plane3 (center, this .invModelViewMatrix .multDirMatrix (new Vector3 (0, 0, 1)) .normalize ()); // Screen aligned Z-plane
						this .sphere = new Sphere3 (hitPoint .abs (), center);
						this .behind = this .zPlane .getDistanceToPoint (hitPoint) < 0;

						this .fromVector  .assign (hitPoint);
						this .startPoint  .assign (hitPoint);
						this .startOffset .assign (this .offset_ .getValue ());
					}
					else
					{
						if (this .autoOffset_ .getValue ())
							this .offset_ = this .rotation_changed_;
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

					if (this .getTrackPoint (hitRay, trackPoint, this .behind))
					{
						var zAxis = this .invModelViewMatrix .multDirMatrix (new Vector3 (0, 0, 1)) .normalize (); // Camera direction
						this .zPlane = new Plane3 (trackPoint, zAxis);                                             // Screen aligned Z-plane
					}
					else
					{
						// Find trackPoint on the plane with sphere

						var tangentPoint = new Vector3 (0, 0, 0);
						this .zPlane .intersectsLine (hitRay, tangentPoint);

						hitRay = new Line3 (tangentPoint, Vector3 .subtract (this .sphere .center, tangentPoint) .normalize ());
						
						//console .log (hitRay .toString ());

						this .getTrackPoint (hitRay, trackPoint, false);

						// Find trackPoint behind sphere

						var
							triNormal     = Triangle3 .normal (this .sphere .center, trackPoint, this .startPoint, new Vector3 (0, 0, 0)),
							dirFromCenter = Vector3 .subtract (trackPoint, this .sphere .center) .normalize (),
							normal        = Vector3 .cross (triNormal, dirFromCenter) .normalize ();

						var point1 = Vector3 .subtract (trackPoint, normal .multiply (Vector3 .subtract (tangentPoint, trackPoint) .abs ()));

						hitRay = new Line3 (point1, Vector3 .subtract (this .sphere .center, point1) .normalize ());

						this .getTrackPoint (hitRay, trackPoint, false);
					}

					this .trackPoint_changed_ = trackPoint;

					var
						toVector = Vector3 .subtract (trackPoint, this .sphere .center),
						rotation = new Rotation4 (this .fromVector, toVector);

					if (this .behind)
						rotation .inverse ();

					this .rotation_changed_ = Rotation4 .multRight (this .startOffset, rotation);
				}
				catch (error)
				{
					//console .log (error);

					this .trackPoint_changed_ .addEvent ();
					this .rotation_changed_   .addEvent ();
				}
			},
		});

		return SphereSensor;
	}
});


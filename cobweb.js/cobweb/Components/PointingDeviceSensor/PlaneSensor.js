
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/PointingDeviceSensor/X3DDragSensorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Geometry/Line3",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Geometry/ViewVolume",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDragSensorNode, 
          X3DConstants,
          Rotation4,
          Vector3,
          Vector4,
          Matrix4,
          Line3,
          Plane3,
          ViewVolume,
          Algorithm)
{
"use strict";

	function PlaneSensor (executionContext)
	{
		X3DDragSensorNode .call (this, executionContext);

		this .addType (X3DConstants .PlaneSensor);
	}

	PlaneSensor .prototype = $.extend (Object .create (X3DDragSensorNode .prototype),
	{
		constructor: PlaneSensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",            new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "description",         new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "axisRotation",        new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "autoOffset",          new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "offset",              new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "minPosition",         new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "maxPosition",         new Fields .SFVec2f (-1, -1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "trackPoint_changed",  new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "translation_changed", new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isOver",              new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",            new Fields .SFBool ()),
		]),
		getTypeName: function ()
		{
			return "PlaneSensor";
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
			this .projectionMatrix   = new Matrix4 ();
			this .viewport           = new Vector4 ();

			this .planeSensor = true;
			this .plane       = null;
			this .line        = null;
			this .startOffset = new Vector3 (0, 0, 0);
			this .startPoint  = new Vector3 (0, 0, 0);
		},
		getLineTrackPoint: function (hit, line, trackPoint)
		{
			var
				screenLine     = ViewVolume .projectLine (line, this .modelViewMatrix, this .projectionMatrix, this .viewport),
				trackPoint1    = screenLine .getClosestPointToPoint (new Vector3 (hit .pointer .x, hit .pointer .y, 0)),
				trackPointLine = ViewVolume .unProjectLine (trackPoint1 .x, trackPoint1 .y, this .modelViewMatrix, this .projectionMatrix, this .viewport);

			return line .getClosestPointToLine (trackPointLine, trackPoint);
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
					this .projectionMatrix .assign (matrices .projectionMatrix);
					this .viewport .assign (matrices .viewport);
					this .invModelViewMatrix .assign (this .modelViewMatrix) .inverse ();

					var
						hitRay   = hit .hitRay .copy () .multLineMatrix (this .invModelViewMatrix),
						hitPoint = this .invModelViewMatrix .multVecMatrix (hit .intersection .point .copy ());

					var axisRotation = this .axisRotation_ .getValue ();

					if (this .minPosition_ .x === this .maxPosition_ .x)
					{
						this .planeSensor = false;

						var direction = axisRotation .multVecRot (new Vector3 (0, Math .abs (this .maxPosition_ .y - this .minPosition_ .y), 0));

						this .line = new Line3 (hitPoint, direction .normalize ());
					}
					else if (this .minPosition_ .y === this .maxPosition_ .y)
					{
						this .planeSensor = false;

						var direction = axisRotation .multVecRot (new Vector3 (Math .abs (this .maxPosition_ .x - this .minPosition_ .x), 0, 0));

						this .line = new Line3 (hitPoint, direction .normalize ());
					}
					else
					{
						this .planeSensor = true;
						this .plane       = new Plane3 (hitPoint, axisRotation .multVecRot (new Vector3 (0, 0, 1)));
					}

					if (this .planeSensor)
						this .plane .intersectsLine (hitRay, this .startPoint);

					else
						this .getLineTrackPoint (hit, this .line, this .startPoint);

					this .startOffset .assign (this .offset_ .getValue ());
				}
				else
				{
					if (this .autoOffset_ .getValue ())
						this .offset_ = this .translation_changed_;
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
				if (this .planeSensor)
				{
					var hitRay = hit .hitRay .copy () .multLineMatrix (this .invModelViewMatrix);

					var
						endPoint   = new Vector3 (0, 0, 0),
						trackPoint = new Vector3 (0, 0, 0);

					if (this .plane .intersectsLine (hitRay, endPoint))
					{
						new Plane3 (new Vector3 (0, 0, 0), this .plane .normal) .intersectsLine (hitRay, trackPoint);

						this .track (endPoint, trackPoint);
					}
					else
						throw new Error ("Plane and line are parallel.");
				}
				else
				{
					var
						endPoint   = new Vector3 (0, 0, 0),
						trackPoint = new Vector3 (0, 0, 0);

					if (this .getLineTrackPoint (hit, this .line, endPoint))
					{
						try
						{
							this .getLineTrackPoint (hit, new Line3 (Vector3 .Zero, this .line .direction), trackPoint);
						}
						catch (error)
						{
							//console .log (error);

							trackPoint = endPoint;
						}
					
						this .track (endPoint, trackPoint);
					}
					else
						throw new Error ("Lines are parallel.");
				}
			}
			catch (error)
			{
				//console .log (error);

				this .trackPoint_changed_  .addEvent ();
				this .translation_changed_ .addEvent ();
			}
		},
		track: function (endPoint, trackPoint)
		{
			var
				axisRotation = this .axisRotation_ .getValue (),
				translation  = Rotation4 .inverse (axisRotation) .multVecRot (endPoint .add (this .startOffset) .subtract (this .startPoint));

			// X component

			if (! (this .minPosition_ .x > this .maxPosition_ .x))
				translation .x = Algorithm .clamp (translation .x, this .minPosition_ .x, this .maxPosition_ .x);

			// Y component

			if (! (this .minPosition_ .y > this .maxPosition_ .y))
				translation .y = Algorithm .clamp (translation .y, this .minPosition_ .y, this .maxPosition_ .y);

			axisRotation .multVecRot (translation);

			if (! this .trackPoint_changed_ .getValue () .equals (trackPoint))
				this .trackPoint_changed_ = trackPoint;

			if (! this .translation_changed_ .getValue () .equals (translation))
				this .translation_changed_ = translation;
		},
	});

	return PlaneSensor;
});



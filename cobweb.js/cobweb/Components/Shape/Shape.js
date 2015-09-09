
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DShapeNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Algorithm",
	"standard/Math/Geometry/Line3",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Geometry/ViewVolume",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShapeNode, 
          TraverseType,
          X3DConstants,
          Algorithm,
          Line3,
          Vector3,
          Matrix4,
          QuickSort,
          ViewVolume)
{
	with (Fields)
	{
		var intersections = [ ];

		function Shape (executionContext)
		{
			X3DShapeNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Shape);
		}

		Shape .prototype = $.extend (Object .create (X3DShapeNode .prototype),
		{
			constructor: Shape,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "appearance", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "geometry",   new SFNode ()),
			]),
			invModelViewMatrix: new Matrix4 (),
			hitRay: new Line3 (new Vector3 (0, 0, 0), new Vector3 (0, 0, 0)),
			intersections: intersections,
			intersectionSorter: new QuickSort (intersections, function (lhs, rhs)
			{
				return lhs .point .z > rhs .point .z;
			}),
			getTypeName: function ()
			{
				return "Shape";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "children";
			},
			traverse: function (type)
			{
				if (this .getGeometry ())
				{
					switch (type)
					{
						case TraverseType .POINTER:
							this .pointer ();
							break;

						case TraverseType .COLLISION:
							this .getCurrentLayer () .addCollision (this);
							break;

						case TraverseType .DISPLAY:
							this .getCurrentLayer () .addShape (this);
							break;
					}
				}
			},
			pointer: function ()
			{
				try
				{
					if (this .getGeometry () .isLineGeometry ())
						return;

					var
						browser            = this .getBrowser (),
						modelViewMatrix    = browser .getModelViewMatrix () .get (),
						invModelViewMatrix = this .invModelViewMatrix .assign (modelViewMatrix) .inverse (),
						intersections      = this .intersections;

					this .hitRay .assign (browser .getHitRay ()) .multLineMatrix (invModelViewMatrix);

					if (this .getGeometry () .intersectsLine (this .hitRay, intersections))
					{
						// Finally we have intersections and must now find the closest hit in front of the camera.

						// Transform hitPoints to absolute space.
						for (var i = 0; i < intersections .length; ++ i)
							modelViewMatrix .multVecMatrix (intersections [i] .point);

						this .intersectionSorter .sort (0, intersections .length);

						// Find first point that is not greater than near plane;
						var index = Algorithm .lowerBound (intersections, 0, intersections .length, -this .getCurrentNavigationInfo () .getNearPlane (),
						                                   function (lhs, rhs)
						                                   {
						                                      return lhs .point .z > rhs;
						                                   });

						// Are there intersections before the camera?
						if (index !== intersections .length)
						{
							// Transform hitNormal to absolute space.
							invModelViewMatrix .multMatrixDir (intersections [index] .normal) .normalize ();

							browser .addHit (intersections [index], this .getCurrentLayer ());
						}

						intersections .length = 0;
					}
				}
				catch (error)
				{
					//console .log (error);
				}
			},
			draw: function (context)
			{
				this .getAppearance () .traverse ();
				this .getGeometry ()   .traverse (context);
			},
		});

		return Shape;
	}
});


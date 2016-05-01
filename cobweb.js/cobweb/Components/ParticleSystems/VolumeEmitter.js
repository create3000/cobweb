
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticleEmitterNode",
	"cobweb/Components/Geometry3D/IndexedFaceSet",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Geometry/Line3",
	"standard/Math/Geometry/Plane3",
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Algorithm",
	"standard/Math/Utility/BVH",
	"standard/Math/Algorithms/QuickSort",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticleEmitterNode,
          IndexedFaceSet,
          X3DConstants,
          Vector3,
          Rotation4,
          Line3,
          Plane3,
          Triangle3,
          Algorithm,
          BVH,
          QuickSort)
{
"use strict";

	var
		vertex1  = new Vector3 (0, 0, 0),
		vertex2  = new Vector3 (0, 0, 0),
		vertex3  = new Vector3 (0, 0, 0),
		point    = new Vector3 (0, 0, 0),
		normal   = new Vector3 (0, 0, 0),
		rotation = new Rotation4 (0, 0, 1, 0),
		line     = new Line3 (Vector3 .Zero, Vector3 .zAxis),
		plane    = new Plane3 (Vector3 .Zero, Vector3 .zAxis);

	function VolumeEmitter (executionContext)
	{
		X3DParticleEmitterNode .call (this, executionContext);

		this .addType (X3DConstants .VolumeEmitter);

		this .direction      = new Vector3 (0, 0, 0);
		this .surfaceNode    = new IndexedFaceSet (executionContext);
		this .areaSoFarArray = [ 0 ];
		this .points         = [ ];
		this .normals        = [ ];
		this .sorter         = new QuickSort (this .points, function (a, b) { return plane .getDistanceToPoint (a) < plane .getDistanceToPoint (b); });
	}

	VolumeEmitter .prototype = $.extend (Object .create (X3DParticleEmitterNode .prototype),
	{
		constructor: VolumeEmitter,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "internal",    new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "direction",   new Fields .SFVec3f (0, 1, 0)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",       new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "variation",   new Fields .SFFloat (0.25)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "mass",        new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "surfaceArea", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coordIndex",  new Fields .MFInt32 (-1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",       new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "VolumeEmitter";
		},
		getComponentName: function ()
		{
			return "ParticleSystems";
		},
		getContainerField: function ()
		{
			return "emitter";
		},
		initialize: function ()
		{
			X3DParticleEmitterNode .prototype .initialize .call (this);

			this .direction_ .addInterest (this, "set_direction__");

			this .coordIndex_ .addFieldInterest (this .surfaceNode .coordIndex_);
			this .coord_      .addFieldInterest (this .surfaceNode .coord_);
	
			this .surfaceNode .creaseAngle_ = 0;
			this .surfaceNode .convex_      = false;
			this .surfaceNode .coordIndex_  = this .coordIndex_;
			this .surfaceNode .coord_       = this .coord_;

			this .surfaceNode .addInterest (this, "set_geometry__");
			this .surfaceNode .setup ();

			this .set_geometry__ ();
		},
		set_direction__: function ()
		{
			this .direction .assign (this .direction_ .getValue ()) .normalize ();

			if (this .direction .equals (Vector3 .Zero))
				this .getRandomVelocity = this .getSphericalRandomVelocity;
			else
				delete this .getRandomVelocity;
		},
		set_geometry__: function ()
		{
			var
				areaSoFar      = 0,
				areaSoFarArray = this .areaSoFarArray,
				vertices       = this .surfaceNode .getVertices (),
				normals        = this .surfaceNode .getNormals ();
	
			areaSoFarArray .length = 1;

			for (var i = 0, length = vertices .length; i < length; i += 12)
			{
				vertex1 .set (vertices [i + 0], vertices [i + 1], vertices [i + 2]);
				vertex2 .set (vertices [i + 4], vertices [i + 5], vertices [i + 6]);
				vertex3 .set (vertices [i + 8], vertices [i + 9], vertices [i + 10]);

				areaSoFar += Triangle3 .area (vertex1, vertex2, vertex3);
				areaSoFarArray .push (areaSoFar);
			}

			this .bvh = new BVH (vertices, normals);
		},
		getRandomPosition: function (position)
		{
			// Get random point on surface

			// Determine index0 and weight.

			var
				areaSoFarArray = this .areaSoFarArray,
				length         = areaSoFarArray .length,
				fraction       = Math .random () * areaSoFarArray [length - 1],
				index0         = 0,
				index1         = 0,
				weight         = 0;

			if (length == 1 || fraction <= areaSoFarArray [0])
			{
				index0 = 0;
				weight = 0;
			}
			else if (fraction >= areaSoFarArray [length - 1])
			{
				index0 = length - 2;
				weight = 1;
			}
			else
			{
				var index = Algorithm .upperBound (areaSoFarArray, 0, length, fraction, Algorithm .less);

				if (index < length)
				{
					index1 = index;
					index0 = index - 1;
			
					var
						key0 = areaSoFarArray [index0],
						key1 = areaSoFarArray [index1];
			
					weight = Algorithm .clamp ((fraction - key0) / (key1 - key0), 0, 1);
				}
				else
				{
					index0 = 0;
					weight = 0;
				}
			}

			// Random barycentric coordinates.

			var
				u = Math .random (),
				v = Math .random ();
		
			if (u + v > 1)
			{
				u = 1 - u;
				v = 1 - v;
			}

			var t = 1 - u - v;

			// Interpolate and determine random point on surface and normal.

			var
				i        = index0 * 12,
				vertices = this .surfaceNode .getVertices ();

			point .x = u * vertices [i + 0] + v * vertices [i + 4] + t * vertices [i + 8];
			point .y = u * vertices [i + 1] + v * vertices [i + 5] + t * vertices [i + 9];
			point .z = u * vertices [i + 2] + v * vertices [i + 6] + t * vertices [i + 10];

			var
				i       = index0 * 9,
				normals = this .surfaceNode .getNormals ();

			normal .x = u * normals [i + 0] + v * normals [i + 3] + t * normals [i + 6];
			normal .y = u * normals [i + 1] + v * normals [i + 4] + t * normals [i + 7];
			normal .z = u * normals [i + 2] + v * normals [i + 5] + t * normals [i + 8];

			normal .normalize ();

			rotation .setFromToVec (Vector3 .zAxis, normal);
			rotation .multVecRot (this .getRandomSurfaceNormal (normal));

			line  .set (point, normal);
			plane .set (point, normal);
	
			// Find random point in volume.

			var points = this .points;

			var numIntersections = this .bvh .getIntersections (line, points, this .normals);

			if (numIntersections) // and even
			{
				this .sorter .sort (0, numIntersections);
	
				var
					index  = Math .floor (Math .round (this .getRandomValue (0, numIntersections / 2 - 1))) * 2, // Select random intersection.
					point0 = points [index],
					point1 = points [index + 1],
					t      = Math .random ();
	
				position .x = point0 .x + (point1 .x - point0 .x) * t;
				position .y = point0 .y + (point1 .y - point0 .y) * t;
				position .z = point0 .z + (point1 .z - point0 .z) * t;
	
				return position;
			}

			return position .set (Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY);
		},
		getRandomVelocity: function (velocity)
		{
			var
				direction = this .direction,
				speed     = this .getRandomSpeed ();

			velocity .x = direction .x * speed;
			velocity .y = direction .y * speed;
			velocity .z = direction .z * speed;

			return velocity;
 		},
	});

	return VolumeEmitter;
});




define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticleEmitterNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Bits/X3DCast",
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticleEmitterNode, 
          X3DConstants,
          X3DCast,
          Triangle3,
          Vector3,
          Algorithm)
{
"use strict";

	var
		vertex1  = new Vector3 (0, 0, 0),
		vertex2  = new Vector3 (0, 0, 0),
		vertex3  = new Vector3 (0, 0, 0),
		direction = new Vector3 (0, 0, 0);

	function SurfaceEmitter (executionContext)
	{
		X3DParticleEmitterNode .call (this, executionContext);

		this .addType (X3DConstants .SurfaceEmitter);

		this .surfaceNode    = null;
		this .areaSoFarArray = [ 0 ];
	}

	SurfaceEmitter .prototype = $.extend (Object .create (X3DParticleEmitterNode .prototype),
	{
		constructor: SurfaceEmitter,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "speed",       new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "variation",   new Fields .SFFloat (0.25)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "mass",        new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "surfaceArea", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "surface",     new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "SurfaceEmitter";
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

			this .surface_ .addInterest (this, "set_surface__");

			this .set_surface__ ();
		},
		set_surface__: function ()
		{
			if (this .surfaceNode)
				this .surfaceNode .removeInterest (this, "set_geometry__");

			this .surfaceNode = X3DCast (X3DConstants .X3DGeometryNode, this .surface_);

			if (this .surfaceNode)
				this .surfaceNode .addInterest (this, "set_geometry__");

			this .set_geometry__ ();
		},
		set_geometry__: function ()
		{
			if (this .surfaceNode)
			{		
				delete this .getRandomPosition;
				delete this .getRandomVelocity;

				var
					areaSoFar      = 0,
					areaSoFarArray = this .areaSoFarArray,
					vertices       = this .surfaceNode .getVertices ();
		
				areaSoFarArray .length = 1;

				for (var i = 0, length = vertices .length; i < length; i += 12)
				{
					vertex1 .set (vertices [i + 0], vertices [i + 1], vertices [i + 2]);
					vertex2 .set (vertices [i + 4], vertices [i + 5], vertices [i + 6]);
					vertex3 .set (vertices [i + 8], vertices [i + 9], vertices [i + 10]);

					areaSoFar += Triangle3 .area (vertex1, vertex2, vertex3);
					areaSoFarArray .push (areaSoFar);
				}
			}
			else
			{
				this .getRandomPosition = getPosition;
				this .getRandomVelocity = this .getSphericalRandomVelocity;

				direction .set (0, 0, 0);
			}
		},
		getRandomPosition: function (position)
		{
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

			// Interpolate and set position.

			var
				i        = index0 * 12,
				vertices = this .surfaceNode .getVertices ();

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

			position .x = u * vertices [i + 0] + v * vertices [i + 4] + t * vertices [i + 8];
			position .y = u * vertices [i + 1] + v * vertices [i + 5] + t * vertices [i + 9];
			position .z = u * vertices [i + 2] + v * vertices [i + 6] + t * vertices [i + 10];

			var
				i       = index0 * 9,
				normals = this .surfaceNode .getNormals ();

			direction .x = u * normals [i + 0] + v * normals [i + 3] + t * normals [i + 6];
			direction .y = u * normals [i + 1] + v * normals [i + 4] + t * normals [i + 7];
			direction .z = u * normals [i + 2] + v * normals [i + 5] + t * normals [i + 8];

			return position;
		},
		getRandomVelocity: function (velocity)
		{
			var speed = this .getRandomSpeed ();

			velocity .x = direction .x * speed;
			velocity .y = direction .y * speed;
			velocity .z = direction .z * speed;

			return velocity;
 		},
	});

	function getPosition (position)
	{
		return this .position .set (0, 0, 0);
	}

	return SurfaceEmitter;
});



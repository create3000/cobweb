
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/ParticleSystems/X3DParticleEmitterNode",
	"cobweb/Components/Rendering/IndexedLineSet",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParticleEmitterNode,
          IndexedLineSet,
          X3DConstants,
          Vector3,
          Algorithm)
{
"use strict";

	var vector = new Vector3 (0, 0, 0);

	function PolylineEmitter (executionContext)
	{
		X3DParticleEmitterNode .call (this, executionContext);

		this .addType (X3DConstants .PolylineEmitter);

		this .direction        = new Vector3 (0, 0, 0);
		this .polylineNode     = new IndexedLineSet (executionContext);
		this .polylines        = [ ];
		this .lengthSoFarArray = [ 0 ];
	}

	PolylineEmitter .prototype = $.extend (Object .create (X3DParticleEmitterNode .prototype),
	{
		constructor: PolylineEmitter,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
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
			return "PolylineEmitter";
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

			this .coordIndex_ .addFieldInterest (this .polylineNode .coordIndex_);
			this .coord_      .addFieldInterest (this .polylineNode .coord_);
		
			this .polylineNode .coordIndex_ = this .coordIndex_;
			this .polylineNode .coord_      = this .coord_;

			this .polylineNode .addInterest (this, "set_polyline");
			this .polylineNode .setup ();

			this .set_direction__ ();
			this .set_polyline ();
		},
		set_direction__: function ()
		{
			this .direction .assign (this .direction_ .getValue ()) .normalize ();

			if (this .direction .equals (Vector3 .Zero))
				this .getRandomVelocity = this .getSphericalRandomVelocity;
			else
				delete this .getRandomVelocity;
		},
		set_polyline: function ()
		{
			var polylines = this .polylineNode .getPolylines (this .polylines);

			if (polylines .length)
			{
				delete this .getRandomPosition;

				var
					lengthSoFar      = 0,
					lengthSoFarArray = this .lengthSoFarArray;
		
				lengthSoFarArray .length = 1;

				for (var i = 0, length = polylines .length; i < length; i += 2)
				{
					lengthSoFar += vector .assign (polylines [i + 1]) .subtract (polylines [i]) .abs ();
					lengthSoFarArray .push (lengthSoFar);
				}
			}
			else
			{
				this .getRandomPosition = getPosition;
			}
		},
		getRandomPosition: function (position)
		{
			// Determine index0 and weight.

			var
				lengthSoFarArray = this .lengthSoFarArray,
				length           = lengthSoFarArray .length,
				fraction         = Math .random () * lengthSoFarArray [length - 1],
				index0           = 0,
				index1           = 0,
				weight           = 0;

			if (length == 1 || fraction <= lengthSoFarArray [0])
			{
				index0 = 0;
				weight = 0;
			}
			else if (fraction >= lengthSoFarArray [length - 1])
			{
				index0 = length - 2;
				weight = 1;
			}
			else
			{
				var index = Algorithm .upperBound (lengthSoFarArray, 0, length, fraction, Algorithm .less);

				if (index < length)
				{
					index1 = index;
					index0 = index - 1;
			
					var
						key0 = lengthSoFarArray [index0],
						key1 = lengthSoFarArray [index1];
			
					weight = Algorithm .clamp ((fraction - key0) / (key1 - key0), 0, 1);
				}
				else
				{
					index0 = 0;
					weight = 0;
				}
			}

			// Interpolate and set position.

			index0 *= 2;
			index1  = index0 + 1;

			var
				vertex1 = this .polylines [index0],
				vertex2 = this .polylines [index1];
	
			position .x = vertex1 .x + weight * (vertex2 .x - vertex1 .x);
			position .y = vertex1 .y + weight * (vertex2 .y - vertex1 .y);
			position .z = vertex1 .z + weight * (vertex2 .z - vertex1 .z);
			position .w = vertex1 .w + weight * (vertex2 .w - vertex1 .w);

			return position;
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

	function getPosition (position)
	{
		return this .position .set (0, 0, 0);
	}

	return PolylineEmitter;
});



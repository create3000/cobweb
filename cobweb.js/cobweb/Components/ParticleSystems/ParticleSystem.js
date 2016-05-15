
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DShapeNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"cobweb/Bits/X3DCast",
	"standard/Math/Numbers/Color4",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Vector4",
	"standard/Math/Numbers/Matrix4",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Algorithms/QuickSort",
	"standard/Math/Algorithm",
	"standard/Math/Utility/BVH",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DShapeNode,
          TraverseType,
          X3DConstants,
          X3DCast,
          Color4,
          Vector3,
          Vector4,
          Matrix4,
          Matrix3,
          QuickSort,
          Algorithm,
          BVH)
{
"use strict";

	var
		i        = 0,
		POINT    = i ++,
		LINE     = i ++,
		TRIANGLE = i ++,
		QUAD     = i ++,
		GEOMETRY = i ++,
		SPRITE   = i ++;

	var GeometryTypes = {
		POINT:    POINT,
		LINE:     LINE,
		TRIANGLE: TRIANGLE,
		QUAD:     QUAD,
		GEOMETRY: GEOMETRY,
		SPRITE:   SPRITE,
	};

	var
		invModelViewMatrix = new Matrix4 (),
		billboardToScreen  = new Vector3 (0, 0, 0),
		viewerYAxis        = new Vector3 (0, 0, 0),
		normal             = new Vector3 (0, 0, 0),
		s1                 = new Vector3 (0, 0, 0),
		s2                 = new Vector3 (0, 0, 0),
		s3                 = new Vector3 (0, 0, 0),
		s4                 = new Vector3 (0, 0, 0),
		x                  = new Vector3 (0, 0, 0),
		y                  = new Vector3 (0, 0, 0),
		z                  = new Vector3 (0, 0, 0);

	function compareDistance (lhs, rhs) { return lhs .distance < rhs .distance; }

	function ParticleSystem (executionContext)
	{
		X3DShapeNode .call (this, executionContext);

		this .addType (X3DConstants .ParticleSystem);

		this .createParticles          = true;
		this .particles                = [ ];
		this .velocities               = [ ];
		this .speeds                   = [ ];
		this .turbulences              = [ ];
		this .geometryType             = POINT;
		this .maxParticles             = 0;
		this .numParticles             = 0;
		this .particleLifetime         = 0;
		this .lifetimeVariation        = 0;
		this .emitterNode              = null;
		this .forcePhysicsModelNodes   = [ ];
		this .boundedPhysicsModelNodes = [ ];
		this .boundedNormals           = [ ];
		this .boundedVertices          = [ ];
		this .boundedVolume            = null;
		this .creationTime             = 0;
		this .pauseTime                = 0;
		this .deltaTime                = 0;
		this .numForces                = 0;
		this .colorKeys                = [ ];
		this .colorRamppNode           = null;
		this .colorRamp                = [ ];
		this .colorMaterial            = false;
		this .texCoordKeys             = [ ];
		this .texCoordRampNode         = null;
		this .texCoordRamp             = [ ];
		this .texCoordAnim             = false;
		this .vertexCount              = 0;
		this .shader                   = this .getBrowser () .getPointShader ();
		this .modelViewMatrix          = new Matrix4 ();
		this .rotation                 = new Matrix3 ();
		this .particleSorter           = new QuickSort (this .particles, compareDistance);
		this .sortParticles            = false;
	}

	ParticleSystem .prototype = $.extend (Object .create (X3DShapeNode .prototype),
	{
		constructor: ParticleSystem,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "createParticles",   new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geometryType",      new Fields .SFString ("QUAD")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "maxParticles",      new Fields .SFInt32 (200)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "particleLifetime",  new Fields .SFFloat (5)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "lifetimeVariation", new Fields .SFFloat (0.25)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "particleSize",      new Fields .SFVec2f (0.02, 0.02)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "emitter",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "physics",           new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorKey",          new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorRamp",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "texCoordKey",       new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "texCoordRamp",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",          new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",          new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",        new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "appearance",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "geometry",          new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "ParticleSystem";
		},
		getComponentName: function ()
		{
			return "ParticleSystems";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DShapeNode .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .getBrowser () .getBrowserOptions () .Shading_ .addInterest (this, "set_shader__");

			this .enabled_           .addInterest (this, "set_enabled__");
			this .createParticles_   .addInterest (this, "set_createParticles__");
			this .geometryType_      .addInterest (this, "set_geometryType__");
			this .maxParticles_      .addInterest (this, "set_enabled__");
			this .particleLifetime_  .addInterest (this, "set_particleLifetime__");
			this .lifetimeVariation_ .addInterest (this, "set_lifetimeVariation__");
			this .emitter_           .addInterest (this, "set_emitter__");
			this .physics_           .addInterest (this, "set_physics__");
			this .colorKey_          .addInterest (this, "set_color__");
			this .colorRamp_         .addInterest (this, "set_colorRamp__");
			this .texCoordKey_       .addInterest (this, "set_texCoord__");
			this .texCoordRamp_      .addInterest (this, "set_texCoordRamp__");

			this .colorBuffer    = gl .createBuffer ();
			this .texCoordBuffer = gl .createBuffer ();
			this .normalBuffer   = gl .createBuffer ();
			this .vertexBuffer   = gl .createBuffer ();

			this .colorArray    = new Float32Array ();
			this .texCoordArray = new Float32Array ();
			this .normalArray   = new Float32Array ();
			this .vertexArray   = new Float32Array ();

			// Call order is higly important at startup.
			this .set_emitter__ ();
			this .set_enabled__ ();
			this .set_createParticles__ ();
			this .set_particleLifetime__ ();
			this .set_lifetimeVariation__ ();
			this .set_physics__ ();
			this .set_colorRamp__ ();
			this .set_texCoordRamp__ ();
		},
		set_bbox__: function ()
		{
			if (this .bboxSize_ .getValue () .equals (this .defaultBBoxSize))
				this .bbox .set ();
			else
				this .bbox .set (this .bboxSize_ .getValue (), this .bboxCenter_ .getValue ());
			
			this .bboxSize   = this .bbox .size;
			this .bboxCenter = this .bbox .center;
		},
		set_transparent__: function ()
		{
			switch (this .geometryType)
			{
				case POINT:
					this .setTransparent (true);
					break;
				default:
				{
					this .setTransparent ((this .getAppearance () && this .getAppearance () .transparent_ .getValue ()) ||
					                      (this .colorRampNode && this .colorRampNode .isTransparent ()));
					break;
				}
			}
		},
		set_live__: function ()
		{
			if (this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue ())
			{
				if (this .isActive_ .getValue () && this .maxParticles_ .getValue ())
				{
					this .getBrowser () .sensors () .addInterest (this, "animate");
					this .getBrowser () .sensors () .addInterest (this, "update");
		
					if (this .pauseTime)
					{
						this .creationTime += performance .now () / 1000 - this .pauseTime;
						this .pauseTime     = 0;
					}
				}
			}
			else
			{
				if (this .isActive_ .getValue () && this .maxParticles_ .getValue ())
				{
					this .getBrowser () .sensors () .removeInterest (this, "animate");
					this .getBrowser () .sensors () .removeInterest (this, "update");
		
					if (this .pauseTime === 0)
						this .pauseTime = performance .now () / 1000;
				}
			}
		},
		set_enabled__: function ()
		{
			if (this .enabled_ .getValue () && this .maxParticles_ .getValue ())
			{
				if (! this .isActive_ .getValue ())
				{
					if (this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue ())
					{
						this .getBrowser () .sensors () .addInterest (this, "animate");
						this .getBrowser () .sensors () .addInterest (this, "update");
			
						this .pauseTime = 0;
					}
					else
						this .pauseTime = performance .now () / 1000;

					this .isActive_ = true;
				}
			}
			else
			{
				if (this .isActive_ .getValue ())
				{
					if (this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue ())
					{
						this .getBrowser () .sensors () .removeInterest (this, "animate");
						this .getBrowser () .sensors () .removeInterest (this, "update");
					}
	
					this .isActive_ = false;
				}
			}

			this .set_maxParticles__ ();
		},
		set_createParticles__: function ()
		{
			this .createParticles = this .createParticles_ .getValue ();
		},
		set_geometryType__: function ()
		{
			var
				gl           = this .getBrowser () .getContext (),
				maxParticles = this .maxParticles;

			// geometryType

			this .geometryType = GeometryTypes [this .geometryType_ .getValue ()]

			if (! this .geometryType)
				this .geometryType = POINT;

			// Create buffers

			switch (this .geometryType)
			{
				case POINT:
				{
					this .colorArray    = new Float32Array (4 * maxParticles);
					this .texCoordArray = new Float32Array ();
					this .normalArray   = new Float32Array ();
					this .vertexArray   = new Float32Array (4 * maxParticles);

					this .colorArray  .fill (1);
					this .vertexArray .fill (1);

					this .texCoordCount = 0;
					this .vertexCount   = 1;
					break;
				}
				case LINE:
				{
					this .colorArray    = new Float32Array (2 * 4 * maxParticles);
					this .texCoordArray = new Float32Array ();
					this .normalArray   = new Float32Array ();
					this .vertexArray   = new Float32Array (2 * 4 * maxParticles);

					this .colorArray  .fill (1);
					this .vertexArray .fill (1);

					this .texCoordCount = 2;
					this .vertexCount   = 2;
					this .shader        = this .getBrowser () .getLineShader ()
					break;
				}
				case TRIANGLE:
				case QUAD:
				case SPRITE:
				{
					this .colorArray    = new Float32Array (6 * 4 * maxParticles);
					this .texCoordArray = new Float32Array (6 * 4 * maxParticles);
					this .normalArray   = new Float32Array (6 * 3 * maxParticles);
					this .vertexArray   = new Float32Array (6 * 4 * maxParticles);

					this .colorArray  .fill (1);
					this .vertexArray .fill (1);

					var
						texCoordArray = this .texCoordArray,
						normalArray   = this .normalArray;

					for (var i = 0, length = 6 * 3 * maxParticles; i < length; i += 3)
					{
						normalArray [i]     = 0;
						normalArray [i + 1] = 0;
						normalArray [i + 2] = 1;
					}

					gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
					gl .bufferData (gl .ARRAY_BUFFER, this .normalArray, gl .STATIC_DRAW);

					for (var i = 0; i < maxParticles; ++ i)
					{
						var i24 = i * 24;

						// p4 ------ p3
						// |       / |
						// |     /   |
						// |   /     |
						// | /       |
						// p1 ------ p2

						// p1
						texCoordArray [i24]     = texCoordArray [i24 + 12] = 0;
						texCoordArray [i24 + 1] = texCoordArray [i24 + 13] = 0;
						texCoordArray [i24 + 2] = texCoordArray [i24 + 14] = 0;
						texCoordArray [i24 + 3] = texCoordArray [i24 + 15] = 1;

						// p2
						texCoordArray [i24 + 4] = 1;
						texCoordArray [i24 + 5] = 0;
						texCoordArray [i24 + 6] = 0;
						texCoordArray [i24 + 7] = 1;

						// p3
						texCoordArray [i24 + 8]  = texCoordArray [i24 + 16] = 1;
						texCoordArray [i24 + 9]  = texCoordArray [i24 + 17] = 1;
						texCoordArray [i24 + 10] = texCoordArray [i24 + 18] = 0;
						texCoordArray [i24 + 11] = texCoordArray [i24 + 19] = 1;

						// p4
						texCoordArray [i24 + 20] = 0;
						texCoordArray [i24 + 21] = 1;
						texCoordArray [i24 + 22] = 0;
						texCoordArray [i24 + 23] = 1;
					}

					gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffer);
					gl .bufferData (gl .ARRAY_BUFFER, this .texCoordArray, gl .STATIC_DRAW);

					this .texCoordCount = 4;
					this .vertexCount   = 6;
					break;
				}
				case GEOMETRY:
				{
					this .texCoordCount = 0;
					this .vertexCount   = 0;
					break;
				}
			}

			this .set_shader__ ();
		},
		set_shader__: function ()
		{
			switch (this .geometryType)
			{
				case POINT:
				{
					this .shader = this .getBrowser () .getPointShader ()
					break;
				}
				case LINE:
				{
					this .shader = this .getBrowser () .getLineShader ()
					break;
				}
				case TRIANGLE:
				case QUAD:
				case SPRITE:
				{
					this .shader = this .getBrowser () .getDefaultShader ()
					break;
				}
				case GEOMETRY:
				{
					this .shader = this .getBrowser () .getDefaultShader ()
					break;
				}
			}
		},
		set_maxParticles__: function ()
		{
			var
				particles    = this .particles,
				maxParticles = Math .max (0, this .maxParticles_ .getValue ());

			for (var i = this .numParticles, length = Math .min (particles .length, maxParticles); i < length; ++ i)
				particles [i] .lifetime = -1;

			for (var i = particles .length, length = maxParticles; i < length; ++ i)
			{
				particles [i] = {
					lifetime: -1,
					elapsedTime: 0,
					position: new Vector3 (0, 0, 0),
					velocity: new Vector3 (0, 0, 0),
					color:    new Vector4 (1, 1, 1, 1),
					distance: 0,
				};
			}

			this .maxParticles = maxParticles;
			this .numParticles = Math .min (this .numParticles, maxParticles);

			if (! this .emitterNode .isExplosive ())
				this .creationTime = performance .now () / 1000;

			this .set_geometryType__ ();
		},
		set_particleLifetime__: function ()
		{
			this .particleLifetime = this .particleLifetime_ .getValue ();
		},
		set_lifetimeVariation__: function ()
		{
			this .lifetimeVariation = this .lifetimeVariation_ .getValue ();
		},
		set_emitter__: function ()
		{
			this .emitterNode = X3DCast (X3DConstants .X3DParticleEmitterNode, this .emitter_);

			if (! this .emitterNode)
				this .emitterNode = this .getBrowser () .getDefaultEmitter ();
		},
		set_physics__: function ()
		{
			var
				physics                  = this .physics_ .getValue (),
				forcePhysicsModelNodes   = this .forcePhysicsModelNodes,
				boundedPhysicsModelNodes = this .boundedPhysicsModelNodes;

			for (var i = 0, length = boundedPhysicsModelNodes .length; i < length; ++ i)
				boundedPhysicsModelNodes [i] .removeInterest (this, "set_boundedPhysics__");

			forcePhysicsModelNodes   .length = 0;
			boundedPhysicsModelNodes .length = 0;

			for (var i = 0, length = physics .length; i < length; ++ i)
			{
				try
				{
					var
						innerNode = physics [i] .getValue () .getInnerNode (),
						type      = innerNode .getType ();

					for (var t = type .length - 1; t >= 0; -- t)
					{
						switch (type [t])
						{
							case X3DConstants .ForcePhysicsModel:
							case X3DConstants .WindPhysicsModel:
							{
								forcePhysicsModelNodes .push (innerNode);
								break;
							}
							case X3DConstants .BoundedPhysicsModel:
							{
								innerNode .addInterest (this, "set_boundedPhysics__");
								boundedPhysicsModelNodes .push (innerNode);
								break;
							}
							default:
								continue;
						}

						break;
					}
				}
				catch (error)
				{ }
			}

			this .set_boundedPhysics__ ();
		},
		set_boundedPhysics__: function ()
		{
			var
				boundedPhysicsModelNodes = this .boundedPhysicsModelNodes,
				boundedNormals           = this .boundedNormals,
				boundedVertices          = this .boundedVertices;

			boundedNormals  .length = 0;
			boundedVertices .length = 0;

			for (var i = 0, length = boundedPhysicsModelNodes .length; i < length; ++ i)
			{
				boundedPhysicsModelNodes [i] .addGeometry (boundedNormals, boundedVertices);
			}

			this .boundedVolume = new BVH (boundedVertices, boundedNormals);
		},
		set_colorRamp__: function ()
		{
			if (this .colorRampNode)
				this .colorRampNode .removeInterest (this, "set_color__");

			this .colorRampNode = X3DCast (X3DConstants .X3DColorNode, this .colorRamp_);

			if (this .colorRampNode)
				this .colorRampNode .addInterest (this, "set_color__");

			this .set_color__ ();
			this .set_transparent__ ();
		},
		set_color__: function ()
		{
			var
				colorKey  = this .colorKey_ .getValue (),
				colorKeys = this .colorKeys,
				colorRamp = this .colorRamp;

			for (var i = 0, length = colorKey .length; i < length; ++ i)
				colorKeys [i] = colorKey [i] .getValue ();

			colorKeys .length = length;

			if (this .colorRampNode)
				this .colorRampNode .getVectors (this .colorRamp);

			for (var i = colorRamp .length, length = colorKey .length; i < length; ++ i)
				colorRamp [i] = new Vector4 (1, 1, 1, 1);

			colorRamp .length = length;

			this .colorMaterial = Boolean (colorKeys .length && this .colorRampNode);
		},
		set_texCoordRamp__: function ()
		{
			if (this .texCoordRampNode)
				this .texCoordRampNode .removeInterest (this, "set_texCoord__");

			this .texCoordRampNode = X3DCast (X3DConstants .X3DTextureCoordinateNode, this .texCoordRamp_);

			if (this .texCoordRampNode)
				this .texCoordRampNode .addInterest (this, "set_texCoord__");

			this .set_texCoord__ ();
		},
		set_texCoord__: function ()
		{
			var
				texCoordKey  = this .texCoordKey_ .getValue (),
				texCoordKeys = this .texCoordKeys,
				texCoordRamp = this .texCoordRamp;

			for (var i = 0, length = texCoordKey .length; i < length; ++ i)
				texCoordKeys [i] = texCoordKey [i] .getValue ();

			texCoordKeys .length = length;

			if (this .texCoordRampNode)
				this .texCoordRampNode .getTexCoord (texCoordRamp);

			for (var i = texCoordRamp .length, length = texCoordKey .length * this .texCoordCount; i < length; ++ i)
				texCoordRamp [i] = new Vector4 (0, 0, 0, 0);

			texCoordRamp .length = length;

			this .texCoordAnim = Boolean (texCoordKeys .length && this .texCoordRampNode);
		},
		animate: function ()
		{
			var emitterNode = this .emitterNode;

			// Determine delta time

			var
				DELAY = 15, // Delay in frames when dt full applys.
				dt    = 1 / this .getBrowser () .getCurrentFrameRate ();

			// var deltaTime is only for the emitter, this.deltaTime is for the forces.
			var deltaTime = this .deltaTime = ((DELAY - 1) * this .deltaTime + dt) / DELAY; // Moving average about DELAY frames.

			// Determine numParticles

			if (emitterNode .isExplosive ())
			{
				var
					now              = performance .now () / 1000,
					particleLifetime = this .particleLifetime + this .particleLifetime * this .lifetimeVariation;
	
				if (this .numParticles === 0 || now - this .creationTime > particleLifetime)
				{
					this .creationTime    = now;
					this .numParticles    = this .maxParticles;
					this .createParticles = this .createParticles_ .getValue ();

					deltaTime = Number .POSITIVE_INFINITY; 
				}
				else
					this .createParticles = false;
			}
			else
			{
				if (this .numParticles < this .maxParticles)
				{
					var
						now          = performance .now () / 1000,
						newParticles = Math .ceil ((now - this .creationTime) * this .maxParticles / this .particleLifetime);
	
					if (newParticles)
						this .creationTime = now;

					this .numParticles = Math .floor (Math .min (this .maxParticles, this .numParticles + newParticles));
				}
			}

			// Apply forces.

			if (emitterNode .getMass ())
			{
				var
					forcePhysicsModelNodes = this .forcePhysicsModelNodes,
					velocities             = this .velocities,
					speeds                 = this .speeds,
					turbulences            = this .turbulences,
					deltaMass              = this .deltaTime / emitterNode .getMass ();

				// Collect forces in velocities and collect turbulences.

				for (var i = velocities .length, length = forcePhysicsModelNodes .length; i < length; ++ i)
					velocities [i] = new Vector3 (0, 0, 0);

				for (var i = 0, length = forcePhysicsModelNodes .length; i < length; ++ i)
					forcePhysicsModelNodes [i] .addForce (i, emitterNode, velocities, turbulences);

				// Determine velocities from forces and determine speed.

				for (var i = 0, length = velocities .length; i < length; ++ i)
				{
					velocities [i] .multiply (deltaMass);
					speeds [i] = velocities [i] .abs ();
				}

				this .numForces = length;
			}
			else
			{
				this .numForces = 0;
			}

			// Determine particle position, velocity and colors

			emitterNode .animate (this, deltaTime);

			this .getBrowser () .addBrowserEvent (this);
		},
		update: function ()
		{
			switch (this .geometryType)
			{
				case POINT:
					this .updatePoint ();
					break;
				case LINE:
					this .updateLine ();
					break;
				case TRIANGLE:
				case QUAD:
				case SPRITE:
					this .updateQuad ();
					break;
				case GEOMETRY:
					break;
			}
		},
		updatePoint: function ()
		{
			var
				gl           = this .getBrowser () .getContext (),
				particles    = this .particles,
				numParticles = this .numParticles,
				colorArray   = this .colorArray,
				vertexArray  = this .vertexArray;

			// Colors

			if (this .colorMaterial)
			{
				for (var i = 0; i < numParticles; ++ i)
				{
					var
						color = particles [i] .color,
						i4    = i * 4;
	
					colorArray [i4]     = color .x;
					colorArray [i4 + 1] = color .y;
					colorArray [i4 + 2] = color .z;
					colorArray [i4 + 3] = color .w;
				}
	
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, this .colorArray, gl .STATIC_DRAW);
			}

			// Vertices

			for (var i = 0; i < numParticles; ++ i)
			{
				var
					position = particles [i] .position,
					i4       = i * 4;

				vertexArray [i4]     = position .x;
				vertexArray [i4 + 1] = position .y;
				vertexArray [i4 + 2] = position .z;
			}

			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, this .vertexArray, gl .STATIC_DRAW);
		},
		updateLine: function ()
		{
			var
				gl           = this .getBrowser () .getContext (),
				particles    = this .particles,
				numParticles = this .numParticles,
				colorArray   = this .colorArray,
				vertexArray  = this .vertexArray,
				sx1_2        = this .particleSize_ .x / 2,
				sy1_2        = this .particleSize_ .y / 2;

			// Colors

			if (this .colorMaterial)
			{
				for (var i = 0; i < numParticles; ++ i)
				{
					var
						color = particles [i] .color,
						i8    = i * 8;
	
					colorArray [i8]     = color .x;
					colorArray [i8 + 1] = color .y;
					colorArray [i8 + 2] = color .z;
					colorArray [i8 + 3] = color .w;

					colorArray [i8 + 4] = color .x;
					colorArray [i8 + 5] = color .y;
					colorArray [i8 + 6] = color .z;
					colorArray [i8 + 7] = color .w;
				}
	
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, this .colorArray, gl .STATIC_DRAW);
			}

			// Vertices

			for (var i = 0; i < numParticles; ++ i)
			{
				var
					particle = particles [i],
					position = particle .position,
					i8       = i * 8;

				normal .assign (particle .velocity) .normalize ();

				vertexArray [i8]     = position .x - normal .x * sy1_2;
				vertexArray [i8 + 1] = position .y - normal .y * sy1_2;
				vertexArray [i8 + 2] = position .z - normal .z * sy1_2;

				vertexArray [i8 + 4] = position .x + normal .x * sy1_2;
				vertexArray [i8 + 5] = position .y + normal .y * sy1_2;
				vertexArray [i8 + 6] = position .z + normal .z * sy1_2;
			}

			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, this .vertexArray, gl .STATIC_DRAW);
		},
		updateQuad: function ()
		{
			var
				gl              = this .getBrowser () .getContext (),
				particles       = this .particles,
				maxParticles    = this .maxParticles,
			   numParticles    = this .numParticles,
				colorArray      = this .colorArray,
				texCoordArray   = this .texCoordArray,
				normalArray     = this .normalArray,
				vertexArray     = this .vertexArray,
				sx1_2           = this .particleSize_ .x / 2,
				sy1_2           = this .particleSize_ .y / 2,
				modelViewMatrix = this .modelViewMatrix;

			// Sort particles

			if (this .sortParticles)
			{
				for (var i = 0; i < numParticles; ++ i)
				{
					var particle = particles [i];
					particle .distance = modelViewMatrix .getDepth (particle .position);
				}
				
				// Expensisive function!!!
				this .particleSorter .sort (0, numParticles);
			}

			// Colors

			if (this .colorMaterial)
			{
				for (var i = 0; i < maxParticles; ++ i)
				{
					var
						color = particles [i] .color,
						i24   = i * 24;

					// p4 ------ p3
					// |       / |
					// |     /   |
					// |   /     |
					// | /       |
					// p1 ------ p2

					// p1, p2, p3; p1, p3, p4
					colorArray [i24]     = colorArray [i24 + 4] = colorArray [i24 + 8]  = colorArray [i24 + 12] = colorArray [i24 + 16] = colorArray [i24 + 20] = color .x;
					colorArray [i24 + 1] = colorArray [i24 + 5] = colorArray [i24 + 9]  = colorArray [i24 + 13] = colorArray [i24 + 17] = colorArray [i24 + 21] = color .y;
					colorArray [i24 + 2] = colorArray [i24 + 6] = colorArray [i24 + 10] = colorArray [i24 + 14] = colorArray [i24 + 18] = colorArray [i24 + 22] = color .z;
					colorArray [i24 + 3] = colorArray [i24 + 7] = colorArray [i24 + 11] = colorArray [i24 + 15] = colorArray [i24 + 19] = colorArray [i24 + 23] = color .w;
				}
	
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, this .colorArray, gl .STATIC_DRAW);
			}

			if (this .texCoordAnim && this .texCoordArray .length)
			{
				var
					texCoordKeys = this .texCoordKeys,
					texCoordRamp = this .texCoordRamp;

				var
					length = texCoordKeys .length,
					index0 = 0;
		
				for (var i = 0; i < maxParticles; ++ i)
				{
					// Determine index0.
		
					var
						particle = particles [i],
						fraction = particle .elapsedTime / particle .lifetime,
						color    = particle .color;
	
					if (length == 1 || fraction <= texCoordKeys [0])
					{
						index0 = 0;
					}
					else if (fraction >= texCoordKeys [length - 1])
					{
						index0 = length - 2;
					}
					else
					{
						var index = Algorithm .upperBound (texCoordKeys, 0, length, fraction, Algorithm .less);

						if (index < length)
							index0 = index - 1;
						else
							index0 = 0;
					}

					// Set texCoord.
		
					index0 *= this .texCoordCount;

					var
						texCoord1 = texCoordRamp [index0],
						texCoord2 = texCoordRamp [index0 + 1],
						texCoord3 = texCoordRamp [index0 + 2],
						texCoord4 = texCoordRamp [index0 + 3],
						i24 = i * 24;

					// p4 ------ p3
					// |       / |
					// |     /   |
					// |   /     |
					// | /       |
					// p1 ------ p2

					// p1
					texCoordArray [i24]     = texCoordArray [i24 + 12] = texCoord1 .x;
					texCoordArray [i24 + 1] = texCoordArray [i24 + 13] = texCoord1 .y;
					texCoordArray [i24 + 2] = texCoordArray [i24 + 14] = texCoord1 .z;
					texCoordArray [i24 + 3] = texCoordArray [i24 + 15] = texCoord1 .w;

					// p2
					texCoordArray [i24 + 4] = texCoord2 .x;
					texCoordArray [i24 + 5] = texCoord2 .y;
					texCoordArray [i24 + 6] = texCoord2 .z;
					texCoordArray [i24 + 7] = texCoord2 .w;

					// p3
					texCoordArray [i24 + 8]  = texCoordArray [i24 + 16] = texCoord3 .x;
					texCoordArray [i24 + 9]  = texCoordArray [i24 + 17] = texCoord3 .y;
					texCoordArray [i24 + 10] = texCoordArray [i24 + 18] = texCoord3 .z;
					texCoordArray [i24 + 11] = texCoordArray [i24 + 19] = texCoord3 .w;

					// p4
					texCoordArray [i24 + 20] = texCoord4 .x;
					texCoordArray [i24 + 21] = texCoord4 .y;
					texCoordArray [i24 + 22] = texCoord4 .z;
					texCoordArray [i24 + 23] = texCoord4 .w;
				}
	
				gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, this .texCoordArray, gl .STATIC_DRAW);
			}

			// Vertices

			if (this .geometryType === SPRITE)
			{
				// Normals

				var
					rotation = this .getScreenAlignedRotation (this .modelViewMatrix),
					nx       = rotation [6],
					ny       = rotation [7],
					nz       = rotation [8];

				for (var i = 0, length = 6 * 3 * maxParticles; i < length; i += 3)
				{
					normalArray [i]     = nx;
					normalArray [i + 1] = ny;
					normalArray [i + 2] = nz;
				}

				gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
				gl .bufferData (gl .ARRAY_BUFFER, this .normalArray, gl .STATIC_DRAW);

				// Vertices

				s1 .set (-sx1_2, -sy1_2, 0);
				s2 .set ( sx1_2, -sy1_2, 0);
				s3 .set ( sx1_2,  sy1_2, 0);
				s4 .set (-sx1_2,  sy1_2, 0);

				rotation .multVecMatrix (s1);
				rotation .multVecMatrix (s2);
				rotation .multVecMatrix (s3);
				rotation .multVecMatrix (s4);

				for (var i = 0; i < numParticles; ++ i)
				{
					var
						position = particles [i] .position,
						x        = position .x,
						y        = position .y,
						z        = position .z,
						i24      = i * 24;
	
					// p4 ------ p3
					// |       / |
					// |     /   |
					// |   /     |
					// | /       |
					// p1 ------ p2
	

					// p1
					vertexArray [i24]     = vertexArray [i24 + 12] = x + s1 .x;
					vertexArray [i24 + 1] = vertexArray [i24 + 13] = y + s1 .y;
					vertexArray [i24 + 2] = vertexArray [i24 + 14] = z + s1 .z;
	
					// p2
					vertexArray [i24 + 4] = x + s2 .x;
					vertexArray [i24 + 5] = y + s2 .y;
					vertexArray [i24 + 6] = z + s2 .z;
	
					// p3
					vertexArray [i24 + 8]  = vertexArray [i24 + 16] = x + s3 .x;
					vertexArray [i24 + 9]  = vertexArray [i24 + 17] = y + s3 .y;
					vertexArray [i24 + 10] = vertexArray [i24 + 18] = z + s3 .z;
	
					// p4
					vertexArray [i24 + 20] = x + s4 .x;
					vertexArray [i24 + 21] = y + s4 .y;
					vertexArray [i24 + 22] = z + s4 .z;
				}
			}
			else
			{
				for (var i = 0; i < numParticles; ++ i)
				{
					var
						position = particles [i] .position,
						x        = position .x,
						y        = position .y,
						z        = position .z,
						i24      = i * 24;
	
					// p4 ------ p3
					// |       / |
					// |     /   |
					// |   /     |
					// | /       |
					// p1 ------ p2
	
					// p1
					vertexArray [i24]     = vertexArray [i24 + 12] = x - sx1_2;
					vertexArray [i24 + 1] = vertexArray [i24 + 13] = y - sy1_2;
					vertexArray [i24 + 2] = vertexArray [i24 + 14] = z;
	
					// p2
					vertexArray [i24 + 4] = x + sx1_2;
					vertexArray [i24 + 5] = y - sy1_2;
					vertexArray [i24 + 6] = z;
	
					// p3
					vertexArray [i24 + 8]  = vertexArray [i24 + 16] = x + sx1_2;
					vertexArray [i24 + 9]  = vertexArray [i24 + 17] = y + sy1_2;
					vertexArray [i24 + 10] = vertexArray [i24 + 18] = z;
	
					// p4
					vertexArray [i24 + 20] = x - sx1_2;
					vertexArray [i24 + 21] = y + sy1_2;
					vertexArray [i24 + 22] = z;
				}
			}

			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, this .vertexArray, gl .STATIC_DRAW);
		},
		traverse: function (type)
		{
			switch (type)
			{
				case TraverseType .DISPLAY:
				{
					this .modelViewMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());
		
					this .getCurrentLayer () .addShape (this);
					break;
				}
			}
		},
		display: function (context)
		{
			// Traverse appearance before everything.

			this .getAppearance () .traverse ();

			// Display geometry.

			if (this .geometryType === GEOMETRY)
			{
				var geometryNode = this .getGeometry ();

				if (geometryNode)
					geometryNode .displayParticles (context, this .particles, this .numParticles);
			}
			else
			{
				var
					browser = this .getBrowser (),
					gl      = browser .getContext (),
					shader  = browser .getShader ();
	
				if (shader === browser .getDefaultShader ())
					shader = this .shader;
	
				if (shader .vertex < 0 || this .numParticles === 0)
					return;
	
				// Setup shader.
	
				context .colorMaterial = this .colorMaterial;
				shader .setLocalUniforms (context);
	
				// Setup vertex attributes.
	
				if (this .colorMaterial && shader .color >= 0)
				{
					gl .enableVertexAttribArray (shader .color);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
					gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
				}
	
				if (this .texCoordArray .length && shader .texCoord >= 0)
				{
					gl .enableVertexAttribArray (shader .texCoord);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .texCoordBuffer);
					gl .vertexAttribPointer (shader .texCoord, 4, gl .FLOAT, false, 0, 0);
				}
	
				if (this .normalArray .length && shader .normal >= 0)
				{
					gl .enableVertexAttribArray (shader .normal);
					gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
					gl .vertexAttribPointer (shader .normal, 3, gl .FLOAT, false, 0, 0);
				}
	
				gl .enableVertexAttribArray (shader .vertex);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
				gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);
	
				if (shader .wireframe)
				{
					// Wireframes are always solid so only one drawing call is needed.
	
					for (var i = 0, length = this .numParticles * this .vertexCount; i < length; i += 3)
						gl .drawArrays (shader .primitiveMode, i, 3);
				}
				else
				{
					var positiveScale = Matrix4 .prototype .determinant3 .call (context .modelViewMatrix) > 0;
		
					gl .frontFace (positiveScale ? gl .CCW : gl .CW);
					gl .enable (gl .CULL_FACE);
					gl .cullFace (gl .BACK);
		
					gl .drawArrays (this .shader .primitiveMode, 0, this .numParticles * this .vertexCount);
				}
	
				if (shader .color >= 0) gl .disableVertexAttribArray (shader .color);
				gl .disableVertexAttribArray (shader .vertex);
			}
		},
		getScreenAlignedRotation: function (modelViewMatrix)
		{
			invModelViewMatrix .assign (modelViewMatrix) .inverse ();
		
			invModelViewMatrix .multDirMatrix (billboardToScreen .assign (Vector3 .zAxis));
			invModelViewMatrix .multDirMatrix (viewerYAxis .assign (Vector3 .yAxis));
		
			x .assign (viewerYAxis) .cross (billboardToScreen);
			y .assign (billboardToScreen) .cross (x);
			var z = billboardToScreen;
		
			// Compose rotation
		
			x .normalize ();
			y .normalize ();
			z .normalize ();
		
			return this .rotation .set (x .x, x .y, x .z,
			                            y .x, y .y, y .z,
			                            z .x, z .y, z .z);
		},
	});

	return ParticleSystem;
});



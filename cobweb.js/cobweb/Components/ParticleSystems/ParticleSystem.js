
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
          Vector4)
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

	function ParticleSystem (executionContext)
	{
		X3DShapeNode .call (this, executionContext);

		this .addType (X3DConstants .ParticleSystem);

		this .particles          = [ ];
		this .velocities         = [ ];
		this .speeds             = [ ];
		this .turbulences        = [ ];
		this .geometryType       = POINT;
		this .numParticles       = 0;
		this .emitterNode        = null;
		this .physicsModelNodes  = [ ];
		this .creationTime       = 0;
		this .pauseTime          = 0;
		this .deltaTime          = 0;
		this .numForces          = 0;
		this .colorKeys          = [ ];
		this .colorRamp          = [ ];
		this .shader             = this .getBrowser () .getPointShader ();
	}

	ParticleSystem .prototype = $.extend (Object .create (X3DShapeNode .prototype),
	{
		constructor: ParticleSystem,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",           new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geometryType",      new Fields .SFString ("QUAD")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "createParticles",   new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "maxParticles",      new Fields .SFInt32 (200)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "particleLifetime",  new Fields .SFFloat (5)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "lifetimeVariation", new Fields .SFFloat (0.25)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "particleSize",      new Fields .SFVec2f (0.02, 0.02)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorKey",          new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "texCoordKey",       new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",          new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",          new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",        new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "emitter",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "physics",           new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "colorRamp",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "texCoordRamp",      new Fields .SFNode ()),
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

			this .enabled_      .addInterest (this, "set_enabled__");
			this .geometryType_ .addInterest (this, "set_geometryType__");
			this .maxParticles_ .addInterest (this, "set_enabled__");
			this .emitter_      .addInterest (this, "set_emitter__");
			this .physics_      .addInterest (this, "set_physics__");
			this .colorRamp_    .addInterest (this, "set_colorRamp__");

			this .colorBuffer = gl .createBuffer ();
			this .colorArray  = new Float32Array ();

			this .vertexBuffer = gl .createBuffer ();
			this .vertexArray  = new Float32Array ();

			this .set_enabled__ ();
			this .set_emitter__ ();
			this .set_physics__ ();
			this .set_colorRamp__ ();
		},
		getParticles: function ()
		{
			return this .particles;
		},
		getNumParticles: function ()
		{
			return this .numParticles;
		},
		getDeltaTime: function ()
		{
			return this .deltaTime;
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
					this .getBrowser () .prepareEvents () .addInterest (this, "prepareEvents");
					this .getBrowser () .sensors ()       .addInterest (this, "update");
		
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
					this .getBrowser () .prepareEvents () .removeInterest (this, "prepareEvents");
					this .getBrowser () .sensors ()       .removeInterest (this, "update");
		
					if (this .pauseTime === 0)
						this .pauseTime = performance .now () / 1000;
				}
			}
		},
		set_enabled__: function ()
		{
			if (this .enabled_ .getValue () && this .maxParticles_ .getValue ())
			{
				if (this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue ())
				{
					this .getBrowser () .prepareEvents () .addInterest (this, "prepareEvents");
					this .getBrowser () .sensors ()       .addInterest (this, "update");
		
					if (this .pauseTime)
					{
						this .creationTime += performance .now () / 1000 - this .pauseTime;
						this .pauseTime     = 0;
					}
					else
						this .pauseTime = performance .now () / 1000;

					this .isActive_ = true;
					
					this .set_maxParticles__ ();
				}
			}
			else
			{
				if (this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue ())
				{
					this .getBrowser () .prepareEvents () .removeInterest (this, "prepareEvents");
					this .getBrowser () .sensors ()       .removeInterest (this, "update");
				}

				this .isActive_ = false;
			}
		},
		set_geometryType__: function ()
		{
			// geometryType

			this .geometryType = GeometryTypes [this .geometryType_ .getValue ()]

			if (! this .geometryType)
				this .geometryType = POINT;

			// Create buffers

			var maxParticles = this .maxParticles_ .getValue ();

			switch (this .geometryType)
			{
				case POINT:
				{
					this .colorArray  = new Float32Array (4 * maxParticles);
					this .vertexArray = new Float32Array (4 * maxParticles);

					this .colorArray  .fill (1);
					this .vertexArray .fill (1);

					this .shader = this .getBrowser () .getPointShader ()
					break;
				}
			}
		},
		set_maxParticles__: function ()
		{
			var particles = this .particles;

			for (var i = 0, length = Math .max (0, this .maxParticles_ .getValue ()); i < length; ++ i)
			{
				particles [i] = {
					lifetime: -1,
					elapsedTime: 0,
					position: new Vector3 (0, 0, 0),
					velocity: new Vector3 (0, 0, 0),
					color:    new Vector4 (1, 1, 1, 1),
				};
			}

			this .numParticles = 0;
			this .creationTime = performance .now () / 1000;

			this .set_geometryType__ ();
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
				physics           = this .physics_ .getValue (),
				physicsModelNodes = this .physicsModelNodes;

			physicsModelNodes .length = 0;

			for (var i = 0, length = physics .length; i < length; ++ i)
			{
				var physicsModelNode = X3DCast (X3DConstants .X3DParticlePhysicsModelNode, physics [i]);

				if (physicsModelNode)
					physicsModelNodes .push (physicsModelNode);
			}
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
			for (var i = 0, length = this .colorKey_ .length; i < length; ++ i)
				this .colorKeys [i] = this .colorKey_ [i];

			this .colorRampNode .getColors (this .colorRamp);

			for (var i = this .colorRamp .length, length = this .colorKey_ .length; i < length; ++ i)
				this .colorRamp [i] = new Color4 (1, 1, 1, 1);
		},
		prepareEvents: function ()
		{
			var emitterNode = this .emitterNode;

			// Determine numParticles

			if (emitterNode .isExplosive ())
			{
			}
			else
			{
				if (this .numParticles < this .maxParticles_ .getValue ())
				{
					var
						now          = performance .now () / 1000,
						newParticles = (now - this .creationTime) * this .maxParticles_ .getValue () / this .particleLifetime_ .getValue ();
	
					if (newParticles)
						this .creationTime = now;
	
					this .numParticles = Math .floor (Math .min (Math .max (0, this .maxParticles_ .getValue ()), this .numParticles + newParticles));
				}
			}

			// Determine delta time

			var
				DELAY = 15, // Delay in frames when dt full applys.
				dt    = 1 / this .getBrowser () .getCurrentFrameRate ();

			this .deltaTime = ((DELAY - 1) * this .deltaTime + dt) / DELAY; // Moving average about DELAY frames.

			// Determine particle position, velocity and colors

			emitterNode .animate (this);

			// Apply forces.

			if (emitterNode .mass_ .getValue ())
			{
				var
					physicsModelNodes = this .physicsModelNodes,
					velocities        = this .velocities,
					speeds            = this .speeds,
					turbulences       = this .turbulences,
					deltaMass         = this .deltaTime / emitterNode .mass_ .getValue ();

				// Collect forces in velocities and turbulences.

				for (var i = velocities .length, length = physicsModelNodes .length; i < length; ++ i)
					velocities [i] = new Vector3 (0, 0, 0);

				for (var i = 0, length = physicsModelNodes .length; i < length; ++ i)
					physicsModelNodes [i] .addForce (i, emitterNode, velocities, turbulences);

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

			this .getBrowser () .addBrowserEvent (this);
		},
		update: function ()
		{
			switch (this .geometryType)
			{
				case POINT:
					this .updatePoint ();
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

			if (this .colorRamp .length)
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
		traverse: function (type)
		{
			switch (type)
			{
				case TraverseType .DISPLAY:
					this .getCurrentLayer () .addShape (this);
					break;
			}
		},
		display: function (context)
		{
			this .getAppearance () .traverse ();

			switch (this .geometryType)
			{
				case POINT:
					this .displayPoint (context);
					break;
			}
		},
		displayPoint: function (context)
		{
			var
				browser = this .getBrowser (),
				gl      = browser .getContext (),
				shader  = browser .getShader ();

			if (shader === browser .getDefaultShader ())
				shader = this .shader;

			if (shader .vertex < 0 || this .vertexCount === 0)
				return;

			// Setup shader.

			context .colorMaterial = this .colorRamp .length;
			shader .setLocalUniforms (context);

			// Setup vertex attributes.

			if (this .colorRamp .length && shader .color >= 0)
			{
				gl .enableVertexAttribArray (shader .color);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .colorBuffer);
				gl .vertexAttribPointer (shader .color, 4, gl .FLOAT, false, 0, 0);
			}

			gl .enableVertexAttribArray (shader .vertex);
			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .vertexAttribPointer (shader .vertex, 4, gl .FLOAT, false, 0, 0);

			// Wireframes are always solid so only one drawing call is needed.

			gl .drawArrays (gl .POINTS, 0, this .numParticles);

			if (shader .color >= 0) gl .disableVertexAttribArray (shader .color);
			gl .disableVertexAttribArray (shader .vertex);
		},
	});

	return ParticleSystem;
});



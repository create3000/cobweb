
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Algorithm",
],
function ($,
          X3DNode, 
          X3DConstants,
          Vector3,
          Rotation4,
          Algorithm)
{
"use strict";

	var normal = new Vector3 (0, 0, 0);

	function X3DParticleEmitterNode (executionContext)
	{
		X3DNode .call (this, executionContext);

		this .addType (X3DConstants .X3DParticleEmitterNode);

		this .rotations = [ ];
	}

	X3DParticleEmitterNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DParticleEmitterNode,
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);

			this .speed_     .addInterest (this, "set_speed__");
			this .variation_ .addInterest (this, "set_variation__");
			this .mass_      .addInterest (this, "set_mass__");

			this .set_speed__ ();
			this .set_variation__ ();
			this .set_mass__ ();
		},
		set_speed__: function ()
		{
			this .speed = this .speed_ .getValue ();
		},
		set_variation__: function ()
		{
			this .variation = this .variation_ .getValue ();
		},
		set_mass__: function ()
		{
			this .mass = this .mass_ .getValue ();
		},
		isExplosive: function ()
		{
			return false;
		},
		getMass: function ()
		{
			return this .mass;
		},
		getRandomLifetime: function (particleLifetime, lifetimeVariation)
		{
			var
				v   = particleLifetime * lifetimeVariation,
				min = Math .max (0, particleLifetime - v),
				max = particleLifetime + v;
		
			return Math .random () * (max - min) + min;
		},
		getRandomSpeed: function ()
		{
			var
				speed = this .speed,
				v     = speed * this .variation,
				min   = Math .max (0, speed - v),
				max   = speed + v;
		
			return Math .random () * (max - min) + min;
		},
		getSphericalRandomVelocity: function (velocity)
		{
			return this .getRandomNormal (velocity) .multiply (this .getRandomSpeed ());
		},
		getRandomValue: function (min, max)
		{
			return Math .random () * (max - min) + min;
		},
		getRandomNormal: function (normal)
		{
			var
				theta = this .getRandomValue (-1, 1) * Math .PI,
				cphi  = this .getRandomValue (-1, 1),
				phi   = Math .acos (cphi),
				r     = Math .sin (phi);
		
			return normal .set (Math .sin (theta) * r,
			                    Math .cos (theta) * r,
			                    cphi);
		},
		getRandomNormalWithAngle: function (angle, normal)
		{
			var
				theta = (Math .random () * 2 - 1) * Math .PI,
				cphi  = this .getRandomValue (Math .cos (angle), 1),
				phi   = Math .acos (cphi),
				r     = Math .sin (phi);
		
			return normal .set (Math .sin (theta) * r,
			                    Math .cos (theta) * r,
			                    cphi);
		},
		getRandomNormalWithDirectionAndAngle: function (direction, angle, normal)
		{
			rotation .setFromToVec (Vector3 .zAxis, direction);

			return rotation .multVecRot (this .getRandomNormalAngle (angle, normal));
		},
		getRandomSurfaceNormal: function (normal)
		{
			var
				theta = this .getRandomValue (-1, 1) * Math .PI,
				cphi  = Math .pow (Math .random (), 1/3),
				phi   = Math .acos (cphi),
				r     = Math .sin (phi);
		
			return normal .set (Math .sin (theta) * r,
			                    Math .cos (theta) * r,
			                    cphi);
		},
		animate: function (particleSystem, deltaTime)
		{
			var
				particles         = particleSystem .particles,
				numParticles      = particleSystem .numParticles,
				createParticles   = particleSystem .createParticles,
				particleLifetime  = particleSystem .particleLifetime,
				lifetimeVariation = particleSystem .lifetimeVariation,
				speeds            = particleSystem .speeds,            // speed of velocities
				velocities        = particleSystem .velocities,        // resulting velocities from forces
				turbulences       = particleSystem .turbulences,       // turbulences
				rotations         = this .rotations,                   // rotation to direction of force
				numForces         = particleSystem .numForces;         // number of forces

			for (var i = rotations .length; i < numForces; ++ i)
				rotations [i] = new Rotation4 (0, 0, 1, 0);

			for (var i = 0; i < numForces; ++ i)
				rotations [i] .setFromToVec (Vector3 .zAxis, velocities [i]);

			for (var i = 0; i < numParticles; ++ i)
			{
				var
					particle    = particles [i],
					elapsedTime = particle .elapsedTime + deltaTime;
		
				if (elapsedTime > particle .lifetime)
				{
					// Create new particle or hide particle.

					particle .lifetime    = this .getRandomLifetime (particleLifetime, lifetimeVariation);
					particle .elapsedTime = 0;

					if (createParticles)
					{
						this .getRandomPosition (particle .position)
						this .getRandomVelocity (particle .velocity);
					}
					else
						particle .position .set (Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY);
				}
				else
				{
					// Animate particle.

					var
						position = particle .position,
						velocity = particle .velocity;

					for (var f = 0; f < numForces; ++ f)
					{
						velocity .add (rotations [f] .multVecRot (this .getRandomNormalWithAngle (turbulences [f], normal)) .multiply (speeds [f]));
					}

					//fromPosition .assign (position);
		
					position .x += velocity .x * deltaTime;
					position .y += velocity .y * deltaTime;
					position .z += velocity .z * deltaTime;
		
					//bounce (fromPosition, position, velocity);
			
					particle .elapsedTime = elapsedTime;
				}
			}

			// Animate color if needed.

			if (particleSystem .colorMaterial)
				this .getColors (particles, particleSystem .colorKeys, particleSystem .colorRamp, numParticles);
		},
		getColors: function (particles, colorKeys, colorRamp, numParticles)
		{
			var
				length = colorKeys .length,
				index0 = 0,
				index1 = 0,
				weight = 0;
		
			for (var i = 0; i < numParticles; ++ i)
			{
				// Determine index0, index1 and weight.

				var
					particle = particles [i],
					fraction = particle .elapsedTime / particle .lifetime,
					color    = particle .color;

				if (length == 1 || fraction <= colorKeys [0])
				{
					index0 = 0;
					index1 = 0;
					weight = 0;
				}
				else if (fraction >= colorKeys [length - 1])
				{
					index0 = length - 2;
					index1 = length - 1;
					weight = 1;
				}
				else
				{
					var index = Algorithm .upperBound (colorKeys, 0, length, fraction, Algorithm .less);
	
					if (index < length)
					{
						index1 = index;
						index0 = index - 1;
				
						var
							key0 = colorKeys [index0],
							key1 = colorKeys [index1];
				
						weight = Algorithm .clamp ((fraction - key0) / (key1 - key0), 0, 1);
					}
					else
					{
						index0 = 0;
						index1 = 0;
						weight = 0;
					}
				}
	
				// Interpolate and set color.

				var
					color0 = colorRamp [index0],
					color1 = colorRamp [index1];
	
				// Algorithm .lerp (color0, color1, weight);
				color .x = color0 .x + weight * (color1 .x - color0 .x);
				color .y = color0 .y + weight * (color1 .y - color0 .y);
				color .z = color0 .z + weight * (color1 .z - color0 .z);
				color .w = color0 .w + weight * (color1 .w - color0 .w);
			}
		},
	});

	return X3DParticleEmitterNode;
});



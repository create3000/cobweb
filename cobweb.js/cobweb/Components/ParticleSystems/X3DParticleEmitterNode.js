
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

			this .set_speed__ ();
			this .set_variation__ ();
		},
		set_speed__: function ()
		{
			this .speed = this .speed_ .getValue ();
		},
		set_variation__: function ()
		{
			this .variation = this .variation_ .getValue ();
		},
		isExplosive: function ()
		{
			return false;
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
		animate: function (particleSystem)
		{
			var
				particles         = particleSystem .getParticles (),
				deltaTime         = particleSystem .getDeltaTime (),
				numParticles      = particleSystem .getNumParticles (),
				createParticles   = particleSystem .createParticles_ .getValue (),
				particleLifetime  = particleSystem .particleLifetime_ .getValue (),
				lifetimeVariation = particleSystem .lifetimeVariation_ .getValue (),
				speeds            = particleSystem .speeds,
				velocities        = particleSystem .velocities,
				turbulences       = particleSystem .turbulences,
				rotations         = this .rotations,
				numForces         = particleSystem .numForces,
				colorKeys         = particleSystem .colorKeys,
				colorRamp         = particleSystem .colorRamp;

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
					particle .lifetime    = this .getRandomLifetime (particleLifetime, lifetimeVariation);
					particle .elapsedTime = 0;

					if (createParticles)
						this .getRandomPosition (particle .position)
					else
						particle .position .set (Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY, Number .POSITIVE_INFINITY);

					this .getRandomVelocity (particle .velocity);
				}
				else
				{
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

			this .getColors (particles, colorKeys, colorRamp, numParticles);
		},
		getColors: function (particles, colorKeys, colorRamp, numParticles)
		{
			var
				length = colorKeys .length,
				index0 = 0,
				index1 = 0,
				weight = 0;
		
			if (colorRamp .length)
			{
				for (var i = 0; i < numParticles; ++ i)
				{
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
		
					var
						color0 = colorRamp [index0],
						color1 = colorRamp [index1];
		
					color .x = Algorithm .lerp (color0 .r, color1 .r, weight);
					color .y = Algorithm .lerp (color0 .g, color1 .g, weight);
					color .z = Algorithm .lerp (color0 .b, color1 .b, weight);
					color .w = Algorithm .lerp (color0 .a, color1 .a, weight);
				}
			}
		},
	});

	return X3DParticleEmitterNode;
});



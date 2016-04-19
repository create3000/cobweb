
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DNode, 
          X3DConstants)
{
"use strict";

	function X3DParticleEmitterNode (executionContext)
	{
		X3DNode .call (this, executionContext);

		this .addType (X3DConstants .X3DParticleEmitterNode);
	}

	X3DParticleEmitterNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DParticleEmitterNode,
		isExplosive: function ()
		{
			return false;
		},
		getRandomLifetime: function (particleLifetime, lifetimeVariation)
		{
			var v = particleLifetime * lifetimeVariation;
		
			return this .getRandomValue (Math .max (0, particleLifetime - v), particleLifetime + v);
		},
		getRandomSpeed: function ()
		{
			var
				speed = this .speed_ .getValue (),
				v     = speed * this .variation_ .getValue ();
		
			return this .getRandomValue (Math .max (0, speed - v), speed + v);
		},
		getRandomValue: function (min, max)
		{
			return Math .random () * (max - min) + min;
		},
		getRandomNormal: function (direction, normal)
		{
			var
				theta = this .getRandomValue (-1, 1) * Math .PI;
				cphi  = Math .pow (Math .random (), 1/3); // I don't why this, but its almost uniform.
				phi   = Math .acos (cphi);
				r     = Math .sin (phi);
		
			normal .set (Math .sin (theta) * r,
			             Math .cos (theta) * r,
			             cphi);
		
			rotation .setFromToVec (Vector3 .zAxis, direction);

			return rotation .multRotVec (normal);
		},
		animate: function (position, velocity, deltaTime)
		{
			//fromPosition .assign (position);

			position .x += velocity .x * deltaTime;
			position .y += velocity .y * deltaTime;
			position .z += velocity .z * deltaTime;
		
			//bounce (fromPosition, position, velocity);
		},
		update: function (particleSystem)
		{
			var
				particles         = particleSystem .getParticles (),
				deltaTime         = particleSystem .getDeltaTime (),
				numParticles      = particleSystem .getNumParticles (),
				createParticles   = particleSystem .createParticles_ .getValue (),
				particleLifetime  = particleSystem .particleLifetime_ .getValue (),
				lifetimeVariation = particleSystem .lifetimeVariation_ .getValue ();

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
					this .animate (particle .position, particle .velocity, deltaTime);
			
					particle .elapsedTime = elapsedTime;
				}

				//this .getColor (particle);
			}
		},
	});

	return X3DParticleEmitterNode;
});



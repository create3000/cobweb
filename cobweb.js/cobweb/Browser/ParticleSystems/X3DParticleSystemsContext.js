
define ([
	"cobweb/Components/ParticleSystems/PointEmitter",
],
function (PointEmitter)
{
"use strict";
	
	function X3DParticleSystemsContext ()
	{
		this .defaultEmitter = new PointEmitter (this);
	}

	X3DParticleSystemsContext .prototype =
	{
		initialize: function ()
		{
			this .defaultEmitter .setup ();
		},
		getDefaultEmitter: function ()
		{
			return this .defaultEmitter;
		},
	};

	return X3DParticleSystemsContext;
});

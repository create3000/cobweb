
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
],
function ($,
          Fields,
          X3DBaseNode)
{
"use strict";
	
	function ConeOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .addChildren ("uDimension", new Fields .SFInt32 (1),
		                   "vDimension", new Fields .SFInt32 (20))
	}

	ConeOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: ConeOptions,
		getTypeName: function ()
		{
			return "ConeOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "coneOptions";
		},
	});

	return ConeOptions;
});

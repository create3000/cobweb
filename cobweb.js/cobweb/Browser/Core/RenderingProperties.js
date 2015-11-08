
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
],
function ($,
          X3DBaseNode)
{
"use strict";
	
	function RenderingProperties (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);
	}

	RenderingProperties .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: RenderingProperties,
		getTypeName: function ()
		{
			return "RenderingProperties";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "renderingProperties";
		},
	});

	return RenderingProperties;
});

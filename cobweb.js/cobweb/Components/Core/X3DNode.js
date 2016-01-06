
define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DBaseNode,
          TraverseType,
          X3DConstants)
{
"use strict";

	function X3DNode (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .X3DNode);
	}

	X3DNode .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: X3DNode,
		getCurrentLayer: function ()
		{
			return this .getBrowser () .getLayers () [0];
		},
		getCurrentViewport: function ()
		{
			return this .getBrowser () .getLayers () [0] .getViewport ();
		},
		getCurrentNavigationInfo: function ()
		{
			return this .getBrowser () .getLayers () [0] .getNavigationInfo ();
		},
		getCurrentViewpoint: function ()
		{
			return this .getBrowser () .getLayers () [0] .getViewpoint ();
		},
		getModelViewMatrix: function (type, modelViewMatrix)
		{
			modelViewMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());
			
			if (type === TraverseType .CAMERA)
				modelViewMatrix .multRight (this .getCurrentViewpoint () .getInverseCameraSpaceMatrix ());
			
			return modelViewMatrix;
		},
	});

	return X3DNode;
});



define ([
	"jquery",
	"cobweb/Basic/X3DBaseNode",
	"standard/Math/Numbers/Vector3",
],
function ($, X3DBaseNode, Vector3)
{
	function BoxOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);
	}

	BoxOptions .prototype = $.extend (new X3DBaseNode (),
	{
		constructor: BoxOptions,
		normals: [
			// front
			new Vector3 ( 0,  0,  1), new Vector3 ( 0,  0,  1), new Vector3 ( 0,  0,  1),
			new Vector3 ( 0,  0,  1), new Vector3 ( 0,  0,  1), new Vector3 ( 0,  0,  1),
			// back
			new Vector3 ( 0,  0, -1), new Vector3 ( 0,  0, -1), new Vector3 ( 0,  0, -1),
			new Vector3 ( 0,  0, -1), new Vector3 ( 0,  0, -1), new Vector3 ( 0,  0, -1),
			// left
			new Vector3 (-1,  0,  0), new Vector3 (-1,  0,  0), new Vector3 (-1,  0,  0),
			new Vector3 (-1,  0,  0), new Vector3 (-1,  0,  0), new Vector3 (-1,  0,  0),
			// right
			new Vector3 ( 1,  0,  0), new Vector3 ( 1,  0,  0), new Vector3 ( 1,  0,  0),
			new Vector3 ( 1,  0,  0), new Vector3 ( 1,  0,  0), new Vector3 ( 1,  0,  0),
			// top
			new Vector3 ( 0,  1,  0), new Vector3 ( 0,  1,  0), new Vector3 ( 0,  1,  0),
			new Vector3 ( 0,  1,  0), new Vector3 ( 0,  1,  0), new Vector3 ( 0,  1,  0),
			// bottom
			new Vector3 ( 0, -1,  0), new Vector3 ( 0, -1,  0), new Vector3 ( 0, -1,  0),
			new Vector3 ( 0, -1,  0), new Vector3 ( 0, -1,  0), new Vector3 ( 0, -1,  0),
		],
		triangles: [
			// front
			new Vector3 ( 1,  1,  1), new Vector3 (-1,  1,  1), new Vector3 (-1, -1,  1),
			new Vector3 ( 1,  1,  1), new Vector3 (-1, -1,  1), new Vector3 ( 1, -1,  1), 
			// back
			new Vector3 ( 1,  1, -1), new Vector3 (-1, -1, -1), new Vector3 (-1,  1, -1),
			new Vector3 ( 1,  1, -1), new Vector3 ( 1, -1, -1), new Vector3 (-1, -1, -1), 
			// left
			new Vector3 (-1,  1,  1), new Vector3 (-1,  1, -1), new Vector3 (-1, -1, -1),
			new Vector3 (-1,  1,  1), new Vector3 (-1, -1, -1), new Vector3 (-1, -1,  1), 
			// right
			new Vector3 ( 1,  1,  1), new Vector3 ( 1, -1, -1), new Vector3 ( 1,  1, -1),
			new Vector3 ( 1,  1,  1), new Vector3 ( 1, -1,  1), new Vector3 ( 1, -1, -1), 
			// top
			new Vector3 ( 1,  1, -1), new Vector3 (-1,  1, -1), new Vector3 (-1,  1,  1),
			new Vector3 ( 1,  1, -1), new Vector3 (-1,  1,  1), new Vector3 ( 1,  1,  1),
			// bottom
			new Vector3 ( 1, -1, -1), new Vector3 (-1, -1,  1), new Vector3 (-1, -1, -1),
			new Vector3 ( 1, -1, -1), new Vector3 ( 1, -1,  1), new Vector3 (-1, -1,  1),
		],
		lines: [
			// front	
			new Vector3 ( 1,  1,  1), new Vector3 (-1,  1,  1), new Vector3 (-1, -1,  1), new Vector3 ( 1, -1,  1), new Vector3 ( 1,  1,  1), 
			// back	
			new Vector3 ( 1,  1, -1), new Vector3 (-1,  1, -1), new Vector3 (-1, -1, -1), new Vector3 ( 1, -1, -1), new Vector3 ( 1,  1, -1), 
			// top
			new Vector3 ( 1,  1,  1), new Vector3 ( 1,  1, -1), 
			new Vector3 (-1,  1,  1), new Vector3 (-1,  1, -1), 
			// bottom
			new Vector3 ( 1, -1,  1), new Vector3 ( 1, -1, -1), 
			new Vector3 (-1, -1,  1), new Vector3 (-1, -1, -1), 
		],
	});

	return BoxOptions;
});

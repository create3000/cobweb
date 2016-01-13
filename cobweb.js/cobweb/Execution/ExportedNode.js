
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Base/X3DObject",
],
function ($,
          Fields,
          X3DObject)
{
"use strict";

	function ExportedNode (exportedName, localNode)
	{
		X3DObject .call (this);

		this .exportedName = exportedName;
		this .localNode    = localNode;
	}

	ExportedNode .prototype = $.extend (Object .create (X3DObject .prototype),
	{
		constructor: ExportedNode,
		getExportedName: function ()
		{
			return this .exportedName;
		},
		getLocalNode: function ()
		{
			return new Fields .SFNode (this .localNode);
		},
	});

	return ExportedNode;
});
